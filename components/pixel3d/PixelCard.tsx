"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "lime" | "dark";
  interactive?: boolean;
  onClick?: () => void;
}

export function PixelCard({
  children,
  className = "",
  variant = "default",
  interactive = true,
  onClick,
}: PixelCardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 10 - 5;
    const y = ((e.clientY - rect.top) / rect.height) * 10 - 5;
    setRotate({ x: -y, y: x });
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setRotate({ x: 0, y: 0 });
  };

  const borderVariantClass =
    variant === "lime"
      ? "pixel-border-lime bg-white dark:bg-[#1C1F1A]"
      : variant === "dark"
      ? "border-2 border-[#171816] dark:border-[#C8F169] bg-[#171816] text-[#F4F3EE] shadow-pixel dark:shadow-pixel-lime"
      : "pixel-border bg-white dark:bg-[#171A1F]";

  return (
    <motion.div
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative p-6 transition-all duration-200 ${
        interactive
          ? "hover:-translate-x-0.5 hover:-translate-y-0.5 cursor-pointer"
          : ""
      } ${borderVariantClass} ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Corner Pixel Notches */}
      <span className="absolute top-1 left-1 w-1.5 h-1.5 bg-[#171816] dark:bg-[#C8F169] pointer-events-none" />
      <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#171816] dark:bg-[#C8F169] pointer-events-none" />
      <span className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-[#171816] dark:bg-[#C8F169] pointer-events-none" />
      <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-[#171816] dark:bg-[#C8F169] pointer-events-none" />

      {children}
    </motion.div>
  );
}

