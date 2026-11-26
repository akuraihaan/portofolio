"use client";

import React, { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ChevronDown, GraduationCap } from "lucide-react";
import { SplitText } from "../motion/SplitText";
import { TextCard, Sprite } from "../collage";
import { SPRINGS, VIEWPORT_ONCE } from "../motion/MotionSystem";
import {
  defaultMotorsportExperiences,
  type MotorsportExperienceRecord,
} from "../motorsport/MotorsportExperience";

interface ExperienceProps {
  experiences?: MotorsportExperienceRecord[];
}

export function Experience({
  experiences = defaultMotorsportExperiences,
}: ExperienceProps) {
  const [expandedId, setExpandedId] = useState<string | null>(experiences[0]?.id ?? null);
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 25%"],
  });
  const lineScaleY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), {
    stiffness: 70,
    damping: 20,
  });

  return (
    <section
      ref={ref}
      id="experience"
      className="relative w-full max-w-6xl mx-auto py-24 md:py-32 px-6 sm:px-8 border-t border-[#000000]/10 dark:border-[#FAF8F5]/10"
    >
      <Sprite kind="flower" color="pink" size="md" className="hidden md:inline-block absolute top-16 right-10" />

      <div className="max-w-3xl mb-14 space-y-4">
        <span className="inline-block px-2.5 py-1 rounded-[0.5rem] bg-[#C4D94E] text-[#000000] font-mono text-xs uppercase tracking-[0.05em]">
          04 // EXPERIENCE &amp; EDUCATION
        </span>
        <h2 className="font-hero-display text-4xl sm:text-5xl text-[#000000] dark:text-[#FAF8F5] leading-[1.08]">
          <SplitText text="Journey across engineering, cloud & pedagogy." type="words" />
        </h2>
      </div>

      {/* Education Editorial Card */}
      <div className="mb-14">
        <TextCard rotate={-1} mobileRotate={-1} foldedCorner className="max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-4 border-b border-[#000000]/15">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.05em] text-[#F05A28] mb-1">
                <GraduationCap className="w-4 h-4" />
                <span>EDUCATION · S1 PENDIDIKAN KOMPUTER</span>
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl text-[#000000]">
                Universitas Lambung Mangkurat (ULM)
              </h3>
            </div>
            <div className="font-mono text-xs text-[#000000]/80 sm:text-right">
              <div>2022 – 2026</div>
              <div className="text-[#F05A28] font-medium">IPK 3.54 / 4.00 (Magna Cum Laude)</div>
            </div>
          </div>
          <p className="font-body-editorial text-sm text-[#000000]/85 pt-4">
            <strong>Skripsi:</strong> &ldquo;Penerapan Learning Analytics pada Web Pembelajaran Interaktif Materi Framework Tailwind CSS Dasar&rdquo; — divalidasi dengan predikat &lsquo;Sangat Layak&rsquo;.
          </p>
        </TextCard>
      </div>

      {/* Informal Editorial Timeline */}
      <div className="relative pl-6 sm:pl-10">
        {!prefersReduced && (
          <div className="absolute left-1.5 top-2 bottom-2 w-[2px] bg-[#000000]/10 dark:bg-[#FAF8F5]/10">
            <motion.div
              style={{ scaleY: lineScaleY }}
              className="w-full h-full bg-[#F05A28] origin-top"
            />
          </div>
        )}

        <div className="space-y-6">
          {experiences.map((exp, idx) => {
            const isOpen = expandedId === exp.id;
            return (
              <motion.div
                key={exp.id}
                layout
                initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT_ONCE}
                transition={{ ...SPRINGS.fluid, delay: idx * 0.06 }}
                className={`relative p-5 sm:p-6 rounded-[0.75rem] border transition-colors ${
                  isOpen
                    ? "bg-[#FAF8F5] dark:bg-[#252420] border-[#F05A28]"
                    : "bg-[#FAF8F5]/70 dark:bg-[#252420]/70 border-[#000000]/12 dark:border-[#FAF8F5]/12"
                }`}
              >
                {/* Timeline dot */}
                <span
                  className={`absolute -left-[22px] sm:-left-[38px] top-7 w-3 h-3 rounded-full border-2 border-[#FAF8F5] dark:border-[#1A1917] ${
                    isOpen ? "bg-[#F05A28] scale-125" : "bg-[#C4D94E]"
                  } transition-transform`}
                />

                <button
                  type="button"
                  onClick={() => setExpandedId(isOpen ? null : exp.id)}
                  className="w-full text-left flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer focus:outline-none"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-[0.35rem] bg-[#C4D94E] text-[#000000] font-mono text-[10px] uppercase">
                        {exp.typeBadge || "EXPERIENCE"}
                      </span>
                      <span className="font-mono text-xs text-[#000000]/60 dark:text-[#FAF8F5]/60">
                        {exp.period}
                      </span>
                    </div>
                    <h3 className="font-editorial text-xl sm:text-2xl text-[#000000] dark:text-[#FAF8F5]">
                      {exp.role}
                    </h3>
                    <p className="font-mono text-xs text-[#F05A28]">{exp.organization}</p>
                  </div>

                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={SPRINGS.snappy}
                    className="self-start sm:self-center text-[#000000]/60 dark:text-[#FAF8F5]/60"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-[#000000]/10 dark:border-[#FAF8F5]/10 space-y-3">
                        <p className="font-body-editorial text-sm text-[#000000]/80 dark:text-[#FAF8F5]/80">
                          {exp.description}
                        </p>
                        <ul className="space-y-1.5">
                          {exp.responsibilities.map((r, ri) => (
                            <li
                              key={ri}
                              className="font-mono text-xs text-[#000000]/75 dark:text-[#FAF8F5]/75 flex items-start gap-2"
                            >
                              <span className="text-[#F05A28]">→</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
