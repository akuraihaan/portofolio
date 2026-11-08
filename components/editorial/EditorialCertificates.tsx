"use client";

import React, { useState } from "react";
import { Award, ShieldCheck, Eye, X, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { EASINGS } from "../motion/MotionSystem";

export interface EditorialCertificateItem {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  category?: string;
  isAward?: boolean;
  certificate_url?: string | null;
  credential_url?: string | null;
  description?: string;
}

export const defaultCertificates: EditorialCertificateItem[] = [
  {
    id: "cert-sendikom-2026",
    title: "Sertifikat Seminar Nasional Komputer 2026",
    issuer: "SENDIKOM 2026",
    issue_date: "2026-06-23",
    category: "Publikasi Ilmiah",
    isAward: false,
    certificate_url: "https://cdn.phototourl.com/free/2026-07-20-cc0542ca-e0f6-4398-9c4c-d9aaf3e04075.png",
    credential_url: "https://cdn.phototourl.com/free/2026-07-20-cc0542ca-e0f6-4398-9c4c-d9aaf3e04075.png",
    description: "Sertifikat Pemakalah / Peserta Seminar Nasional Komputer (SENDIKOM 2026) dalam diseminasi riset teknologi komputasi dan pembelajaran interaktif.",
  },
  {
    id: "cert-peksiminas-2024",
    title: "Sertifikat Peksiminas FKIP XVIII (Juara 2)",
    issuer: "Pusat Prestasi Nasional (Puspresnas) & BEM FKIP",
    issue_date: "2024-04-15",
    category: "Penghargaan Kompetisi",
    isAward: true,
    certificate_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/ad091a01-5090-4bce-9208-bdff986d8e01-Taufik-Raihandani_2_converted.jpg",
    credential_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/ad091a01-5090-4bce-9208-bdff986d8e01-Taufik-Raihandani_2_converted.jpg",
    description: "Penghargaan Juara 2 dalam perancangan media komunikasi visual dan kampanye sosial edukatif pada Pekan Seni Mahasiswa.",
  },
  {
    id: "cert-gdsc-2023",
    title: "Webinar Nasional GDSC X IT FEST",
    issuer: "Google Developer Student Club (GDSC)",
    issue_date: "2023-11-11",
    category: "Teknologi Industri",
    isAward: false,
    certificate_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/1ad94fe7-751e-4c82-8cbe-b28dbb642b60-AhaConvert_Taufik-Raihandani.jpg",
    credential_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/1ad94fe7-751e-4c82-8cbe-b28dbb642b60-AhaConvert_Taufik-Raihandani.jpg",
    description: "Sertifikasi partisipasi pengembangan ekosistem web modern, infrastruktur cloud, dan tren industri software engineer.",
  },
  {
    id: "cert-scratch-2025",
    title: "Pelatihan Pemrograman Scratch Siswa SMAN 1 Panyipatan",
    issuer: "Pendidikan Komputer FKIP ULM",
    issue_date: "2025-09-08",
    category: "Instruktur & Pengabdian",
    isAward: false,
    certificate_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/b72458f8-b12e-4394-9f5a-a3e2fbf25e9a-sertif-pkl-1.png",
    credential_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/b72458f8-b12e-4394-9f5a-a3e2fbf25e9a-sertif-pkl-1.png",
    description: "Sertifikat Instruktur Pengabdian Masyarakat dalam membimbing siswa SMA memahami dasar logika komputasi menggunakan visual block programming Scratch.",
  },
  {
    id: "cert-lahan-basah-2023",
    title: "TIK untuk Kemajuan Literasi Digital Masyarakat Lahan Basah",
    issuer: "Pendidikan Komputer ULM",
    issue_date: "2023-08-02",
    category: "Literasi Digital",
    isAward: false,
    certificate_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/3008f3ba-fd64-49a0-a3a8-9ff56c4e3511-1784622934472-e4f9e9c7-2d13-49dc-a23c-0f6b25faa5b4_1.jpg",
    credential_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/3008f3ba-fd64-49a0-a3a8-9ff56c4e3511-1784622934472-e4f9e9c7-2d13-49dc-a23c-0f6b25faa5b4_1.jpg",
    description: "Sertifikasi diseminasi penerapan teknologi informasi dan komunikasi dalam penguatan literasi digital masyarakat lingkungan lahan basah.",
  },
  {
    id: "cert-bangkit-cloud",
    title: "Bangkit Academy Cloud Computing Graduate Certificate",
    issuer: "Google, GoTo, Tokopedia, Traveloka",
    issue_date: "2025-01-15",
    category: "Sertifikasi Industri",
    isAward: false,
    certificate_url: null,
    credential_url: "https://www.credential.net",
    description: "Kelulusan resmi program studi independen bersertifikat kurikulum arsitektur cloud Google Cloud Platform (GCP), microservices, dan kontainerisasi.",
  },
];

export function EditorialCertificates({
  certificates = defaultCertificates,
}: {
  certificates?: EditorialCertificateItem[];
}) {
  const [selectedCert, setSelectedCert] = useState<EditorialCertificateItem | null>(null);

  return (
    <section
      id="certificates"
      className="w-full max-w-5xl mx-auto py-24 md:py-32 px-6 md:px-8 border-t border-black/[0.08] dark:border-white/[0.1]"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-12">
        <span className="text-xs font-semibold tracking-[0.2em] text-[#86868B] uppercase">
          06 / Credentials &amp; Honors
        </span>
        <div className="h-px flex-1 bg-black/[0.06] dark:bg-white/[0.08]" />
      </div>

      {/* Main Headline */}
      <div className="mb-14">
        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] max-w-2xl leading-tight mb-4">
          Verified credentials.
        </h2>
        <p className="text-base text-[#86868B] max-w-xl leading-relaxed">
          Arsip sertifikasi resmi, publikasi seminar nasional, dan penghargaan kompetisi desain media.
        </p>
      </div>

      {/* Apple-Style Grid Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            onClick={() => {
              if (cert.certificate_url) setSelectedCert(cert);
            }}
            className={`rounded-3xl bg-[#F5F5F7] dark:bg-[#161617] border border-black/[0.04] dark:border-white/[0.06] p-6 flex flex-col justify-between transition-all ${
              cert.certificate_url
                ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5"
                : ""
            }`}
          >
            <div>
              {/* Document Image Thumbnail if available */}
              {cert.certificate_url ? (
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white dark:bg-[#0B0B0C] border border-black/[0.06] dark:border-white/[0.08] mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cert.certificate_url}
                    alt={cert.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1.5">
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </div>
                </div>
              ) : (
                <div className="relative aspect-[4/3] rounded-2xl bg-white dark:bg-[#0B0B0C] border border-black/[0.06] dark:border-white/[0.08] mb-4 flex items-center justify-center p-4 text-center">
                  <ShieldCheck className="w-8 h-8 text-[#86868B]" />
                </div>
              )}

              <div className="flex items-center justify-between text-xs font-mono text-[#86868B] mb-2">
                <span>{cert.category || "Official Certificate"}</span>
                <span>{cert.issue_date}</span>
              </div>

              <h3 className="font-display font-semibold text-base text-[#1D1D1F] dark:text-[#F5F5F7] mb-2 leading-snug">
                {cert.title}
              </h3>

              <span className="text-xs text-[#86868B] block mb-3">
                {cert.issuer}
              </span>

              {cert.description && (
                <p className="text-xs text-[#1D1D1F]/70 dark:text-[#F5F5F7]/70 leading-relaxed font-normal">
                  {cert.description}
                </p>
              )}
            </div>

            {/* Action link */}
            {cert.credential_url && (
              <div className="pt-4 mt-4 border-t border-black/[0.04] dark:border-white/[0.06]">
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center gap-1 hover:underline"
                >
                  <span>Lihat Kredensial Resmi</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* High-Res Document Preview Modal */}
      <AnimatePresence>
        {selectedCert && selectedCert.certificate_url && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/70 backdrop-blur-md"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: EASINGS.apple }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] bg-white dark:bg-[#161617] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.08] mb-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-[#1D1D1F] dark:text-[#F5F5F7]">
                    {selectedCert.title}
                  </h3>
                  <span className="text-xs text-[#86868B]">
                    {selectedCert.issuer} · {selectedCert.issue_date}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="p-2 rounded-full text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-auto flex items-center justify-center bg-[#F5F5F7] dark:bg-[#0B0B0C] rounded-2xl p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedCert.certificate_url}
                  alt={selectedCert.title}
                  className="max-h-[65vh] w-auto object-contain rounded-lg"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
