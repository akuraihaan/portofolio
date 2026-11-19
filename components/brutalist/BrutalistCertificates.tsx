"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ExternalLink, Calendar, Building, X, ZoomIn, CheckCircle2, ShieldCheck } from "lucide-react";

export interface BrutalistCertificateItem {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  category: string;
  isAward?: boolean;
  certificate_url: string | null;
  credential_url: string | null;
  description?: string;
}

export const defaultBrutalistCertificates: BrutalistCertificateItem[] = [
  {
    id: "cert-1",
    title: "Pemakalah Seminar Nasional Ilmu Komputer (SENDIKOM 2026)",
    issuer: "Fakultas Ilmu Komputer & Komputasi Riset",
    issue_date: "2026",
    category: "Publikasi Ilmiah",
    isAward: true,
    certificate_url:
      "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/1788526557608-sendikom.png",
    credential_url:
      "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/1788526557608-sendikom.png",
    description:
      "Sertifikat resmi pemakalah ilmiah atas publikasi riset implementasi Learning Analytics pada media pembelajaran interaktif Tailwind CSS.",
  },
  {
    id: "cert-2",
    title: "Juara 2 Pekan Seni Mahasiswa (PEKSIMINAS XVI)",
    issuer: "Universitas Lambung Mangkurat",
    issue_date: "2022",
    category: "Penghargaan Kompetisi",
    isAward: true,
    certificate_url:
      "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/1788526574719-peksiminas.png",
    credential_url:
      "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/1788526574719-peksiminas.png",
    description:
      "Juara 2 tingkat universitas pada kompetisi perancangan media komunikasi visual dan komik digital kampanye sosial.",
  },
  {
    id: "cert-3",
    title: "Bangkit Academy Cloud Computing Cohort Distinction",
    issuer: "Google, GoTo, Traveloka",
    issue_date: "2024",
    category: "Teknologi Industri",
    isAward: true,
    certificate_url:
      "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/1788526620593-google.png",
    credential_url:
      "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/1788526620593-google.png",
    description:
      "Sertifikat kelulusan program studi independen jalur Google Cloud Computing dengan predikat kelulusan distinction dan kepemimpinan tim cohort.",
  },
  {
    id: "cert-4",
    title: "Instruktur Pelatihan Pemrograman Visual Scratch",
    issuer: "SMAN 1 Panyipatan & Tim Pengabdian ULM",
    issue_date: "2023",
    category: "Instruktur & Pengabdian",
    certificate_url:
      "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/1788526593574-scratch.png",
    credential_url:
      "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/1788526593574-scratch.png",
    description:
      "Sertifikat instruktur workshop computational thinking dan pemrograman berbasis visual (Scratch) bagi siswa dan dewan guru SMA.",
  },
  {
    id: "cert-5",
    title: "Literasi Digital & TIK Lingkungan Lahan Basah",
    issuer: "Pusat Studi Lahan Basah ULM",
    issue_date: "2023",
    category: "Literasi Digital",
    certificate_url:
      "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/1788526607062-lahan-basah.png",
    credential_url:
      "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/1788526607062-lahan-basah.png",
    description:
      "Partisipasi aktif dalam implementasi teknologi informasi untuk kemajuan literasi masyarakat kawasan ekosistem lahan basah Kalimantan.",
  },
  {
    id: "cert-6",
    title: "Webinar Nasional Google Developer Student Club (GDSC)",
    issuer: "GDSC Universitas Lambung Mangkurat x IT FEST",
    issue_date: "2023",
    category: "Teknologi Industri",
    certificate_url:
      "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/1788526633630-gdsc.png",
    credential_url:
      "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/1788526633630-gdsc.png",
    description:
      "Pelatihan komprehensif eksplorasi ekosistem cloud dan pengembangan aplikasi modern bersama Google Developer Student Club.",
  },
];

interface BrutalistCertificatesProps {
  certificates?: BrutalistCertificateItem[];
}

