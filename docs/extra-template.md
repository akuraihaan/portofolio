# Extra — implementation and verification

Implemented locally on 2026-09-08. Existing uncommitted work was preserved. No
content was published to the user's Supabase project during this work.

## Usage

1. Open `/admin/appearance`. The **Desain portfolio** panel shows thumbnails for
   the existing design and **Extra**.
2. Select Extra, choose the existing profile or hero media, set horizontal and
   vertical focal coordinates, accent, motion, highlighted skills and featured
   projects. Cover focal coordinates are stored by project ID.
3. Add hero cards, choose their data source, edit labels and custom values, move
   them with **Naik / Turun**, hide them with **Tampilkan**, or remove them.
   Empty cards are omitted; the first three visible, populated cards appear.
4. **Simpan draft** writes only the private appearance row. **Preview draft
   tersimpan** saves and opens the draft in an iframe. Desktop, Mobile, 360px,
   768px and 1024px controls set the iframe viewport.
5. **Publikasikan tampilan** atomically writes the public appearance snapshot.
   Public pages query it on load, so refreshing loads the latest publication.
   No deployment is needed for settings/content updates.
6. Continue managing profile, bio, uploads, projects, sections, contact and
   navigation in their existing admin modules. Their publication semantics are
   retained: profile/settings edits are direct updates; content modules have
   their existing draft/published status. The new appearance draft does **not**
   create draft snapshots for profile or bio edits.
7. In Portfolio Builder (also linked from `/admin/portfolio_versions`), select
   **Extra** in **Tema** and select the version's content. **Publikasikan versi**
   uses the existing version table and `/portfolio/:slug` route; `/p/:slug`
   remains accepted. **Cetak / Simpan PDF** opens the native print dialog after
   fonts and images have settled. It does not download a PDF automatically.

## Data and security

No new table, column, or second portfolio database is required for Extra.
`site_settings.value` already supports JSON, and `portfolio_versions.theme` is
text without a restrictive theme check in the existing migrations.

- `appearance_draft`: `is_public = false`; existing RLS permits authorized
  settings readers. The preview also checks an active authenticated profile and
  `settings.view` before reading the draft.
- `appearance_published`: `is_public = true`; copied only on explicit publish.
- Main content continues through `public-content-service.js`, including
  published/scheduled filters. Hero project counts independently exclude draft
  and future-dated records as well.
- No generated identity, project fallback array, stock portrait or permanent
  signed URL was added to production. Existing managed media paths are preferred
  over legacy URLs, with the existing updated-at cache key.
- Version web and print renderers use the same selected IDs. QR URLs point to
  the current origin and existing `/portfolio/:slug` route. Actual accessibility
  of a production QR destination still requires a published, unexpired version.
- Crop coordinates and accent values are normalized; card text is escaped.

## Visual direction

White/light-gray canvas, large dark identity text, horizontal header, circular
portrait, rounded cards and soft shadows follow the user's description of the
TikTok preview. The TikTok link could not be opened; the complete video and its
motion were not observed. Section treatments, tablet/mobile layout and A4 print
layout were developed as consistent additions. See `DESIGN.md` for the isolated
variation and retained accessibility rules.

## Verification performed

The browser loaded the actual local app and read existing public Supabase data.
Admin access redirected to `/login`; no authenticated test admin was available.
The following interactive checks therefore used the actual renderers and editor
with an injected **test-only repository**, not live Supabase writes.

The fixture `/tests/extra-preview.html` is a development entry, excluded from
Vite's production entry graph. Its profile and project are explicitly synthetic,
its SVG says it is not the owner's photo, and all editor writes stay in the
fixture's sessionStorage key `extra-isolated-qa`. It is never a production content
fallback. Fixture links are test destinations and are not published versions.

