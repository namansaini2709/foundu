-- Add feedback column to track founder's response in foundu_submissions
ALTER TABLE foundu_submissions ADD COLUMN feedback TEXT AFTER status;
