# Next.js migration plan — 2026-09-08

The starting application is Vite + JavaScript, npm/package-lock.json, and one
existing Supabase database. `backend/` is a retained local Laravel system and
is not the production entry. Next.js becomes the canonical root application;
legacy files remain available for comparison, with no second content database.

Implementation order: App Router/TypeScript and verified cookie auth → shared
content domain and private revisions → server-rendered public content and
interactive editorial UI → admin/media/versions/contact → build/runtime and
access tests → deployment if the connected hosting credentials are available.

| Existing source | Next.js usage |
| --- | --- |
| profiles | public identity and authorized profile editor |
| site_settings | metadata, media, contact, appearance and footer |
| page_sections | hero copy, order, visibility, about and custom sections |
| navigation_items | public rule-bar and footer navigation |
| projects / project_media | archive, case study, gallery and technology diagram |
| skills / experiences / educations | grouped skills and timeline sections |
| certificates / achievements | evidence/document viewers |
| articles / services / testimonials | archives and public content |
| social_links / statistics | configured public links and genuine statistics |
| portfolio_versions | existing selected content, routes and print selection |
| media_assets / portfolio-public | existing media library and uploads |
| contact_messages | protected inbox; server-validated, rate-limited submissions |
| Auth / roles / permissions / user_roles | verified server identity and RLS |
| new playground table | missing experiment content module, no seeded content |
| new content_revisions table | private edits; canonical rows stay published until explicit publication |
| new slug_redirects table | preserve prior public project/article slugs |

Important routes retained: `/`, `/projects`, `/projects/:slug`, `/login`,
`/forgot-password`, `/reset-password`, `/admin` and existing module aliases,
`/portfolio-builder`, `/portfolio/:slug`, `/p/:slug`. Added archives include
`/articles`, `/articles/:slug`, `/playground` and `/playground/:slug`.

The current Supabase schema is behind repository migrations (missing
projects.project_year, experiences.experience_type, articles.seo_title and
achievements). Read errors must remain visible; missing columns must not be
silently replaced by invented data. New migrations contain no identity/project
seeds. No production content or auth user is replaced.

DESIGN.md now specifies Drive Capital. The previous Extra reference is superseded
for the new renderer. Existing version appearance values remain stored, but the
new design respects cream, Ink, Ash, outline-blue pills, square flat content
surfaces and lightweight serif display. Cormorant 300 and Inter 300/400 are the
licensed open-source substitutes. Body text and small action labels use Ink;
blue remains on large display and outlines for accessible contrast. User photos,
project captures and evidence documents are real content, not decoration.
