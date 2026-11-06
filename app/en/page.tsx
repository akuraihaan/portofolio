import Link from "next/link";
import { getPublicBundle, origin } from "@/lib/data";
import { text } from "@/lib/domain";
import {
  EnglishShell,
  EnglishBody,
  EnglishContact,
} from "@/components/english-portfolio";
export async function generateMetadata() {
  const b = await getPublicBundle(),
    home = b.collections.translations?.data.find(
      (row) => row.source_type === "home",
    );
  return {
    title: home ? text(home.title) : "English translation",
    description: text(home?.summary),
    robots: { index: !!home, follow: true },
    alternates: {
      canonical: origin(b.settings) + "/en",
      languages: { id: origin(b.settings), en: origin(b.settings) + "/en" },
    },
  };
}
export default async function EnglishHome() {
  const bundle = await getPublicBundle(),
    rows = bundle.collections.translations?.data || [],
    home = rows.find((row) => row.source_type === "home");
  return (
    <EnglishShell bundle={bundle}>
      <main id="main" className="shell">
        {home ? (
          <>
            <section className="section">
              <EnglishBody row={home} />
            </section>
            {rows.some((row) => row.source_type !== "home") && (
              <section id="work" className="section">
                <div className="section-heading">
                  <p className="eyebrow">Selected work & writing</p>
                  <h2>Explore the work.</h2>
                </div>
                <div className="flat-grid">
                  {rows
                    .filter((row) => row.source_type !== "home")
                    .map((row) => (
                      <article className="flat-card" key={text(row.id)}>
                        <p className="meta">{text(row.category)}</p>
                        <h3>
                          <Link
                            href={
                              "/en/" +
                              text(row.source_type) +
                              "/" +
                              text(row.slug)
                            }
                          >
                            {text(row.title)}
                          </Link>
                        </h3>
                        <p>{text(row.summary)}</p>
                        <Link
                          className="pill"
                          href={
                            "/en/" +
                            text(row.source_type) +
                            "/" +
                            text(row.slug)
                          }
                        >
                          Read more ↗
                        </Link>
                      </article>
                    ))}
                </div>
              </section>
            )}
            <EnglishContact bundle={bundle} />
          </>
        ) : (
          <section className="section">
            <p className="eyebrow">English edition</p>
            <h1>Translation in progress.</h1>
            <p>The reviewed English portfolio has not been published yet.</p>
            <Link className="pill" href="/" hrefLang="id">
              Continue in Indonesian ↗
            </Link>
          </section>
        )}
      </main>
    </EnglishShell>
  );
}
