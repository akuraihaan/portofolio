"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Award, Eye, X, ArrowUpRight } from "lucide-react";
import { useMotionContext } from "../motion/MotionProvider";
import { SplitText } from "../motion/SplitText";
import { RevealImage } from "../motion/RevealImage";
import { EASINGS, SPRINGS, DURATION, VIEWPORT_ONCE, staggerContainer, staggerItem } from "../motion/MotionSystem";

export interface MotorsportCertificateItem {
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

export const defaultMotorsportCertificates: MotorsportCertificateItem[] = [
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

interface MotorsportCertificatesProps {
  certificates?: MotorsportCertificateItem[];
}

export function MotorsportCertificates({
  certificates = defaultMotorsportCertificates,
}: MotorsportCertificatesProps) {
  const [selectedCert, setSelectedCert] = useState<MotorsportCertificateItem | null>(null);
  const prefersReduced = useReducedMotion();
  const { setCursor, resetCursor } = useMotionContext();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCert(null);
    };
    if (selectedCert) {
      window.addEventListener("keydown", onKeyDown);
    }
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedCert]);

  const inView = (delay = 0) =>
    prefersReduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-8%" },
          transition: { duration: 0.7, delay, ease: EASINGS.editorial },
        };

  return (
    <section
      id="sertifikat"
      className="w-full bg-[#1A1A1A] text-[#F5F5F0] py-24 md:py-36 px-6 sm:px-8 border-b border-[#333333]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div {...inView(0)} className="flex items-center gap-3 mb-16">
          <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#D1FF00] uppercase">
            05 // SERTIFIKASI &amp; PENGHARGAAN
          </span>
          <div className="h-px flex-1 bg-[#333333]" />
          <span className="font-mono text-xs text-[#888888] uppercase tracking-wider">
            KREDENSIAL TERVERIFIKASI
          </span>
        </motion.div>

        {/* Section Headline */}
        <div className="max-w-3xl mb-14">
          <h2 className="font-hero-display text-4xl sm:text-6xl text-[#F5F5F0] leading-[0.95] uppercase font-bold mb-4">
            <SplitText text="Kredensial Industri · Prestasi Kompetisi" type="words" />
          </h2>
          <motion.p
            {...inView(0.15)}
            className="font-body-editorial text-sm sm:text-base text-[#AAAAAA] leading-relaxed font-light"
          >
            Sertifikasi resmi dalam rekayasa komputasi awan, seminar publikasi riset, instruktur pelatihan logika pemrograman, dan kejuaraan desain media sosial nasional.
          </motion.p>
        </div>

        {/* Grid of Certificates (DESIGN.md Gallery Pattern) */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          initial={prefersReduced ? {} : "hidden"}
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          variants={staggerContainer(0.08, 0.04)}
        >
          {certificates.map((cert) => (
            <motion.div
              key={cert.id}
              variants={staggerItem}
              whileHover={prefersReduced ? {} : { y: -6 }}
              transition={SPRINGS.fluid}
              onMouseEnter={() => setCursor({ active: true, text: "PREVIEW", variant: "project" })}
              onMouseLeave={resetCursor}
              onClick={() => setSelectedCert(cert)}
              className="group bg-[#111111] rounded-[1rem] border border-[#333333] hover:border-[#D1FF00]/80 p-5 sm:p-6 transition-colors duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Visual Thumbnail Container with RevealImage */}
                <div className="relative aspect-[16/11] rounded-[0.75rem] overflow-hidden bg-[#1A1A1A] border border-[#333333] mb-5 flex items-center justify-center">
                  {cert.certificate_url ? (
                    <RevealImage
                      src={cert.certificate_url}
                      alt={cert.title}
                      className="w-full h-full"
                      imgClassName="group-hover:scale-105 transition-transform duration-700 filter contrast-105"
                    />
                  ) : (
                    <div className="p-6 text-center space-y-2">
                      <Award className="w-10 h-10 text-[#D1FF00] mx-auto" />
                      <span className="font-mono text-[10px] text-[#888888] uppercase block">
                        KREDENSIAL DIGITAL RESMI
                      </span>
                    </div>
                  )}

                  {/* Corner Badge pairing Category with Year in Action Lime */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-[#111111]/90 backdrop-blur-md px-3 py-1 rounded-[0.5rem] border border-[#333333]">
                    <span className="font-mono text-[10px] text-[#F5F5F0] font-medium uppercase">
                      {cert.category || "RESMI"}
                    </span>
                    <span className="text-[#333333]">&middot;</span>
                    <span className="font-mono text-[10px] text-[#D1FF00] font-bold">
                      {cert.issue_date.slice(0, 4) || "2024"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#D1FF00] font-semibold">
                    {cert.issuer}
                  </span>
                  <Eye className="w-4 h-4 text-[#888888] group-hover:text-[#D1FF00] transition-colors" />
                </div>

                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#F5F5F0] group-hover:text-[#D1FF00] transition-colors mb-2">
                  {cert.title}
                </h3>

                {cert.description && (
                  <p className="font-body-editorial text-xs sm:text-sm text-[#AAAAAA] line-clamp-3 leading-relaxed font-light">
                    {cert.description}
                  </p>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-[#333333]/60 flex items-center justify-between font-mono text-xs">
                <span className="text-[#888888]">{cert.issue_date}</span>
                <span className="text-[#D1FF00] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>LIHAT</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Certificate Modal Preview */}
      <AnimatePresence>
        {selectedCert && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: EASINGS.editorial }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl bg-[#1A1A1A] border-2 border-[#D1FF00]/60 rounded-[1.5rem] p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col justify-between max-h-[90vh]"
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#333333]">
                  <div>
                    <span className="font-mono text-xs text-[#D1FF00] uppercase tracking-wider block mb-1">
                      {selectedCert.category || "SERTIFIKASI RESMI"} &middot; {selectedCert.issue_date}
                    </span>
                    <h3 className="font-hero-display text-2xl sm:text-3xl font-bold text-[#F5F5F0]">
                      {selectedCert.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="p-2 rounded-full text-[#888888] hover:text-[#F5F5F0] hover:bg-white/10 cursor-pointer"
                    aria-label="Tutup Pratinjau"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedCert.certificate_url && (
                    <div className="rounded-[1rem] overflow-hidden border border-[#333333] max-h-[50vh] bg-black/40 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedCert.certificate_url}
                        alt={selectedCert.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  <p className="font-sans text-xs sm:text-sm text-[#CCCCCC] leading-relaxed">
                    {selectedCert.description || "Kredensial resmi terdaftar dalam riwayat akademik dan kompetensi komputasi."}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#333333] flex items-center justify-between font-mono text-xs">
                <span className="text-[#888888]">Penerbit: <strong className="text-[#F5F5F0]">{selectedCert.issuer}</strong></span>
                {selectedCert.credential_url && (
                  <a
                    href={selectedCert.credential_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[0.75rem] bg-[#D1FF00] text-[#111111] font-bold uppercase tracking-wider hover:brightness-105"
                  >
                    <span>BUKA DOKUMEN</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
