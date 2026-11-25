"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const MARQUEE_ITEMS = [
  "WEB DEVELOPMENT",
  "UI/UX ARCHITECTURE",
  "EDUCATIONAL TECHNOLOGY",
  "CLOUD COMPUTING",
  "LEARNING ANALYTICS",
  "NEXT.JS & TYPESCRIPT",
  "BANGKIT ALUMNUS",
  "POSTGRESQL & SUPABASE",
  "PEDAGOGI KOMPUTASI",
];

export function ContemporaryMarquee() {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) return null;

  return (
    <div className="w-full overflow-hidden py-4 border-y border-black/[0.08] dark:border-white/[0.1] bg-black/[0.015] dark:bg-white/[0.015] select-none">
      <div className="flex items-center whitespace-nowrap">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-8 font-mono text-xs uppercase tracking-[0.25em] text-[#71717A] dark:text-[#A1A1AA] font-semibold"
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
            <span key={idx} className="flex items-center gap-8">
              <span className="hover:text-[#121214] dark:hover:text-[#F4F4F6] transition-colors">
                {item}
              </span>
              <span className="text-[#2563EB] dark:text-[#C8F169] font-bold">✦</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
