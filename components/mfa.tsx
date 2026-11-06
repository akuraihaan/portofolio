"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { browserClient } from "@/lib/supabase/browser";
export function Mfa({ enroll = false }: { enroll?: boolean }) {
  const router = useRouter();
  const [factor, setFactor] = useState(""),
    [qr, setQr] = useState(""),
    [code, setCode] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  async function setup() {
    setBusy(true);
    setMessage("");
    try {
      const client = browserClient();
      const factors = await client.auth.mfa.listFactors();
      if (factors.error) throw factors.error;
      if (factors.data.totp.some((item) => item.status === "verified")) {
        setMessage("Autentikasi dua langkah sudah aktif.");
        return;
      }
      const result = await client.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Portofolio",
      });
      if (result.error) throw result.error;
      setFactor(result.data.id);
      setQr(result.data.totp.qr_code);
    } catch {
      setMessage(
        "Pengaturan belum berhasil. Periksa konfigurasi MFA di Supabase.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="prose">
      {enroll && !factor && (
        <button disabled={busy} onClick={setup}>
          Aktifkan autentikasi dua langkah
        </button>
      )}
      {qr && (
        <>
          <p>
            Pindai QR dengan aplikasi autentikator Anda, lalu masukkan kode enam
            digit.
          </p>
          {/* The QR comes directly from the authenticated Supabase MFA enrollment API. */}
          <Image unoptimized
            className="mfa-qr"
            src={
              qr.startsWith("data:")
                ? qr
                : "data:image/svg+xml;charset=utf-8," + encodeURIComponent(qr)
            }
            alt="QR pengaturan autentikator"
            width={220}
            height={220}
          />
        </>
      )}
      {(!enroll || factor) && (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            setBusy(true);
            setMessage("");
            try {
              const client = browserClient();
              let id = factor;
              if (!id) {
                const factors = await client.auth.mfa.listFactors();
                if (factors.error) throw factors.error;
                id =
                  factors.data.totp.find((item) => item.status === "verified")
                    ?.id || "";
              }
              if (!id) throw new Error();
              const result = await client.auth.mfa.challengeAndVerify({
                factorId: id,
                code,
              });
              if (result.error) throw result.error;
              router.replace("/admin"); router.refresh();
            } catch {
              setMessage(
                "Kode belum valid atau sudah kedaluwarsa. Coba kode terbaru.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            Kode autentikator
            <input
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              required
              minLength={6}
              maxLength={6}
            />
          </label>
          <div className="actions">
            <button disabled={busy}>
              {busy ? "Memeriksa…" : "Verifikasi kode"}
            </button>
          </div>
        </form>
      )}
      <p role="status">{message}</p>
    </div>
  );
}
