"use client";

import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface PixelRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

/**
 * PixelReveal guarantees that server-rendered HTML is 100% visible immediately,
 * eliminating empty-page flashes. On client mount, it applies a subtle fluid lift.
 */
export function PixelReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: PixelRevealProps) {
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and initial paint, render plain visible DOM with zero opacity:0 style
  if (prefersReduced || !mounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0.85, y: direction === "up" ? 10 : 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: Math.min(delay, 0.15),
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
