"use client";

import React, { useRef, useState, useCallback } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { InfoCard, TextCard, Sticker, Sprite } from "../collage";
import { EASINGS, DURATION, SPRINGS, VIEWPORT_ONCE } from "../motion/MotionSystem";

interface AboutProps {
  ownerName?: string;
  stats?: {
    projectsCount?: number;
    certificatesCount?: number;
    gpa?: string;
    graduationYear?: string;
  };
}

/**
 * About — Preserves DESIGN.md Collage About Composition:
 * - Large orange card rotated -8deg (mobile: -2.5deg)
 * - Overlapping peach text box rotated +3deg at lower-right corner
 * - Orbiting draggable blue sticker + green label tag
 * - Sparse ASCII sprites
 */
export function About({
  ownerName = "Taufik Raihandani",
  stats = {
    projectsCount: 7,
    certificatesCount: 5,
    gpa: "3.54",
    graduationYear: "2026",
  },
}: AboutProps) {
  const prefersReduced = useReducedMotion();
  const [hoveredCard, setHoveredCard] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const peachY = useTransform(scrollYProgress, [0, 1], [18, -18]);
  const stickerY = useTransform(scrollYProgress, [0, 1], [-14, 14]);

  const ptrX = useMotionValue(0);
  const ptrY = useMotionValue(0);
  const cardShiftX = useSpring(useTransform(ptrX, [-0.5, 0.5], [-8, 8]), SPRINGS.fluid);
  const cardShiftY = useSpring(useTransform(ptrY, [-0.5, 0.5], [-6, 6]), SPRINGS.fluid);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (prefersReduced || e.pointerType !== "mouse" || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      ptrX.set((e.clientX - rect.left) / rect.width - 0.5);
      ptrY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [prefersReduced, ptrX, ptrY]
  );

  return (
    <section
      ref={ref}
      id="about"
      onPointerMove={onPointerMove}
      className="relative w-full max-w-6xl mx-auto py-24 md:py-32 px-6 sm:px-8 overflow-x-clip"
    >
      {/* Section Tag */}
      <motion.div
        initial={prefersReduced ? {} : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: DURATION.medium, ease: EASINGS.editorial }}
        className="flex items-center justify-between mb-12 font-mono text-xs uppercase tracking-[0.05em]"
      >
        <span className="px-2.5 py-1 rounded-[0.5rem] bg-[#C4D94E] text-[#000000]">
          01 // ABOUT &amp; STORY
        </span>
        <Sprite kind="ascii-wave" color="pink" size="md" />
      </motion.div>

      {/* Collage Cluster */}
      <div className="relative flex flex-col lg:block items-center lg:min-h-[430px]">
        {/* Orbiting Green Label Tag */}
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: DURATION.medium, delay: 0.1 }}
          className="mb-4 lg:mb-0 lg:absolute lg:top-0 lg:right-16 z-20 inline-block px-3 py-1.5 rounded-[0.5rem] bg-[#C4D94E] text-[#000000] font-mono text-xs uppercase tracking-[0.05em] rotate-[4deg]"
        >
          IPK {stats.gpa || "3.54"} · MAGNA CUM LAUDE
        </motion.div>

        {/* Large Orange Card (-8deg desktop, -2.5deg mobile) with pointer depth */}
        <motion.div
          style={prefersReduced ? {} : { x: cardShiftX, y: cardShiftY }}
          onMouseEnter={() => setHoveredCard(true)}
          onMouseLeave={() => setHoveredCard(false)}
          className="w-full max-w-[540px] lg:ml-6 z-10 relative"
        >
          <InfoCard rotate={-8} mobileRotate={-2.5} binderHoles className="w-full">
            <h2 className="font-hero-display text-3xl sm:text-5xl text-[#FAF8F5] leading-[1.1] mb-5">
              Crafting interactive learning systems &amp; resilient web architecture.
            </h2>
            <p className="font-body-editorial text-sm sm:text-base text-[#FAF8F5]/90 leading-relaxed">
              Saya {ownerName}, lulusan S1 Pendidikan Komputer FKIP Universitas Lambung Mangkurat. Fokus utama saya berada di persimpangan antara rekayasa perangkat lunak modern, <em>Learning Analytics</em>, dan infrastruktur cloud berlatensi rendah.
            </p>
            <div
              className={`mt-4 pt-3 border-t border-[#FAF8F5]/20 font-mono text-[11px] uppercase tracking-wider text-[#FAF8F5] transition-opacity duration-300 ${
                hoveredCard ? "opacity-100" : "opacity-65"
              }`}
            >
              ✿ {stats.projectsCount || 7} SHIPPED WORKS · {stats.certificatesCount || 5} VERIFIED CERTS
            </div>
          </InfoCard>
        </motion.div>

        {/* Overlapping Peach Text Box (+3deg, lower right) */}
        <motion.div
          style={prefersReduced ? {} : { y: peachY }}
          className="w-full max-w-[420px] -mt-4 lg:mt-0 lg:absolute lg:bottom-2 lg:right-6 z-20"
        >
          <TextCard rotate={3} mobileRotate={2} foldedCorner delay={0.18}>
            <div className="space-y-3 font-mono text-xs sm:text-[13px] leading-relaxed text-[#000000]">
              <p>
                <strong>Bangkit Academy 2024:</strong> Cloud Computing Capstone Lead — men-deploy microservices Docker di GCP Cloud Run untuk penerjemah bahasa isyarat BISINDO.
              </p>
              <p>
                <strong>Skripsi Riset:</strong> Merancang <em>Flowwind Learn</em> dengan in-browser code editor &amp; perekaman analitik belajar mahasiswa secara real-time.
              </p>
            </div>
          </TextCard>
        </motion.div>

        {/* Orbiting Blue Square Sticker */}
        <motion.div
          style={prefersReduced ? {} : { y: stickerY }}
          className="mt-6 lg:mt-0 lg:absolute lg:bottom-8 lg:left-2 z-30"
        >
          <Sticker tone="blue" rotate={-12} className="w-24 h-24 p-3 flex-col gap-1 text-center">
            <span className="font-mono text-lg leading-none">✿</span>
            <span className="font-mono text-[10px] uppercase tracking-wider leading-tight">
              CLASS OF {stats.graduationYear || "2026"}
            </span>
          </Sticker>
        </motion.div>

        {/* Sparse Decorative Sprites */}
        <Sprite kind="bug" color="green" size="md" className="hidden lg:inline-block absolute top-14 right-6" />
        <Sprite kind="spark" color="orange" size="md" className="hidden lg:inline-block absolute bottom-2 left-1/2" />
      </div>
    </section>
  );
}
