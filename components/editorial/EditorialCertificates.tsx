"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Calendar, ExternalLink, Eye, X, ShieldCheck, Trophy, Sparkles, Download, FileText, ArrowUpRight } from "lucide-react";
import { HoverPerspective } from "../motion/HoverPerspective";
import { useMotionContext } from "../motion/MotionProvider";
import { EASINGS, DURATION } from "../motion/MotionSystem";

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

export const defaultCredentials: EditorialCertificateItem[] = [
  {
    id: "peksiminas-2nd",
    title: "2nd Place – Social Campaign Media Design Competition",
    issuer: "Puspresnas Kemdikbud & BEM FKIP ULM",
    issue_date: "2024-04-15",
    category: "Competition Award",
    isAward: true,
    certificate_url:
      "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/ad091a01-5090-4bce-9208-bdff986d8e01-Taufik-Raihandani_2_converted.jpg",
    credential_url:
      "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/ad091a01-5090-4bce-9208-bdff986d8e01-Taufik-Raihandani_2_converted.jpg",
    description: "Juara 2 Lomba Desain Media Kampanye Sosial pada ajang Pekan Seni Mahasiswa (Peksiminas) FKIP XVIII.",
  },
  {
    id: "bangkit-program",
    title: "Bangkit Academy Independent Study Program Graduate",
    issuer: "Google, GoTo, Tokopedia, Traveloka & Kemendikbudristek",
    issue_date: "2025-01-20",
    category: "Professional Credential",
    isAward: false,
    certificate_url: null,
    credential_url: "https://grow.google/intl/id_id/bangkit/",
    description: "Kelulusan program studi independen bersertifikat bidang Cloud Computing & Google Cloud Platform.",
  },
  {
    id: "sendikom-2026",
    title: "Publikasi Pemakalah SENDIKOM 2026",
    issuer: "Seminar Nasional Pendidikan Ilmu Komputer",
    issue_date: "2026-07-20",
    category: "Academic Publication",
    isAward: false,
    certificate_url:
      "https://cdn.phototourl.com/free/2026-07-20-cc0542ca-e0f6-4398-9c4c-d9aaf3e04075.png",
    credential_url:
      "https://cdn.phototourl.com/free/2026-07-20-cc0542ca-e0f6-4398-9c4c-d9aaf3e04075.png",
    description: "Pemakalah seminar nasional: Penerapan Learning Analytics pada Web Pembelajaran Interaktif Framework Tailwind CSS.",
  },
  {
    id: "gdsc-itfest",
    title: "Webinar Nasional GDSC X IT FEST",
    issuer: "Google Developer Student Club ULM",
    issue_date: "2023-11-11",
    category: "National Seminar",
    isAward: false,
    certificate_url:
      "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/1ad94fe7-751e-4c82-8cbe-b28dbb642b60-AhaConvert_Taufik-Raihandani.jpg",
    credential_url:
      "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/1ad94fe7-751e-4c82-8cbe-b28dbb642b60-AhaConvert_Taufik-Raihandani.jpg",
    description: "Partisipasi aktif dalam eksplorasi tren teknologi web dan ekosistem software engineering.",
  },
  {
    id: "tik-lahan-basah",
    title: "TIK untuk Kemajuan Literasi Digital Masyarakat Lahan Basah",
    issuer: "Pendidikan Komputer ULM",
    issue_date: "2023-08-02",
    category: "Community Engagement",
    isAward: false,
    certificate_url:
      "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/3008f3ba-fd64-49a0-a3a8-9ff56c4e3511-1784622934472-e4f9e9c7-2d13-49dc-a23c-0f6b25faa5b4_1.jpg",
    credential_url:
      "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/3008f3ba-fd64-49a0-a3a8-9ff56c4e3511-1784622934472-e4f9e9c7-2d13-49dc-a23c-0f6b25faa5b4_1.jpg",
    description: "Pelatihan penguatan literasi digital bagi masyarakat wilayah ekosistem lahan basah.",
  },
  {
    id: "scratch-training",
    title: "Pelatihan Pemrograman Scratch bagi Siswa SMAN 1 Panyipatan",
    issuer: "Pendidikan Komputer ULM",
    issue_date: "2025-09-08",
    category: "Workshop Certification",
    isAward: false,
    certificate_url:
      "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/b72458f8-b12e-4394-9f5a-a3e2fbf25e9a-sertif-pkl-1.png",
    credential_url:
      "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/ef4d0997-13e2-4034-97ee-328963e2351a/b72458f8-b12e-4394-9f5a-a3e2fbf25e9a-sertif-pkl-1.png",
    description: "Instruktur dan fasilitator pelatihan computational thinking berbasis visual blocks Scratch.",
  },
];

