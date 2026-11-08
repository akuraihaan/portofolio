"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { EASINGS } from "../motion/MotionSystem";

interface EditorialHeroProps {
  name?: string;
  avatarUrl?: string | null;
  resumeUrl?: string;
}

export function EditorialHero({
  name = "Taufik Raihandani",
  resumeUrl = "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/documents/ef4d0997-13e2-4034-97ee-328963e2351a/1788526781228-CV.pdf",
}: EditorialHeroProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative w-full max-w-5xl mx-auto pt-36 pb-24 md:pt-48 md:pb-36 px-6 md:px-8 flex flex-col items-center text-center justify-center min-h-[85vh]"
    >
      {/* Category Eyebrow */}
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASINGS.apple }}
        className="text-xs sm:text-sm font-medium tracking-[0.2em] text-[#86868B] uppercase mb-4"
      >
        Taufik Raihandani · Personal Portfolio
      </motion.span>

      {/* Large Confident Apple-Style Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: EASINGS.apple }}
        className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] max-w-4xl leading-[1.06] mb-6"
      >
        BWORIEY.
        <br />
        <span className="text-[#86868B] font-medium text-4xl sm:text-5xl md:text-6xl lg:text-7xl block mt-2">
          Designed with purpose. Built with code.
        </span>
      </motion.h1>

      {/* Editorial Narrative Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: EASINGS.apple }}
        className="text-base sm:text-lg md:text-xl text-[#1D1D1F]/80 dark:text-[#F5F5F7]/80 max-w-2xl leading-relaxed font-normal mb-10"
      >
        Lulusan Sarjana Pendidikan Komputer dari Universitas Lambung Mangkurat (2026) dan Alumnus Bangkit Academy 2024. Menghubungkan kedalaman pedagogi komputasi dengan rekayasa web modern, sistem cloud serverless, dan pembelajaran interaktif.
      </motion.p>

      {/* Primary Apple-Style CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: EASINGS.apple }}
        className="flex flex-wrap items-center justify-center gap-4"
      >
        <button
          onClick={() => scrollTo("projects")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-[#1D1D1F] text-white dark:bg-[#F5F5F7] dark:text-[#1D1D1F] hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
        >
          <span>Explore Projects</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => scrollTo("contact")}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border border-black/[0.12] dark:border-white/[0.2] text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          <span>Get in Touch</span>
        </button>
      </motion.div>

      {/* Subtle Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6, ease: EASINGS.gentle }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[#86868B] cursor-pointer"
        onClick={() => scrollTo("about")}
      >
        <span className="text-[11px] font-medium tracking-wider uppercase">Scroll</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
      </motion.div>
    </section>
  );
}
