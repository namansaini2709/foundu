-- Add likes_count to user_posts
ALTER TABLE user_posts ADD COLUMN IF NOT EXISTS likes_count INT DEFAULT 0;

-- Track individual liker records (prevents double-liking, stores who liked)
CREATE TABLE IF NOT EXISTS post_likes (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  post_id    INT NOT NULL,
  user_id    INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_like (post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES user_posts(id) ON DELETE CASCADE
);
