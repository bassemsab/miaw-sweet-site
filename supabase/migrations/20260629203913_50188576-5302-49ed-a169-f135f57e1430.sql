CREATE TABLE public.photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path text NOT NULL,
  caption text,
  value numeric NOT NULL DEFAULT 0,
  likes int NOT NULL DEFAULT 0,
  client_ip text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.photos TO anon;
GRANT SELECT, INSERT, UPDATE ON public.photos TO authenticated;
GRANT ALL ON public.photos TO service_role;

ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view photos" ON public.photos FOR SELECT TO anon USING (true);
CREATE POLICY "Anyone can upload photos" ON public.photos FOR INSERT TO anon WITH CHECK (true);

CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.newsletter_subscribers TO anon;
GRANT SELECT, INSERT ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT TO anon WITH CHECK (true);