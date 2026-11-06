import Link from "next/link";
import type { Bundle } from "@/lib/data";
import { text, safeHref, type Row } from "@/lib/domain";
import { ArticleContent } from "./article-content";
export function EnglishShell({
  bundle,
  children,
  original = "/",
}: {
  bundle: Bundle;
  children: React.ReactNode;
  original?: string;
}) {
  return (
    <div lang="en" className="public-site public-english">
      <header className="site-header">
        <div className="nav-rule wrap">
          <Link className="wordmark" href="/en">
            {text(bundle.profile?.full_name)} ↗
          </Link>
          <nav className="language-nav" aria-label="Main navigation">
            <Link href="/en">Home</Link>
            <Link href="/en#work">Work</Link>
            <Link href="/en#contact">Contact</Link>
            <Link href={original} hrefLang="id">
              Bahasa Indonesia ↗
            </Link>
          </nav>
        </div>
      </header>
      {children}
      <footer className="shell footer">
        <p>{text(bundle.profile?.full_name)}</p>
        <Link href={original} hrefLang="id">
          View in Indonesian
        </Link>
      </footer>
    </div>
  );
}
export function EnglishBody({ row }: { row: Row }) {
  return (
    <>
      <header className="section-heading">
        <p className="eyebrow">{text(row.category)}</p>
        <h1>{text(row.title)}</h1>
        <p>{text(row.summary)}</p>
      </header>
      <div className="prose">
        <ArticleContent
          source={text(row.content)}
          labels={{
            toc: "In this article",
            copy: "Copy code",
            copied: "Copied",
            manual: "Select the code to copy manually",
          }}
        />
      </div>
    </>
  );
}
export function EnglishContact({ bundle }: { bundle: Bundle }) {
  const email = text(bundle.settings.owner_email);
  return (
    <section id="contact" className="section">
      <div className="section-heading">
        <p className="eyebrow">Get in touch</p>
        <h2>Let’s start a conversation.</h2>
      </div>
      <div className="actions center-actions">
        {email && safeHref("mailto:" + email) && (
          <a className="pill" href={safeHref("mailto:" + email)}>
            {email} ↗
          </a>
        )}
        {(bundle.collections.social_links?.data || [])
          .filter((row) => row.show_in_contact && safeHref(row.url))
          .map((row) => (
            <a className="pill" key={text(row.id)} href={safeHref(row.url)}>
              {text(row.label)} ↗
            </a>
          ))}
      </div>
    </section>
  );
}
