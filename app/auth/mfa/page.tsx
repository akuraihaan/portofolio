import { redirect } from "next/navigation";
import { currentActor } from "@/lib/auth";
import { Mfa } from "@/components/mfa";
export const metadata = {
  title: "Verifikasi dua langkah",
  robots: { index: false, follow: false },
};
export default async function MfaPage() {
  if (!(await currentActor())) redirect("/login");
  return (
    <main id="main" className="shell section">
      <div className="section-heading">
        <p className="eyebrow">Keamanan akun</p>
        <h1>Satu langkah lagi.</h1>
        <p>Masukkan kode dari aplikasi autentikator untuk melanjutkan.</p>
      </div>
      <Mfa />
    </main>
  );
}
