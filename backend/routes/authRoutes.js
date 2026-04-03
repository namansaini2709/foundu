const express = require('express');
const passport = require('passport');
const router = express.Router();
const { generateJWT } = require('../utils/jwtUtils');

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

    // Handle "No account found" strict mode failure
    if (!user) {
      if (info && info.message === 'no_account') {
        return res.redirect(`${frontendUrl}/login-signup?auth=no_account`);
      }
      return res.redirect(`${frontendUrl}/login-signup?auth=error`);
    }

    try {
      const token = generateJWT(user);
      res.cookie("jwt", token, getCookieOptions());

      // If profile is incomplete, redirect to the specific onboarding page
      if (user.is_profile_complete === 0) {
        const type = String(user.user_type || 'freelancer').trim();
        let onboardingPath = "/profile";
        if (type === 'freelancer') onboardingPath = "/freelancer-profile";
        else if (type === 'founder') onboardingPath = "/startup-profile";
        else if (type === 'cofounder') onboardingPath = "/cofounder-profile";
        
        return res.redirect(`${frontendUrl}${onboardingPath}?auth=success&new=true`);
      }

      // Normal dashboard redirect for existing users (specific to role)
      const type = String(user.user_type || 'freelancer').trim();
      let dashboardPath = "/";
      if (type === 'freelancer') dashboardPath = "/freelancer-dashboard";
      else if (type === 'founder') dashboardPath = "/startup-dashboard";
      else if (type === 'cofounder') dashboardPath = "/cofounder-dashboard";

      res.redirect(`${frontendUrl}${dashboardPath}?auth=success`);
    } catch (error) {
      console.error("Auth Callback Error:", error);
      res.redirect(`${frontendUrl}/login-signup?auth=error`);
    }
  })(req, res, next);
});

module.exports = router;
