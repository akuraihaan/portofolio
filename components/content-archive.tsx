import Link from "next/link";
import { ContentCards } from "./portfolio";
import { explore, readFilters, filterHref } from "@/lib/explorer";
import { text, type Row } from "@/lib/domain";
export function ContentArchive({
  rows,
  moduleKey,
  search,
}: {
  rows: Row[];
  moduleKey: string;
  search: { q?: string; category?: string; page?: string };
}) {
  const filters = readFilters(
    new URLSearchParams(
      Object.entries(search).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string",
      ),
    ),
  );
  const result = explore(rows, filters),
    path = "/" + moduleKey;
  const categories = [
    ...new Set(rows.map((row) => text(row.category)).filter(Boolean)),
  ];
  return (
    <>
      <form className="project-tools" action={path}>
        <label className="search-field">
          Cari {moduleKey === "articles" ? "tulisan" : "eksperimen"}
          <input
            name="q"
            type="search"
            defaultValue={filters.q}
            placeholder="Judul atau kata kunci"
          />
        </label>
        <label>
          Kategori
          <select name="category" defaultValue={filters.category}>
            <option value="">Semua kategori</option>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <button>Cari ↗</button>
      </form>
      <p className="results-count">{result.total} hasil</p>
      <ContentCards moduleKey={moduleKey} rows={result.rows} />
      {!result.total && (
        <div className="empty-state">
          <h3>
            {rows.length
              ? "Tidak ada hasil yang cocok."
              : "Belum ada konten terbit."}
          </h3>
          <Link href={path}>Hapus filter</Link>
          <Link href="/">Kembali ke beranda ↗</Link>
        </div>
      )}
      {result.pages > 1 && (
        <nav className="pagination" aria-label="Halaman arsip">
          {result.page > 1 ? (
            <Link
              className="pill"
              href={filterHref(path, { ...filters, page: result.page - 1 })}
            >
              ← Sebelumnya
            </Link>
          ) : (
            <span />
          )}
          <span>
            {result.page} / {result.pages}
          </span>
          {result.page < result.pages && (
            <Link
              className="pill"
              href={filterHref(path, { ...filters, page: result.page + 1 })}
            >
              Berikutnya →
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
