-- Migration: Add Razorpay & Wallet support

-- 1. Update foundu_jobs with payment columns
ALTER TABLE foundu_jobs 
ADD COLUMN payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
ADD COLUMN numeric_budget DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN gst_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN commission_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN total_amount DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN razorpay_order_id VARCHAR(255),
ADD COLUMN razorpay_payment_id VARCHAR(255),
ADD COLUMN is_completed BOOLEAN DEFAULT FALSE;

-- 2. Fix job_applicants status enum
ALTER TABLE job_applicants 
MODIFY COLUMN status ENUM('pending', 'accepted', 'rejected', 'completed') DEFAULT 'pending';

-- 3. Create wallets table
CREATE TABLE IF NOT EXISTS wallets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 0,
    UNIQUE(user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Create wallet_transactions table
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wallet_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_type ENUM('credit', 'debit') NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
);
