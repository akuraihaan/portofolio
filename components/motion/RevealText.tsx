"use client";

/**
 * RevealText — overflow-masked text reveal using SplitText or simple fade
 */
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASINGS, DURATION } from "./MotionSystem";

interface RevealTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}

export function RevealText({ children, className = "", delay = 0, once = true }: RevealTextProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={`inline-block overflow-hidden ${className}`}>
      <motion.span
        className="inline-block"
        initial={{ y: "105%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once, margin: "-40px" }}
        transition={{ duration: DURATION.medium, ease: EASINGS.organic, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}
