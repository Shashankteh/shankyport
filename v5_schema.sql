-- Create inquiries table
CREATE TABLE public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company_or_brand TEXT,
    shoot_type TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Public can insert
CREATE POLICY "Anyone can insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);

-- Admins can read, update, delete
CREATE POLICY "Admins can view inquiries" ON public.inquiries FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can update inquiries" ON public.inquiries FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete inquiries" ON public.inquiries FOR DELETE USING (auth.role() = 'authenticated');
