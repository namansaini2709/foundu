-- Creates the users_socials table used across the app (profile pictures,
-- blue-tick verification socials, live feed, badges, reviews, posts).
-- Referenced by userController, usersSocialsController, badgeService,
-- jobApplicantsController, postController, reviewController, adminController.
--
-- Schema is derived from usersSocialsController.addUserSocials (INSERT ...
-- ON DUPLICATE KEY UPDATE) and every `us.<column>` reference in the codebase.

CREATE TABLE IF NOT EXISTS users_socials (
  id                          INT AUTO_INCREMENT PRIMARY KEY,
  user_id                     INT NOT NULL UNIQUE,
  full_name                   VARCHAR(255) DEFAULT NULL,
  freelancer_id               INT DEFAULT NULL,
  founder_id                  INT DEFAULT NULL,
  cofounder_id                INT DEFAULT NULL,
  linkedin_url                VARCHAR(512) DEFAULT NULL,
  github_url                  VARCHAR(512) DEFAULT NULL,
  portfolio_url               VARCHAR(512) DEFAULT NULL,
  company_linkedin_url        VARCHAR(512) DEFAULT NULL,
  company_social_url          VARCHAR(512) DEFAULT NULL,
  company_registration_number VARCHAR(255) DEFAULT NULL,
  past_work_proof             VARCHAR(512) DEFAULT NULL,
  profile_picture_url         VARCHAR(512) DEFAULT NULL,
  created_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_socials_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
