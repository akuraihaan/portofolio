"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASINGS, DURATION, VIEWPORT_ONCE } from "./MotionSystem";

interface AnimatedSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export function AnimatedSection({ children, id, className = "" }: AnimatedSectionProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.section
      id={id}
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: DURATION.slow, ease: EASINGS.editorial }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
