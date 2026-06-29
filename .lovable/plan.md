Miaw.ovh v1 — Cat-photo platform where uploads build a fun "financial value" score.

Scope
- A playful, cute brand website with a bento-grid homepage.
- Anonymous cat-photo uploads (storage + public DB gallery).
- Gallery page with masonry-style photo cards and a mock "value" ticker.
- Newsletter signup (email stored in DB).
- Dark/light mode toggle.
- No real payments yet — a styled "value" concept with placeholder pricing/actions.

Design system
- Palette: warm cream background (#FEF3C7), soft pink (#F9A8D4), lavender (#A78BFA), sky blue (#60A5FA) as primary accents. Use these only through CSS tokens.
- Typography: Outfit headings, Figtree body. Loaded via Google Fonts link in __root.tsx.
- Shape: large rounded corners, soft shadows, pill buttons, pastel gradients, paw/whisker icon accents.
- Components: Header (logo + nav + theme toggle), Hero bento (stats + featured cat + CTA), Upload card, Newsletter card, Photo gallery, Footer.

Routes
- / — Bento landing page: hero headline, featured photo, upload CTA, live stats, newsletter, recent gallery preview.
- /gallery — Full masonry gallery of uploaded photos with value score and like action.
- /upload — Upload form + recent uploads (optional; upload also available from home).

Data model
- photos table: id, storage_path, caption, value (numeric), likes (int), created_at, client_ip (optional, for moderation).
- newsletter_subscribers: id, email, created_at.
- Storage bucket: cat-photos (public read).
- Server functions: listPhotos, uploadPhoto, incrementLikes, subscribeNewsletter.

Implementation steps
1. Enable Lovable Cloud and create storage bucket + migrations (tables, RLS grants).
2. Update src/styles.css with tokens and fonts.
3. Update __root.tsx head with Google Fonts and dark-mode toggle wiring.
4. Build shared Header, Footer, ThemeToggle components.
5. Build home bento layout with generated hero assets.
6. Build gallery route with photo cards.
7. Build upload flow (signed upload URL + insert photo row).
8. Build newsletter signup.
9. Add robots.txt and sitemap.xml.
10. Verify build, preview, and test upload/gallery/newsletter.