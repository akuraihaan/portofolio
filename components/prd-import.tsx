"use client";
import { useState } from "react";
import { importPrdDrafts } from "@/app/actions";
export function PrdImport() {
  const [busy, setBusy] = useState(false),
    [report, setReport] = useState<string[]>([]);
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#14151b] border border-[#e4e1d7] dark:border-[#222530] shadow-sm">
      <div className="pb-4 border-b border-black/5 dark:border-white/5 mb-4">
        <h3 className="font-display font-bold text-lg text-charcoal dark:text-white">
          Inisialisasi Data dari PRD
        </h3>
        <p className="font-mono text-xs text-charcoal/50 dark:text-white/40">
          Sinkronisasi draf awal terverifikasi ke database
        </p>
      </div>
      <p className="text-xs text-charcoal/70 dark:text-white/70 font-sans leading-relaxed mb-4">
        Siapkan draf beranda, riwayat pendidikan, dan studi kasus proyek dari kurikulum perkuliahan dan Bangkit Academy. Konten yang sudah ada tidak akan ditimpa.
      </p>
      <button
        type="button"
        disabled={busy}
        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-forest dark:bg-lime text-white dark:text-charcoal font-mono text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
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
        {busy ? "Menyiapkan draf…" : "Siapkan Draf Terverifikasi ＋"}
      </button>
      {report.length > 0 && (
        <ul role="status" className="mt-4 space-y-1 font-mono text-xs text-charcoal/70 dark:text-white/70 p-3 rounded-xl bg-[#faf8f5] dark:bg-[#0c0d10] border border-black/5 dark:border-white/5">
          {report.map((line, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="text-forest dark:text-lime">›</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