| Check | Result |
| --- | --- |
| Choose Extra, add/edit card, save draft | Passed in the actual editor with isolated storage |
| Public view before publication | Retained previous cards; new draft card absent |
| Draft iframe | Showed the new draft card |
| Reorder two cards | Preview showed `Kedua` before `Pertama` |
| Hide a card | Hidden card absent from preview and published fixture |
| Explicit publication + public refresh | Updated card displayed |
| 360 / 390 / 768 / 1024 / 1440px iframe widths | No horizontal overflow |
| Usable widths excluding the 15px scrollbar | 345 / 375 / 753 / 1009 / 1425px; each matched scrollWidth |
| Portrait dimensions at those widths | 269² / 299² / 360² / 368.30² / 482.11² px; no distortion |
| Long biography | Wrapped without overflow in home, version, and A4 CSS preview |
| Mobile menu Enter / Escape | aria-expanded changed true / false |
| Lihat Proyek anchor; Back / Forward | Correct #work URL and history restoration |
| Detail renderer and refresh | Correct title, owner and return-to-section links; no console errors |
| Invalid application route | Displayed the existing 404 screen |
| Version selection | Unselected project excluded; tested automatically |
| A4 CSS layout | Visually inspected using the same print rules in the fixture |
| Email / project / QR links | Correct markup and URLs checked; fixed malformed mailto link |
| Print asset sequencing | Automated test verifies font/image completion before window.print |

`node --test tests/*.test.mjs`: **11 passed**. Production `vite build`: **passed**.
The system Node version is 22.11.0, below Vite's supported minimum; final checks
use the bundled newer Node runtime. No lint or typecheck scripts exist in this
JavaScript project. JS syntax checks and `git diff --check` are also run.

## Outstanding verification and existing configuration blockers

Read-only PostgREST checks against the configured project returned:

| Table | Error |
| --- | --- |
| projects | 42703: `project_year` column does not exist |
| experiences | 42703: `experience_type` column does not exist |
| articles | 42703: `seo_title` column does not exist |
| achievements | PGRST205: table not found in schema cache |

These fields/tables are provided by the already-existing
`supabase/migrations/202609040001_admin_content_expansion.sql`. Apply the project's
pending migrations in order to a separate test Supabase project before the live
acceptance flow. This work did not execute remote migrations or write test
records into the owner's database.

Still unverified against a real test database: uploading/replacing profile media
and bio through authenticated admin, server-side RLS isolation of the new draft
row, project draft-to-published lifecycle, saved version publication, and a
publicly reachable QR destination. These require an authenticated test admin and
the missing schema. The fixture checks do not prove those server-side behaviors.

The embedded browser did not expose a native print preview or a saved PDF file.
The A4 CSS preview and print sequencing passed, but **actual PDF pagination,
selectable text, hyperlinks and absence of blank pages in the final PDF file
remain to be checked** in the native browser print dialog. No automatic PDF
download is claimed.

## Files changed for Extra

- `DESIGN.md`: isolated Extra variation.
- `index.html`: Extra stylesheet.
- `extra.css`: responsive home/detail/listing/version and A4 styles.
- `js/extra-template.js`: appearance normalization, hero/cards, navigation,
  contrast and print sequencing.
- `js/appearance-admin.js`: draft/publish editor, preview authorization, and
  injectable repository for isolated tests.
- `js/admin.js`: attach the template panel to existing Appearance settings.
- `js/public.js`: Extra renderer integration, safe social links, visible load
  errors and achievement thumbnail viewer.
- `js/projects.js`: Extra listing and differentiated load errors.
- `js/project-detail.js`: content-scope bug fix, Extra navigation/crop and load
  error state.
- `js/portfolio-builder.js`: Extra option and rendering, covers/documents,
  print label/sequencing, explicit version publication label and mailto fix.
- `js/public-portfolio.js`: print sequencing and version fetch error state.
- `js/services/public-content-service.js`: managed asset precedence and document
  URL/path resolution.
- `js/router.js`: malformed/nested route rejection.
- `js/ui/navigation.js`: anchor history supports Back/Forward.
- `tests/extra-template.test.mjs`: normalization, count, escaping, routes,
  version selection and print sequencing tests.
- `tests/extra-preview.html`, `tests/extra-preview.js`, `tests/extra-media.svg`:
  development-only browser fixtures.
- `docs/extra-template.md`: this report.

Other files already modified at task start were not reverted or included as new
Extra changes in this list.
