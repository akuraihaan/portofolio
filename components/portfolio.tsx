import Link from "next/link";
import { Suspense } from "react";
import type { Bundle } from "@/lib/data";
import {
  text,
  strings,
  object,
  safeHref,
  titleOf,
  anchor,
  sectionAliases,
  modules,
  type Row,
} from "@/lib/domain";
import { Navigation } from "./navigation";
import { MediaImage } from "./media";
import { ProjectExplorer } from "./project-explorer";
import { ContactForm } from "./contact-form";
import { TechnologyMap } from "./technology-map";
import { Gallery } from "./gallery";
import { safeReturnPath } from "@/lib/explorer";
import { EditorialFallbackHero, EditorialHero, SkillGroups } from "./editorial";
import { ArticleContent } from "./article-content";
import {
  visibleSections,
  sectionKind,
  sectionAnchor,
} from "@/lib/presentation";
export function TextBlock({ value }: { value: Row[string] }) {
  if (Array.isArray(value))
    return (
      <ul>
        {value.map((item, i) => (
          <li key={i}>
            <TextBlock value={item} />
          </li>
        ))}
      </ul>
    );
  if (value && typeof value === "object")
    return (
      <>
        {Object.entries(value).map(([key, item]) => (
          <div key={key}>
            {!["description", "content", "text", "value"].includes(key) && (
              <h4>{key.replaceAll("_", " ")}</h4>
            )}
            <TextBlock value={item} />
          </div>
        ))}
      </>
    );
  return (
    <>
      {text(value)
        .split(/\n\s*\n/)
        .filter(Boolean)
        .map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
    </>
  );
}

const editorialCopy: Record<string, { title: string; description: string }> = {
  skills: { title: "Keahlian", description: "Teknologi yang saya gunakan." },
  featured_projects: { title: "Proyek pilihan", description: "Beberapa proyek yang pernah saya kerjakan." },
  projects: { title: "Proyek", description: "Proyek kuliah, tugas akhir, dan kerja tim." },
  experiences: { title: "Pengalaman", description: "Pengalaman dan kegiatan saya." },
  educations: { title: "Pendidikan", description: "Riwayat pendidikan." },
  certificates: { title: "Sertifikat", description: "Sertifikat yang saya miliki." },
  contact: { title: "Kontak", description: "Hubungi saya untuk pekerjaan atau kolaborasi." },
  collaborate: { title: "Kolaborasi", description: "Terbuka untuk proyek dan kolaborasi." },
  process: { title: "Cara kerja", description: "Pahami kebutuhan, kerjakan, lalu uji hasilnya." },
  footer: { title: "Taufik Raihandani", description: "Proyek, pengalaman, dan pendidikan." },
};

function sectionCopy(section: Row, key: string) {
  const copy = editorialCopy[key];
  return {
    title: copy?.title || text(section.title) || text(section.section_name),
    description: copy?.description || text(section.description),
  };
}

function visibleSectionCopy(section: Row, key: string) {
  const copy = sectionCopy(section, key);
  if (key === "featured_projects")
    return { ...copy, title: "Proyek pilihan", description: "Beberapa proyek yang pernah saya kerjakan." };
  if (key === "projects")
    return { ...copy, description: "Proyek kuliah, tugas akhir, dan kerja tim." };
  if (key === "skills") return { ...copy, description: "Teknologi yang saya gunakan." };
  if (key === "experiences") return { ...copy, description: "Pengalaman dan kegiatan saya." };
  if (key === "educations") return { ...copy, description: "Riwayat pendidikan." };
  if (key === "certificates") return { ...copy, description: "Sertifikat yang saya miliki." };
  if (key === "contact") return { ...copy, description: "Hubungi saya untuk pekerjaan atau kolaborasi." };
  return copy;
}
export function PublicShell({
  bundle,
  children,
  home = false,
}: {
  bundle: Bundle;
  children: React.ReactNode;
  home?: boolean;
}) {
  const sectionIds = new Set(visibleSections(bundle).map(sectionAnchor));
  const nav = (bundle.collections.navigation?.data || []).flatMap((row) => {
    let href = safeHref(row.href);
    if (!href) return [];
    if (
      [
        "/articles",
        "/playground",
        "/projects",
        "/experiences",
        "/educations",
        "/skills",
        "/certificates",
        "/achievements",
      ].includes(href) &&
      !bundle.collections[href.slice(1)]?.data.length
    )
      return [];
    if (href === "/about" && !sectionIds.has("about")) return [];
    if (href.startsWith("#")) {
      const target = anchor(href.slice(1));
      if (!sectionIds.has(target)) return [];
      href = (home ? "" : "/") + "#" + target;
    }
    return [{ label: text(row.label), href }];
  });
  if (
    bundle.collections.translations?.data.some(
      (row) => row.source_type === "home",
    )
  )
    nav.push({ label: "EN ↗", href: "/en" });
  return (
    <div className={home ? "public-site public-home" : "public-site"}>
      <Navigation
        name={
          text(bundle.profile?.full_name) || text(bundle.settings.site_name)
        }
        items={nav}
      />
      {children}
      <footer className="footer shell">
        <p>
          {text(bundle.profile?.full_name) || text(bundle.settings.site_name)}
          <br />
          <small>
            {text(
              bundle.settings.footer_text ?? bundle.settings.copyright_text,
            ).replaceAll("{year}", String(new Date().getFullYear()))}
          </small>
        </p>
        {(bundle.collections.sections?.data || [])
          .filter((row) => row.section_key === "footer")
          .map((row) => (
            <div className="prose" key={text(row.id)}>
              <p>{editorialCopy.footer.title}</p>
              <p>{editorialCopy.footer.description}</p>
            </div>
          ))}
        <nav aria-label="Media sosial">
          <Link href="/privacy">Privasi</Link>
          {(bundle.collections.social_links?.data || [])
            .filter((row) => row.show_in_footer)
            .map((row) => (
              <a
                key={text(row.id)}
                href={safeHref(row.url)}
                target={row.open_in_new_tab ? "_blank" : undefined}
                rel="noreferrer"
              >
                {text(row.label)} ↗{" "}
              </a>
            ))}
        </nav>
        <a href="#main">Kembali ke atas ↑</a>
      </footer>
    </div>
  );
}
export function CollectionError({
  bundle,
  name,
}: {
  bundle: Bundle;
  name: string;
}) {
  const error = bundle.collections[name]?.error;
  return error ? (
    <p className="notice" role="status">
      Bagian ini belum dapat dimuat. Silakan coba kembali nanti.
    </p>
  ) : null;
}
export function ContactInfo({ bundle }: { bundle: Bundle }) {
  return (
    <address>
      {text(bundle.settings.owner_location) && (
        <p>{text(bundle.settings.owner_location)}</p>
      )}
      {safeHref("mailto:" + text(bundle.settings.owner_email)) &&
        text(bundle.settings.owner_email) && (
          <p>
            <a href={safeHref("mailto:" + text(bundle.settings.owner_email))}>
              {text(bundle.settings.owner_email)}
            </a>
          </p>
        )}
      {bundle.settings.show_phone === true && text(bundle.profile?.phone) && (
        <p>
          <a href={safeHref("tel:" + text(bundle.profile?.phone))}>
            {text(bundle.profile?.phone)}
          </a>
        </p>
      )}
      {(bundle.collections.social_links?.data || [])
        .filter((r) => r.show_in_contact)
        .map((r) => (
          <p key={text(r.id)}>
            <a href={safeHref(r.url)} target="_blank" rel="noreferrer">
              {text(r.label)} ↗
            </a>
          </p>
        ))}
    </address>
  );
}
function Buttons({ row }: { row: Row }) {
  return (
    <div className="actions center-actions">
      {["primary", "secondary"].map((key) =>
        safeHref(row[key + "_button_url"]) &&
        text(row[key + "_button_label"]) ? (
          <a
            className="pill"
            key={key}
            href={safeHref(row[key + "_button_url"])}
          >
            {text(row[key + "_button_label"])} ↗
          </a>
        ) : null,
      )}
    </div>
  );
}
export function ContentCards({
  rows,
  moduleKey,
  projects = [],
}: {
  rows: Row[];
  moduleKey: string;
  projects?: Row[];
}) {
  return (
    <div
      className={
        ["experiences", "educations"].includes(moduleKey)
          ? "timeline"
          : "flat-grid"
      }
    >
      {rows.map((row) => (
        <article className="flat-card" key={text(row.id)}>
          {text(
            row.image_url ||
              row.certificate_url ||
              row.thumbnail_url ||
              row.avatar_url ||
              row.logo_url,
          ) &&
            (moduleKey === "certificates" ? (
              <Gallery
                label={titleOf(row)}
                items={[
                  {
                    src: text(row.image_url || row.certificate_url),
                    alt: titleOf(row),
                  },
                ]}
              />
            ) : (
              <MediaImage
                src={text(
                  row.image_url ||
                    row.certificate_url ||
                    row.thumbnail_url ||
                    row.avatar_url ||
                    row.logo_url,
                )}
                alt={titleOf(row)}
                contain
              />
            ))}
          <p className="meta">
            {[
              row.category,
              row.author_role,
              row.issuer,
              row.organizer,
              row.experience_type,
              row.issue_date,
              row.achievement_date,
              row.credential_id,
              row.expiry_date,
              row.location,
              moduleKey === "testimonials" ? row.company : undefined,
            ]
              .map(text)
              .filter(Boolean)
              .join(" / ")}
          </p>
          <h3>
            {["articles", "playground"].includes(moduleKey) ? (
              <Link href={"/" + moduleKey + "/" + text(row.slug)}>
                {titleOf(row)}
              </Link>
            ) : (
              titleOf(row)
            )}
          </h3>
          {row.role_title && <p>{text(row.role_title)}</p>}
          {(row.degree || row.field_of_study) && (
            <p>
              {[row.degree, row.field_of_study]
                .map(text)
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
          {row.start_date && (
            <p className="meta">
              {text(row.start_date)} —{" "}
              {row.is_current ? "Sekarang" : text(row.end_date)}
            </p>
          )}
          <TextBlock value={row.description || row.excerpt || row.quote} />
          {row.price_label && <p>{text(row.price_label)}</p>}
          {moduleKey === "skills" && (
            <div className="actions">
              {projects
                .filter((p) =>
                  strings(p.technologies).some(
                    (t) => t.toLowerCase() === text(row.name).toLowerCase(),
                  ),
                )
                .map((p) => (
                  <Link key={text(p.id)} href={"/projects/" + text(p.slug)}>
                    {text(p.title)} ↗
                  </Link>
                ))}
            </div>
          )}
          {row.result && <p>{text(row.result)}</p>}
          {[
            "responsibilities",
            "achievements",
            "related_achievements",
            "features",
          ].map((key) =>
            strings(row[key]).length ? (
              <ul key={key}>
                {strings(row[key]).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            ) : null,
          )}
          <div className="actions">
            {[
              "credential_url",
              "file_url",
              "document_url",
              "link_url",
              "organization_url",
              "cta_url",
            ].map((key) =>
              safeHref(row[key]) ? (
                <a
                  key={key}
                  className="pill"
                  href={safeHref(row[key])}
                  target="_blank"
                  rel="noreferrer"
                >
                  {key === "cta_url"
                    ? text(row.cta_label) || "Hubungi"
                    : key.includes("file") || key.includes("document")
                      ? "Dokumen"
                      : "Lihat sumber"}{" "}
                  ↗
                </a>
              ) : null,
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
export function Portfolio({
  bundle,
  version,
}: {
  bundle: Bundle;
  version?: Row;
}) {
  let sections = visibleSections(bundle);
  if (version) {
    const order = strings(version.section_order);
    const allowed = new Set([
      "hero",
      "about",
      "skills",
      "projects",
      "experiences",
      "educations",
      "certificates",
      "articles",
      ...(version.show_contact ? ["contact"] : []),
    ]);
    sections = sections.filter((row) =>
      allowed.has(
        sectionAliases[text(row.section_key)] || text(row.section_key),
      ),
    );
    if (order.length)
      sections = [...sections].sort((a, b) => {
        const position = (r: Row) => {
          const n = order.findIndex(
            (k) =>
              (sectionAliases[k] || k) ===
              (sectionAliases[text(r.section_key)] || text(r.section_key)),
          );
          return n < 0 ? 999 : n;
        };
        return position(a) - position(b);
      });
  }
  return (
    <main
      id="main"
      className={"shell" + (version?.density === "compact" ? " compact" : "")}
    >
      <CollectionError bundle={bundle} name="sections" />
      {!sections.length && !bundle.collections.sections?.error && (
        <div className="section">
          <h1>{text(bundle.profile?.full_name) || "Portofolio"}</h1>
          <p>Belum ada bagian halaman yang dipublikasikan.</p>
        </div>
      )}
      {sections.length > 0 && !sections.some((row) => sectionKind(row) === "hero") && (
        <EditorialFallbackHero
          bundle={bundle}
          nextSection={sectionAnchor(sections[0])}
          hasContact={sections.some((row) => sectionKind(row) === "contact")}
          showExport={!version}
        />
      )}
      {sections.map((section, sectionIndex) => {
        const key = sectionKind(section),
          rows = bundle.collections[key]?.data || [],
          custom = object(section.custom_data);
        if (key === "hero")
          return (
            <EditorialHero
              key={text(section.id)}
              section={section}
              bundle={bundle}
              version={version}
              showExport={!version}
            />
          );
        return (
          <section
            id={sectionAnchor(section)}
            className={"section editorial-section section-" + key}
            key={text(section.id)}
          >
            <span className="editorial-pixel-field" aria-hidden="true">
              <span className="pixel-mark pixel-mark-one" />
              <span className="pixel-mark pixel-mark-two" />
              <span className="pixel-mark pixel-mark-three" />
            </span>
            <span className="section-spark" aria-hidden="true">✳</span>
            <div className="section-heading">
              <span className="section-number" aria-hidden="true">
                {String(sectionIndex + 1).padStart(2, "0")} /
              </span>
              {section.eyebrow && (
                <p className="eyebrow">{text(section.eyebrow)}</p>
              )}
              {key === "hero" ? (
                <h1>
                  {text(section.title) || text(bundle.profile?.full_name)}
                </h1>
              ) : (
              <h2>{visibleSectionCopy(section, key).title}</h2>
              )}
              {section.subtitle && !editorialCopy[key] && (
                <p className="lead">
                  {visibleSectionCopy(section, key).description ||
                    text(section.subtitle)}
                </p>
              )}
            </div>
            {!section.subtitle && editorialCopy[key]?.description && (
              <p className="lead section-copy">
                {visibleSectionCopy(section, key).description}
              </p>
            )}
            {key === "hero" ? (
              <>
                <div className="prose">
                  <TextBlock value={section.description} />
                </div>
                {section.badge_text && (
                  <p className="eyebrow">{text(section.badge_text)}</p>
                )}
                <p className="meta">{strings(custom.roles).join(" / ")}</p>
                <p>{text(custom.availability_status)}</p>
                <Buttons row={section} />
                {safeHref(bundle.settings.resume_url) && (
                  <div className="actions center-actions">
                    <a
                      className="pill"
                      href={safeHref(bundle.settings.resume_url)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {text(custom.resume_label) || "Unduh CV"} ↗
                    </a>
                  </div>
                )}
                <div className="hero-art">
                  <TechnologyMap
                    projects={bundle.collections.projects?.data || []}
                  />
                </div>
              </>
            ) : key === "about" ? (
              <>
                {version?.show_photo !== false &&
                  text(section.image_url || bundle.profile?.avatar_url) && (
                    <div className="profile-photo">
                      <MediaImage
                        src={text(
                          section.image_url || bundle.profile?.avatar_url,
                        )}
                        alt={text(bundle.profile?.full_name)}
                        contain
                      />
                    </div>
                  )}
                <div className="prose">
                  <TextBlock
                    value={section.description ?? bundle.profile?.bio}
                  />
                  {Object.entries(custom)
                    .filter(
                      ([k, v]) => typeof v === "string" && !k.includes("url"),
                    )
                    .map(([k, v]) => (
                      <p key={k}>{text(v)}</p>
                    ))}
                </div>
                <Buttons row={section} />
              </>
            ) : key === "contact" ? (
              <div className="contact-layout">
                <div className="contact-intro prose">
                  <TextBlock value={section.description} />
                  <ContactInfo bundle={bundle} />
                </div>
                <ContactForm />
              </div>
            ) : key === "statistics" ? (
              <dl className="statistics">
                {rows.map((row) => (
                  <div key={text(row.id)}>
                    <dt>{text(row.label)}</dt>
                    <dd>
                      {row.source_type === "count"
                        ? bundle.collections[text(row.source_table)]?.error
                          ? "—"
                          : (bundle.collections[text(row.source_table)]?.data
                              .length ?? 0)
                        : text(row.value)}
                      {text(row.suffix)}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <>
                {key !== "skills" && key !== "projects" && (
                  <div className="prose">
                    <TextBlock value={section.description} />
                  </div>
                )}
                <CollectionError bundle={bundle} name={key} />
                {key === "process" && (
                  <ol className="timeline">
                    {(Array.isArray(custom.steps) ? custom.steps : []).map(
                      (step, i) => (
                        <li key={i}>
                          <h3>{text(object(step).title)}</h3>
                          <TextBlock value={object(step).description} />
                        </li>
                      ),
                    )}
                  </ol>
                )}
                {text(custom.content) && (
                  <div className="prose">
                    <TextBlock value={custom.content} />
                  </div>
                )}
                {key === "projects" ? (
                  <Suspense fallback={<p>Memuat pencarian…</p>}>
                    <ProjectExplorer
                      basePath={
                        text(bundle.settings.preview_project_base) ||
                        "/projects"
                      }
                      projects={
                        !version && section.section_key === "featured_projects"
                          ? rows.filter((row) => row.is_featured).slice(0, 3)
                          : version
                            ? rows
                            : rows.slice(0, 6)
                      }
                    />
                  </Suspense>
                ) : key === "skills" ? (
                  <SkillGroups
                    rows={rows}
                    projects={bundle.collections.projects?.data || []}
                  />
                ) : modules[key] ? (
                  <ContentCards
                    rows={rows}
                    moduleKey={key}
                    projects={bundle.collections.projects?.data || []}
                  />
                ) : null}
                {!rows.length &&
                  modules[key] &&
                  !bundle.collections[key]?.error && (
                    <p className="empty-state">
                      Belum ada {modules[key].label.toLowerCase()} yang
                      dipublikasikan.
                    </p>
                  )}
                {["projects", "articles", "playground"].includes(key) && (
                  <div className="actions center-actions">
                    <Link
                      className="pill"
                      href={
                        key === "projects" &&
                        bundle.settings.preview_project_base
                          ? text(bundle.settings.preview_project_base)
                          : "/" + key
                      }
                    >
                      Arsip {modules[key].label.toLowerCase()} ↗
                    </Link>
                  </div>
                )}
                <Buttons row={section} />
              </>
            )}
          </section>
        );
      })}
    </main>
  );
}
export function Detail({
  bundle,
  row,
  moduleKey,
  returnTo,
}: {
  bundle: Bundle;
  row: Row;
  moduleKey: string;
  returnTo?: string;
}) {
  const caseStudy = object(row.case_study),
    labels: Record<string, string> = {
      background: "Latar belakang",
      problem: "Masalah",
      goal: "Tujuan",
      contribution: "Kontribusi pribadi",
      team_technologies: "Teknologi tim",
      audience: "Pengguna",
      process: "Proses",
      features: "Fitur",
      decisions: "Keputusan desain & teknologi",
      solution: "Solusi",
      outcome: "Hasil",
      lessons: "Refleksi",
    };
  const gallery = (bundle.collections.project_media?.data || [])
    .filter((media) => media.project_id === row.id)
    .map((media) => ({
      src: text(media.media_url),
      alt: text(media.alt_text) || titleOf(row),
      caption: text(media.caption),
    }))
    .filter((media) => safeHref(media.src));
  return (
    <main id="main" className="shell">
      <article>
        <header
          className="section hero"
          style={
            moduleKey === "projects"
              ? {
                  viewTransitionName: `project-${text(row.id).replace(/[^\w-]/g, "")}`,
                }
              : undefined
          }
        >
          <Link href={safeReturnPath(returnTo, moduleKey)}>
            ← Arsip {modules[moduleKey].label.toLowerCase()}
          </Link>
          <p className="eyebrow">{text(row.category)}</p>
          <h1>{titleOf(row)}</h1>
          <div className="detail-meta">
            {moduleKey === "articles" && text(row.content) && (
              <span>
                {Math.max(
                  1,
                  Math.ceil(text(row.content).split(/\s+/).length / 200),
                )}{" "}
                menit baca
              </span>
            )}
            {[
              row.role,
              row.client,
              row.project_year,
              row.duration,
              moduleKey === "articles" &&
                row.published_at &&
                text(row.published_at).slice(0, 10),
            ].map((v, i) => (v ? <span key={i}>{text(v)}</span> : null))}
          </div>
          <div className="prose">
            <TextBlock value={row.summary || row.excerpt} />
          </div>
          <ul className="tag-list center-actions">
            {strings(row.technologies || row.tags).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          {text(row.cover_url || row.thumbnail_url || row.image_url) && (
            <div className="detail-cover">
              <MediaImage
                src={text(row.cover_url || row.thumbnail_url || row.image_url)}
                alt={titleOf(row)}
                priority
              />
            </div>
          )}
          <div className="actions center-actions">
            {[
              "project_url",
              "repository_url",
              "figma_url",
              "documentation_url",
              "video_url",
              "link_url",
            ].map((key) =>
              safeHref(row[key]) ? (
                <a
                  className="pill"
                  key={key}
                  href={safeHref(row[key])}
                  rel="noreferrer"
                  target="_blank"
                >
                  {
                    (
                      {
                        project_url: "Demo",
                        repository_url: "Repository",
                        figma_url: "Figma",
                        documentation_url: "Dokumentasi",
                        video_url: "Video",
                        link_url: "Eksperimen",
                      } as Record<string, string>
                    )[key]
                  }{" "}
                  ↗
                </a>
              ) : null,
            )}
          </div>
        </header>
        <div className="section prose">
          {moduleKey === "articles" ? (
            <ArticleContent source={text(row.content)} />
          ) : (
            <TextBlock value={row.content || row.description} />
          )}
          {safeHref(row.video_url) &&
            (/\.(mp4|webm)(\?|$)/i.test(text(row.video_url)) ||
              text(row.video_url).startsWith("/api/media/")) && (
              <video
                controls
                preload="metadata"
                src={safeHref(row.video_url)}
                aria-label={titleOf(row)}
              />
            )}
          {Object.entries(labels).map(([key, label]) =>
            text(caseStudy[key]) ? (
              <section key={key} id={key}>
                <h3>{label}</h3>
                <TextBlock value={caseStudy[key]} />
              </section>
            ) : null,
          )}
          {Object.entries(caseStudy)
            .filter(([key]) => !Object.hasOwn(labels, key))
            .map(([key, value]) => (
              <section key={key}>
                <h3>{key.replaceAll("_", " ")}</h3>
                <TextBlock value={value} />
              </section>
            ))}
        </div>
        {gallery.length > 0 && (
          <section className="section">
            <h2>Di balik layar.</h2>
            <Gallery items={gallery} />
          </section>
        )}
      </article>
    </main>
  );
}
