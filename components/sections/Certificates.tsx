"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Award, X, ArrowUpRight } from "lucide-react";
import { SplitText } from "../motion/SplitText";
import { Sprite } from "../collage";
import { useMotionContext } from "../motion/MotionProvider";
import {
  SPRINGS,
  VIEWPORT_ONCE,
  staggerContainer,
  staggerItem,
} from "../motion/MotionSystem";
import {
  defaultMotorsportCertificates,
  type MotorsportCertificateItem,
} from "../motorsport/MotorsportCertificates";

interface CertificatesProps {
  certificates?: MotorsportCertificateItem[];
}

export function Certificates({
  certificates = defaultMotorsportCertificates,
}: CertificatesProps) {
  const [selected, setSelected] = useState<MotorsportCertificateItem | null>(null);
  const prefersReduced = useReducedMotion();
  const { setCursor, resetCursor } = useMotionContext();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    if (selected) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <section
      id="certificates"
      className="relative w-full max-w-7xl mx-auto py-24 md:py-32 px-6 sm:px-8 border-t border-[#000000]/10 dark:border-[#FAF8F5]/10"
    >
      <Sprite kind="star" color="blue" size="md" className="hidden md:inline-block absolute top-14 right-12" />

      <div className="max-w-3xl mb-12 space-y-4">
        <span className="inline-block px-2.5 py-1 rounded-[0.5rem] bg-[#C4D94E] text-[#000000] font-mono text-xs uppercase tracking-[0.05em]">
          05 // CERTIFICATES &amp; AWARDS
        </span>
        <h2 className="font-hero-display text-4xl sm:text-5xl text-[#000000] dark:text-[#FAF8F5] leading-[1.08]">
          <SplitText text="Verified credentials & competition awards." type="words" />
        </h2>
      </div>

      {/* Gallery with sharp image edges */}
      <motion.div
        initial={prefersReduced ? {} : "hidden"}
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        variants={staggerContainer(0.07, 0.04)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {certificates.map((cert) => (
          <motion.div
            key={cert.id}
            variants={staggerItem}
            whileHover={prefersReduced ? {} : { y: -4 }}
            transition={SPRINGS.fluid}
            onClick={() => setSelected(cert)}
            onMouseEnter={() => setCursor({ active: true, text: "PREVIEW", variant: "project" })}
            onMouseLeave={resetCursor}
            className="group cursor-pointer flex flex-col justify-between bg-[#FAF8F5] dark:bg-[#252420] border border-[#000000]/12 dark:border-[#FAF8F5]/12 p-5"
          >
            <div>
              {/* Sharp image — no rounded corners */}
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#1A1917] mb-4 flex items-center justify-center">
                {cert.certificate_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cert.certificate_url}
                    alt={cert.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                  />
                ) : (
                  <Award className="w-9 h-9 text-[#F05A28]" />
                )}
              </div>

              <div className="flex items-center justify-between gap-2 mb-2 font-mono text-[11px]">
                <span className="px-2 py-0.5 rounded-[0.35rem] bg-[#FFD4C2] text-[#000000]">
                  {cert.category || "CERT"}
                </span>
                <span className="text-[#000000]/60 dark:text-[#FAF8F5]/60">{cert.issue_date}</span>
              </div>

              <h3 className="font-editorial text-xl sm:text-2xl text-[#000000] dark:text-[#FAF8F5] group-hover:text-[#F05A28] transition-colors mb-1">
                {cert.title}
              </h3>
              <p className="font-mono text-xs text-[#000000]/65 dark:text-[#FAF8F5]/65">
                {cert.issuer}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Keyboard-Accessible Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 bg-[#1A1917]/80 flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 16 }}
              transition={SPRINGS.fluid}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl bg-[#FAF8F5] dark:bg-[#1A1917] text-[#000000] dark:text-[#FAF8F5] p-6 sm:p-8 rounded-[0.75rem] border border-[#000000]/20 dark:border-[#FAF8F5]/20 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-[#000000]/15 dark:border-[#FAF8F5]/15">
                <div>
                  <span className="font-mono text-xs text-[#F05A28] uppercase">
                    {selected.issuer} · {selected.issue_date}
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl mt-1">{selected.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close certificate preview"
                  className="p-2 hover:bg-[#FFD4C2] rounded-[0.5rem] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selected.certificate_url && (
                <div className="mb-5 bg-[#1A1917] max-h-[52vh] overflow-hidden flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selected.certificate_url}
                    alt={selected.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {selected.description && (
                <p className="font-body-editorial text-sm text-[#000000]/80 dark:text-[#FAF8F5]/80 mb-5">
                  {selected.description}
                </p>
              )}

              {selected.credential_url && (
                <a
                  href={selected.credential_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[0.5rem] bg-[#F05A28] text-[#FAF8F5] font-mono text-xs uppercase tracking-wider"
                >
                  <span>OPEN CREDENTIAL</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
