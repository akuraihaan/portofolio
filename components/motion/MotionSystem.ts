/**
 * BWORIEY Ultra Motion System
 * Cinematic · Fluid · Organic · Expressive · Editorial
 *
 * Centralized motion configuration — the single source of truth
 * for every animation across the portfolio.
 */
import type { Variants, Transition } from "framer-motion";

// ─── EASING CURVES ────────────────────────────────────────────────
export const EASINGS = {
  // Apple fluid deceleration
  apple:            [0.25, 0.1, 0.25, 1.0] as const,
  // Natural organic deceleration (long settle)
  fluid:            [0.22, 1, 0.36, 1] as const,
  // High-momentum organic curve for headlines
  organic:          [0.16, 1, 0.3, 1] as const,
  // Editorial entrance — deliberate, measured
  editorial:        [0.16, 1, 0.3, 1] as const,
  // Cinematic — slow start, fast middle, controlled settle
  cinematic:        [0.4, 0, 0.1, 1] as const,
  // Elastic overshoot in bezier space
  elasticOvershoot: [0.34, 1.35, 0.64, 1] as const,
  // Smooth deceleration for modal backdrops
  softSettle:       [0.25, 1, 0.5, 1] as const,
  // Snappy response for micro-interactions
  snappy:           [0.19, 1, 0.22, 1] as const,
  // Gentle easing for subtle text reveals
  gentle:           [0.4, 0, 0.2, 1] as const,
  // Sharp entry for clip-path reveals
  clipReveal:       [0.76, 0, 0.24, 1] as const,
  // Expo-like dramatic deceleration
  expo:             [0.87, 0, 0.13, 1] as const,
} as const;

// ─── SPRING CONFIGURATIONS ────────────────────────────────────────
export const SPRINGS = {
  // Precision cursor tracking
  cursor:    { type: "spring" as const, stiffness: 920, damping: 38, mass: 0.3 },
  // Spring-based trailing follower
  follower:  { type: "spring" as const, stiffness: 200, damping: 22, mass: 0.8 },
  // Responsive magnetic spring for buttons / links
  magnetic:  { type: "spring" as const, stiffness: 340, damping: 18, mass: 0.5 },
  // 3D tilt physics for image cards
  tilt:      { type: "spring" as const, stiffness: 240, damping: 25, mass: 0.7 },
  // Smooth organic spring for card hover states
  fluid:     { type: "spring" as const, stiffness: 260, damping: 24, mass: 0.9 },
  // Heavy weighted spring with momentum for modals
  heavy:     { type: "spring" as const, stiffness: 180, damping: 26, mass: 1.3 },
  // Bouncy spring for micro-interactions and tags
  bouncy:    { type: "spring" as const, stiffness: 380, damping: 16, mass: 0.7 },
  // Snappy spring for quick taps and active indicators
  snappy:    { type: "spring" as const, stiffness: 450, damping: 28, mass: 0.6 },
  // Ultra-soft spring for page transitions
  page:      { type: "spring" as const, stiffness: 120, damping: 20, mass: 1.0 },
  // Responsive spring for nav / menu animations
  nav:       { type: "spring" as const, stiffness: 300, damping: 30, mass: 0.8 },
} as const;

// ─── DURATION TOKENS ─────────────────────────────────────────────
export const DURATION = {
  instant:    0.12,
  fast:       0.22,
  base:       0.35,
  normal:     0.5,
  medium:     0.65,
  slow:       0.85,
  deliberate: 1.1,
  cinematic:  1.5,
} as const;

// ─── TRANSITION PRESETS ───────────────────────────────────────────
export const TRANSITIONS: Record<string, Transition> = {
  // For fast UI feedback (button clicks, toggles)
  fastInteraction: {
    duration: DURATION.fast,
    ease: EASINGS.snappy,
  },
  // For editorial section entrances
  editorialReveal: {
    duration: DURATION.slow,
    ease: EASINGS.editorial,
  },
  // For dramatic hero choreography
  heroChoreography: {
    duration: DURATION.cinematic,
    ease: EASINGS.cinematic,
  },
  // For consistent page transitions
  pageTransition: {
    duration: DURATION.medium,
    ease: EASINGS.softSettle,
  },
  // For light hover micro-interactions
  hoverInteraction: {
    duration: DURATION.base,
    ease: EASINGS.fluid,
  },
  // For clip-path / mask reveals
  clipReveal: {
    duration: DURATION.slow,
    ease: EASINGS.clipReveal,
  },
  // Spring magnetic
  magnetic: SPRINGS.magnetic,
};

// ─── MOTION VARIANTS ──────────────────────────────────────────────

/** Fade up with slight scale — most common entrance */
export const fluidFadeUp: Variants = {
  hidden:  { opacity: 0, y: 32, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.medium, ease: EASINGS.fluid },
  },
};

/** Clip-path reveal from bottom — masks text overflow */
export const maskReveal: Variants = {
  hidden:  { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: DURATION.slow, ease: EASINGS.organic },
  },
};

/** Clip-path wipe from left */
export const clipLeft: Variants = {
  hidden:  { clipPath: "inset(0 100% 0 0)" },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: DURATION.slow, ease: EASINGS.clipReveal },
  },
};

/** Image reveal using clip-path from bottom */
export const imageReveal: Variants = {
  hidden:  { clipPath: "inset(100% 0 0 0)", scale: 1.08 },
  visible: {
    clipPath: "inset(0% 0 0 0)",
    scale: 1,
    transition: { duration: DURATION.cinematic, ease: EASINGS.expo },
  },
};

/** Stagger container — wraps staggered children */
export const staggerContainer = (stagger = 0.07, delay = 0): Variants => ({
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

/** Stagger item — child of staggerContainer */
export const staggerItem: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.medium, ease: EASINGS.editorial },
  },
};

/** Fade in only */
export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.medium, ease: EASINGS.gentle },
  },
};

/** Scale reveal */
export const scaleReveal: Variants = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.slow, ease: EASINGS.elasticOvershoot },
  },
};

/** Slide from right */
export const slideFromRight: Variants = {
  hidden:  { opacity: 0, x: 48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.medium, ease: EASINGS.editorial },
  },
};

/** Slide from left */
export const slideFromLeft: Variants = {
  hidden:  { opacity: 0, x: -48 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: DURATION.medium, ease: EASINGS.editorial },
  },
};

/** Page enter/exit */
export const pageVariants: Variants = {
  hidden: {
    opacity: 0,
    clipPath: "inset(100% 0 0 0)",
  },
  visible: {
    opacity: 1,
    clipPath: "inset(0% 0 0 0)",
    transition: { duration: DURATION.medium, ease: EASINGS.softSettle },
  },
  exit: {
    opacity: 0,
    clipPath: "inset(0 0 100% 0)",
    transition: { duration: DURATION.base, ease: EASINGS.snappy },
  },
};

/** Card hover state */
export const cardHover: Variants = {
  rest:  { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -6, transition: SPRINGS.fluid },
  tap:   { scale: 0.985, y: -2, transition: SPRINGS.snappy },
};

// ─── SCROLL UTILS ─────────────────────────────────────────────────
/** Standard viewport options for most reveal triggers */
export const VIEWPORT_ONCE = { once: true, margin: "-80px" } as const;
/** For important hero-adjacent elements */
export const VIEWPORT_PARTIAL = { once: true, margin: "-40px" } as const;
/** For timeline / scrolly items */
export const VIEWPORT_TIMELINE = { once: false, margin: "-100px" } as const;
