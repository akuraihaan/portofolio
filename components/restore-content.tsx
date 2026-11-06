"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { restoreContent } from "@/app/actions";
export function RestoreContent({
  id,
  trash,
  moduleKey,
  expected,
}: {
  id: string;
  trash: boolean;
  moduleKey: string;
  expected?: string;
}) {
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const router = useRouter();
  return (
    <>
      <button
        disabled={busy}
        onClick={async () => {
          if (
            !window.confirm(
              "Salin revisi ini menjadi draf? Publikasi tidak berubah sampai Anda menerbitkannya.",
            )
          )
            return;
          setBusy(true);
          try {
            const result = await restoreContent(id, trash, expected);
            if (result.error) setMessage(result.error);
            else router.push("/admin/" + moduleKey + "/" + result.id);
          } catch {
            setMessage("Pemulihan gagal. Coba kembali.");
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Memulihkan…" : "Pulihkan sebagai draf"}
      </button>
      <span role="status">{message}</span>
    </>
  );
}
