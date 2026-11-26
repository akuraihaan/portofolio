"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SPRINGS } from "./MotionSystem";
import { useMotionContext } from "./MotionProvider";

interface MotionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  cursorLabel?: string;
}

export function MotionLink({
  href,
  children,
  className = "",
  external = false,
  cursorLabel,
}: MotionLinkProps) {
  const prefersReduced = useReducedMotion();
  const { setCursor, resetCursor } = useMotionContext();

  const inner = (
    <motion.span
      whileHover={prefersReduced ? {} : { y: -1 }}
      whileTap={prefersReduced ? {} : { scale: 0.97 }}
      transition={SPRINGS.snappy}
      onMouseEnter={() =>
        setCursor(
          cursorLabel
            ? { active: true, text: cursorLabel, variant: "link" }
            : { active: true, variant: "link" }
        )
      }
      onMouseLeave={resetCursor}
      className={`inline-flex items-center gap-1.5 ${className}`}
    >
      {children}
    </motion.span>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="inline-block">
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className="inline-block">
      {inner}
    </Link>
  );
}
