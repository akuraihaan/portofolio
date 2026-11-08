/**
 * Apple-Inspired Motion System
 * Refined, natural interface transitions with organic deceleration curves.
 */

export const EASINGS = {
  // Apple standard fluid deceleration
  apple: [0.25, 0.1, 0.25, 1.0] as const,
  // Smooth editorial curve for headlines and hero transitions
  editorial: [0.16, 1, 0.3, 1] as const,
  cinematic: [0.16, 1, 0.3, 1] as const,
  // Gentle curve for opacity and subtle hover states
  gentle: [0.4, 0, 0.2, 1] as const,
  // Snappy curve for buttons, badges, and quick toggles
  snappy: [0.2, 0.8, 0.2, 1] as const,
};

export const DURATION = {
  instant: 0.15,
  fast: 0.25,
  base: 0.4,
  normal: 0.5,
  medium: 0.6,
  slow: 0.8,
  deliberate: 1.1,
};

export const VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: DURATION.base, ease: EASINGS.gentle },
    },
  },
  fadeUp: {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION.medium, ease: EASINGS.editorial },
    },
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.04,
      },
    },
  },
};
