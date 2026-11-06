"use client";
import { useState } from "react";
export function SharePrint({ url, slug, fullOnly = false }: { url: string; slug?: string; fullOnly?: boolean }) {
  const [status, setStatus] = useState<{ kind: "info" | "success" | "error"; text: string } | null>(null),
    [busy, setBusy] = useState(false);
  return (
    <div className={`share-print pdf-tools no-print${fullOnly ? " pdf-tools-full" : ""}`} aria-label="Bagikan dan unduh portofolio">
      {(slug || fullOnly) && (
        <button
          type="button"
          className={`pdf-export${busy ? " is-busy" : ""}${status?.kind === "success" ? " is-success" : ""}`}
          disabled={busy}
          aria-busy={busy}
          onClick={async () => {
            setBusy(true);
            setStatus({ kind: "info", text: "Menyiapkan dokumen portofolio…" });
            try {
              const response = await fetch(fullOnly
                ? "/api/portfolio/full/pdf"
                : "/api/portfolio/" + encodeURIComponent(slug || "") + "/pdf");
              if (!response.ok)
                throw new Error(
                  (await response.json()).error || "PDF gagal dibuat.",
                );
              const download = URL.createObjectURL(await response.blob());
              const link = document.createElement("a");
              link.href = download;
              link.download =
                response.headers
                  .get("Content-Disposition")
                  ?.match(/filename="([^"]+)"/)?.[1] || (fullOnly ? "portofolio-lengkap.pdf" : slug + ".pdf");
              document.body.append(link);
              link.click();
              link.remove();
              setTimeout(() => URL.revokeObjectURL(download), 10000);
              setStatus({ kind: "success", text: "PDF selesai diunduh." });
            } catch (error) {
              setStatus({
                kind: "error",
                text: error instanceof Error ? error.message : "PDF gagal dibuat. Silakan coba lagi.",
              });
            } finally {
              setBusy(false);
            }
          }}
        >
          <span className="pdf-export-icon" aria-hidden="true">
            {busy ? <span className="pdf-pixel-loader"><i /><i /><i /></span> : status?.kind === "success" ? "✓" : "↓"}
          </span>
          <span>{busy ? "Menyiapkan PDF" : status?.kind === "success" ? "PDF tersimpan" : fullOnly ? "Unduh portofolio lengkap" : "Unduh portofolio"}</span>
          {!busy && <span className="pdf-export-format">PDF</span>}
          <span className="pdf-export-progress" aria-hidden="true" />
        </button>
      )}
      {!fullOnly && <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setStatus({ kind: "success", text: "Tautan portofolio disalin." });
          } catch {
            setStatus({ kind: "info", text: url });
          }
        }}
      >
        Salin tautan
      </button>}
      {!fullOnly && <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setStatus({ kind: "info", text: "Menyiapkan gambar dan font…" });
          try {
            await document.fonts.ready;
            await Promise.all(
              [...document.images].map(async (image) => {
                image.loading = "eager";
                try {
                  await image.decode();
                } catch {
                  /* A missing image does not remove document text. */
                }
              }),
            );
            window.print();
            setStatus({ kind: "success", text: "Gunakan dialog cetak untuk menyimpan PDF." });
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Menyiapkan…" : "Cetak / Simpan PDF"}
      </button>}
      {status && <p className={`pdf-tools-status is-${status.kind}`} role="status" aria-live="polite">
        <span className="pdf-status-marker" aria-hidden="true">{status.kind === "success" ? "✓" : status.kind === "error" ? "!" : "·"}</span>
        {status.text}
      </p>}
    </div>
  );
}
