"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Search, Layers } from "lucide-react";
import { GithubIcon } from "../space/SocialIcons";
import { Sticker, Sprite } from "../collage";
import { SplitText } from "../motion/SplitText";
import { useMotionContext } from "../motion/MotionProvider";
import { EASINGS, SPRINGS, DURATION, VIEWPORT_ONCE } from "../motion/MotionSystem";
import {
  defaultMotorsportProjects,
  type MotorsportProjectItem,
} from "../motorsport/MotorsportGallery";

interface PlaygroundProps {
  projects?: MotorsportProjectItem[];
}

// Scattered collage layout presets per item index (varied aspect ratios, offsets, and slight tilts)
const SCATTER_LAYOUTS = [
  { col: "lg:col-span-7", aspect: "aspect-[16/10]", offset: "lg:mt-0", rotate: -1.5 },
  { col: "lg:col-span-5", aspect: "aspect-[4/3]", offset: "lg:mt-16", rotate: 2 },
  { col: "lg:col-span-5", aspect: "aspect-[4/4]", offset: "lg:mt-4", rotate: -2 },
  { col: "lg:col-span-7", aspect: "aspect-[16/9]", offset: "lg:-mt-6", rotate: 1 },
  { col: "lg:col-span-6", aspect: "aspect-[16/10]", offset: "lg:mt-8", rotate: -1 },
  { col: "lg:col-span-6", aspect: "aspect-[3/2]", offset: "lg:mt-0", rotate: 1.5 },
  { col: "lg:col-span-8 lg:col-start-3", aspect: "aspect-[16/9]", offset: "lg:mt-6", rotate: -1 },
];

