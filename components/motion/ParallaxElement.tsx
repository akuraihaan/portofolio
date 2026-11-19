"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";

interface ParallaxElementProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // negative moves opposite, positive moves along scroll
  direction?: "vertical" | "horizontal";
}

export function ParallaxElement({
  children,
  className = "",
  speed = 0.2,
  direction = "vertical",
}: ParallaxElementProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const range = speed * 120;
  const rawTransform = useTransform(scrollYProgress, [0, 1], [-range, range]);
  const smoothTransform = useSpring(rawTransform, { stiffness: 300, damping: 25 });

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={`overflow-visible ${className}`}>
      <motion.div
        style={direction === "vertical" ? { y: smoothTransform } : { x: smoothTransform }}
      >
        {children}
      </motion.div>
    </div>
  );
}
