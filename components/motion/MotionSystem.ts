/**
 * BWORIEY Global Motion System
 * Reusable motion tokens, spring presets, easings, and animation variants.
 */

import { type Transition, type Variants } from "framer-motion";

// ── Duration Tokens ──────────────────────────────────────────────
export const DURATION = {
  fast: 0.2,
  normal: 0.45,
  slow: 0.75,
  cinematic: 1.1,
} as const;

// ── Easings ───────────────────────────────────────────────────────
export const EASINGS = {
  editorial: [0.16, 1, 0.3, 1] as const,
  cinematic: [0.76, 0, 0.24, 1] as const,
  decel: [0.25, 1, 0.5, 1] as const,
  smooth: [0.33, 1, 0.68, 1] as const,
};

// ── Spring Presets ────────────────────────────────────────────────
export const SPRINGS: Record<string, Transition> = {
  soft: { type: "spring", stiffness: 100, damping: 20 },
  smooth: { type: "spring", stiffness: 200, damping: 28 },
  snappy: { type: "spring", stiffness: 350, damping: 25 },
  heavy: { type: "spring", stiffness: 150, damping: 30, mass: 1.2 },
  elastic: { type: "spring", stiffness: 400, damping: 15 },
};

// ── Reusable Transition Presets ───────────────────────────────────
export const TRANSITIONS = {
  default: { duration: DURATION.normal, ease: EASINGS.editorial },
  fast: { duration: DURATION.fast, ease: EASINGS.editorial },
  slow: { duration: DURATION.slow, ease: EASINGS.cinematic },
  cinematic: { duration: DURATION.cinematic, ease: EASINGS.cinematic },
  springSmooth: SPRINGS.smooth,
  springSnappy: SPRINGS.snappy,
  springHeavy: SPRINGS.heavy,
};

// ── Animation Variants ───────────────────────────────────────────
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASINGS.editorial,
      delay: typeof custom === "number" ? custom : 0,
    },
  }),
};

export const fadeScaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (custom = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATION.normal,
      ease: EASINGS.editorial,
      delay: typeof custom === "number" ? custom : 0,
    },
  }),
};

export const maskRevealVariants: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: (custom = 0) => ({
    y: "0%",
    opacity: 1,
    transition: {
      duration: DURATION.slow,
      ease: EASINGS.cinematic,
      delay: typeof custom === "number" ? custom : 0,
    },
  }),
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (staggerDelay = 0.08) => ({
    opacity: 1,
    transition: {
      staggerChildren: typeof staggerDelay === "number" ? staggerDelay : 0.08,
      delayChildren: 0.05,
    },
  }),
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.normal,
      ease: EASINGS.editorial,
    },
  },
};

export const clipPathRevealVariants: Variants = {
  hidden: { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
  visible: (custom = 0) => ({
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    transition: {
      duration: DURATION.slow,
      ease: EASINGS.cinematic,
      delay: typeof custom === "number" ? custom : 0,
    },
  }),
};

