"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Calendar, ExternalLink, Eye, X, ShieldCheck, Sparkles } from "lucide-react";

export interface CertificateItem {
  id: string;
  title: string;
  issuer?: string;
  issue_date?: string;
  credential_url?: string | null;
  certificate_url?: string | null;
  image_url?: string | null;
  description?: string | null;
}

interface SpaceCertificatesProps {
  certificates?: CertificateItem[];
}

export function SpaceCertificates({ certificates = [] }: SpaceCertificatesProps) {
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  return (
    <section
      id="certificates"
      className="w-full max-w-7xl mx-auto py-24 md:py-32 cursor-default px-6 md:px-12 border-t border-blue-900/20 relative"
    >
      {/* Ambient Backdrop */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Eyebrow & Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-14 text-left"
      >
        <h2 className="text-sm font-bold tracking-[0.2em] text-[#6ba0ff] uppercase mb-3 flex items-center gap-2">
          <Award className="w-3.5 h-3.5 text-[#2c67ed]" />
          <span>Accreditation & Honors</span>
        </h2>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter">
            Licenses & <span className="text-[#2c67ed] drop-shadow-[0_0_20px_rgba(44,103,237,0.6)]">Awards</span>
          </h3>
          <p className="text-sm md:text-base text-slate-400 max-w-md">
            Sertifikasi kredensial, keikutsertaan program teknologi nasional, dan pengakuan akademik.
          </p>
        </div>
      </motion.div>

      {/* Grid of Certificates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert, idx) => {
          const previewImg = cert.certificate_url || cert.image_url;
          const targetUrl = cert.credential_url || cert.certificate_url || cert.image_url;

          return (
            <motion.div
              key={cert.id || idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="group relative flex flex-col rounded-2xl bg-[#060a20]/80 border border-[#2c67ed]/20 overflow-hidden hover:border-[#2c67ed]/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(44,103,237,0.25)] hover:-translate-y-1"
            >
              {/* Preview Thumbnail */}
              <div
                onClick={() => setSelectedCert(cert)}
                className="relative h-48 w-full bg-[#04081c] overflow-hidden cursor-pointer flex items-center justify-center border-b border-[#2c67ed]/15"
              >
                {previewImg ? (
                  <img
                    src={previewImg}
                    alt={cert.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400">
                    <div className="w-12 h-12 rounded-full bg-[#2c67ed]/20 border border-[#2c67ed]/40 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(44,103,237,0.4)]">
                      <Award className="w-6 h-6 text-[#60a5fa]" />
                    </div>
                    <span className="text-xs font-mono text-blue-300/80">Dokumen Kredensial</span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-[#02040a]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2c67ed] text-white text-xs font-semibold shadow-[0_0_15px_rgba(44,103,237,0.8)]">
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#2c67ed]/15 border border-[#2c67ed]/30 text-[11px] font-mono text-[#6ba0ff]">
                      {cert.issuer || "Penyelenggara"}
                    </span>
                    {cert.issue_date && (
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#2c67ed]" />
                        {cert.issue_date}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-300 transition-colors">
                    {cert.title}
                  </h4>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="text-xs font-semibold text-[#6ba0ff] hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <span>Detail Sertifikat</span>
                    <span>→</span>
                  </button>

                  {targetUrl && (
                    <a
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      title="Buka dokumen asli"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox / Preview Modal */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-3xl rounded-2xl bg-[#060a20] border border-[#2c67ed]/40 p-6 shadow-[0_0_50px_rgba(44,103,237,0.35)] overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2 text-xs font-mono text-[#6ba0ff]">
                <ShieldCheck className="w-4 h-4 text-[#2c67ed]" />
                <span>{selectedCert.issuer || "Verified Credential"}</span>
                {selectedCert.issue_date && <span>• {selectedCert.issue_date}</span>}
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 pr-10">
                {selectedCert.title}
              </h3>

              {/* Certificate Image Frame */}
              <div className="relative w-full rounded-xl overflow-hidden bg-[#02040a] border border-[#2c67ed]/20 max-h-[60vh] flex items-center justify-center mb-6">
                {selectedCert.certificate_url || selectedCert.image_url ? (
                  <img
                    src={selectedCert.certificate_url || selectedCert.image_url || ""}
                    alt={selectedCert.title}
                    className="w-full h-auto max-h-[60vh] object-contain"
                  />
                ) : (
                  <div className="py-20 text-center text-slate-400">
                    <Award className="w-12 h-12 text-[#2c67ed] mx-auto mb-2 opacity-60" />
                    <p className="text-sm">Dokumen kredensial tersimpan secara aman.</p>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-xs text-slate-400 font-mono">
                  ID Kredensial: {selectedCert.id.slice(0, 12)}...
                </span>
                <div className="flex items-center gap-3">
                  {(selectedCert.credential_url || selectedCert.certificate_url) && (
                    <a
                      href={selectedCert.credential_url || selectedCert.certificate_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2c67ed] text-white text-xs font-semibold hover:brightness-110 shadow-[0_0_15px_rgba(44,103,237,0.5)] transition-all"
                    >
                      <span>Buka File Asli</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors"
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

