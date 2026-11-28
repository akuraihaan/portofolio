"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Maximize2, X } from "lucide-react";
import { useMotionContext } from "../motion/MotionProvider";
import { SPRINGS } from "../motion/MotionSystem";

interface ProjectImageViewerProps {
  src: string;
  alt: string;
}

export function ProjectImageViewer({ src, alt }: ProjectImageViewerProps) {
  const [open, setOpen] = useState(false);
  const prefersReduced = useReducedMotion();
  const { setCursor, resetCursor } = useMotionContext();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        onMouseEnter={() => setCursor({ active: true, text: "VIEW IMAGE", variant: "project" })}
        onMouseLeave={resetCursor}
        className="group relative mb-14 aspect-[16/9] w-full overflow-hidden bg-[#1A1917] cursor-zoom-in"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
        />
        <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1917]/85 text-[#FAF8F5] font-mono text-[10px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-3 h-3 text-[#F05A28]" />
          <span>Perbesar</span>
        </span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[9995] bg-[#1A1917]/95 flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup gambar"
              className="fixed top-6 right-6 p-2.5 bg-[#F05A28] text-[#FAF8F5] rounded-[0.5rem] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.img
              src={src}
              alt={alt}
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
              transition={SPRINGS.fluid}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-[88vh] object-contain cursor-default"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
