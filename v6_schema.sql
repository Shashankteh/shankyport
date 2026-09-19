-- Create page_views table
CREATE TABLE public.page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert
CREATE POLICY "Anyone can insert page views" ON public.page_views FOR INSERT WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Admins can read page views" ON public.page_views FOR SELECT USING (auth.role() = 'authenticated');
