"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { AnimatedUnderline } from "../motion/AnimatedUnderline";
import { EASINGS, DURATION, VIEWPORT_ONCE } from "../motion/MotionSystem";

interface FooterProps {
  ownerName?: string;
  ownerEmail?: string;
}

// Scattered pink & green ASCII sprites for the Dark Digital Garden Footer
const GARDEN_SPRITES = [
  { art: "✿", color: "#FF8AD8", left: "4%", top: "14%" },
  { art: "(•‿•)", color: "#C4D94E", left: "14%", top: "58%" },
  { art: "✦", color: "#C4D94E", left: "22%", top: "24%" },
  { art: "ᗢ", color: "#FF8AD8", left: "31%", top: "72%" },
  { art: "✳", color: "#C4D94E", left: "40%", top: "30%" },
  { art: "(=^･ω･^=)", color: "#FF8AD8", left: "49%", top: "64%" },
  { art: "❦", color: "#C4D94E", left: "58%", top: "18%" },
  { art: "✿", color: "#FF8AD8", left: "67%", top: "76%" },
  { art: "~≈~", color: "#C4D94E", left: "75%", top: "36%" },
  { art: "✦", color: "#FF8AD8", left: "84%", top: "62%" },
  { art: "(•‿•)", color: "#C4D94E", left: "92%", top: "22%" },
  { art: "✳", color: "#FF8AD8", left: "10%", top: "82%" },
  { art: "❦", color: "#C4D94E", left: "62%", top: "48%" },
  { art: "✿", color: "#C4D94E", left: "88%", top: "84%" },
];

/**
 * Footer — Dark Digital Garden Footer (#1A1917) per DESIGN.md:
 * - Left column: poetic personal statement in large italic serif
 * - Middle column: contact links
 * - Right column: page navigation
 * - Lower area: glowing pink & green ASCII sprite field
 */
export function Footer({
  ownerName = "Taufik Raihandani",
  ownerEmail = "raihandani270204@gmail.com",
}: FooterProps) {
  const prefersReduced = useReducedMotion();

  return (
    <footer className="w-full bg-[#1A1917] text-[#FAF8F5] pt-24 pb-12 px-6 sm:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Three-Column Top Area */}
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: DURATION.slow, ease: EASINGS.editorial }}
          className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-20"
        >
          {/* Left Column (6 cols): Poetic Statement in Large Italic Serif */}
          <div className="md:col-span-6 pr-0 md:pr-12 space-y-4">
            <p className="font-editorial italic text-[clamp(1.75rem,3.4vw,2.6rem)] leading-[1.2] text-[#FAF8F5]">
              &ldquo;Merancang perangkat lunak yang rapi, ringan, dan menyenangkan untuk dijelajahi.&rdquo;
            </p>
            <p className="font-mono text-xs text-[#FAF8F5]/55 uppercase tracking-[0.05em]">
              bworiey · {ownerName} · Banjarmasin
            </p>
          </div>

          {/* Middle Column (3 cols): Contact Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#C4D94E] block mb-4">
              CONTACT
            </span>
            <ul className="space-y-2.5 font-mono text-xs uppercase tracking-[0.03em]">
              <li>
                <a href={`mailto:${ownerEmail}`} className="hover:text-[#F05A28] transition-colors">
                  <AnimatedUnderline color="#F05A28">{ownerEmail}</AnimatedUnderline>
                </a>
              </li>
              <li>
                <a href="https://github.com/bworiey" target="_blank" rel="noreferrer" className="hover:text-[#F05A28] transition-colors">
                  <AnimatedUnderline color="#F05A28">GitHub</AnimatedUnderline>
                </a>
              </li>
              <li>
                <a href="https://linkedin.com/in/taufik-raihandani" target="_blank" rel="noreferrer" className="hover:text-[#F05A28] transition-colors">
                  <AnimatedUnderline color="#F05A28">LinkedIn</AnimatedUnderline>
                </a>
              </li>
              <li>
                <a href="https://instagram.com/bworiey" target="_blank" rel="noreferrer" className="hover:text-[#F05A28] transition-colors">
                  <AnimatedUnderline color="#F05A28">Instagram</AnimatedUnderline>
                </a>
              </li>
            </ul>
          </div>

          {/* Right Column (3 cols): Page Navigation */}
          <div className="md:col-span-3 space-y-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[#FF8AD8] block mb-4">
              PAGES
            </span>
            <ul className="space-y-2.5 font-mono text-xs uppercase tracking-[0.03em]">
              {[
                { label: "About", href: "/#about" },
                { label: "Playground", href: "/#playground" },
                { label: "Skills", href: "/#skills" },
                { label: "Experience", href: "/#experience" },
                { label: "Certificates", href: "/#certificates" },
                { label: "Contact", href: "/#contact" },
                { label: "Admin CMS", href: "/admin" },
              ].map((nav) => (
                <li key={nav.label}>
                  <Link href={nav.href} className="hover:text-[#C4D94E] transition-colors">
                    <AnimatedUnderline color="#C4D94E">{nav.label}</AnimatedUnderline>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Lower Two-Thirds Area: Glowing Pink & Green ASCII Sprite Field */}
        <div
          aria-hidden="true"
          className="relative h-44 sm:h-56 w-full border-t border-[#FAF8F5]/10 select-none"
        >
          {GARDEN_SPRITES.map((sp, i) => (
            <motion.span
              key={i}
              initial={prefersReduced ? { opacity: 0.85 } : { opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 0.9, scale: 1 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.5, delay: i * 0.04, ease: EASINGS.editorial }}
              style={{ color: sp.color, left: sp.left, top: sp.top }}
              className={`absolute font-mono text-xs sm:text-sm ${
                i > 4 ? "hidden sm:inline-block" : "inline-block"
              }`}
            >
              {sp.art}
            </motion.span>
          ))}
        </div>

        {/* Bottom Copyright + Back to Top */}
        <div className="pt-6 border-t border-[#FAF8F5]/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#FAF8F5]/55">
          <span>© {new Date().getFullYear()} bworiey · {ownerName}</span>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 text-[#C4D94E] hover:text-[#F05A28] uppercase tracking-wider cursor-pointer transition-colors"
          >
            <span>Kembali ke atas</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
