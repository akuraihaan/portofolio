"use client";
import Link from "next/link";
import { PixelIcon } from "./pixel-icon";
import { useState, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { text, strings, safeHref, type Row } from "@/lib/domain";
import { explore, filterHref, readFilters, type Filters } from "@/lib/explorer";
import { MediaImage } from "./media";
import { ProjectArtwork } from "./project-artwork";
export function ProjectExplorer({
  projects,
  archive = false,
  basePath = "/projects",
}: {
  projects: Row[];
  archive?: boolean;
  basePath?: string;
}) {
  const params = useSearchParams(),
    router = useRouter(),
    pathname = usePathname();
  const filters = archive
    ? readFilters(params)
    : { q: "", category: "", technology: "", page: 1 };
  const [preview, setPreview] = useState<Row | null>(null);
  const dialog = useRef<HTMLDialogElement>(null),
    opener = useRef<HTMLButtonElement | null>(null);
  const categories = [
    ...new Set(projects.map((row) => text(row.category)).filter(Boolean)),
  ];
  const technologies = [
    ...new Set(projects.flatMap((row) => strings(row.technologies))),
  ].sort();
  const result = explore(
    projects,
    filters,
    archive ? 12 : Math.max(1, projects.length),
  );
  function update(next: Partial<Filters>) {
    router.push(filterHref(pathname, { ...filters, page: 1, ...next }), {
      scroll: false,
    });
  }
  function href(row: Row) {
    return (
      basePath +
      "/" +
      text(row.slug) +
      (archive
        ? "?from=" +
          encodeURIComponent(
            filterHref(pathname, { ...filters, page: result.page }),
          )
        : "")
    );
  }
  return (
    <div
      className={
        "project-explorer" +
        (archive ? " archive-explorer" : " featured-explorer")
      }
    >
      {archive && (
        <>
          <div className="project-tools">
            <form
              className="search-field"
              onSubmit={(event) => {
                event.preventDefault();
                update({
                  q: String(new FormData(event.currentTarget).get("q") || ""),
                });
              }}
            >
              <label htmlFor="project-search">Cari proyek</label>
              <div className="search-control">
                <input
                  key={filters.q}
                  id="project-search"
                  name="q"
                  type="search"
                  defaultValue={filters.q}
                  placeholder="Judul, peran, atau teknologi"
                />
                <button type="submit" aria-label="Cari proyek">
                  ↗
                </button>
              </div>
            </form>
            <label className="technology-filter">
              Teknologi
              <select
                value={filters.technology}
                onChange={(event) => update({ technology: event.target.value })}
              >
                <option value="">Semua teknologi</option>
                {technologies.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="filter-row" aria-label="Kategori proyek">
            <button
              aria-pressed={!filters.category}
              onClick={() => update({ category: "" })}
            >
              Semua proyek
            </button>
            {categories.map((item) => (
              <button
                key={item}
                aria-pressed={filters.category === item}
                onClick={() => update({ category: item })}
              >
                {item}
              </button>
            ))}
          </div>
          <p className="results-count" aria-live="polite">
            {result.total} proyek{filters.q ? ` untuk “${filters.q}”` : ""}
          </p>
        </>
      )}
      <div className="project-list">
        {result.rows.map((project, index) => (
          <article
            className={
              "project-card" +
              (!project.cover_url && !project.thumbnail_url
                ? " text-project"
                : "")
            }
            key={text(project.id)}
            style={{
              viewTransitionName: `project-${text(project.id).replace(/[^\w-]/g, "")}`,
            }}
          >
            <div className="project-topline">
              <span>
                {String((result.page - 1) * 12 + index + 1).padStart(2, "0")} /{" "}
                {text(project.category)}
              </span>
              <span>{text(project.project_year)}</span>
            </div>
            {text(project.cover_url || project.thumbnail_url) && (
              <Link href={href(project)} className="project-cover">
                <MediaImage
                  src={text(project.cover_url || project.thumbnail_url)}
                  alt={text(project.title)}
                />
              </Link>
            )}
            {!text(project.cover_url || project.thumbnail_url) && (
              <Link
                href={href(project)}
                className="project-cover project-cover-art"
                aria-label={`Lihat proyek ${text(project.title)}`}
              >
                <ProjectArtwork project={project} />
              </Link>
            )}
            <div className="project-description">
              <div>
                <h3>
                  <Link href={href(project)}>{text(project.title)}</Link>
                </h3>
                <p>{text(project.summary)}</p>
              </div>
              <div>
                <p className="meta">{text(project.role)}</p>
                <ul className="tag-list">
                  {strings(project.technologies).map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="actions">
              <Link className="pill" href={href(project)}>
                Lihat proyek <PixelIcon name="arrow-up-right" />
              </Link>
              <button
                onClick={(event) => {
                  opener.current = event.currentTarget;
                  setPreview(project);
                  dialog.current?.showModal();
                }}
              >
                Pratinjau <PixelIcon name="plus" />
              </button>
            </div>
          </article>
        ))}
      </div>
      {!result.total && (
        <div className="empty-state">
          <h3>
            {projects.length
              ? "Belum menemukan yang sesuai?"
              : "Karya sedang disiapkan."}
          </h3>
          <p>
            {projects.length
              ? "Coba kata kunci lain atau hapus filter untuk melihat semua karya."
              : "Studi kasus akan tampil di sini setelah diterbitkan."}
          </p>
          {projects.length > 0 && (
            <button
              onClick={() => update({ q: "", category: "", technology: "" })}
            >
              Hapus semua filter ↺
            </button>
          )}
          <Link href="/">Kembali ke beranda ↗</Link>
        </div>
      )}
      {archive && result.pages > 1 && (
        <nav className="pagination" aria-label="Halaman proyek">
          <button
            disabled={result.page <= 1}
            onClick={() => update({ page: result.page - 1 })}
          >
            ← Sebelumnya
          </button>
          <span aria-live="polite">
            {result.page} / {result.pages}
          </span>
          <button
            disabled={result.page >= result.pages}
            onClick={() => update({ page: result.page + 1 })}
          >
            Berikutnya →
          </button>
        </nav>
      )}
      <dialog
        ref={dialog}
        className="project-preview"
        onClose={() => opener.current?.focus()}
        aria-labelledby="project-preview-title"
      >
        <div className="dialog-heading">
          <span>{text(preview?.category)}</span>
          <button onClick={() => dialog.current?.close()}>Tutup ×</button>
        </div>
        {preview && (
          <>
            {text(preview.cover_url || preview.thumbnail_url) && (
              <MediaImage
                src={text(preview.cover_url || preview.thumbnail_url)}
                alt={text(preview.title)}
                contain
              />
            )}
            <h2 id="project-preview-title">{text(preview.title)}</h2>
            <p>{text(preview.summary)}</p>
            <p>{strings(preview.technologies).join(" / ")}</p>
            <div className="actions">
              <Link href={href(preview)} className="pill">
                Buka proyek
              </Link>
              {safeHref(preview.project_url) && (
                <a
                  className="pill"
                  href={safeHref(preview.project_url)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Demo ↗
                </a>
              )}
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}
