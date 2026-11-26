"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SPRINGS } from "./MotionSystem";

interface SpringCardProps {
  children: React.ReactNode;
  className?: string;
  rotate?: number;
  hoverRotate?: number;
}

export function SpringCard({
  children,
  className = "",
  rotate = 0,
  hoverRotate = 0,
}: SpringCardProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={{ rotate }}
      whileHover={prefersReduced ? {} : { y: -4, rotate: hoverRotate }}
      whileTap={prefersReduced ? {} : { scale: 0.985 }}
      transition={SPRINGS.fluid}
      className={className}
    >
      {children}
    </motion.div>
  );
}
