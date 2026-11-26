"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../editorial/ThemeContext";
import { SPRINGS } from "../motion/MotionSystem";
import { useMotionContext } from "../motion/MotionProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const prefersReduced = useReducedMotion();
  const { setCursor, resetCursor } = useMotionContext();
  const isDark = theme === "dark";

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={prefersReduced ? {} : { scale: 1.05 }}
      whileTap={prefersReduced ? {} : { scale: 0.92 }}
      onMouseEnter={() =>
        setCursor({
          active: true,
          text: isDark ? "LIGHT" : "DARK",
          variant: "hover",
        })
      }
      onMouseLeave={resetCursor}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-[0.5rem] bg-[#FFD4C2] dark:bg-[#252420] text-[#000000] dark:text-[#FAF8F5] font-mono text-[11px] uppercase tracking-[0.04em] cursor-pointer focus:outline-none"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={prefersReduced ? {} : { rotate: -45, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={prefersReduced ? {} : { rotate: 45, opacity: 0 }}
            transition={SPRINGS.snappy}
            className="inline-flex items-center gap-1.5"
          >
            <Moon className="w-3.5 h-3.5 text-[#C4D94E]" />
            <span>DARK</span>
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={prefersReduced ? {} : { rotate: 45, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={prefersReduced ? {} : { rotate: -45, opacity: 0 }}
            transition={SPRINGS.snappy}
            className="inline-flex items-center gap-1.5"
          >
            <Sun className="w-3.5 h-3.5 text-[#F05A28]" />
            <span>LIGHT</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
