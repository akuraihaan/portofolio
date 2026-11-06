"use client";
import { useState } from "react";
import { safeHref } from "@/lib/domain";
type Block = {
  kind: string;
  text: string;
  level?: number;
  id?: string;
  language?: string;
};
export function articleBlocks(source: string): Block[] {
  const lines = source.replaceAll("\r\n", "\n").split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [],
    code: string[] | null = null,
    language = "";
  function flush() {
    if (paragraph.length) {
      blocks.push({ kind: "paragraph", text: paragraph.join("\n") });
      paragraph = [];
    }
  }
  for (const line of lines) {
    if (line.startsWith("```")) {
      if (code) {
        blocks.push({ kind: "code", text: code.join("\n"), language });
        code = null;
      } else {
        flush();
        code = [];
        language = line.slice(3).trim();
      }
    } else if (code) code.push(line);
    else if (/^#{1,4} /.test(line)) {
      flush();
      const level = line.match(/^#+/)![0].length;
      blocks.push({
        kind: "heading",
        level: Math.max(2, level),
        text: line.slice(level + 1),
        id: "bagian-" + blocks.length,
      });
    } else if (/^[-*] /.test(line)) {
      flush();
      blocks.push({ kind: "list", text: line.slice(2) });
    } else if (line.startsWith("> ")) {
      flush();
      blocks.push({ kind: "quote", text: line.slice(2) });
    } else if (!line.trim()) flush();
    else paragraph.push(line);
  }
  flush();
  if (code) blocks.push({ kind: "code", text: code.join("\n"), language });
  return blocks;
}
function Inline({ source }: { source: string }) {
  return source.split(/(\[[^\]]+\]\([^)]+\)|`[^`]+`)/g).map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link && safeHref(link[2]))
      return (
        <a key={index} href={safeHref(link[2])}>
          {link[1]}
        </a>
      );
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={index}>{part.slice(1, -1)}</code>;
    return part;
  });
}
type Labels = { toc: string; copy: string; copied: string; manual: string };
const defaultLabels: Labels = {
  toc: "Dalam tulisan ini",
  copy: "Salin kode",
  copied: "Disalin",
  manual: "Pilih teks kode untuk menyalin manual",
};
function Code({ block, labels }: { block: Block; labels: Labels }) {
  const [status, setStatus] = useState("");
  return (
    <figure className="code-block">
      <figcaption>
        {block.language || "Kode"}
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(block.text);
              setStatus(labels.copied);
            } catch {
              setStatus(labels.manual);
            }
          }}
        >
          {labels.copy}
        </button>
        <span role="status">{status}</span>
      </figcaption>
      <pre tabIndex={0}>
        <code>{block.text}</code>
      </pre>
    </figure>
  );
}
export function ArticleContent({
  source,
  labels = defaultLabels,
}: {
  source: string;
  labels?: Labels;
}) {
  const blocks = articleBlocks(source),
    headings = blocks.filter((block) => block.kind === "heading");
  return (
    <div className="article-content">
      {headings.length > 1 && (
        <nav className="article-toc" aria-label={labels.toc}>
          <p className="eyebrow">{labels.toc}</p>
          <ol>
            {headings.map((block) => (
              <li key={block.id}>
                <a href={"#" + block.id}>{block.text}</a>
              </li>
            ))}
          </ol>
        </nav>
      )}
      {blocks.map((block, index) =>
        block.kind === "heading" ? (
          <h2 key={index} id={block.id}>
            {block.text}
          </h2>
        ) : block.kind === "code" ? (
          <Code key={index} block={block} labels={labels} />
        ) : block.kind === "quote" ? (
          <blockquote key={index}>
            <Inline source={block.text} />
          </blockquote>
        ) : block.kind === "list" ? (
          <ul key={index}>
            <li>
              <Inline source={block.text} />
            </li>
          </ul>
        ) : (
          <p key={index}>
            <Inline source={block.text} />
          </p>
        ),
      )}
    </div>
  );
}
