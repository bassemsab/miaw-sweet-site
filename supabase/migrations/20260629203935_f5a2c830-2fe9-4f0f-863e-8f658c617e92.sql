REVOKE INSERT ON public.photos FROM anon;
REVOKE INSERT ON public.newsletter_subscribers FROM anon;

DROP POLICY IF EXISTS "Anyone can upload photos" ON public.photos;
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;

CREATE POLICY "Service role can manage photos" ON public.photos FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage newsletter subscribers" ON public.newsletter_subscribers FOR ALL TO service_role USING (true) WITH CHECK (true);