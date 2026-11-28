import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="dotted-canvas min-h-screen flex flex-col items-center justify-center px-6 py-24 text-[#000000] dark:text-[#FAF8F5]">
      <div className="max-w-lg w-full bg-[#F05A28] text-[#FAF8F5] p-8 sm:p-10 rounded-[0.75rem] -rotate-2">
        <span className="font-mono text-xs uppercase tracking-wider block mb-3 opacity-85">
          404 · Halaman tidak ditemukan
        </span>
        <h1 className="font-hero-display text-5xl sm:text-6xl leading-[1.05] mb-4">
          bworiey
        </h1>
        <p className="font-body-editorial text-sm sm:text-base opacity-90 mb-8">
          Halaman yang Anda tuju tidak tersedia atau telah dipindahkan.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-[0.5rem] bg-[#FAF8F5] text-[#000000] font-mono text-xs uppercase tracking-wider hover:bg-[#FFD4C2] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke beranda</span>
        </Link>
      </div>
    </div>
  );
}
