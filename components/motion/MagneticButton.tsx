"use client";

import React, { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SPRINGS } from "./MotionSystem";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  variant?: "primary" | "secondary" | "lime";
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function MagneticButton({
  children,
  className = "",
  strength = 0.35,
  onClick,
  href,
  target,
  rel,
  ariaLabel,
  onMouseEnter,
  onMouseLeave,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const prefersReduced = useReducedMotion();

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    setPos({
      x: (e.clientX - (left + width / 2)) * strength,
      y: (e.clientY - (top + height / 2)) * strength,
    });
  };

  const handleLeave = () => {
    setPos({ x: 0, y: 0 });
    onMouseLeave?.();
  };

  const content = (
    <motion.div
      ref={ref}
      animate={{ x: pos.x, y: pos.y }}
      transition={SPRINGS.magnetic}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseEnter={onMouseEnter}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target={target} rel={rel} onClick={onClick} aria-label={ariaLabel} className="inline-block text-inherit no-underline">
        {content}
      </a>
    );
  }

  return (
    <div onClick={onClick} className="inline-block cursor-pointer">
      {content}
    </div>
  );
}
