"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudyBlock, BlockMotionPreset, BlockBackground } from "@/lib/case-study-blocks";
import { EASINGS, SPRINGS, DURATION, VIEWPORT_ONCE } from "../motion/MotionSystem";
import { ProjectImageViewer } from "./ProjectImageViewer";

interface CaseStudyBlockRendererProps {
  blocks: CaseStudyBlock[];
  isPreview?: boolean;
}

const BG_CLASSES: Record<BlockBackground, string> = {
  default: "bg-transparent text-[#000000] dark:text-[#FAF8F5]",
  orange: "bg-[#F05A28] text-[#FAF8F5] p-6 sm:p-8 rounded-[0.75rem]",
  peach: "bg-[#FFD4C2] text-[#000000] p-6 sm:p-8 rounded-[0.75rem]",
  green: "bg-[#C4D94E] text-[#000000] p-6 sm:p-8 rounded-[0.75rem]",
  blue: "bg-[#A8D0F0] text-[#000000] p-6 sm:p-8 rounded-[0.75rem]",
  dark: "bg-[#1A1917] text-[#FAF8F5] p-6 sm:p-8 rounded-[0.75rem]",
};

function getMotionProps(preset: BlockMotionPreset, reduced: boolean | null) {
  if (reduced || preset === "none") return {};
  switch (preset) {
    case "fade":
      return {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: VIEWPORT_ONCE,
        transition: { duration: DURATION.medium, ease: EASINGS.gentle },
      };
    case "slide":
      return {
        initial: { opacity: 0, x: -24 },
        whileInView: { opacity: 1, x: 0 },
        viewport: VIEWPORT_ONCE,
        transition: { duration: DURATION.medium, ease: EASINGS.editorial },
      };
    case "scale":
      return {
        initial: { opacity: 0, scale: 0.94 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: VIEWPORT_ONCE,
        transition: SPRINGS.fluid,
      };
    case "clip":
      return {
        initial: { opacity: 0, clipPath: "inset(100% 0 0 0)" },
        whileInView: { opacity: 1, clipPath: "inset(0% 0 0 0)" },
        viewport: VIEWPORT_ONCE,
        transition: { duration: DURATION.slow, ease: EASINGS.expo },
      };
    default:
      return {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: VIEWPORT_ONCE,
        transition: { duration: DURATION.medium, ease: EASINGS.editorial },
      };
  }
}

function ImageComparison({
  beforeUrl,
  afterUrl,
  alt,
}: {
  beforeUrl: string;
  afterUrl: string;
  alt: string;
}) {
  const [pos, setPos] = useState(50);
  return (
    <div className="space-y-2">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#1A1917] select-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={afterUrl} alt={`${alt} after`} className="w-full h-full object-cover" />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={beforeUrl} alt={`${alt} before`} className="w-full h-full object-cover" />
        </div>
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-[#F05A28]"
          style={{ left: `${pos}%` }}
        />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Geser perbandingan gambar"
        className="w-full accent-[#F05A28] cursor-ew-resize"
      />
    </div>
  );
}

export function CaseStudyBlockRenderer({
  blocks,
  isPreview = false,
}: CaseStudyBlockRendererProps) {
  const prefersReduced = useReducedMotion();
  const visibleBlocks = isPreview ? blocks : blocks.filter((b) => b.visible !== false);

  if (visibleBlocks.length === 0) return null;

  return (
    <div className="space-y-10">
      {visibleBlocks.map((block) => {
        if (!block.visible && isPreview) {
          return (
            <div
              key={block.id}
              className="p-4 border border-dashed border-[#000000]/25 dark:border-[#FAF8F5]/25 opacity-50 font-mono text-xs"
            >
              [Tersembunyi] {block.title || block.type}
            </div>
          );
        }

        const bgClass = BG_CLASSES[block.background || "default"];
        const alignClass =
          block.align === "center"
            ? "text-center"
            : block.align === "right"
            ? "text-right"
            : "text-left";
        const motionProps = getMotionProps(block.motion, prefersReduced);

        return (
          <motion.section
            key={block.id}
            {...motionProps}
            className={`${bgClass} ${alignClass}`}
          >
            {/* Quote */}
            {block.type === "quote" && (
              <blockquote className="font-editorial italic text-2xl sm:text-3xl leading-snug">
                &ldquo;{block.content}&rdquo;
                {block.title && (
                  <footer className="mt-3 font-mono text-xs uppercase not-italic opacity-70">
                    {block.title}
                  </footer>
                )}
              </blockquote>
            )}

            {/* Code Snippet */}
            {block.type === "code_snippet" && (
              <div className="bg-[#1A1917] text-[#FAF8F5] p-5 rounded-[0.5rem] overflow-x-auto text-left">
                {block.title && (
                  <div className="font-mono text-[11px] text-[#C4D94E] uppercase mb-3">
                    {block.title}
                  </div>
                )}
                <pre className="font-mono text-xs leading-relaxed">
                  <code>{block.content}</code>
                </pre>
              </div>
            )}

            {/* Image / Full Image / Fullscreen Visual */}
            {(block.type === "image" ||
              block.type === "full_image" ||
              block.type === "fullscreen_visual") &&
              block.imageUrl && (
                <div className="space-y-3">
                  {block.title && (
                    <h3 className="font-editorial text-2xl">{block.title}</h3>
                  )}
                  <ProjectImageViewer
                    src={block.imageUrl}
                    alt={block.imageAlt || block.title || "Project visual"}
                  />
                  {block.content && (
                    <p className="font-mono text-xs opacity-75">{block.content}</p>
                  )}
                </div>
              )}

            {/* Image Comparison */}
            {block.type === "comparison" &&
              block.imageUrl &&
              block.secondaryImageUrl && (
                <div className="space-y-3">
                  {block.title && (
                    <h3 className="font-editorial text-2xl">{block.title}</h3>
                  )}
                  <ImageComparison
                    beforeUrl={block.imageUrl}
                    afterUrl={block.secondaryImageUrl}
                    alt={block.title || "Comparison"}
                  />
                </div>
              )}

            {/* Video Embed */}
            {block.type === "video" && block.videoUrl && (
              <div className="space-y-3">
                {block.title && (
                  <h3 className="font-editorial text-2xl">{block.title}</h3>
                )}
                <div className="aspect-video w-full bg-[#1A1917] overflow-hidden">
                  <iframe
                    src={block.videoUrl}
                    title={block.title || "Project video"}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Statistics / Multi-Column / Timeline / Gallery */}
            {(block.type === "statistics" ||
              block.type === "two_column" ||
              block.type === "three_column" ||
              block.type === "timeline" ||
              block.type === "gallery") && (
              <div className="space-y-4">
                {block.title && (
                  <h3 className="font-editorial text-2xl sm:text-3xl">{block.title}</h3>
                )}
                {block.content && (
                  <p className="font-body-editorial text-sm sm:text-base opacity-85">
                    {block.content}
                  </p>
                )}
                {block.items && block.items.length > 0 && (
                  <div
                    className={`grid gap-4 ${
                      block.type === "three_column" || block.type === "gallery"
                        ? "grid-cols-1 sm:grid-cols-3"
                        : block.type === "timeline"
                        ? "grid-cols-1"
                        : "grid-cols-1 sm:grid-cols-2"
                    }`}
                  >
                    {block.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 border border-current/15 rounded-[0.5rem] space-y-1"
                      >
                        {item.imageUrl && (
                          <div className="aspect-[16/10] w-full overflow-hidden bg-[#1A1917] mb-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.imageUrl}
                              alt={item.label}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        {item.value && (
                          <div className="font-editorial text-3xl text-[#F05A28]">
                            {item.value}
                          </div>
                        )}
                        <div className="font-mono text-xs uppercase">{item.label}</div>
                        {item.description && (
                          <p className="font-body-editorial text-xs opacity-80">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Call to Action */}
            {block.type === "cta" && (
              <div className="space-y-4">
                {block.title && (
                  <h3 className="font-editorial text-2xl sm:text-3xl">{block.title}</h3>
                )}
                {block.content && (
                  <p className="font-body-editorial text-sm sm:text-base opacity-85">
                    {block.content}
                  </p>
                )}
                {block.ctaUrl && (
                  <a
                    href={block.ctaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-[0.5rem] bg-[#1A1917] text-[#FAF8F5] font-mono text-xs uppercase tracking-wider"
                  >
                    <span>{block.ctaLabel || "Buka Tautan"}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}

            {/* Default Text / Narrative Blocks */}
            {![
              "quote",
              "code_snippet",
              "image",
              "full_image",
              "fullscreen_visual",
              "comparison",
              "video",
              "statistics",
              "two_column",
              "three_column",
              "timeline",
              "gallery",
              "cta",
            ].includes(block.type) && (
              <div className="space-y-3">
                {block.title && (
                  <h3 className="font-section-display text-2xl sm:text-3xl">
                    {block.title}
                  </h3>
                )}
                {block.content && (
                  <p className="font-body-editorial text-base leading-relaxed opacity-90 whitespace-pre-line">
                    {block.content}
                  </p>
                )}
              </div>
            )}
          </motion.section>
        );
      })}
    </div>
  );
}
