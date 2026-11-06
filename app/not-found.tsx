import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="shell section">
      <p className="eyebrow">404</p>
      <h1>Halaman tidak ditemukan.</h1>
      <p>Konten mungkin belum dipublikasikan atau alamat telah berubah.</p>
      <Link className="button" href="/">
        Kembali ke beranda
      </Link>
    </main>
  );
}