export function BrutalistCertificates({
  certificates = defaultBrutalistCertificates,
}: BrutalistCertificatesProps) {
  const [activeCert, setActiveCert] = useState<BrutalistCertificateItem | null>(null);

  return (
    <section
      id="certificates"
      className="py-20 md:py-28 px-4 md:px-8 bg-[#F4F4F0] dark:bg-[#0A0A0A] text-black dark:text-[#F4F4F0] border-b-4 border-black dark:border-white transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs font-black bg-black text-[#FFE500] dark:bg-white dark:text-black px-2.5 py-1 border-2 border-black dark:border-white shadow-[2px_2px_0px_#C8F169]">
                06 // CREDENTIALS
              </span>
              <span className="font-mono text-xs font-bold text-[#0047FF] dark:text-[#FFE500] uppercase">
                {certificates.length} SERTIFIKASI & PENGHARGAAN
              </span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tighter">
              CERTIFICATE ARCHIVE
            </h2>
          </div>

          <p className="font-sans text-base md:text-lg max-w-md text-neutral-700 dark:text-neutral-300">
            Galeri visual sertifikat resmi, publikasi seminar nasional, pengabdian instruktur, serta penghargaan kompetisi desain.
          </p>
        </div>

        {/* Visual Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, idx) => (
            <div
              key={cert.id}
              className="flex flex-col bg-white dark:bg-[#141414] border-4 border-black dark:border-white shadow-[6px_6px_0px_#000] dark:shadow-[6px_6px_0px_#FFF] hover:shadow-[10px_10px_0px_#FFE500] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 group"
            >
              {/* Top Meta Strip */}
              <div className="p-3 bg-neutral-100 dark:bg-[#1C1F1A] border-b-3 border-black dark:border-neutral-700 flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-[#FF5C00]">{cert.category}</span>
                <span className="bg-white dark:bg-black px-2 py-0.5 border border-black dark:border-neutral-700 font-bold">
                  {cert.issue_date}
                </span>
              </div>

              {/* Certificate Image Thumbnail (Clickable) */}
              <div
                onClick={() => setActiveCert(cert)}
                className="relative aspect-[16/10] w-full border-b-3 border-black dark:border-neutral-700 bg-neutral-900 cursor-pointer overflow-hidden"
              >
                {cert.certificate_url ? (
                  <img
                    src={cert.certificate_url}
                    alt={cert.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-800 text-neutral-400 p-4">
                    <Award size={36} className="text-[#FFE500] mb-2" />
                    <span className="font-mono text-xs uppercase font-bold text-center">
                      DOKUMEN SERTIFIKAT RESMI
                    </span>
                  </div>
                )}

                {/* Hover Overlay with Zoom Icon */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="p-2.5 bg-[#FFE500] text-black border-2 border-black font-display font-black text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_#000]">
                    <ZoomIn size={16} />
                    <span>INSPEKSI DOKUMEN</span>
                  </div>
                </div>

                {cert.isAward && (
                  <div className="absolute top-2 left-2 bg-[#FF5C00] text-white font-mono text-[10px] font-black px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
                    ★ PENGHARGAAN
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-black text-lg md:text-xl uppercase tracking-tight text-black dark:text-white line-clamp-2 mb-2 group-hover:text-[#0047FF] dark:group-hover:text-[#FFE500] transition-colors">
                    {cert.title}
                  </h3>

                  <div className="flex items-center gap-1.5 font-mono text-xs text-neutral-600 dark:text-neutral-400 mb-3">
                    <Building size={13} className="shrink-0 text-neutral-400" />
                    <span className="truncate">{cert.issuer}</span>
                  </div>

                  {cert.description && (
                    <p className="font-sans text-xs text-neutral-700 dark:text-neutral-300 line-clamp-2 leading-relaxed mb-4">
                      {cert.description}
                    </p>
                  )}
                </div>

                {/* Inspect Button Trigger */}
                <button
                  onClick={() => setActiveCert(cert)}
                  className="w-full py-2 bg-neutral-100 dark:bg-[#1E1E1E] hover:bg-[#FFE500] hover:text-black dark:hover:bg-[#FFE500] dark:hover:text-black text-black dark:text-white font-mono text-xs font-bold border-2 border-black dark:border-neutral-700 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck size={14} />
                  <span>LIHAT DETAIL & VERIFIKASI</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Resolution Inspection Modal */}
      <AnimatePresence>
        {activeCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-[#F4F4F0] dark:bg-[#121212] text-black dark:text-[#F4F4F0] border-4 border-black dark:border-white shadow-[12px_12px_0px_#FFE500] flex flex-col overflow-hidden"
            >
              {/* Modal Top Header */}
              <div className="p-4 bg-black text-[#FFE500] border-b-4 border-black dark:border-neutral-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award size={18} />
                  <span className="font-mono text-xs font-black uppercase">
                    INSPEKSI KREDENSIAL // {activeCert.category}
                  </span>
                </div>
                <button
                  onClick={() => setActiveCert(null)}
                  className="p-1 bg-[#FFE500] text-black hover:bg-white transition-colors cursor-pointer border border-black"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body with Zoomed Image */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                <h3 className="font-display font-black text-2xl md:text-3xl uppercase tracking-tight">
                  {activeCert.title}
                </h3>

                <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-neutral-600 dark:text-neutral-400 pb-3 border-b-2 border-neutral-300 dark:border-neutral-700">
                  <span>PENYELENGGARA: <strong>{activeCert.issuer}</strong></span>
                  <span>TAHUN TERBIT: <strong>{activeCert.issue_date}</strong></span>
                </div>

                {/* Big Preview Image */}
                {activeCert.certificate_url ? (
                  <div className="border-4 border-black overflow-hidden bg-neutral-900 shadow-[6px_6px_0px_#000]">
                    <img
                      src={activeCert.certificate_url}
                      alt={activeCert.title}
                      className="w-full h-auto object-contain max-h-[60vh] mx-auto"
                    />
                  </div>
                ) : (
                  <div className="p-12 text-center border-2 border-black bg-neutral-100 dark:bg-neutral-800">
                    <Award size={48} className="mx-auto mb-2 text-[#FFE500]" />
                    <p className="font-mono text-sm">Dokumen verifikasi fisik tersimpan di arsip akademik.</p>
                  </div>
                )}

                {activeCert.description && (
                  <p className="font-sans text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed bg-white dark:bg-[#1A1A1A] p-4 border-2 border-black dark:border-neutral-700">
                    {activeCert.description}
                  </p>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-neutral-100 dark:bg-[#1C1F1A] border-t-3 border-black dark:border-neutral-700 flex items-center justify-between">
                <span className="font-mono text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={16} />
                  <span>KREDENSIAL TERVERIFIKASI RESMI</span>
                </span>

                <div className="flex items-center gap-2">
                  {activeCert.credential_url && (
                    <a
                      href={activeCert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#FFE500] text-black font-display font-black text-xs border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-1.5 no-underline"
                    >
                      <ExternalLink size={14} />
                      <span>BUKA BERKAS ASLI</span>
                    </a>
                  )}

                  <button
                    onClick={() => setActiveCert(null)}
                    className="px-4 py-2 bg-white dark:bg-black text-black dark:text-white font-mono text-xs font-bold border-2 border-black dark:border-white cursor-pointer"
                  >
                    TUTUP
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
