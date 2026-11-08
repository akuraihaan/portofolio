"use client";

import React, { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "lime";
  href?: string;
  target?: string;
  rel?: string;
}

export function MagneticButton({
  children,
  className = "",
  onClick,
  variant = "primary",
  href,
  target,
  rel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const prefersReduced = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.15, y: middleY * 0.15 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const variantClass =
    variant === "lime"
      ? "bg-[#C8F169] text-[#171816] border-2 border-[#171816] shadow-pixel hover:shadow-pixel-lg"
      : variant === "secondary"
      ? "bg-white dark:bg-[#1C1F1A] text-[#171816] dark:text-[#F4F3EE] border-2 border-[#171816] dark:border-[#C8F169] shadow-pixel dark:shadow-pixel-lime hover:shadow-pixel-lg"
      : "bg-[#171816] text-[#F4F3EE] dark:bg-[#C8F169] dark:text-[#171816] border-2 border-[#171816] dark:border-[#C8F169] shadow-pixel dark:shadow-pixel-lime hover:shadow-pixel-lg";

  const content = (
    <motion.div
      ref={ref}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      className="inline-block"
    >
      <div
        className={`px-5 py-3 font-pixel text-[10px] tracking-wider uppercase transition-all duration-100 active:translate-x-1 active:translate-y-1 active:shadow-none select-none flex items-center justify-center gap-2 ${variantClass} ${className}`}
      >
        {children}
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        className="inline-block no-underline"
      >
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} type="button" className="inline-block bg-transparent p-0 border-0 cursor-pointer">
      {content}
    </button>
  );
}

