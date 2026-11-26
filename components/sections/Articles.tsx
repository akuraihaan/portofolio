"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Clock, ArrowUpRight } from "lucide-react";
import { SplitText } from "../motion/SplitText";
import { AnimatedUnderline } from "../motion/AnimatedUnderline";
import { useMotionContext } from "../motion/MotionProvider";
import {
  SPRINGS,
  VIEWPORT_ONCE,
  staggerContainer,
  staggerItem,
} from "../motion/MotionSystem";
import {
  defaultMotorsportArticles,
  type MotorsportArticleItem,
} from "../motorsport/MotorsportResearch";

interface ArticlesProps {
  articles?: MotorsportArticleItem[];
}

export function Articles({
  articles = defaultMotorsportArticles,
}: ArticlesProps) {
  const prefersReduced = useReducedMotion();
  const { setCursor, resetCursor } = useMotionContext();

  return (
    <section
      id="articles"
      className="w-full max-w-7xl mx-auto py-24 md:py-32 px-6 sm:px-8 border-t border-[#000000]/10 dark:border-[#FAF8F5]/10"
    >
      <div className="max-w-3xl mb-12 space-y-4">
        <span className="inline-block px-2.5 py-1 rounded-[0.5rem] bg-[#C4D94E] text-[#000000] font-mono text-xs uppercase tracking-[0.05em]">
          06 // RESEARCH &amp; NOTES
        </span>
        <h2 className="font-hero-display text-4xl sm:text-5xl text-[#000000] dark:text-[#FAF8F5] leading-[1.08]">
          <SplitText text="Writing on learning analytics, cloud & craft." type="words" />
        </h2>
      </div>

      <motion.div
        initial={prefersReduced ? {} : "hidden"}
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        variants={staggerContainer(0.08, 0.04)}
        className="divide-y divide-[#000000]/12 dark:divide-[#FAF8F5]/12"
      >
        {articles.map((art) => (
          <motion.article
            key={art.id}
            variants={staggerItem}
            whileHover={prefersReduced ? {} : { x: 6 }}
            transition={SPRINGS.fluid}
            onMouseEnter={() => setCursor({ active: true, text: "READ NOTE", variant: "link" })}
            onMouseLeave={resetCursor}
            className="group py-8 flex flex-col md:flex-row md:items-baseline justify-between gap-6 cursor-pointer"
          >
            <div className="space-y-2.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                <span className="px-2 py-0.5 rounded-[0.35rem] bg-[#A8D0F0] text-[#000000]">
                  {art.category}
                </span>
                <span className="inline-flex items-center gap-1 text-[#000000]/60 dark:text-[#FAF8F5]/60">
                  <Clock className="w-3 h-3" />
                  {art.reading_time || "5 Min Read"}
                </span>
                <span className="text-[#000000]/50 dark:text-[#FAF8F5]/50">{art.created_at}</span>
              </div>

              <h3 className="font-editorial text-2xl sm:text-3xl text-[#000000] dark:text-[#FAF8F5] group-hover:text-[#F05A28] transition-colors">
                <AnimatedUnderline color="#F05A28" thickness={1.5}>
                  {art.title}
                </AnimatedUnderline>
              </h3>

              <p className="font-body-editorial text-sm text-[#000000]/75 dark:text-[#FAF8F5]/75">
                {art.excerpt}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2 font-mono text-xs text-[#F05A28]">
              <span>READ</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
