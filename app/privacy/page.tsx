import Link from "next/link";
import { getPublicBundle, origin } from "@/lib/data";
import { PublicShell } from "@/components/portfolio";
import { safeHref, text } from "@/lib/domain";
export async function generateMetadata() {
  const b = await getPublicBundle();
  return {
    title: "Privasi",
    description: "Penggunaan data pada formulir kontak portofolio.",
    alternates: { canonical: origin(b.settings) + "/privacy" },
  };
}
export default async function Privacy() {
  const bundle = await getPublicBundle();
  const email = text(bundle.settings.owner_email);
  return (
    <PublicShell bundle={bundle}>
      <main id="main" className="shell section">
        <header className="section-heading">
          <p className="eyebrow">Informasi pengunjung</p>
          <h1>Privasi Anda.</h1>
          <p>Cara informasi yang Anda kirim digunakan dan disimpan.</p>
        </header>
        <article className="prose privacy-copy">
          <h2>Pesan dan kontak</h2>
          <p>
            Formulir mengumpulkan nama, email, topik, dan isi pesan untuk
            menanggapi pertanyaan atau kebutuhan kerja sama. Informasi ini hanya
            tersedia bagi pengelola portofolio dan penyedia infrastruktur yang
            memprosesnya. Mengirim pesan tidak mendaftarkan Anda ke pemasaran
            atau newsletter.
          </p>
          <h2>Penyimpanan</h2>
          <p>
            Pesan disimpan di database Supabase. Kebijakan retensi yang
            ditetapkan adalah maksimal 12 bulan sejak interaksi terakhir,
            kecuali masih diperlukan untuk tindak lanjut. Pengelola dapat
            menghapus pesan dari inbox.
          </p>
          <h2>Keamanan dan cookie</h2>
          <p>
            Formulir menggunakan validasi, pencegahan pengiriman ganda, dan
            pembatasan permintaan. Cookie sesi digunakan saat pengelola masuk ke
            dashboard. Halaman publik tidak memasang cookie analitik atau iklan.
          </p>
          <h2>Permintaan penghapusan</h2>
          <p>
            Anda dapat meminta pengelola memperbaiki atau menghapus pesan
            beserta informasi kontak Anda.
          </p>
          {email && safeHref("mailto:" + email) ? (
            <a className="pill" href={safeHref("mailto:" + email)}>
              Hubungi pengelola ↗
            </a>
          ) : (
            <Link className="pill" href="/#contact">
              Buka kontak ↗
            </Link>
          )}
        </article>
      </main>
    </PublicShell>
  );
}
