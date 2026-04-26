-- Run this in the Supabase SQL editor to add site editing support.
-- Adds a JSONB column to weddings for storing custom site content.

ALTER TABLE weddings ADD COLUMN IF NOT EXISTS site_content JSONB DEFAULT '{}';

-- site_content structure:
-- {
--   "story": "We met at...",
--   "sections": [
--     { "id": "hero", "visible": true },
--     { "id": "story", "visible": true },
--     { "id": "events", "visible": true },
--     ...
--   ]
-- }
