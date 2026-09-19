-- 1. Site Settings Table
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hero_image TEXT,
    hero_tagline TEXT DEFAULT 'MODEL · CREATOR · ACTOR',
    banner_text TEXT DEFAULT 'AVAILABLE FOR BOOKINGS GLOBALLY - Q3/Q4 2026',
    banner_visible BOOLEAN DEFAULT true,
    featured_photo_ids UUID[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Categories Table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    display_order INTEGER DEFAULT 0
);

-- Insert default categories
INSERT INTO public.categories (name, display_order) VALUES
('FASHION', 1), ('EDITORIAL', 2), ('COMMERCIAL', 3), ('ETHNIC', 4), ('LIFESTYLE', 5);

-- 3. Update Profile Table
-- profile table already has 'phone' which we can use for WhatsApp, 
-- and it already has 'hero_image'. 
-- Just ensuring they exist.

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public site_settings are viewable by everyone" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

-- Admin Write Policies
CREATE POLICY "Admins can insert site_settings" ON public.site_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update site_settings" ON public.site_settings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete site_settings" ON public.site_settings FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert categories" ON public.categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update categories" ON public.categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete categories" ON public.categories FOR DELETE USING (auth.role() = 'authenticated');
