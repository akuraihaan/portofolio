import Link from "next/link";
import type { Bundle, Collection } from "@/lib/data";
import { text, strings, object, safeHref, origin, type Row } from "@/lib/domain";
import { MediaImage } from "./media";
import { PixelIcon } from "./pixel-icon";
import { SharePrint } from "./share-print";

export function EditorialHero({
  section,
  bundle,
  version,
  showExport = false,
}: {
  section: Row;
  bundle: Bundle;
  version?: Row;
  showExport?: boolean;
}) {
  const custom = object(section.custom_data);
  const roles = strings(custom.roles);
  const name = text(bundle.profile?.full_name);
  const photo = safeHref(section.image_url || bundle.settings.hero_image_url);
  const availability = text(custom.availability_status);
  return (
    <section id="hero" className="editorial-hero">
      {/* AI Badge Pill + availability — above headline */}
      <div className="hero-kicker">
        <p className="eyebrow">
          {text(section.eyebrow) || "Portofolio Digital"}
        </p>
        {availability && availability !== "hidden" && (
          <p className="availability">
            <span aria-hidden="true" />
            {availability}
          </p>
        )}
      </div>

      {/* Main centered composition */}
      <div className="hero-composition">
        <div className="hero-copy">
          <h1>
            <span className="hero-readable">{text(section.title) || name}</span>
            <span aria-hidden="true" className="hero-display">
              {text(section.title) || name}
            </span>
          </h1>
          {section.subtitle && (
            <p className="hero-subtitle">{text(section.subtitle)}</p>
          )}
          {roles.length > 0 && (
            <p className="hero-roles">
              {roles.map((role, i) => (
                <span key={role}>
                  {i > 0 && (
                    <span aria-hidden="true" className="role-separator">
                      {" "}
                      /{" "}
                    </span>
                  )}
                  {role}
                </span>
              ))}
            </p>
          )}
        </div>
        {photo && version?.show_photo !== false ? (
          <figure className="hero-portrait">
            <MediaImage src={photo} alt={name} priority contain />
          </figure>
        ) : null}
      </div>

      {/* Bottom row: description + CTAs, centered */}
      <div className="hero-bottom">
        <div className="hero-introduction">
          {text(section.description)
            .split(/\n\s*\n/)
            .filter(Boolean)
            .map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          {section.badge_text && (
            <p className="meta">{text(section.badge_text)}</p>
          )}
        </div>
        <div className="hero-actions">
          {["primary", "secondary"].map((key) =>
            safeHref(section[key + "_button_url"]) &&
            text(section[key + "_button_label"]) ? (
              <a
                key={key}
                className="pill"
                href={safeHref(section[key + "_button_url"])}
              >
                {text(section[key + "_button_label"])}{" "}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12L12 2M4 2h8v8"/></svg>
              </a>
            ) : null,
          )}
          {safeHref(bundle.settings.resume_url) && (
            <a
              className="pill"
              href={safeHref(bundle.settings.resume_url)}
              target="_blank"
              rel="noreferrer"
            >
              {text(custom.resume_label) || "Unduh CV"}{" "}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 2v8M3 7l4 4 4-4M2 12h10"/></svg>
            </a>
          )}
          {showExport && <SharePrint url={origin(bundle.settings)} fullOnly />}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hero-footnote">
        <span>{text(bundle.settings.owner_location)}</span>
        <span aria-hidden="true">Jelajahi karya</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 2v8M3 8l4 4 4-4"/></svg>
      </div>
    </section>
  );
}

export function EditorialFallbackHero({
  bundle,
  nextSection,
  hasContact,
  showExport = false,
}: {
  bundle: Bundle;
  nextSection: string;
  hasContact: boolean;
  showExport?: boolean;
}) {
  const name =
    text(bundle.profile?.full_name) ||
    text(bundle.settings.site_name) ||
    "Portofolio";
  const skills = (bundle.collections.skills?.data || []).slice(0, 4);
  const factSources: [string, Collection][] = [
    ["Proyek", bundle.collections.projects],
    ["Keahlian", bundle.collections.skills],
    ["Pengalaman", bundle.collections.experiences],
    ["Pendidikan", bundle.collections.educations],
    ["Sertifikat", bundle.collections.certificates],
  ];
  const facts = factSources.filter(
    ([, collection]) => !collection.error && collection.data.length > 0,
  );

  return (
    <section id="hero" className="editorial-hero editorial-hero-fallback">
      {/* AI Badge Pill */}
      <div className="hero-kicker">
        <p className="eyebrow">Portofolio Digital</p>
        {text(bundle.settings.owner_location) && (
          <p className="availability">
            <span aria-hidden="true" />
            {text(bundle.settings.owner_location)}
          </p>
        )}
      </div>

      {/* Centered hero content */}
      <div className="hero-composition">
        <div className="hero-copy">
          <h1>
            <span className="hero-readable">{name}</span>
            <span aria-hidden="true" className="hero-display">
              {name}
            </span>
          </h1>
          <p className="hero-subtitle">Proyek dan pengalaman saya.</p>
        </div>
        {facts.length > 0 && (
          <dl className="hero-facts" aria-label="Ringkasan portofolio">
            {facts.map(([label, collection]) => (
              <div key={label as string}>
                <dt>{label}</dt>
                <dd>{collection.data.length.toString().padStart(2, "0")}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {/* Bottom row */}
      <div className="hero-bottom">
        <div className="hero-introduction">
          {skills.length > 0 && (
            <>
              <p className="meta">Keahlian</p>
              <ul className="hero-skill-preview">
                {skills.map((skill) => (
                  <li key={text(skill.id)}>{text(skill.name)}</li>
                ))}
              </ul>
            </>
          )}
        </div>
        <div className="hero-actions">
          <Link className="pill" href={`#${nextSection}`}>
            Lihat proyek{" "}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 2v8M3 8l4 4 4-4"/></svg>
          </Link>
          {hasContact && (
            <Link className="pill" href="#contact">
              Hubungi saya{" "}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12L12 2M4 2h8v8"/></svg>
            </Link>
          )}
          {showExport && <SharePrint url={origin(bundle.settings)} fullOnly />}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hero-footnote">
        <span>{text(bundle.settings.owner_location)}</span>
        <span aria-hidden="true">Jelajahi portofolio</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 2v8M3 8l4 4 4-4"/></svg>
      </div>
    </section>
  );
}

export function SkillGroups({
  rows,
  projects,
}: {
  rows: Row[];
  projects: Row[];
}) {
  const groups = Map.groupBy(rows, (row) => text(row.category) || "Keahlian");
  const categoryName = (value: string) =>
    ({
      "hard skills": "Teknis",
      website: "Web",
      app: "Aplikasi",
      "soft skill": "Sikap kerja",
    })[value.trim().toLowerCase()] || value;
  const skillDescription = (skill: Row) => {
    const name = text(skill.name).trim().toLowerCase();
    const simpleDescriptions: Record<string, string> = {
      "microsoft office": "Word, Excel, dan PowerPoint.",
      "html & css": "Membuat tampilan web dengan HTML dan CSS.",
      "mobile development": "Membuat aplikasi untuk perangkat mobile.",
      teamwork: "Bekerja sama dalam tim.",
    };
    return simpleDescriptions[name] || text(skill.description);
  };
  return (
    <div className="skill-groups">
      {[...groups.entries()].map(([category, skills], index) => (
        <section className="skill-group" key={category}>
          <div className="skill-category">
            <span className="meta">{String(index + 1).padStart(2, "0")}</span>
            <h3>{categoryName(category)}</h3>
            <PixelIcon name="arrow-up-right" />
          </div>
          <div>
            {skills.map((skill) => (
              <div className="skill-item" key={text(skill.id)}>
                <h4>{text(skill.name)}</h4>
                {skillDescription(skill) && <p>{skillDescription(skill)}</p>}
                <div className="skill-evidence">
                  {projects
                    .filter((project) =>
                      strings(project.technologies).some(
                        (tech) =>
                          tech.toLowerCase() === text(skill.name).toLowerCase(),
                      ),
                    )
                    .map((project) => (
                      <Link
                        key={text(project.id)}
                        href={"/projects/" + text(project.slug)}
                      >
                        {text(project.title)} <PixelIcon name="arrow-up-right" />
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
