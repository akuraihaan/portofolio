"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Calendar, ExternalLink, Eye, X, ShieldCheck, Trophy, Sparkles } from "lucide-react";

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

const verifiedCredentials: EditorialCertificateItem[] = [
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

interface EditorialCertificatesProps {
  initialCertificates?: EditorialCertificateItem[];
}

export function EditorialCertificates({ initialCertificates }: EditorialCertificatesProps) {
  const [selectedCert, setSelectedCert] = useState<EditorialCertificateItem | null>(null);

  const certificatesToDisplay =
    initialCertificates && initialCertificates.length > 0 ? initialCertificates : verifiedCredentials;

  return (
    <section
      id="certificates"
      className="w-full max-w-7xl mx-auto py-24 md:py-32 px-6 md:px-12 border-t border-[#e4e1d7] dark:border-[#222530]"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-16 gap-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold tracking-widest text-forest dark:text-lime uppercase">
            06 / AWARDS & CREDENTIALS
          </span>
          <span className="h-px w-8 bg-black/15 dark:bg-white/20"></span>
          <span className="font-mono text-xs text-charcoal/50 dark:text-white/40">
            CURATED DIGITAL ARCHIVE
          </span>
        </div>
        <span className="font-mono text-[11px] text-charcoal/40 dark:text-white/40">
          INDEX: {certificatesToDisplay.length} CREDENTIALS RECORDED
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-8">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-charcoal dark:text-white leading-[1.15] mb-3"
          >
            Certificates & recognition.
          </motion.h2>
          <p className="text-charcoal/70 dark:text-white/70 text-base max-w-xl leading-relaxed">
            Pengakuan kompetensi resmi, penghargaan kompetisi desain media, dan rekognisi program teknologi berskala nasional.
          </p>
        </div>
      </div>

      {/* Grid of Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificatesToDisplay.map((cert, idx) => {
          const previewImg = cert.certificate_url;
          const targetUrl = cert.credential_url || cert.certificate_url;

          return (
            <motion.div
              key={cert.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              className="group p-5 rounded-2xl bg-white dark:bg-[#14151b] border border-[#e4e1d7] dark:border-[#222530] shadow-editorial dark:shadow-none flex flex-col justify-between hover:border-black/25 dark:hover:border-white/25 transition-all"
            >
              <div>
                {/* Visual Thumbnail Frame */}
                <div
                  onClick={() => setSelectedCert(cert)}
                  className="relative h-44 w-full rounded-xl bg-[#faf8f5] dark:bg-[#0c0d10] border border-black/5 dark:border-white/5 overflow-hidden cursor-pointer flex items-center justify-center mb-4 group/img"
                >
                  {previewImg ? (
                    <img
                      src={previewImg}
                      alt={cert.title}
                      className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <div className="w-10 h-10 rounded-full bg-forest/10 dark:bg-lime/20 flex items-center justify-center text-forest dark:text-lime mb-2">
                        {cert.isAward ? <Trophy className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                      </div>
                      <span className="font-mono text-[10px] text-charcoal/50 dark:text-white/40">
                        Official Credential Record
                      </span>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-charcoal/40 dark:bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-lime text-charcoal font-mono text-[11px] font-bold shadow-md">
                      <Eye className="w-3.5 h-3.5" />
                      View Certificate
                    </span>
                  </div>
                </div>

                {/* Metadata Badges */}
                <div className="flex items-center justify-between font-mono text-[10px] mb-2.5">
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold ${
                      cert.isAward
                        ? "bg-forest/10 dark:bg-lime/20 text-forest dark:text-lime border border-forest/20 dark:border-lime/30"
                        : "bg-[#f0eee6] dark:bg-[#1f212a] text-charcoal/70 dark:text-white/70"
                    }`}
                  >
                    {cert.category || (cert.isAward ? "Award" : "Certificate")}
                  </span>
                  <span className="text-charcoal/40 dark:text-white/40 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {cert.issue_date}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-charcoal dark:text-white leading-snug mb-1.5 group-hover:text-forest dark:group-hover:text-lime transition-colors">
                  {cert.title}
                </h3>
                <p className="font-mono text-[11px] text-charcoal/60 dark:text-white/50 mb-3">
                  {cert.issuer}
                </p>

                {cert.description && (
                  <p className="text-xs text-charcoal/70 dark:text-white/70 leading-relaxed line-clamp-2">
                    {cert.description}
                  </p>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 mt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between font-mono text-xs">
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="font-bold text-forest dark:text-lime hover:underline flex items-center gap-1"
                >
                  <span>Preview</span>
                  <span>→</span>
                </button>

                {targetUrl && (
                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded-md text-charcoal/40 dark:text-white/40 hover:text-charcoal dark:hover:text-white transition-colors"
                    title="Buka dokumen kredensial"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 dark:bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-3xl rounded-3xl bg-[#faf8f5] dark:bg-[#14151b] border border-[#e4e1d7] dark:border-[#222530] p-6 sm:p-8 shadow-2xl"
            >
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-black/5 dark:bg-white/10 text-charcoal dark:text-white hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 font-mono text-xs text-forest dark:text-lime font-bold mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>{selectedCert.issuer}</span>
                <span>• {selectedCert.issue_date}</span>
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-charcoal dark:text-white mb-4 pr-8">
                {selectedCert.title}
              </h3>

              {/* Certificate Image Viewer */}
              <div className="relative w-full rounded-2xl overflow-hidden bg-black/5 dark:bg-black/40 border border-black/5 dark:border-white/5 max-h-[55vh] flex items-center justify-center mb-6">
                {selectedCert.certificate_url ? (
                  <img
                    src={selectedCert.certificate_url}
                    alt={selectedCert.title}
                    className="w-full h-auto max-h-[55vh] object-contain"
                  />
                ) : (
                  <div className="py-16 text-center text-charcoal/50 dark:text-white/40">
                    <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-mono">Dokumen kredensial digital terverifikasi.</p>
                  </div>
                )}
              </div>

              {selectedCert.description && (
                <p className="text-xs text-charcoal/70 dark:text-white/70 leading-relaxed mb-6 font-mono">
                  {selectedCert.description}
                </p>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10 font-mono text-xs">
                <span className="text-charcoal/50 dark:text-white/40">
                  ID: {selectedCert.id}
                </span>

                <div className="flex items-center gap-3">
                  {selectedCert.credential_url && (
                    <a
                      href={selectedCert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-forest dark:bg-lime text-white dark:text-charcoal font-bold hover:opacity-90 transition-opacity"
                    >
                      <span>Buka Tautan Asli</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 text-charcoal dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium"
                  >
                    Tutup
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

