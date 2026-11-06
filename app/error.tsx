"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="shell section">
      <h1>Halaman belum dapat dimuat.</h1>
      <p>Periksa koneksi dan coba kembali.</p>
      <button onClick={reset}>Coba lagi</button>
    </main>
  );
}