export function EditorialCertificates({
  initialCertificates,
}: {
  initialCertificates?: EditorialCertificateItem[];
}) {
  const certificates =
    initialCertificates && initialCertificates.length > 0
      ? initialCertificates
      : defaultCredentials;

  const [activeTab, setActiveTab] = useState<"all" | "awards" | "credentials">("all");
  const [selectedPreview, setSelectedPreview] = useState<EditorialCertificateItem | null>(null);
  const { setCursor, resetCursor } = useMotionContext();

  const filtered = certificates.filter((item) => {
    if (activeTab === "awards") return item.isAward;
    if (activeTab === "credentials") return !item.isAward;
    return true;
  });

  return (
    <section
      id="certificates"
      className="w-full max-w-7xl mx-auto py-28 md:py-36 px-6 md:px-12 border-t border-[#171816]/10 dark:border-[#F4F3EE]/10"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-16 gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold tracking-widest text-[#171816] dark:text-[#C8F169] uppercase">
            06 / AWARDS & CREDENTIALS
          </span>
          <span className="h-px w-8 bg-[#171816]/20 dark:bg-[#F4F3EE]/20"></span>
          <span className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] uppercase tracking-wider">
            DIGITAL CREDENTIAL ARCHIVE
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#777970] dark:text-[#A1A49A] tracking-widest">
          VERIFIED ARCHIVE · {certificates.length} RECORDS
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-8">
          <h2 className="fluid-h2 font-display font-black tracking-tight text-[#171816] dark:text-[#F4F3EE] mb-4">
            Validated knowledge and achievements.
          </h2>
          <p className="text-[#777970] dark:text-[#A1A49A] text-base sm:text-lg max-w-xl leading-relaxed">
            Arsip kredensial akademik, sertifikasi industri, pemakalah seminar ilmiah, dan penghargaan kompetisi desain media.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {[
          { id: "all", label: "Semua Kredensial" },
          { id: "awards", label: "Penghargaan & Juara" },
          { id: "credentials", label: "Sertifikasi & Publikasi" },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-full font-mono text-xs font-bold transition-all cursor-pointer border ${
                isActive
                  ? "bg-[#171816] dark:bg-[#C8F169] text-[#F4F3EE] dark:text-[#171816] border-transparent shadow-sm"
                  : "bg-[#E9E8E1]/60 dark:bg-[#1C1F1A] text-[#777970] dark:text-[#A1A49A] border-[#171816]/10 dark:border-[#F4F3EE]/10 hover:border-[#171816]/30 dark:hover:border-[#F4F3EE]/30"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Credential Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((cert) => {
          return (
            <motion.div
              key={cert.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: DURATION.normal, ease: EASINGS.editorial }}
              onMouseEnter={() => setCursor({ active: true, text: "VIEW" })}
              onMouseLeave={resetCursor}
              onClick={() => setSelectedPreview(cert)}
              className="group p-6 rounded-3xl bg-white dark:bg-[#1C1F1A] border border-[#171816]/10 dark:border-[#F4F3EE]/10 hover:border-[#171816]/30 dark:hover:border-[#C8F169]/40 shadow-xl transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#171816]/10 dark:border-[#F4F3EE]/10 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-[#E9E8E1] dark:bg-[#111310] flex items-center justify-center text-[#171816] dark:text-[#C8F169]">
                      {cert.isAward ? (
                        <Trophy className="w-4 h-4 text-[#C8F169]" />
                      ) : (
                        <Award className="w-4 h-4" />
                      )}
                    </span>
                    <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#777970] dark:text-[#A1A49A]">
                      {cert.category || "Credential"}
                    </span>
                  </div>

                  <span className="font-mono text-[11px] text-[#777970] dark:text-[#A1A49A]">
                    {cert.issue_date.slice(0, 4)}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-[#171816] dark:text-[#F4F3EE] mb-2 group-hover:text-[#171816] dark:group-hover:text-[#C8F169] transition-colors">
                  {cert.title}
                </h3>

                <p className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] mb-4">
                  {cert.issuer}
                </p>

                {cert.description && (
                  <p className="text-xs text-[#171816]/75 dark:text-[#F4F3EE]/75 leading-relaxed font-sans mb-4">
                    {cert.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-[#171816]/10 dark:border-[#F4F3EE]/10 flex items-center justify-between font-mono text-[11px]">
                <span className="text-[#171816] dark:text-[#C8F169] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Pratinjau Kredensial</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>

                {cert.certificate_url && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#C8F169]/20 text-[#171816] dark:text-[#C8F169] font-bold">
                    Dokumen Siap
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox / Document Preview Modal */}
      <AnimatePresence>
        {selectedPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPreview(null)}
              className="fixed inset-0 bg-[#111310]/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.35, ease: EASINGS.editorial }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#F4F3EE] dark:bg-[#111310] border border-[#171816]/15 dark:border-[#F4F3EE]/15 shadow-2xl p-6 sm:p-8 z-10 text-[#171816] dark:text-[#F4F3EE]"
            >
              <button
                onClick={() => setSelectedPreview(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-[#E9E8E1] dark:bg-[#1C1F1A] text-[#171816] dark:text-[#F4F3EE] hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="pb-4 border-b border-[#171816]/10 dark:border-[#F4F3EE]/10 mb-6 pr-10">
                <span className="font-mono text-xs font-bold text-[#777970] dark:text-[#A1A49A] uppercase tracking-wider block mb-1">
                  {selectedPreview.category || "Verified Credential"} · {selectedPreview.issue_date}
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-[#171816] dark:text-[#F4F3EE]">
                  {selectedPreview.title}
                </h3>
                <p className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] mt-1">
                  Penerbit: {selectedPreview.issuer}
                </p>
              </div>

              {/* Certificate Image / Document Preview */}
              <div className="w-full rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 border border-[#171816]/10 dark:border-[#F4F3EE]/10 flex items-center justify-center p-2 mb-6">
                {selectedPreview.certificate_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={selectedPreview.certificate_url}
                    alt={selectedPreview.title}
                    className="w-full max-h-[55vh] object-contain rounded-xl shadow-sm"
                  />
                ) : (
                  <div className="py-16 text-center">
                    <Award className="w-16 h-16 text-[#C8F169] mx-auto mb-3" />
                    <p className="font-display font-bold text-lg text-[#171816] dark:text-[#F4F3EE]">
                      Kredensial Digital Terverifikasi
                    </p>
                    <p className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] mt-1">
                      Kredensial tercatat pada sistem penerbit resmi Bangkit Academy.
                    </p>
                  </div>
                )}
              </div>

              {selectedPreview.description && (
                <p className="text-xs sm:text-sm text-[#171816]/80 dark:text-[#F4F3EE]/80 leading-relaxed font-sans mb-6">
                  {selectedPreview.description}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#171816]/10 dark:border-[#F4F3EE]/10 font-mono text-xs">
                <button
                  onClick={() => setSelectedPreview(null)}
                  className="px-5 py-2.5 rounded-full border border-[#171816]/20 dark:border-[#F4F3EE]/20 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Tutup
                </button>

                {selectedPreview.credential_url && (
                  <a
                    href={selectedPreview.credential_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-2.5 rounded-full bg-[#171816] dark:bg-[#C8F169] text-[#F4F3EE] dark:text-[#171816] font-bold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                  >
                    <span>Verifikasi Kredensial ↗</span>
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
