-- Migration 003: Add preferred_tech and industry_niche to startup_profiles
ALTER TABLE startup_profiles ADD COLUMN IF NOT EXISTS preferred_tech JSONB DEFAULT NULL;
ALTER TABLE startup_profiles ADD COLUMN IF NOT EXISTS industry_niche VARCHAR(255) DEFAULT NULL;
