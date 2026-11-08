"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { VoxelCube3D } from "../pixel3d/VoxelCube3D";

interface FloatingVoxelProps {
  size?: number;
  color?: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export function FloatingVoxel({
  size = 36,
  color = "#C8F169",
  className = "",
  delay = 0,
  duration = 3,
}: FloatingVoxelProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <div className={className}>
        <VoxelCube3D size={size} color={color} />
      </div>
    );
  }

  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
        rotateZ: [0, 2, -2, 0],
      }}
      transition={{
        y: { repeat: Infinity, duration, delay, ease: "easeInOut" },
        rotateZ: { repeat: Infinity, duration: duration * 1.5, delay, ease: "easeInOut" },
      }}
      className={`inline-block select-none pointer-events-auto ${className}`}
    >
      <VoxelCube3D size={size} color={color} />
    </motion.div>
  );
}

