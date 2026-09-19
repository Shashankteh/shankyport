-- Profile Table
CREATE TABLE public.profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    bio TEXT,
    location TEXT,
    height TEXT,
    instagram TEXT,
    email TEXT,
    phone TEXT,
    hero_image TEXT
);

-- Shoots Table
CREATE TABLE public.shoots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    date DATE,
    location TEXT,
    photographer TEXT,
    stylist TEXT,
    mua TEXT,
    brand TEXT,
    cover_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Photos Table
CREATE TABLE public.photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    image_url TEXT NOT NULL,
    cloudinary_public_id TEXT NOT NULL,
    category TEXT,
    shoot_id UUID REFERENCES public.shoots(id) ON DELETE SET NULL,
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Journey Posts Table
CREATE TABLE public.journey_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT,
    cover_image TEXT,
    date DATE,
    status TEXT DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shoots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_posts ENABLE ROW LEVEL SECURITY;

-- Public Read Access Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Public shoots are viewable by everyone" ON public.shoots FOR SELECT USING (true);
CREATE POLICY "Public photos are viewable by everyone" ON public.photos FOR SELECT USING (true);
CREATE POLICY "Public journey posts are viewable by everyone" ON public.journey_posts FOR SELECT USING (true);

-- Authenticated Admin Access Policies (Assumes users are authenticated to the admin panel)
CREATE POLICY "Admins can insert profile" ON public.profile FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update profile" ON public.profile FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete profile" ON public.profile FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert shoots" ON public.shoots FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update shoots" ON public.shoots FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete shoots" ON public.shoots FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert photos" ON public.photos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update photos" ON public.photos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete photos" ON public.photos FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert journey posts" ON public.journey_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update journey posts" ON public.journey_posts FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete journey posts" ON public.journey_posts FOR DELETE USING (auth.role() = 'authenticated');
