-- Migration to add quote file fields to asns table
-- Run this migration to add support for quote file uploads

ALTER TABLE asns 
ADD COLUMN IF NOT EXISTS quote_file_data TEXT,
ADD COLUMN IF NOT EXISTS quote_file_name VARCHAR(255);

-- Add comments for documentation
COMMENT ON COLUMN asns.quote_file_data IS 'Base64 encoded quote file data';
COMMENT ON COLUMN asns.quote_file_name IS 'Original filename of the quote file';
