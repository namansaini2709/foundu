const passport = require('passport');
const axios = require('axios');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const db = require('./db');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'MISSING_GOOGLE_CLIENT_ID',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'MISSING_GOOGLE_CLIENT_SECRET',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:4000/api/auth/google/callback",
    proxy: true,
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const googleId = profile.id;
      const fullName = profile.displayName;

      // Extract type and mode from state if available
      let userType = null;        // Remove 'freelancer' default to force explicit selection
      let mode = 'signup';        // Default fallback
      if (req.query.state) {
        try {
          const stateData = JSON.parse(Buffer.from(req.query.state, 'base64').toString());
          if (stateData.type) userType = String(stateData.type).trim();
          if (stateData.mode) mode = String(stateData.mode).trim();
        } catch (e) {
          console.error("Error parsing OAuth state:", e);
        }
      }

      // 1. Try to find user by google_id
      const [rowsById] = await db.promise().query('SELECT * FROM users WHERE google_id = ?', [googleId]);
      
      if (rowsById.length > 0) {
        return done(null, rowsById[0]);
      }

      // 2. Try to find user by email
      const [rowsByEmail] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
      
      if (rowsByEmail.length > 0) {
        await db.promise().query('UPDATE users SET google_id = ? WHERE id = ?', [googleId, rowsByEmail[0].id]);
        const updatedUser = { 
          ...rowsByEmail[0], 
          google_id: googleId,
          is_profile_complete: rowsByEmail[0].is_profile_complete || 0 
        };
        return done(null, updatedUser);
      }

      // --- STRICT MODE CHECK ---
      // If mode is 'login' and we didn't find a user, FAIL authentication
      if (mode === 'login') {
        return done(null, false, { message: 'no_account' });
      }

      // --- CATEGORY ENFORCEMENT ---
      // If signing up, we MUST have a valid category
      const validTypes = ['freelancer', 'founder', 'cofounder', 'influencer'];
      if (!userType || !validTypes.includes(userType)) {
        return done(null, false, { message: 'no_category' });
      }

      // 3. Create new user with the passed userType
      let freelancerId = null;
      let founderId = null;
      let cofounderId = null;

      if (userType === 'freelancer') {
        const [r] = await db.promise().query("SELECT COALESCE(MAX(freelancer_id),0)+1 AS next_id FROM users WHERE user_type='freelancer'");
        freelancerId = r[0].next_id;
      } else if (userType === 'founder') {
        const [r] = await db.promise().query("SELECT COALESCE(MAX(founder_id),0)+1 AS next_id FROM users WHERE user_type='founder'");
        founderId = r[0].next_id;
      } else if (userType === 'cofounder') {
        const [r] = await db.promise().query("SELECT COALESCE(MAX(cofounder_id),0)+1 AS next_id FROM users WHERE user_type='cofounder'");
        cofounderId = r[0].next_id;
      }

      const [result] = await db.promise().query(
        `INSERT INTO users (full_name, email, google_id, user_type, freelancer_id, founder_id, cofounder_id, is_profile_complete) 
         VALUES (?, ?, ?, ?, ?, ?, ?, false)`,
        [fullName, email, googleId, userType, freelancerId, founderId, cofounderId]
      );

      const newUser = {
        id: result.insertId,
        full_name: fullName,
        email: email,
        google_id: googleId,
        user_type: userType,
        freelancer_id: freelancerId,
        founder_id: founderId,
        cofounder_id: cofounderId,
        is_profile_complete: 0,
        isNewUser: true // Mark as new user to trigger welcome later or just trigger it here
      };

      // Send Welcome Notification & Email
      try {
        const notificationService = require('../services/notificationService');
        const emailNotificationService = require('../services/emailNotificationService');
        const isProduction = !!(process.env.NODE_ENV === "production" || process.env.RAILWAY_ENVIRONMENT);
        const baseUrl = process.env.FRONTEND_URL || (isProduction ? "https://www.foundu.in" : "http://localhost:5173");
        const profilePath = userType === "founder" ? "/startup-profile" : (userType === "cofounder" ? "/cofounder-profile" : "/freelancer-profile");

        notificationService.sendNotification(
          result.insertId,
          "Welcome to FoundU! 🎉",
          "Your account has been successfully created via Google. Complete your profile to get started.",
          "welcome",
          "/profile",
        );

        emailNotificationService.sendEmailNotification(
          result.insertId,
          "Welcome to FoundU! 🎉",
          "We're thrilled to have you on board. FoundU is the ultimate platform to connect top freelancers with the most innovative startups. Start by completing your profile to unlock all features!",
          "Complete Your Profile",
          `${baseUrl}${profilePath}`,
        );
      } catch (err) {
        console.error("Error sending welcome notifications:", err);
      }

      return done(null, newUser);
    } catch (error) {
      console.error("Passport Google Strategy Error:", error);
      return done(error, null);
    }
  }
));

