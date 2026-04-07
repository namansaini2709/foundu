-- Add unique constraint to foundu_submissions to prevent duplicate project records
-- and allow ON DUPLICATE KEY UPDATE to work correctly on (job_id, freelancer_id)
ALTER TABLE foundu_submissions ADD UNIQUE INDEX unique_job_freelancer (job_id, freelancer_id);
