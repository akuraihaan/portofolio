"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { EASINGS, DURATION } from "../motion/MotionSystem";

interface EditorialHeroProps {
  name?: string;
  avatarUrl?: string | null;
  resumeUrl?: string;
}

export function EditorialHero({
  resumeUrl = "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/documents/ef4d0997-13e2-4034-97ee-328963e2351a/1788526781228-CV.pdf",
}: EditorialHeroProps) {
  const prefersReduced = useReducedMotion();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const fadeUp = (delay = 0) =>
    prefersReduced
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: DURATION.medium, delay, ease: EASINGS.editorial },
        };

  return (
    <section
      id="hero"
      className="relative w-full max-w-6xl mx-auto pt-36 pb-16 md:pt-52 md:pb-24 px-6 md:px-8 min-h-[90vh] flex flex-col justify-center"
    >
      {/* Top editorial meta label */}
      <motion.div {...fadeUp(0)} className="mb-10 flex items-center gap-3">
        <span className="font-mono text-[10px] text-[#86868B] tracking-[0.2em] uppercase">
          Portfolio — 2026
        </span>
        <div className="h-px w-10 bg-[#86868B]/30" />
        <span className="font-mono text-[10px] text-[#86868B] tracking-[0.15em] uppercase">
          Taufik Raihandani
        </span>
      </motion.div>

      {/* Large editorial headline */}
      <div className="relative">
        <motion.h1
          {...fadeUp(0.08)}
          className="font-display font-bold text-[clamp(3rem,9vw,8rem)] tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] leading-[0.95] mb-2"
        >
          BWORIEY
        </motion.h1>

        {/* Accent line */}
        <motion.div
          initial={prefersReduced ? {} : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.25, ease: EASINGS.editorial }}
          className="h-[2px] bg-[#1D1D1F] dark:bg-[#F5F5F7] w-full mb-8"
          style={{ transformOrigin: "left" }}
        />

        {/* Two-column: tagline left, details right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-end">
          <motion.div {...fadeUp(0.2)} className="md:col-span-7">
            <p className="text-[clamp(1.4rem,3.5vw,2.6rem)] font-display font-medium tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] leading-[1.15]">
              Designed with purpose.
              <br />
              <span className="text-[#86868B]">Built with code.</span>
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.3)} className="md:col-span-5 space-y-6">
            <p className="text-sm sm:text-base text-[#1D1D1F]/70 dark:text-[#F5F5F7]/70 leading-relaxed font-normal">
              Lulusan S.Pd. Pendidikan Komputer dari Universitas Lambung Mangkurat dan Alumnus Bangkit Academy 2024.
              Menghubungkan kedalaman pedagogi komputasi dengan rekayasa web modern dan sistem cloud serverless.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => scrollTo("projects")}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#1D1D1F] text-white dark:bg-[#F5F5F7] dark:text-[#1D1D1F] hover:opacity-90 transition-opacity cursor-pointer rounded-full"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium border border-black/[0.15] dark:border-white/[0.2] text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors rounded-full"
              >
                Resume ↗
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom stats strip */}
      <motion.div
        {...fadeUp(0.45)}
        className="mt-16 md:mt-20 pt-6 border-t border-black/[0.08] dark:border-white/[0.1] grid grid-cols-2 sm:grid-cols-4 gap-6"
      >
        {[
          { value: "3.54", label: "GPA — Magna Cum Laude" },
          { value: "2026", label: "S.Pd. Graduation" },
          { value: "7+", label: "Projects Engineered" },
          { value: "GCP", label: "Bangkit Cloud Alumnus" },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1">
            <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
              {stat.value}
            </span>
            <span className="text-[11px] font-mono text-[#86868B] tracking-wide uppercase leading-snug">
              {stat.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={prefersReduced ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8, ease: EASINGS.gentle }}
        className="absolute bottom-6 right-6 md:right-8 flex flex-col items-center gap-1.5 text-[#86868B] cursor-pointer"
        onClick={() => scrollTo("about")}
      >
        <span className="font-mono text-[9px] tracking-widest uppercase">Scroll</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
      </motion.div>
    </section>
  );
}
