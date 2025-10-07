-- Add all missing file columns to asns table
-- This migration adds the remaining file columns that were missing

ALTER TABLE asns
ADD COLUMN IF NOT EXISTS bill_of_lading_data TEXT,
ADD COLUMN IF NOT EXISTS bill_of_lading_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS shipping_invoice_data TEXT,
ADD COLUMN IF NOT EXISTS shipping_invoice_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS vendor_invoice_data TEXT,
ADD COLUMN IF NOT EXISTS vendor_invoice_name VARCHAR(255);

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'asns' 
AND (
  column_name LIKE '%file_data' OR 
  column_name LIKE '%file_name'
)
ORDER BY column_name;
