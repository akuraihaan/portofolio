"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PixelCard } from "../pixel3d/PixelCard";
import { PixelReveal } from "../motion/PixelReveal";
import { Award, ShieldCheck, ExternalLink, Eye, X, Trophy, FileText, ArrowUpRight } from "lucide-react";

export interface CertificateItem {
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

export const defaultCertificates: CertificateItem[] = [
  {
    id: "peksiminas-2nd",
    title: "2nd Place – Social Campaign Media Design Competition",
    issuer: "Puspresnas Kemdikbud & BEM FKIP ULM",
    issue_date: "2024",
    category: "Competition Award",
    isAward: true,
    certificate_url:
      "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/certificates/cert-peksiminas.png",
    credential_url: null,
    description:
      "Penghargaan Juara 2 tingkat fakultas/universitas dalam perancangan materi media kampanye visual edukatif.",
  },
  {
    id: "bangkit-cloud-cert",
    title: "Bangkit Academy Cloud Computing Graduate Certificate",
    issuer: "Google, GoTo, Tokopedia, Traveloka",
    issue_date: "2024–2025",
    category: "Industry Credential",
    isAward: false,
    certificate_url: null,
    credential_url: "https://www.credential.net",
    description:
      "Kelulusan studi independen intensif kurikulum arsitektur cloud Google Cloud Platform (GCP), microservices, dan kontainerisasi.",
  },
  {
    id: "dicoding-web-intermediate",
    title: "Menjadi Front-End Web Developer Expert",
    issuer: "Dicoding Indonesia & Google",
    issue_date: "2024",
    category: "Technical Certification",
    isAward: false,
    certificate_url: null,
    credential_url: "https://www.dicoding.com/certificates",
    description:
      "Sertifikasi keahlian implementasi progressive web apps (PWA), clean architecture, testing otomatis, dan web performance optimization.",
  },
];

interface PixelCertificatesProps {
  certificates?: CertificateItem[];
}

export function PixelCertificates({
  certificates = defaultCertificates,
}: PixelCertificatesProps) {
  const [activeTab, setActiveTab] = useState<"all" | "awards" | "credentials">("all");
  const [previewCert, setPreviewCert] = useState<CertificateItem | null>(null);

  const filtered = certificates.filter((c) => {
    if (activeTab === "awards") return c.isAward;
    if (activeTab === "credentials") return !c.isAward;
    return true;
  });

  return (
    <section id="certificates" className="py-24 relative border-t border-[#171816]/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <PixelReveal delay={0.1}>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-pixel text-[9px] px-2.5 py-1 bg-[#171816] dark:bg-[#C8F169] text-[#C8F169] dark:text-[#171816] font-bold">
              [06 // VAULT]
            </span>
            <span className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] tracking-wider uppercase">
              CREDENTIAL VAULT &amp; HONORS
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-[#171816] dark:text-[#F4F3EE] tracking-tight">
              Verified Credential Archive.
            </h2>
            <p className="font-mono text-xs sm:text-sm text-[#777970] dark:text-[#A1A49A] max-w-md">
              Sertifikasi industri, penghargaan kompetisi nasional, dan validasi kompetensi resmi.
            </p>
          </div>
        </PixelReveal>

        {/* Tab Filters */}
        <PixelReveal delay={0.2}>
          <div className="flex items-center gap-2 mb-10 pb-4 border-b border-[#171816]/10 dark:border-white/10 font-pixel text-[8px] sm:text-[9px]">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-2 border transition-colors ${
                activeTab === "all"
                  ? "bg-[#171816] text-[#C8F169] dark:bg-[#C8F169] dark:text-[#171816] border-[#171816] dark:border-[#C8F169] shadow-pixel"
                  : "bg-white dark:bg-[#1C1F1A] text-[#171816] dark:text-[#F4F3EE] border-[#171816]/20 dark:border-white/10 hover:border-[#171816]"
              }`}
            >
              [ALL_VAULT]
            </button>
            <button
              onClick={() => setActiveTab("awards")}
              className={`px-3 py-2 border transition-colors ${
                activeTab === "awards"
                  ? "bg-[#171816] text-[#C8F169] dark:bg-[#C8F169] dark:text-[#171816] border-[#171816] dark:border-[#C8F169] shadow-pixel"
                  : "bg-white dark:bg-[#1C1F1A] text-[#171816] dark:text-[#F4F3EE] border-[#171816]/20 dark:border-white/10 hover:border-[#171816]"
              }`}
            >
              [AWARDS_ONLY]
            </button>
            <button
              onClick={() => setActiveTab("credentials")}
              className={`px-3 py-2 border transition-colors ${
                activeTab === "credentials"
                  ? "bg-[#171816] text-[#C8F169] dark:bg-[#C8F169] dark:text-[#171816] border-[#171816] dark:border-[#C8F169] shadow-pixel"
                  : "bg-white dark:bg-[#1C1F1A] text-[#171816] dark:text-[#F4F3EE] border-[#171816]/20 dark:border-white/10 hover:border-[#171816]"
              }`}
            >
              [INDUSTRY_CERTS]
            </button>
          </div>
        </PixelReveal>

        {/* Certificate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((cert, idx) => (
            <PixelReveal key={cert.id} delay={0.15 + (idx % 3) * 0.1}>
              <PixelCard
                variant={cert.isAward ? "lime" : "default"}
                onClick={() => setPreviewCert(cert)}
                className="group flex flex-col justify-between h-full cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#171816]/10 dark:border-white/10">
                    <span className="font-pixel text-[8px] text-[#777970] dark:text-[#A1A49A]">
                      {cert.category || (cert.isAward ? "AWARD" : "CREDENTIAL")}
                    </span>
                    <span className="font-mono text-[10px] text-[#777970] dark:text-[#A1A49A]">
                      {cert.issue_date}
                    </span>
                  </div>

                  <div className="mb-4">
                    {cert.isAward ? (
                      <Trophy className="w-8 h-8 text-[#C8F169] mb-3" />
                    ) : (
                      <ShieldCheck className="w-8 h-8 text-[#171816] dark:text-[#C8F169] mb-3" />
                    )}
                    <h3 className="font-display font-bold text-lg text-[#171816] dark:text-[#F4F3EE] group-hover:text-[#171816] dark:group-hover:text-[#C8F169] transition-colors leading-snug mb-2">
                      {cert.title}
                    </h3>
                    <p className="font-mono text-xs text-[#777970] dark:text-[#A1A49A]">
                      {cert.issuer}
                    </p>
                  </div>

                  {cert.description && (
                    <p className="font-sans text-xs text-[#171816]/75 dark:text-[#F4F3EE]/75 leading-relaxed line-clamp-3 mb-4">
                      {cert.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-[#171816]/10 dark:border-white/10 flex items-center justify-between font-pixel text-[8px]">
                  <span className="text-[#171816] dark:text-[#C8F169] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>INSPECT CERT</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                  {cert.certificate_url && (
                    <span className="px-1.5 py-0.5 bg-[#C8F169]/20 text-[#171816] dark:text-[#C8F169] border border-[#C8F169]/40">
                      DOC_READY
                    </span>
                  )}
                </div>
              </PixelCard>
            </PixelReveal>
          ))}
        </div>
      </div>

      {/* Lightbox / Document Preview Modal */}
      <AnimatePresence>
        {previewCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-2xl w-full bg-white dark:bg-[#111310] border-2 border-[#171816] dark:border-[#C8F169] p-6 sm:p-8 shadow-pixel-lg dark:shadow-pixel-lime-lg"
            >
              <button
                onClick={() => setPreviewCert(null)}
                className="absolute top-4 right-4 p-2 border border-[#171816] dark:border-[#C8F169] bg-[#171816] text-[#F4F3EE] dark:bg-[#C8F169] dark:text-[#171816]"
                aria-label="Close preview"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="font-pixel text-[8px] px-2 py-0.5 bg-[#C8F169] text-[#171816] inline-block mb-3 font-bold">
                {previewCert.isAward ? "AWARD CITATION" : "VERIFIED CREDENTIAL"}
              </span>

              <h3 className="font-display font-black text-2xl text-[#171816] dark:text-[#F4F3EE] mb-2">
                {previewCert.title}
              </h3>
              <p className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] mb-6">
                Penerbit: {previewCert.issuer} · Tahun: {previewCert.issue_date}
              </p>

              {previewCert.certificate_url ? (
                <div className="aspect-[4/3] bg-black/5 dark:bg-white/5 border-2 border-[#171816]/20 dark:border-white/20 overflow-hidden mb-6 flex items-center justify-center">
                  <img
                    src={previewCert.certificate_url}
                    alt={previewCert.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="p-8 bg-[#171816]/5 dark:bg-[#1C1F1A] border-2 border-[#171816]/10 dark:border-white/10 text-center font-mono text-xs text-[#777970] dark:text-[#A1A49A] mb-6">
                  <FileText className="w-10 h-10 mx-auto text-[#C8F169] mb-2" />
                  <p>Kredensial digital resmi telah diverifikasi oleh penerbit.</p>
                </div>
              )}

              {previewCert.credential_url && (
                <a
                  href={previewCert.credential_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8F169] text-[#171816] border-2 border-[#171816] font-pixel text-[9px] font-bold shadow-pixel no-underline"
                >
                  <span>VERIFIKASI URL EKSTERNAL</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

