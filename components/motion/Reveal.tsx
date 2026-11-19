"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASINGS } from "./MotionSystem";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  mode?: "fade" | "clip" | "slide";
  delay?: number;
  duration?: number;
  once?: boolean;
}

export function Reveal({
  children,
  className = "",
  direction = "up",
  mode = "fade",
  delay = 0,
  duration = 0.55,
  once = true,
}: RevealProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const offset = 28;
  const initialOffset = {
    up: { y: offset },
    down: { y: -offset },
    left: { x: offset },
    right: { x: -offset },
    none: {},
  }[direction];

  if (mode === "clip") {
    return (
      <div className={`overflow-hidden ${className}`}>
        <motion.div
          initial={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)", opacity: 0 }}
          whileInView={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1 }}
          viewport={{ once, margin: "-60px" }}
          transition={{ duration, delay, ease: EASINGS.editorial }}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...initialOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration, delay, ease: EASINGS.editorial }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