// --- GITHUB STRATEGY ---
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || 'MISSING_GITHUB_CLIENT_ID',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'MISSING_GITHUB_CLIENT_SECRET',
    callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:4000/api/auth/github/callback",
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      console.log("[GitHub] Step 1: Profile received. Username:", profile.username, "| ID:", profile.id);

      // --- Step 2: Resolve Email (including private emails) ---
      let email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
      if (!email && accessToken) {
        console.log("[GitHub] Step 2: No public email, fetching private emails via API...");
        try {
          const emailResponse = await axios.get('https://api.github.com/user/emails', {
            headers: { 
              'Authorization': `Bearer ${accessToken}`, 
              'User-Agent': 'FoundU-App',
              'Accept': 'application/vnd.github+json'
            }
          });
          const emails = emailResponse.data;
          if (Array.isArray(emails)) {
            const primaryEmail = emails.find(e => e.primary && e.verified) || emails.find(e => e.verified) || emails[0];
            if (primaryEmail) email = primaryEmail.email;
          }
        } catch (emailErr) {
          console.error("[GitHub] Step 2 ERROR - Could not fetch emails:", emailErr.message);
        }
      }
      console.log("[GitHub] Step 2: Email resolved to:", email);

      const githubId = String(profile.id);
      const fullName = profile.displayName || profile.username;

      // --- Step 3: Parse OAuth state (category + mode) ---
      let userType = null;
      let mode = 'signup';
      if (req.query.state) {
        try {
          const stateData = JSON.parse(Buffer.from(req.query.state, 'base64').toString());
          if (stateData.type) userType = String(stateData.type).trim();
          if (stateData.mode) mode = String(stateData.mode).trim();
        } catch (e) {
          console.error("[GitHub] Step 3 ERROR - State parse failed:", e.message);
        }
      }
      console.log("[GitHub] Step 3: mode =", mode, "| userType =", userType);

      // --- Step 4: Lookup by github_id ---
      const [rowsById] = await db.promise().query('SELECT * FROM users WHERE github_id = ?', [githubId]);
      if (rowsById.length > 0) {
        console.log("[GitHub] Step 4: Existing user found by github_id");
        return done(null, rowsById[0]);
      }

      // --- Step 5: Guard against missing email ---
      if (!email) {
        console.warn("[GitHub] Step 5: No email available, rejecting.");
        return done(null, false, { message: 'no_email' });
      }

      // --- Step 6: Lookup by email ---
      const [rowsByEmail] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
      if (rowsByEmail.length > 0) {
        console.log("[GitHub] Step 6: Existing user found by email, linking github_id");
        await db.promise().query('UPDATE users SET github_id = ? WHERE id = ?', [githubId, rowsByEmail[0].id]);
        return done(null, { ...rowsByEmail[0], github_id: githubId });
      }

      // --- Step 7: Mode check ---
      if (mode === 'login') {
        console.warn("[GitHub] Step 7: Login mode, no user found. Rejecting.");
        return done(null, false, { message: 'no_account' });
      }

      // --- Step 8: Category check ---
      const validTypes = ['freelancer', 'founder', 'cofounder', 'influencer'];
      if (!userType || !validTypes.includes(userType)) {
        console.warn("[GitHub] Step 8: No valid category selected:", userType);
        return done(null, false, { message: 'no_category' });
      }

      // --- Step 9: Create new user ---
      console.log("[GitHub] Step 9: Creating new user as:", userType);
      let freelancerId = null, founderId = null, cofounderId = null;
      if (userType === 'freelancer') {
        const [r] = await db.promise().query("SELECT COALESCE(MAX(freelancer_id),0)+1 AS next_id FROM users WHERE user_type='freelancer'");
        freelancerId = r[0].next_id;
      } else if (userType === 'founder') {
        const [r] = await db.promise().query("SELECT COALESCE(MAX(founder_id),0)+1 AS next_id FROM users WHERE user_type='founder'");
        founderId = r[0].next_id;
      } else if (userType === 'cofounder') {
        const [r] = await db.promise().query("SELECT COALESCE(MAX(cofounder_id),0)+1 AS next_id FROM users WHERE user_type='cofounder'");
        cofounderId = r[0].next_id;
      }

      const [result] = await db.promise().query(
        `INSERT INTO users (full_name, email, github_id, user_type, freelancer_id, founder_id, cofounder_id, is_profile_complete) 
         VALUES (?, ?, ?, ?, ?, ?, ?, false)`,
        [fullName, email, githubId, userType, freelancerId, founderId, cofounderId]
      );

      console.log("[GitHub] Step 9: New user created with ID:", result.insertId);
      
      const newUser = {
        id: result.insertId,
        full_name: fullName,
        email: email,
        github_id: githubId,
        user_type: userType,
        is_profile_complete: 0,
        isNewUser: true
      };

      // Send Welcome Notification & Email
      try {
        const notificationService = require('../services/notificationService');
        const emailNotificationService = require('../services/emailNotificationService');
        const isProduction = !!(process.env.NODE_ENV === "production" || process.env.RAILWAY_ENVIRONMENT);
        const baseUrl = process.env.FRONTEND_URL || (isProduction ? "https://www.foundu.in" : "http://localhost:5173");
        const profilePath = userType === "founder" ? "/startup-profile" : (userType === "cofounder" ? "/cofounder-profile" : "/freelancer-profile");

        notificationService.sendNotification(
          result.insertId,
          "Welcome to FoundU! 🎉",
          "Your account has been successfully created via GitHub. Complete your profile to get started.",
          "welcome",
          "/profile",
        );

        emailNotificationService.sendEmailNotification(
          result.insertId,
          "Welcome to FoundU! 🎉",
          "We're thrilled to have you on board. FoundU is the ultimate platform to connect top freelancers with the most innovative startups. Start by completing your profile to unlock all features!",
          "Complete Your Profile",
          `${baseUrl}${profilePath}`,
        );
      } catch (err) {
        console.error("Error sending GitHub welcome notifications:", err);
      }

      return done(null, newUser);
    } catch (error) {
      console.error("[GitHub] FATAL ERROR in strategy:", error.message, error.stack);
      return done(error, null);
    }
  }
));

// Simple serialize/deserialize (since we use JWT, these are just for Passport requirements)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