export function Playground({ projects = defaultMotorsportProjects }: PlaygroundProps) {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const prefersReduced = useReducedMotion();
  const { setCursor, resetCursor } = useMotionContext();

  const categories = useMemo(() => {
    const cats = Array.from(new Set(projects.map((p) => p.category)));
    return ["ALL", ...cats];
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchCat = selectedCategory === "ALL" || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.technologies.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <section
      id="playground"
      className="relative w-full max-w-7xl mx-auto py-24 md:py-32 px-6 sm:px-8 overflow-x-clip"
    >
      {/* Sparse Sprites */}
      <Sprite kind="star" color="orange" size="md" className="hidden md:inline-block absolute top-14 right-12" />
      <Sprite kind="leaf" color="green" size="md" className="hidden md:inline-block absolute bottom-20 left-10" />

      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div className="max-w-2xl space-y-4">
          <span className="inline-block px-2.5 py-1 rounded-[0.5rem] bg-[#C4D94E] text-[#000000] font-mono text-xs uppercase tracking-[0.05em]">
            02 // PROJECT PLAYGROUND
          </span>
          <h2 className="font-hero-display text-4xl sm:text-6xl text-[#000000] dark:text-[#FAF8F5] leading-[1.05]">
            <SplitText text="Selected works, experiments & shipped systems." type="words" />
          </h2>
          <p className="font-body-editorial text-sm sm:text-base text-[#000000]/75 dark:text-[#FAF8F5]/75 max-w-xl">
            Komposisi kolase acak di atas kanvas bertitik. Gambar proyek tampil tajam tanpa sudut membulat; klik karya mana pun untuk membuka studi kasus penuh.
          </p>
        </div>

        {/* Search & Sticker */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Sticker tone="peach" rotate={4} className="px-3 py-1.5 font-mono text-[11px] uppercase">
            {filtered.length} WORKS
          </Sticker>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#000000]/50 dark:text-[#FAF8F5]/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter tech or title..."
              className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] dark:bg-[#252420] border border-[#000000]/20 dark:border-[#FAF8F5]/20 text-xs font-mono text-[#000000] dark:text-[#FAF8F5] placeholder-[#000000]/40 dark:placeholder-[#FAF8F5]/40 focus:outline-none focus:border-[#F05A28]"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-14">
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              onMouseEnter={() => setCursor({ active: true, variant: "hover" })}
              onMouseLeave={resetCursor}
              className={`relative px-3.5 py-1.5 rounded-[0.5rem] font-mono text-xs uppercase tracking-[0.04em] cursor-pointer transition-colors ${
                active
                  ? "text-[#FAF8F5]"
                  : "bg-[#FFD4C2]/60 dark:bg-[#252420] text-[#000000] dark:text-[#FAF8F5] hover:bg-[#FFD4C2]"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="pgCategoryPill"
                  transition={SPRINGS.snappy}
                  className="absolute inset-0 rounded-[0.5rem] bg-[#F05A28] -z-0"
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Swipeable / Draggable Quick-Glance Strip */}
      {filtered.length > 1 && (
        <div className="mb-14 overflow-hidden">
          <div className="flex items-center justify-between mb-3 font-mono text-[10px] uppercase tracking-wider text-[#000000]/55 dark:text-[#FAF8F5]/55">
            <span>DRAG TO SWIPE SPOTLIGHT</span>
            <span>↔ GESTURE CAROUSEL</span>
          </div>
          <motion.div
            drag={prefersReduced ? false : "x"}
            dragConstraints={{ left: -320, right: 0 }}
            dragElastic={0.18}
            onMouseEnter={() => setCursor({ active: true, text: "DRAG", variant: "drag" })}
            onMouseLeave={resetCursor}
            className="flex gap-4 cursor-grab active:cursor-grabbing w-max pb-2"
          >
            {filtered.slice(0, 5).map((item) => (
              <Link
                key={`strip-${item.id}`}
                href={`/projects/${item.id}`}
                onClick={(e) => e.stopPropagation()}
                className="w-60 shrink-0 p-3.5 bg-[#FFD4C2]/65 dark:bg-[#252420] border border-[#000000]/12 dark:border-[#FAF8F5]/12 hover:border-[#F05A28] transition-colors flex flex-col justify-between"
              >
                <span className="font-mono text-[10px] text-[#F05A28] uppercase">
                  {item.number} · {item.category}
                </span>
                <span className="font-editorial text-xl text-[#000000] dark:text-[#FAF8F5] mt-1 truncate">
                  {item.title}
                </span>
              </Link>
            ))}
          </motion.div>
        </div>
      )}

      {/* Scattered Collage Grid (12-col asymmetric) */}
      <motion.div layout className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-10 lg:gap-y-16 items-start">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, idx) => {
            const preset = SCATTER_LAYOUTS[idx % SCATTER_LAYOUTS.length];
            const imageSrc = project.cover_url || project.thumbnail_url;
            return (
              <motion.article
                key={project.id}
                layout
                initial={
                  prefersReduced
                    ? { opacity: 0 }
                    : { opacity: 0, y: 28, rotate: preset.rotate * 1.4 }
                }
                whileInView={
                  prefersReduced
                    ? { opacity: 1 }
                    : { opacity: 1, y: 0, rotate: preset.rotate }
                }
                whileHover={
                  prefersReduced
                    ? {}
                    : { rotate: 0, y: -4 }
                }
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
                viewport={VIEWPORT_ONCE}
                transition={{ ...SPRINGS.fluid, delay: Math.min(idx * 0.05, 0.25) }}
                onMouseEnter={() =>
                  setCursor({ active: true, text: "VIEW PROJECT", variant: "project" })
                }
                onMouseLeave={resetCursor}
                className={`group ${preset.col} ${preset.offset} flex flex-col`}
              >
                {/* Sharp Image Tile — NO rounded corners on project images per DESIGN.md */}
                <Link
                  href={`/projects/${project.id}`}
                  className={`relative block w-full ${preset.aspect} overflow-hidden bg-[#1A1917] mb-4`}
                >
                  {imageSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageSrc}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#1A1917] text-[#FAF8F5]">
                      <Layers className="w-7 h-7 text-[#F05A28] mb-2" />
                      <span className="font-mono text-xs uppercase tracking-wider text-[#FAF8F5]/70">
                        {project.title}
                      </span>
                    </div>
                  )}
                </Link>

                {/* Metadata & Title */}
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-[0.4rem] bg-[#C4D94E] text-[#000000] font-mono text-[10px] uppercase tracking-[0.05em]">
                        {project.category}
                      </span>
                      {project.year && (
                        <span className="font-mono text-[11px] text-[#000000]/60 dark:text-[#FAF8F5]/60">
                          {project.year}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      {project.project_url && (
                        <a
                          href={project.project_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[#000000]/70 dark:text-[#FAF8F5]/70 hover:text-[#F05A28]"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>DEMO</span>
                        </a>
                      )}
                      {project.repository_url && (
                        <a
                          href={project.repository_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[#000000]/70 dark:text-[#FAF8F5]/70 hover:text-[#F05A28]"
                        >
                          <GithubIcon className="w-3 h-3" />
                          <span>REPO</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/projects/${project.id}`}
                    className="inline-flex items-baseline gap-2 group/title"
                  >
                    <h3 className="font-editorial text-2xl sm:text-3xl text-[#000000] dark:text-[#FAF8F5] group-hover/title:text-[#F05A28] transition-colors">
                      {project.title}
                    </h3>
                    <ArrowUpRight className="w-4 h-4 text-[#F05A28] opacity-0 group-hover/title:opacity-100 group-hover/title:translate-x-0.5 group-hover/title:-translate-y-0.5 transition-all" />
                  </Link>

                  <p className="font-body-editorial text-xs sm:text-sm text-[#000000]/75 dark:text-[#FAF8F5]/75 line-clamp-2 max-w-xl">
                    {project.summary}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.technologies.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[10px] px-2 py-0.5 bg-[#FAF8F5] dark:bg-[#252420] border border-[#000000]/15 dark:border-[#FAF8F5]/15 text-[#000000]/80 dark:text-[#FAF8F5]/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="py-16 text-center font-mono text-xs text-[#000000]/60 dark:text-[#FAF8F5]/60">
          No projects match &ldquo;{searchQuery}&rdquo;.
        </div>
      )}
    </section>
  );
}
