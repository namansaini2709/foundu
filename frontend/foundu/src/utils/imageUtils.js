const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

/**
 * Safely get the full URL for an image.
 * Works with both old local uploads and new Cloudinary URLs.
 * @param {string} url - The image URL from the database
 * @returns {string} - The full usable URL
 */
export const getImageUrl = (url) => {
  if (!url) return null;
  
  // If it starts with http, it's already a full URL (Cloudinary or Google/Social)
  if (url.startsWith("http")) {
    return url;
  }
  
  // Otherwise, it's an old local file from /uploads/
  return `${API_BASE}${url}`;
};
