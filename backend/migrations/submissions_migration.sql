
-- 1. Create Foundu Submissions Table
CREATE TABLE IF NOT EXISTS foundu_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    freelancer_id INT NOT NULL,
    founder_id INT NOT NULL,
    
    -- Setup by Founder
    instructions TEXT,
    expectations TEXT,
    deadline DATETIME,
    founder_files JSON, -- Array of URLs
    
    -- Work by Freelancer
    freelancer_work_desc TEXT,
    freelancer_work_files JSON, -- Array of URLs
    freelancer_work_links JSON, -- Array of URLs
    
    -- Status and Progress
    status ENUM('pending_setup', 'in_progress', 'submitted', 'completed', 'changes_requested') DEFAULT 'pending_setup',
    progress INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (job_id) REFERENCES foundu_jobs(job_id) ON DELETE CASCADE,
    FOREIGN KEY (freelancer_id) REFERENCES users(id),
    FOREIGN KEY (founder_id) REFERENCES users(id)
);

-- 2. Update job_applicants to include payment details (shifting from foundu_jobs to specific applicants)
ALTER TABLE job_applicants ADD COLUMN payment_status ENUM('pending', 'paid') DEFAULT 'pending';
ALTER TABLE job_applicants ADD COLUMN razorpay_order_id VARCHAR(255);
ALTER TABLE job_applicants ADD COLUMN razorpay_payment_id VARCHAR(255);
ALTER TABLE job_applicants ADD COLUMN amount_paid DECIMAL(10, 2);

-- 3. Add column to foundu_jobs
ALTER TABLE foundu_jobs ADD COLUMN is_assigned BOOLEAN DEFAULT FALSE;
