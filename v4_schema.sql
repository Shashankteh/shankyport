-- Add shoot_id to journey_posts table to link them
ALTER TABLE public.journey_posts ADD COLUMN shoot_id UUID REFERENCES public.shoots(id) ON DELETE SET NULL;
