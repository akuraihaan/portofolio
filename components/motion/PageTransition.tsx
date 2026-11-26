"use client";

/**
 * PageTransition — route-aware clip-path page transition wrapper.
 */
import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { EASINGS, DURATION } from "./MotionSystem";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  /** key must change between routes for AnimatePresence to detect exit */
  pageKey?: string;
}

export function PageTransition({ children, className = "", pageKey }: PageTransitionProps) {
  const prefersReduced = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        className={className}
        initial={
          prefersReduced
            ? { opacity: 0 }
            : { opacity: 0, clipPath: "inset(100% 0 0 0)" }
        }
        animate={
          prefersReduced
            ? { opacity: 1 }
            : { opacity: 1, clipPath: "inset(0% 0 0 0)" }
        }
        exit={
          prefersReduced
            ? { opacity: 0 }
            : { opacity: 0, clipPath: "inset(0 0 100% 0)" }
        }
        transition={{ duration: DURATION.medium, ease: EASINGS.softSettle }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
