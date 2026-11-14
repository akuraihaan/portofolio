"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Award, ShieldCheck, Eye, X, ArrowUpRight } from "lucide-react";
import { EASINGS, DURATION } from "../motion/MotionSystem";

export interface ContemporaryCertificateItem {
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

export const defaultContemporaryCertificates: ContemporaryCertificateItem[] = [
  {
    id: "cert-sendikom-2026",
    title: "Sertifikat Pemakalah Seminar Nasional Komputer 2026",
    issuer: "SENDIKOM 2026",
    issue_date: "23 Juni 2026",
    category: "Publikasi Ilmiah",
    isAward: false,
    certificate_url: "https://cdn.phototourl.com/free/2026-07-20-cc0542ca-e0f6-4398-9c4c-d9aaf3e04075.png",
    credential_url: "https://cdn.phototourl.com/free/2026-07-20-cc0542ca-e0f6-4398-9c4c-d9aaf3e04075.png",
    description: "Sertifikat Pemakalah dalam Seminar Nasional Komputer (SENDIKOM 2026) dalam diseminasi riset teknologi komputasi dan media pembelajaran interaktif.",
  },
  {
    id: "cert-peksiminas-2024",
    title: "Sertifikat Juara 2 Peksiminas Desain Media Sosial 2024",
    issuer: "Pusat Prestasi Nasional (Puspresnas) & BEM FKIP ULM",
    issue_date: "15 April 2024",
    category: "Penghargaan Kompetisi",
    isAward: true,
    certificate_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/ad091a01-5090-4bce-9208-bdff986d8e01-Taufik-Raihandani_2_converted.jpg",
    credential_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/ad091a01-5090-4bce-9208-bdff986d8e01-Taufik-Raihandani_2_converted.jpg",
    description: "Penghargaan Juara 2 dalam perancangan media komunikasi visual dan kampanye sosial edukatif pada Pekan Seni Mahasiswa.",
  },
  {
    id: "cert-gdsc-2023",
    title: "Webinar Nasional GDSC X IT FEST Ekosistem Cloud",
    issuer: "Google Developer Student Club (GDSC)",
    issue_date: "11 November 2023",
    category: "Teknologi Industri",
    isAward: false,
    certificate_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/1ad94fe7-751e-4c82-8cbe-b28dbb642b60-AhaConvert_Taufik-Raihandani.jpg",
    credential_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/1ad94fe7-751e-4c82-8cbe-b28dbb642b60-AhaConvert_Taufik-Raihandani.jpg",
    description: "Sertifikasi partisipasi pengembangan ekosistem web modern, infrastruktur cloud, dan tren industri software engineering.",
  },
  {
    id: "cert-scratch-2025",
    title: "Pelatihan Pemrograman Scratch Siswa SMAN 1 Panyipatan",
    issuer: "Pendidikan Komputer FKIP ULM",
    issue_date: "08 September 2025",
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
    issue_date: "02 Agustus 2023",
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
    issue_date: "15 Januari 2025",
    category: "Sertifikasi Industri",
    isAward: false,
    certificate_url: null,
    credential_url: "https://www.credential.net",
    description: "Kelulusan resmi program studi independen bersertifikat kurikulum arsitektur cloud Google Cloud Platform (GCP), microservices, dan kontainerisasi.",
  },
];

interface ContemporaryCertificatesProps {
  certificates?: ContemporaryCertificateItem[];
}

export function ContemporaryCertificates({
  certificates = defaultContemporaryCertificates,
}: ContemporaryCertificatesProps) {
  const [selectedCert, setSelectedCert] = useState<ContemporaryCertificateItem | null>(null);
  const prefersReduced = useReducedMotion();

  const inView = (delay = 0) =>
    prefersReduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-6%" },
          transition: { duration: DURATION.medium, delay, ease: EASINGS.editorial },
        };

