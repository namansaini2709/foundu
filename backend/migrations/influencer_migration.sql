CREATE TABLE IF NOT EXISTS influencer_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    instagram_url VARCHAR(255) NOT NULL,
    followers_count INT NOT NULL,
    last_month_reach INT NOT NULL,
    email VARCHAR(100) NOT NULL,
    budget_range VARCHAR(100) NOT NULL,
    photo_url VARCHAR(255),
    banner_url VARCHAR(255),
    reel_url VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
