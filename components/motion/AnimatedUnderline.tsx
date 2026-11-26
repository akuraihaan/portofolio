"use client";

/**
 * AnimatedUnderline — hover-triggered underline that draws with spring.
 */
import React, { useState } from "react";
import { motion } from "framer-motion";

interface AnimatedUnderlineProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  thickness?: number;
}

export function AnimatedUnderline({
  children,
  className = "",
  color = "#D1FF00",
  thickness = 1.5,
}: AnimatedUnderlineProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      <motion.span
        className="absolute left-0 bottom-0 w-full origin-left block"
        style={{ height: thickness, backgroundColor: color }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    </span>
  );
}
