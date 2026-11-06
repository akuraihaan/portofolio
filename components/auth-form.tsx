"use client";
import Link from "next/link";
import { useState } from "react";
import { login, updatePassword } from "@/app/actions";
import { browserClient } from "@/lib/supabase/browser";
export function AuthForm({ mode }: { mode: "login" | "forgot" | "reset" }) {
  const [pending, setPending] = useState(false),
    [message, setMessage] = useState("");
  return (
    <main id="main" className="auth-panel">
      <Link href="/">← Portofolio</Link>
      <h1>
        {mode === "login"
          ? "Masuk."
          : mode === "forgot"
            ? "Pulihkan akses."
            : "Password baru."}
      </h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (pending) return;
          setPending(true);
          setMessage("");
          const data = new FormData(e.currentTarget);
          try {
            if (mode === "login") {
              const result = await login(
                String(data.get("email")),
                String(data.get("password")),
              );
              if (result?.error) setMessage(result.error);
            } else if (mode === "reset") {
              const result = await updatePassword(String(data.get("password")));
              setMessage(
                result.error ||
                  "Password diperbarui. Anda dapat masuk kembali.",
              );
            } else {
              const { error } =
                await browserClient().auth.resetPasswordForEmail(
                  String(data.get("email")),
                  {
                    redirectTo:
                      location.origin + "/auth/callback?next=/reset-password",
                  },
                );
              setMessage(
                error
                  ? "Tautan belum dapat dikirim. Coba kembali."
                  : "Jika akun tersedia, tautan pemulihan akan dikirim ke email tersebut.",
              );
            }
          } catch (error) {
            if (
              error instanceof Error &&
              error.message.includes("NEXT_REDIRECT")
            )
              throw error;
            setMessage("Layanan belum dapat dihubungi.");
          } finally {
            setPending(false);
          }
        }}
      >
        {mode !== "reset" && (
          <label>
            Email
            <input type="email" name="email" autoComplete="email" required />
          </label>
        )}
        {mode !== "forgot" && (
          <label>
            Password
            <input
              type="password"
              name="password"
              minLength={mode === "reset" ? 12 : undefined}
              autoComplete={
                mode === "reset" ? "new-password" : "current-password"
              }
              required
            />
          </label>
        )}
        <button disabled={pending}>
          {pending
            ? "Memproses…"
            : mode === "login"
              ? "Masuk"
              : mode === "forgot"
                ? "Kirim tautan"
                : "Simpan password"}
        </button>
        <p role="status">{message}</p>
      </form>
      <Link href={mode === "login" ? "/forgot-password" : "/login"}>
        {mode === "login" ? "Lupa password?" : "Kembali ke login"}
      </Link>
    </main>
  );
}
