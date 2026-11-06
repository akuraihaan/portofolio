import { text, strings, type Row } from "@/lib/domain";
export function TechnologyMap({ projects }: { projects: Row[] }) {
  const rows = projects
    .filter((row) => strings(row.technologies).length)
    .slice(0, 5);
  const tech = [
    ...new Set(rows.flatMap((row) => strings(row.technologies))),
  ].slice(0, 8);
  if (!rows.length)
    return (
      <svg className="orbital-art" viewBox="0 0 1000 300" aria-hidden="true">
        <path d="M0 150H1000M500 0V300" />
        <ellipse cx="500" cy="150" rx="370" ry="110" />
        <ellipse cx="500" cy="150" rx="210" ry="110" />
        <circle cx="500" cy="150" r="90" />
        <circle cx="130" cy="150" r="5" />
        <circle cx="870" cy="150" r="5" />
      </svg>
    );
  const y = (i: number, total: number) =>
    40 + (i * 240) / Math.max(1, total - 1);
  return (
    <figure className="technology-map">
      <svg
        viewBox="0 0 1000 320"
        role="img"
        aria-label="Relasi proyek dengan teknologi yang digunakan"
      >
        {rows.flatMap((row, i) =>
          strings(row.technologies)
            .filter((t) => tech.includes(t))
            .map((t) => (
              <path
                key={text(row.id) + t}
                d={`M310 ${y(i, rows.length)} C500 ${y(i, rows.length)},500 ${y(tech.indexOf(t), tech.length)},680 ${y(tech.indexOf(t), tech.length)}`}
              />
            )),
        )}
        {rows.map((row, i) => (
          <a key={text(row.id)} href={"/projects/" + text(row.slug)}>
            <circle cx="310" cy={y(i, rows.length)} r="4" />
            <text x="0" y={y(i, rows.length) + 5}>
              {text(row.title).slice(0, 34)}
            </text>
          </a>
        ))}
        {tech.map((t, i) => (
          <g key={t}>
            <circle cx="680" cy={y(i, tech.length)} r="4" />
            <text x="705" y={y(i, tech.length) + 5}>
              {t.slice(0, 26)}
            </text>
          </g>
        ))}
      </svg>
      <figcaption>
        <details>
          <summary>Hubungan proyek & teknologi</summary>
          <ul>
            {rows.map((row) => (
              <li key={text(row.id)}>
                <a href={"/projects/" + text(row.slug)}>{text(row.title)}</a>:{" "}
                {strings(row.technologies).join(", ")}
              </li>
            ))}
          </ul>
        </details>
      </figcaption>
    </figure>
  );
}
