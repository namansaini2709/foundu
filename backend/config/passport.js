const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
      let userType = 'freelancer'; // Default fallback
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
        is_profile_complete: 0
      };

      return done(null, newUser);
    } catch (error) {
      console.error("Passport Google Strategy Error:", error);
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
