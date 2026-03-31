const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "fU_s3cR3t_jWt_K3y_2026_xQ9pL4mN7vR";
const JWT_EXPIRES_IN = "2d"; // Token valid for 2 days (48 hours)

/**
 * Generate a signed JWT token for a user.
 * @param {Object} user - User object with at least { id, email, user_type }
 * @returns {string} Signed JWT token (the 3-part string: header.payload.signature)
 */
exports.generateJWT = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      user_type: user.user_type,
      full_name: user.full_name,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Generate a signed JWT token for an admin.
 * @param {Object} admin - Admin object with at least { id, email, role }
 * @returns {string} Signed JWT token
 */
exports.generateAdminJWT = (admin) => {
  return jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      isAdmin: true,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Verify and decode a JWT token.
 * @param {string} token - The JWT token string
 * @returns {Object|null} Decoded payload or null if invalid
 */
exports.verifyJWT = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
