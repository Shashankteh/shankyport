-- Add homepage_sections JSONB column to site_settings table
ALTER TABLE public.site_settings ADD COLUMN homepage_sections JSONB DEFAULT '[]'::jsonb;
