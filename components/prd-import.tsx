"use client";
import { useState } from "react";
import { importPrdDrafts } from "@/app/actions";
export function PrdImport() {
  const [busy, setBusy] = useState(false),
    [report, setReport] = useState<string[]>([]);
  return (
    <div className="flat-card">
      <h3>Konten awal dari PRD</h3>
      <p>
        Siapkan draf beranda, pendidikan, dan dua studi kasus dari sumber
        proyek. Konten atau bagian yang sudah ada tetap dipertahankan. Periksa
        kontribusi, lengkapi bukti, lalu terbitkan dari editor.
      </p>
      <button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            setReport(await importPrdDrafts());
          } catch {
            setReport([
              "Impor belum berhasil. Periksa koneksi dan migrasi database.",
            ]);
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Menyiapkan draf…" : "Siapkan draf PRD"}
      </button>
      <ul role="status">
        {report.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
