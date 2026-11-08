"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownRight, MessageSquare, Terminal, FileDown, CheckCircle2, Sparkles, Code2, MapPin, Compass } from "lucide-react";
import { WordReveal } from "../motion/TextReveal";
import { MagneticElement } from "../motion/MagneticElement";
import { HoverPerspective } from "../motion/HoverPerspective";
import { useMotionContext } from "../motion/MotionProvider";
import { EASINGS, DURATION } from "../motion/MotionSystem";

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
  const { setCursor, resetCursor } = useMotionContext();

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
      className="relative w-full max-w-7xl mx-auto pt-36 pb-20 md:pt-44 md:pb-32 px-6 md:px-12 flex flex-col justify-center min-h-[92vh] overflow-hidden"
    >
      {/* Decorative Technical Coordinates & Crosshairs */}
      <div className="absolute top-28 left-8 sm:left-12 font-mono text-[10px] text-[#777970]/50 dark:text-[#A1A49A]/40 select-none tracking-widest hidden md:block">
        [INDEX // 001] · LAT -3.3167 / LON 114.5900
      </div>
      <div className="absolute top-28 right-8 sm:right-12 font-mono text-[10px] text-[#777970]/50 dark:text-[#A1A49A]/40 select-none tracking-widest hidden md:block">
        BANJARMASIN, KALSEL · EDITION 2026
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Asymmetric Typography & Content (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
          {/* Eyebrow Label */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASINGS.editorial }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#E9E8E1] dark:bg-[#1C1F1A] border border-[#171816]/10 dark:border-[#F4F3EE]/10 mb-6 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#C8F169] animate-pulse"></span>
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#171816] dark:text-[#F4F3EE] uppercase">
              PERSONAL PORTFOLIO / 2026
            </span>
          </motion.div>

          {/* Large Editorial Headline */}
          <h1 className="fluid-h1 font-display font-black tracking-tighter text-[#171816] dark:text-[#F4F3EE] mb-4">
            Building useful things through{" "}
            <span className="relative inline-block text-[#171816] dark:text-[#F4F3EE] underline decoration-[#C8F169] decoration-4 md:decoration-8 underline-offset-8">
              code
            </span>{" "}
            and curiosity.
          </h1>

          {/* Dynamic Specialization Cycler */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="h-9 flex items-center mb-5"
          >
            <span className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] mr-2 uppercase tracking-wider font-semibold">
              Specialization:
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={typewriterRoles[roleIndex]}
                initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.3, ease: EASINGS.editorial }}
                className="font-mono text-xs sm:text-sm font-bold text-[#171816] dark:text-[#C8F169] px-2.5 py-1 rounded-lg bg-[#E9E8E1] dark:bg-[#1C1F1A] border border-[#171816]/15 dark:border-[#C8F169]/30"
              >
                {typewriterRoles[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          {/* Subheadline (English) */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASINGS.editorial }}
            className="text-lg sm:text-xl font-normal text-[#171816]/85 dark:text-[#F4F3EE]/90 leading-snug mb-3 max-w-2xl"
          >
            Computer Education graduate exploring web development, software engineering, and technology-driven learning experiences.
          </motion.p>

          {/* Indonesian Narrative */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: EASINGS.editorial }}
            className="text-sm sm:text-base text-[#777970] dark:text-[#A1A49A] leading-relaxed mb-8 max-w-2xl"
          >
            Saya Taufik Raihandani, lulusan Pendidikan Komputer Universitas Lambung Mangkurat (2026) yang tertarik membangun aplikasi web dan solusi digital yang fungsional, mudah digunakan, serta memberikan dampak nyata.
          </motion.p>

          {/* Action CTAs with Magnetic Effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: EASINGS.editorial }}
            className="flex flex-wrap items-center gap-3.5"
          >
            <MagneticElement strength={0.3}>
              <button
                onClick={() => scrollTo("projects")}
                onMouseEnter={() => setCursor({ active: true, text: "EXPLORE" })}
                onMouseLeave={resetCursor}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#171816] dark:bg-[#C8F169] text-[#F4F3EE] dark:text-[#171816] font-mono text-xs font-bold hover:scale-105 shadow-md transition-transform group cursor-pointer"
              >
                <span>Explore Works</span>
                <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </MagneticElement>

            <MagneticElement strength={0.3}>
              <button
                onClick={() => scrollTo("contact")}
                onMouseEnter={() => setCursor({ active: true, text: "TALK" })}
                onMouseLeave={resetCursor}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#171816]/15 dark:border-[#F4F3EE]/20 bg-white/70 dark:bg-[#1C1F1A] text-[#171816] dark:text-[#F4F3EE] font-mono text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10 transition-colors shadow-sm cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#171816] dark:text-[#C8F169]" />
                <span>Let&apos;s Connect</span>
              </button>
            </MagneticElement>

            <MagneticElement strength={0.2}>
              <a
                href={resumeUrl}
                target={resumeUrl.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                onMouseEnter={() => setCursor({ active: true, text: "CV" })}
                onMouseLeave={resetCursor}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-[#171816]/10 dark:border-[#F4F3EE]/15 text-[#777970] dark:text-[#A1A49A] hover:text-[#171816] dark:hover:text-[#F4F3EE] font-mono text-xs transition-colors"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Download CV</span>
              </a>
            </MagneticElement>
          </motion.div>
        </div>

        {/* Right Column: 3D Perspective Verified Identity Card (5 cols) */}
        <div className="lg:col-span-5 flex justify-center">
          <HoverPerspective maxTilt={6}>
            <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#1C1F1A] border border-[#171816]/10 dark:border-[#F4F3EE]/10 p-6 sm:p-7 shadow-xl relative overflow-hidden">
              {/* Window Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#171816]/10 dark:border-[#F4F3EE]/10 mb-5">
                <div className="flex items-center gap-2 font-mono text-xs text-[#171816] dark:text-[#F4F3EE]">
                  <Terminal className="w-3.5 h-3.5 text-[#C8F169] dark:text-[#C8F169]" />
                  <span className="font-bold">bworiey // verified identity</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-black/10 dark:bg-white/20"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-black/10 dark:bg-white/20"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C8F169]"></span>
                </div>
              </div>

              {/* Profile Monogram & Verified Badge */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F4F3EE] dark:bg-[#111310] border border-[#171816]/5 dark:border-[#F4F3EE]/5 mb-4">
                {avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="w-16 h-16 rounded-2xl object-cover border border-[#171816]/10 dark:border-[#F4F3EE]/10 shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-[#171816] dark:bg-[#C8F169] flex items-center justify-center text-xl font-display font-black text-[#F4F3EE] dark:text-[#171816] shadow-md">
                    TR
                  </div>
                )}
                <div>
                  <h3 className="font-display font-bold text-lg text-[#171816] dark:text-[#F4F3EE]">
                    {name}
                  </h3>
                  <span className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] block">
                    @bworiey · S.Pd. Komputer
                  </span>
                  <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] text-[#171816] dark:text-[#C8F169] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8F169] animate-pulse"></span>
                    <span>Ready for Engineering Roles</span>
                  </div>
                </div>
              </div>

              {/* Verified Credentials Specs */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-[#F4F3EE] dark:bg-[#111310] border border-[#171816]/5 dark:border-[#F4F3EE]/5">
                  <span className="text-[10px] text-[#777970] dark:text-[#A1A49A] uppercase tracking-wider block mb-0.5">
                    01 // Academic Credential
                  </span>
                  <div className="text-[#171816] dark:text-[#F4F3EE] font-bold">
                    Universitas Lambung Mangkurat
                  </div>
                  <div className="text-[#777970] dark:text-[#A1A49A] text-[11px] flex items-center justify-between mt-1">
                    <span>S.Pd. Pendidikan Komputer</span>
                    <span className="px-2 py-0.5 rounded bg-[#C8F169]/20 text-[#171816] dark:text-[#C8F169] font-bold">
                      GPA 3.54 / 4.00
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F4F3EE] dark:bg-[#111310] border border-[#171816]/5 dark:border-[#F4F3EE]/5">
                  <span className="text-[10px] text-[#777970] dark:text-[#A1A49A] uppercase tracking-wider block mb-0.5">
                    02 // National Tech Program
                  </span>
                  <div className="text-[#171816] dark:text-[#F4F3EE] font-bold">
                    Bangkit Academy 2024 Batch II
                  </div>
                  <div className="text-[#777970] dark:text-[#A1A49A] text-[11px] mt-1">
                    Cloud Computing Cohort · Google, GoTo, Tokopedia, Traveloka
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F4F3EE] dark:bg-[#111310] border border-[#171816]/5 dark:border-[#F4F3EE]/5">
                  <span className="text-[10px] text-[#777970] dark:text-[#A1A49A] uppercase tracking-wider block mb-0.5">
                    03 // Research Focus
                  </span>
                  <div className="text-[#171816] dark:text-[#F4F3EE] font-bold">
                    Web Learning Analytics & Pedagogical Software
                  </div>
                  <div className="text-[#777970] dark:text-[#A1A49A] text-[11px] mt-1">
                    Flowwind Learn (Interactive Framework Platform) & ComBridge BISINDO
                  </div>
                </div>
              </div>

              {/* Verified Card Footer */}
              <div className="mt-5 pt-3.5 border-t border-[#171816]/10 dark:border-[#F4F3EE]/10 flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#777970] dark:text-[#A1A49A] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C8F169]" />
                  <span>Verified Identity Profile</span>
                </span>
                <span className="text-[#171816] dark:text-[#F4F3EE] font-bold">
                  Banjarmasin, ID
                </span>
              </div>
            </div>
          </HoverPerspective>
        </div>
      </div>
    </section>
  );
}