  return (
    <section
      id="sertifikat"
      className="w-full max-w-7xl mx-auto py-24 md:py-36 px-6 sm:px-8 border-t border-black/[0.08] dark:border-white/[0.1]"
    >
      {/* Section Header */}
      <motion.div {...inView(0)} className="flex items-center gap-3 mb-16">
        <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#2563EB] dark:text-[#C8F169] uppercase">
          06 // SERTIFIKASI &amp; PENGHARGAAN
        </span>
        <div className="h-px flex-1 bg-black/[0.08] dark:border-white/[0.1]" />
        <span className="font-mono text-xs text-[#71717A] dark:text-[#A1A1AA] uppercase">
          KREDENSIAL RESMI
        </span>
      </motion.div>

      {/* Main Headline */}
      <motion.div {...inView(0.06)} className="max-w-3xl mb-16">
        <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight text-[#121214] dark:text-[#F4F4F6] leading-tight mb-4">
          Bukti kompetensi terverifikasi dan publikasi seminar nasional.
        </h2>
        <p className="font-sans text-base text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
          Arsip sertifikasi resmi dari konsorsium industri teknologi, diseminasi artikel seminar nasional komputer, serta penghargaan kompetisi perancangan media.
        </p>
      </motion.div>

      {/* Grid Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {certificates.map((cert, idx) => (
          <motion.div
            key={cert.id}
            initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-4%" }}
            transition={{ duration: DURATION.medium, delay: idx * 0.07, ease: EASINGS.editorial }}
            onClick={() => {
              if (cert.certificate_url) setSelectedCert(cert);
            }}
            className={`rounded-2xl bg-white dark:bg-[#121214] border border-black/[0.08] dark:border-white/[0.1] p-6 flex flex-col justify-between shadow-sm transition-all ${
              cert.certificate_url
                ? "cursor-pointer hover:shadow-md hover:border-black/20 dark:hover:border-white/20 hover:-translate-y-0.5"
                : ""
            }`}
          >
            <div>
              {/* Document Image Thumbnail if available */}
              {cert.certificate_url ? (
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F0EFEB] dark:bg-[#080809] border border-black/10 dark:border-white/10 mb-5 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cert.certificate_url}
                    alt={cert.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono font-bold gap-2">
                    <Eye className="w-4 h-4" />
                    <span>LIHAT DOKUMEN</span>
                  </div>
                </div>
              ) : (
                <div className="relative aspect-[4/3] rounded-xl bg-[#F0EFEB] dark:bg-[#080809] border border-black/10 dark:border-white/10 mb-5 flex items-center justify-center p-6 text-center">
                  <ShieldCheck className="w-10 h-10 text-[#2563EB] dark:text-[#C8F169]" />
                </div>
              )}

              {/* Meta Header */}
              <div className="flex items-center justify-between text-xs font-mono text-[#71717A] dark:text-[#A1A1AA] mb-2">
                <span className="font-semibold text-[#2563EB] dark:text-[#C8F169]">
                  {cert.category || "Sertifikat Resmi"}
                </span>
                <span>{cert.issue_date}</span>
              </div>

              {/* Title */}
              <h3 className="font-display font-bold text-base sm:text-lg text-[#121214] dark:text-[#F4F4F6] mb-2 leading-snug">
                {cert.title}
              </h3>

              <span className="font-mono text-xs text-[#71717A] dark:text-[#A1A1AA] block mb-3">
                {cert.issuer}
              </span>

              {cert.description && (
                <p className="font-sans text-xs text-[#121214]/75 dark:text-[#F4F4F6]/75 leading-relaxed font-normal">
                  {cert.description}
                </p>
              )}
            </div>

            {/* Credential Link */}
            {cert.credential_url && (
              <div className="pt-4 mt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-mono text-xs font-medium text-[#121214] dark:text-[#F4F4F6] flex items-center gap-1.5 hover:text-[#2563EB] dark:hover:text-[#C8F169] transition-colors"
                >
                  <span>Verifikasi Kredensial Resmi</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Document Inspection Modal */}
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
              transition={{ duration: 0.25, ease: EASINGS.editorial }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] bg-white dark:bg-[#121214] rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col overflow-hidden border border-black/10 dark:border-white/15"
            >
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.08] dark:border-white/[0.1] mb-4">
                <div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-[#121214] dark:text-[#F4F4F6]">
                    {selectedCert.title}
                  </h3>
                  <span className="font-mono text-xs text-[#71717A] dark:text-[#A1A1AA]">
                    {selectedCert.issuer} · {selectedCert.issue_date}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="p-2 rounded-full text-[#71717A] hover:text-[#121214] dark:hover:text-[#F4F4F6] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] cursor-pointer"
                  aria-label="Tutup Pratinjau Dokumen"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-auto flex items-center justify-center bg-[#F8F8F6] dark:bg-[#080809] rounded-xl p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedCert.certificate_url}
                  alt={selectedCert.title}
                  className="max-h-[68vh] w-auto object-contain rounded-lg shadow-sm"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
