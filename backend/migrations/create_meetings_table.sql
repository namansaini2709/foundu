CREATE TABLE IF NOT EXISTS meetings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    meeting_type ENUM('Pitch Deck', 'Startup Portal', 'Web Development', 'Event Partnership') NOT NULL,
    
    -- Common details
    explanation TEXT,
    budget VARCHAR(255),
    selected_date DATE NOT NULL,
    selected_time VARCHAR(50) NOT NULL,
    
    -- Pitch Deck specific
    website_link VARCHAR(255),
    
    -- Startup Portal specific
    portal_type VARCHAR(255),
    other_portal_type VARCHAR(255),
    
    -- Web Development specific
    business_type VARCHAR(255),
    is_web BOOLEAN DEFAULT FALSE,
    is_app BOOLEAN DEFAULT FALSE,
    
    status ENUM('pending', 'contacted', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
