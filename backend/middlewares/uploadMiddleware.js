const { uploadCloud } = require('../config/cloudinary');

// We simply export the Cloudinary multer instance
// This replaces the old local diskStorage logic
const upload = uploadCloud;

module.exports = upload;
