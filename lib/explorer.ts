import { strings, text, type Row } from "./domain";

export type Filters = {
  q: string;
  category: string;
  technology: string;
  page: number;
};
export function readFilters(params: URLSearchParams): Filters {
  const page = Number(params.get("page"));
  return {
    q: params.get("q") || "",
    category: params.get("category") || "",
    technology: params.get("technology") || "",
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
  };
}
export function filterHref(path: string, filters: Filters) {
  const params = new URLSearchParams();
  for (const key of ["q", "category", "technology"] as const)
    if (filters[key]) params.set(key, filters[key]);
  if (filters.page > 1) params.set("page", String(filters.page));
  return path + (params.size ? "?" + params : "");
}
export function explore(rows: Row[], filters: Filters, size = 12) {
  const matches = rows.filter(
    (row) =>
      (!filters.category || text(row.category) === filters.category) &&
      (!filters.technology ||
        strings(row.technologies).includes(filters.technology)) &&
      [
        row.title,
        row.summary,
        row.excerpt,
        row.description,
        row.category,
        ...strings(row.technologies),
        ...strings(row.tags),
      ]
        .map(text)
        .join(" ")
        .toLocaleLowerCase()
        .includes(filters.q.trim().toLocaleLowerCase()),
  );
  const pages = Math.max(1, Math.ceil(matches.length / size));
  const page = Math.min(filters.page, pages);
  return {
    rows: matches.slice((page - 1) * size, page * size),
    total: matches.length,
    pages,
    page,
  };
}
export function safeReturnPath(value: string | undefined, collection: string) {
  const path = "/" + collection;
  if (!value || !(value === path || value.startsWith(path + "?"))) return path;
  return filterHref(
    path,
    readFilters(new URLSearchParams(value.split("?")[1])),
  );
}
