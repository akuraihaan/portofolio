/**
 * Fluid, Organic & Alive Motion System
 * Precision spring physics, custom cubic-bezier curves, and momentum-based animation tokens.
 */

export const EASINGS = {
  // Apple standard fluid deceleration
  apple: [0.25, 0.1, 0.25, 1.0] as const,
  // Natural fluid acceleration with long organic settling
  fluid: [0.22, 1, 0.36, 1] as const,
  // High-momentum organic curve for headlines and editorial entrances
  organic: [0.16, 1, 0.3, 1] as const,
  // Physical spring-like overshoot in bezier space
  elasticOvershoot: [0.34, 1.35, 0.64, 1] as const,
  // Smooth deceleration for modal backdrops and curtain reveals
  softSettle: [0.25, 1, 0.5, 1] as const,
  // Snappy response for buttons, toggles and active tabs
  snappy: [0.19, 1, 0.22, 1] as const,
  // Editorial entrance
  editorial: [0.16, 1, 0.3, 1] as const,
  cinematic: [0.16, 1, 0.3, 1] as const,
  gentle: [0.4, 0, 0.2, 1] as const,
};

export const SPRINGS = {
  // Responsive, fluid spring for cursor and magnetic elements
  magnetic: { type: "spring" as const, stiffness: 340, damping: 18, mass: 0.5 },
  // Smooth organic spring for card tilt and pointer reactions
  fluid: { type: "spring" as const, stiffness: 260, damping: 24, mass: 0.9 },
  // Heavy weighted spring with momentum for modals and floating objects
  heavy: { type: "spring" as const, stiffness: 180, damping: 26, mass: 1.3 },
  // Bouncy spring for micro-interactions and tags
  bouncy: { type: "spring" as const, stiffness: 380, damping: 16, mass: 0.7 },
  // Snappy spring for quick taps and active state indicators
  snappy: { type: "spring" as const, stiffness: 450, damping: 28, mass: 0.6 },
};

export const DURATION = {
  instant: 0.15,
  fast: 0.25,
  base: 0.38,
  normal: 0.5,
  medium: 0.65,
  slow: 0.85,
  deliberate: 1.15,
};

export const VARIANTS = {
  fluidFadeUp: {
    hidden: { opacity: 0, y: 24, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: DURATION.medium, ease: EASINGS.fluid },
    },
  },
  maskReveal: {
    hidden: { y: "105%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: { duration: DURATION.medium, ease: EASINGS.organic },
    },
  },
  staggerFluid: (stagger = 0.06, delay = 0.04) => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  }),
  cardHover: {
    rest: { scale: 1, y: 0, rotateZ: 0 },
    hover: {
      scale: 1.018,
      y: -6,
      transition: SPRINGS.fluid,
    },
    tap: {
      scale: 0.985,
      y: -2,
      transition: SPRINGS.snappy,
    },
  },
};
