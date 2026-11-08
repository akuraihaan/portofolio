"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownRight, MessageSquare, Terminal, FileDown, CheckCircle2, Sparkles, Code2, MapPin } from "lucide-react";

interface EditorialHeroProps {
  name?: string;
  avatarUrl?: string | null;
  resumeUrl?: string;
}

const typewriterRoles = [
  "Web Developer",
  "Software Developer",
  "Computer Education Graduate",
  "Cloud & Tech Enthusiast",
];

export function EditorialHero({
  name = "Taufik Raihandani",
  avatarUrl = null,
  resumeUrl = "#contact",
}: EditorialHeroProps) {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % typewriterRoles.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative w-full max-w-7xl mx-auto pt-32 pb-20 md:pt-40 md:pb-28 px-6 md:px-12 flex flex-col justify-center min-h-[90vh]"
    >
      {/* Background Subtle Editorial Grid Marks */}
      <div className="absolute top-12 left-12 text-[10px] font-mono text-charcoal/20 dark:text-white/20 select-none hidden lg:block">
        GRID / REF 001-A
      </div>
      <div className="absolute top-12 right-12 text-[10px] font-mono text-charcoal/20 dark:text-white/20 select-none hidden lg:block">
        LAT -3.3167 / LON 114.5900 · BANJARMASIN, ID
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Asymmetric Typography & Statements (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#eeece4] dark:bg-[#1a1c24] border border-black/5 dark:border-white/10 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-forest dark:bg-lime"></span>
            <span className="text-[11px] font-mono font-medium tracking-widest text-charcoal/80 dark:text-white/80 uppercase">
              PERSONAL PORTFOLIO / 2026
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-charcoal dark:text-white leading-[1.08] mb-4"
          >
            Building useful things through{" "}
            <span className="relative inline-block text-forest dark:text-white underline decoration-lime decoration-4 underline-offset-4">
              code
            </span>{" "}
            and curiosity.
          </motion.h1>

          {/* Dynamic Framer Motion Typewriter Role Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="h-8 flex items-center mb-4"
          >
            <span className="font-mono text-xs text-charcoal/40 dark:text-white/40 mr-2 uppercase">
              Specialization:
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={typewriterRoles[roleIndex]}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="font-mono text-sm sm:text-base font-bold text-forest dark:text-lime px-2 py-0.5 rounded bg-forest/5 dark:bg-lime/10 border border-forest/15 dark:border-lime/25"
              >
                {typewriterRoles[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl font-normal text-charcoal/80 dark:text-white/90 leading-snug mb-3 max-w-2xl"
          >
            Computer Education graduate with an interest in web development, software engineering, and technology-driven learning experiences.
          </motion.p>

          {/* Indonesian Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-sm sm:text-base text-charcoal/60 dark:text-white/60 leading-relaxed mb-8 max-w-2xl"
          >
            Saya Taufik Raihandani, lulusan Pendidikan Komputer yang tertarik membangun aplikasi web dan solusi digital yang fungsional, mudah digunakan, serta memberikan manfaat.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center gap-3.5"
          >
            <button
              onClick={() => scrollTo("projects")}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-charcoal dark:bg-lime text-white dark:text-charcoal font-mono text-xs font-semibold hover:opacity-95 shadow-sm transition-all group"
            >
              <span>Explore Projects</span>
              <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
            </button>

            <button
              onClick={() => scrollTo("contact")}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-black/15 dark:border-white/20 bg-white/60 dark:bg-white/5 text-charcoal dark:text-white font-mono text-xs font-medium hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-forest dark:text-lime" />
              <span>Let&apos;s Connect</span>
            </button>

            <a
              href={resumeUrl}
              target={resumeUrl.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-black/10 dark:border-white/15 text-charcoal/70 dark:text-white/70 font-mono text-xs hover:text-charcoal dark:hover:text-white transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Download CV</span>
            </a>
          </motion.div>
        </div>

        {/* Right Column: Profile Frame & Structured Digital Identity (5 cols) */}
        <div className="lg:col-span-5 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md rounded-3xl bg-white dark:bg-[#14151b] border border-[#e4e1d7] dark:border-[#222530] p-6 sm:p-7 shadow-editorial dark:shadow-none relative overflow-hidden"
          >
            {/* Window header */}
            <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10 mb-5">
              <div className="flex items-center gap-2 font-mono text-xs text-charcoal/70 dark:text-white/70">
                <Terminal className="w-3.5 h-3.5 text-forest dark:text-lime" />
                <span>bworiey // verified identity</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-black/10 dark:bg-white/20"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-black/10 dark:bg-white/20"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-forest dark:bg-lime"></span>
              </div>
            </div>

            {/* Profile Avatar / Monogram Header Card */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#faf8f5] dark:bg-[#0c0d10] border border-black/5 dark:border-white/5 mb-4">
              {avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-16 h-16 rounded-2xl object-cover border border-black/10 dark:border-white/10 shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-forest/10 dark:bg-lime/20 border-2 border-forest/20 dark:border-lime/30 flex items-center justify-center text-xl font-display font-bold text-forest dark:text-lime shadow-sm">
                  TR
                </div>
              )}
              <div>
                <h3 className="font-display font-bold text-base text-charcoal dark:text-white">
                  {name}
                </h3>
                <span className="font-mono text-xs text-charcoal/60 dark:text-white/60 block">
                  @bworiey · S.Pd. Komputer
                </span>
                <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] text-forest dark:text-lime font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest dark:bg-lime animate-pulse"></span>
                  <span>Siap Kolaborasi</span>
                </div>
              </div>
            </div>

            {/* Structured Digital Credentials & Specs */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#faf8f5] dark:bg-[#0c0d10] border border-black/5 dark:border-white/5">
                <span className="text-[10px] text-charcoal/50 dark:text-white/40 uppercase tracking-wider block mb-0.5">
                  01 // Academic Credential
                </span>
                <div className="text-charcoal dark:text-white font-semibold">
                  Universitas Lambung Mangkurat
                </div>
                <div className="text-charcoal/60 dark:text-white/60 text-[11px] flex items-center justify-between mt-0.5">
                  <span>S.Pd. Pendidikan Komputer</span>
                  <span className="px-1.5 py-0.2 rounded bg-forest/10 dark:bg-lime/20 text-forest dark:text-lime font-bold">
                    Lulus 2026 · GPA 3.54
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#faf8f5] dark:bg-[#0c0d10] border border-black/5 dark:border-white/5">
                <span className="text-[10px] text-charcoal/50 dark:text-white/40 uppercase tracking-wider block mb-0.5">
                  02 // National Tech Program
                </span>
                <div className="text-charcoal dark:text-white font-semibold">
                  Bangkit Academy Batch II 2024
                </div>
                <div className="text-charcoal/60 dark:text-white/60 text-[11px] mt-0.5">
                  Cloud Computing Cohort · Google, GoTo, Tokopedia, Traveloka
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#faf8f5] dark:bg-[#0c0d10] border border-black/5 dark:border-white/5">
                <span className="text-[10px] text-charcoal/50 dark:text-white/40 uppercase tracking-wider block mb-0.5">
                  03 // Core Focus & Research
                </span>
                <div className="text-charcoal dark:text-white font-semibold">
                  Web Engineering & Educational Tech
                </div>
                <div className="text-charcoal/60 dark:text-white/60 text-[11px] mt-0.5">
                  Flowwind Learn (Tailwind Learning Analytics) & ComBridge
                </div>
              </div>
            </div>

            {/* Bottom Meta Status */}
            <div className="mt-5 pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-[11px] font-mono">
              <span className="text-charcoal/50 dark:text-white/40 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest dark:text-lime" />
                <span>Verified Developer Profile</span>
              </span>
              <span className="text-charcoal/70 dark:text-white/70">Banjarmasin, ID</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
