"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface FloatingObjectProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  amplitude?: number;
  rotateAmplitude?: number;
}

export function FloatingObject({
  children,
  className = "",
  delay = 0,
  duration = 3.5,
  amplitude = 10,
  rotateAmplitude = 4,
}: FloatingObjectProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      animate={{
        y: [-amplitude, amplitude, -amplitude],
        rotate: [-rotateAmplitude, rotateAmplitude, -rotateAmplitude],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay,
      }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
