ALTER TABLE card_templates ADD COLUMN category VARCHAR(50) DEFAULT 'General';
ALTER TABLE card_templates ADD COLUMN is_premium BOOLEAN DEFAULT FALSE;
