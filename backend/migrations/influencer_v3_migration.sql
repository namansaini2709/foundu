ALTER TABLE influencer_applications MODIFY COLUMN last_month_reach VARCHAR(100);
ALTER TABLE influencer_applications MODIFY COLUMN followers_count VARCHAR(100);
ALTER TABLE influencer_applications ADD COLUMN is_barter TINYINT(1) DEFAULT 0;
