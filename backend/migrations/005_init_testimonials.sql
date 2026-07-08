CREATE TABLE IF NOT EXISTS homepage_testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    affiliation VARCHAR(255),
    rating INT DEFAULT 5,
    review TEXT NOT NULL,
    tagline VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
