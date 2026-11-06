"use client";
import { useRef, useState } from "react";
import type { Row } from "@/lib/domain";
import { text } from "@/lib/domain";
export function MediaPicker({
  rows,
  onPick,
}: {
  rows: Row[];
  onPick: (url: string, path: string) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null),
    [message, setMessage] = useState(""),
    [progress, setProgress] = useState<number | null>(null),
    [query, setQuery] = useState("");
  async function upload(file: File) {
    setMessage("");
    setProgress(0);
    try {
      const signed = await fetch("/api/media/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          type: file.type,
          size: file.size,
        }),
      });
      const permit = await signed.json();
      if (!signed.ok) throw new Error(permit.error || "Izin unggah ditolak.");
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest(),
          form = new FormData();
        form.append("cacheControl", "0");
        form.append("", file);
        xhr.open("PUT", permit.signedUrl);
        xhr.setRequestHeader("x-upsert", "false");
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable)
            setProgress(Math.round((e.loaded / e.total) * 95));
        };
        xhr.onerror = () =>
          reject(
            new Error("Koneksi unggahan terputus. File lama tetap tersedia."),
          );
        xhr.onload = () =>
          xhr.status >= 200 && xhr.status < 300
            ? resolve()
            : reject(new Error("Storage menolak unggahan."));
        xhr.send(form);
      });
      setMessage("Memverifikasi isi file…");
      const completed = await fetch("/api/media/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: permit.id }),
      });
      const result = await completed.json();
      if (!completed.ok) throw new Error(result.error || "Verifikasi gagal.");
      onPick(result.url, "");
      setMessage(
        "Media tersimpan privat. Terbitkan konten untuk membukanya ke publik.",
      );
      dialog.current?.close();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unggahan gagal.");
    } finally {
      setProgress(null);
    }
  }
  return (
    <div>
      <div className="actions">
        <button type="button" onClick={() => dialog.current?.showModal()}>
          Pilih dari pustaka
        </button>
        <label>
          Unggah media
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,application/pdf,video/mp4,video/webm"
            disabled={progress !== null}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      {progress !== null && (
        <progress value={progress} max={100} aria-label="Progres unggahan" />
      )}
      <p role="status">{message}</p>
      <dialog ref={dialog} aria-label="Pustaka media">
        <div className="dialog-heading">
          <h3>Pustaka media</h3>
          <button type="button" onClick={() => dialog.current?.close()}>
            Tutup ×
          </button>
        </div>
        <label>
          Cari media
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="relation-list">
          {rows
            .filter(
              (row) => row.bucket_id !== "portfolio-private" || row.verified_at,
            )
            .filter((row) =>
              text(row.file_name).toLowerCase().includes(query.toLowerCase()),
            )
            .map((row) => (
              <button
                type="button"
                key={text(row.id)}
                onClick={() => {
                  const url =
                    row.bucket_id === "portfolio-private"
                      ? "/api/media/" + text(row.id)
                      : text(row.public_url) || "/api/media/" + text(row.id);
                  onPick(url, "");
                  dialog.current?.close();
                }}
              >
                {text(row.display_name || row.file_name)}
              </button>
            ))}
        </div>
      </dialog>
    </div>
  );
}
