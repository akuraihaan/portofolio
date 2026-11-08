"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface VoxelCube3DProps {
  size?: number;
  color?: string;
  className?: string;
  interactive?: boolean;
}

export function VoxelCube3D({
  size = 48,
  color = "#C8F169",
  className = "",
  interactive = true,
}: VoxelCube3DProps) {
  const [rotate, setRotate] = useState({ x: -25, y: 45 });
  const half = size / 2;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 40 - 20;
    const y = ((e.clientY - rect.top) / rect.height) * 40 - 20;
    setRotate({ x: -25 - y, y: 45 + x });
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setRotate({ x: -25, y: 45 });
  };

  return (
    <div
      className={`perspective-800 inline-block select-none ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ width: size, height: size }}
    >
      <motion.div
        animate={{ rotateX: rotate.x, rotateY: rotate.y }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="preserve-3d relative w-full h-full cursor-pointer"
        style={{ transformOrigin: "center center" }}
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 border border-black/40 bg-[#C8F169]"
          style={{
            transform: `translateZ(${half}px)`,
            backgroundColor: color,
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.15)",
          }}
        />

        {/* Back Face */}
        <div
          className="absolute inset-0 border border-black/40 bg-[#171816]"
          style={{
            transform: `rotateY(180deg) translateZ(${half}px)`,
            backgroundColor: "#171816",
          }}
        />

        {/* Left Face (Shadowed) */}
        <div
          className="absolute inset-0 border border-black/40 bg-[#1C1F1A]"
          style={{
            transform: `rotateY(-90deg) translateZ(${half}px)`,
            filter: "brightness(0.75)",
            backgroundColor: color,
          }}
        />

        {/* Right Face (Mid-tone) */}
        <div
          className="absolute inset-0 border border-black/40 bg-[#2A2E27]"
          style={{
            transform: `rotateY(90deg) translateZ(${half}px)`,
            filter: "brightness(0.6)",
            backgroundColor: color,
          }}
        />

        {/* Top Face (Highlight) */}
        <div
          className="absolute inset-0 border border-black/40"
          style={{
            transform: `rotateX(90deg) translateZ(${half}px)`,
            filter: "brightness(1.2)",
            backgroundColor: color,
          }}
        />

        {/* Bottom Face */}
        <div
          className="absolute inset-0 border border-black/40 bg-black/80"
          style={{
            transform: `rotateX(-90deg) translateZ(${half}px)`,
            backgroundColor: "#0E1013",
          }}
        />
      </motion.div>
    </div>
  );
}

