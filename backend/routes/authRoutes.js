const express = require('express');
const passport = require('passport');
const router = express.Router();
const { generateJWT } = require('../utils/jwtUtils');
const db = require('../config/db');
const notificationService = require('../services/notificationService');

// Helper to handle login post-processing (audit & notifications)
const handleLoginPostProcessing = (user) => {
  if (user && user.id && !user.isNewUser) {
    // 1. Log Login Audit
    db.query(
      `INSERT INTO login_audit (user_id, login_date) VALUES (?, CURRENT_DATE) ON CONFLICT DO NOTHING`,
      [user.id],
      (auditErr) => {
        if (auditErr) console.error("OAuth Login audit error:", auditErr);
      }
    );

    // 2. Auto-Check Golden Tick
    db.query(
      `SELECT 
        u.blue_tick_verified,
        u.golden_tick_verified,
        u.golden_tick_month,
        to_char(CURRENT_DATE, 'YYYY-MM') AS current_month,
        COUNT(la.user_id) AS login_days_this_month
       FROM users u
       LEFT JOIN login_audit la 
         ON la.user_id = u.id 
         AND to_char(la.login_date, 'YYYY-MM') = to_char(CURRENT_DATE, 'YYYY-MM')
       WHERE u.id = ?
       GROUP BY u.id`,
      [user.id],
      (checkErr, checkRows) => {
        if (!checkErr && checkRows.length) {
          const row = checkRows[0];
          const eligible = row.blue_tick_verified && row.login_days_this_month >= 20;
          const alreadyAwarded = row.golden_tick_verified && row.golden_tick_month === row.current_month;

          if (eligible && !alreadyAwarded) {
            db.query(
              `UPDATE users SET golden_tick_verified = true, golden_tick_month = to_char(CURRENT_DATE, 'YYYY-MM') WHERE id = ?`,
              [user.id]
            );
            notificationService.sendNotification(
              user.id,
              "Golden Tick Awarded! 🟡",
              "Amazing! You've logged in for 20 days this month and unlocked the Golden Tick.",
              "badge",
              "/dashboard"
            );
          }
        }
      }
    );

    // 3. Send Login Notification
    notificationService.sendNotification(
      user.id,
      "New Login Detected",
      "You successfully logged in to FoundU via OAuth.",
      "security",
      "/profile"
    );
  }
};

// Helper for cookie options (replicating userController logic)
const isProduction = !!(process.env.NODE_ENV === "production" || process.env.RAILWAY_ENVIRONMENT);
const getCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "lax" : "lax",
  maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
  path: "/",
  domain: isProduction ? ".foundu.in" : undefined,
});

// @route   GET /api/auth/google
// @desc    Authenticate with Google
router.get('/google', (req, res, next) => {
  const { type, mode } = req.query;
  // Pass the user type and mode (login/signup) into the OAuth state
  const state = (type || mode) ? Buffer.from(JSON.stringify({ type, mode })).toString('base64') : undefined;
  passport.authenticate('google', { 
    scope: ['profile', 'email'], 
    session: false,
    state: state
  })(req, res, next);
});

// @route   GET /api/auth/google/callback
// @desc    Google OAuth callback
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    if (err) {
      console.error("Auth Callback Error:", err);
      return res.redirect(`${frontendUrl}/login-signup?auth=error`);
    }

    // Handle specific failure modes
    if (!user) {
      if (info && info.message === 'no_account') {
        return res.redirect(`${frontendUrl}/login-signup?auth=no_account`);
      }
      if (info && info.message === 'no_category') {
        return res.redirect(`${frontendUrl}/login-signup?auth=no_category`);
      }
      return res.redirect(`${frontendUrl}/login-signup?auth=error`);
    }

    try {
      const token = generateJWT(user);
      res.cookie("jwt", token, getCookieOptions());

      // Perform login audit and notifications
      handleLoginPostProcessing(user);

      // If profile is incomplete, redirect to the specific onboarding page
      if (user.is_profile_complete === 0) {
        const type = String(user.user_type || 'freelancer').trim();
        let onboardingPath = "/profile";
        if (type === 'freelancer') onboardingPath = "/freelancer-profile";
        else if (type === 'founder') onboardingPath = "/startup-profile";
        else if (type === 'cofounder') onboardingPath = "/cofounder-profile";
        else if (type === 'influencer') onboardingPath = "/influencer-marketplace";
        
        return res.redirect(`${frontendUrl}${onboardingPath}?auth=success&new=true`);
      }

      // Normal dashboard redirect for existing users (specific to role)
      const type = String(user.user_type || 'freelancer').trim();
      let dashboardPath = "/";
      if (type === 'freelancer') dashboardPath = "/freelancer-dashboard";
      else if (type === 'founder') dashboardPath = "/startup-dashboard";
      else if (type === 'cofounder') dashboardPath = "/cofounder-dashboard";
      else if (type === 'influencer') dashboardPath = "/influencer-marketplace";

      res.redirect(`${frontendUrl}${dashboardPath}?auth=success`);
    } catch (error) {
      console.error("Auth Callback Error:", error);
      res.redirect(`${frontendUrl}/login-signup?auth=error`);
    }
  })(req, res, next);
});

// @route   GET /api/auth/github
// @desc    Authenticate with GitHub
router.get('/github', (req, res, next) => {
  const { type, mode } = req.query;
  const state = (type || mode) ? Buffer.from(JSON.stringify({ type, mode })).toString('base64') : undefined;
  passport.authenticate('github', { 
    scope: ['user:email'], 
    session: false,
    state: state
  })(req, res, next);
});

// @route   GET /api/auth/github/callback
// @desc    GitHub OAuth callback
router.get('/github/callback', (req, res, next) => {
  console.log("[Auth] GitHub Callback reached");
  passport.authenticate('github', { session: false }, (err, user, info) => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    if (err) {
      console.error("[Auth] Passport Error (GitHub):", err);
      return res.redirect(`${frontendUrl}/login-signup?auth=error`);
    }

    if (!user) {
      console.warn("[Auth] No user found in GitHub OAuth info:", info);
      if (info && info.message === 'no_account') {
        return res.redirect(`${frontendUrl}/login-signup?auth=no_account`);
      }
      if (info && info.message === 'no_category') {
        return res.redirect(`${frontendUrl}/login-signup?auth=no_category`);
      }
      if (info && info.message === 'no_email') {
        return res.redirect(`${frontendUrl}/login-signup?auth=error&reason=no_email`);
      }
      return res.redirect(`${frontendUrl}/login-signup?auth=error`);
    }

    try {
      const token = generateJWT(user);
      res.cookie("jwt", token, getCookieOptions());

      // Perform login audit and notifications
      handleLoginPostProcessing(user);

      // If profile is incomplete, redirect to onboarding
      if (user.is_profile_complete === 0) {
        const type = String(user.user_type || 'freelancer').trim();
        let onboardingPath = "/profile";
        if (type === 'freelancer') onboardingPath = "/freelancer-profile";
        else if (type === 'founder') onboardingPath = "/startup-profile";
        else if (type === 'cofounder') onboardingPath = "/cofounder-profile";
        else if (type === 'influencer') onboardingPath = "/influencer-marketplace";
        
        return res.redirect(`${frontendUrl}${onboardingPath}?auth=success&new=true`);
      }

      // Normal dashboard redirect
      const type = String(user.user_type || 'freelancer').trim();
      let dashboardPath = "/";
      if (type === 'freelancer') dashboardPath = "/freelancer-dashboard";
      else if (type === 'founder') dashboardPath = "/startup-dashboard";
      else if (type === 'cofounder') dashboardPath = "/cofounder-dashboard";
      else if (type === 'influencer') dashboardPath = "/influencer-marketplace";

      res.redirect(`${frontendUrl}${dashboardPath}?auth=success`);
    } catch (error) {
      console.error("Auth Callback Error:", error);
      res.redirect(`${frontendUrl}/login-signup?auth=error`);
    }
  })(req, res, next);
});

module.exports = router;
