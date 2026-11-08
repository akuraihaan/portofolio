"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface Voxel {
  x: number;
  y: number;
  z: number;
  color: string;
}

interface VoxelCanvasProps {
  className?: string;
  size?: number;
}

export function VoxelCanvas({ className = "", size = 420 }: VoxelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReduced = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;
    let floatOffset = 0;

    // Define 3D voxel model: A futuristic retro workstation & monogram emblem
    // Coords: x (left-right), y (depth), z (height/up)
    const voxels: Voxel[] = [
      // Base platform (Dark charcoal/slate voxels)
      { x: -2, y: -2, z: 0, color: "#1C1F1A" },
      { x: -1, y: -2, z: 0, color: "#2A2E27" },
      { x: 0, y: -2, z: 0, color: "#1C1F1A" },
      { x: 1, y: -2, z: 0, color: "#2A2E27" },
      { x: 2, y: -2, z: 0, color: "#1C1F1A" },
      { x: -2, y: -1, z: 0, color: "#2A2E27" },
      { x: -1, y: -1, z: 0, color: "#1C1F1A" },
      { x: 0, y: -1, z: 0, color: "#2A2E27" },
      { x: 1, y: -1, z: 0, color: "#1C1F1A" },
      { x: 2, y: -1, z: 0, color: "#2A2E27" },
      { x: -2, y: 0, z: 0, color: "#1C1F1A" },
      { x: -1, y: 0, z: 0, color: "#2A2E27" },
      { x: 0, y: 0, z: 0, color: "#C8F169" }, // Center accent core
      { x: 1, y: 0, z: 0, color: "#2A2E27" },
      { x: 2, y: 0, z: 0, color: "#1C1F1A" },
      { x: -2, y: 1, z: 0, color: "#2A2E27" },
      { x: -1, y: 1, z: 0, color: "#1C1F1A" },
      { x: 0, y: 1, z: 0, color: "#2A2E27" },
      { x: 1, y: 1, z: 0, color: "#1C1F1A" },
      { x: 2, y: 1, z: 0, color: "#2A2E27" },
      { x: -2, y: 2, z: 0, color: "#1C1F1A" },
      { x: -1, y: 2, z: 0, color: "#2A2E27" },
      { x: 0, y: 2, z: 0, color: "#1C1F1A" },
      { x: 1, y: 2, z: 0, color: "#2A2E27" },
      { x: 2, y: 2, z: 0, color: "#1C1F1A" },

      // Pillar pedestal
      { x: 0, y: 0, z: 1, color: "#2A2E27" },
      { x: 0, y: 0, z: 2, color: "#1C1F1A" },

      // Floating BWORIEY 'B' / 'T' Monogram Block Structure
      { x: -1, y: -1, z: 4, color: "#C8F169" },
      { x: 0, y: -1, z: 4, color: "#C8F169" },
      { x: 1, y: -1, z: 4, color: "#C8F169" },
      { x: 0, y: 0, z: 4, color: "#C8F169" },
      { x: 0, y: 0, z: 5, color: "#C8F169" },
      { x: 0, y: 0, z: 6, color: "#C8F169" },
      { x: -1, y: 0, z: 6, color: "#C8F169" },
      { x: 1, y: 0, z: 6, color: "#C8F169" },
      { x: 0, y: 1, z: 6, color: "#E9E8E1" },

      // Floating Satellite Orbit Voxels
      { x: -2, y: 2, z: 5, color: "#38BDF8" }, // Retro Cyan Voxel
      { x: 2, y: -2, z: 4, color: "#F4F3EE" }, // Ivory Voxel
      { x: 2, y: 2, z: 2, color: "#C8F169" },  // Lime Voxel
      { x: -2, y: -2, z: 3, color: "#38BDF8" },
    ];

    // Helper: shade hex color
    const adjustColor = (color: string, percent: number) => {
      let num = parseInt(color.replace("#", ""), 16);
      if (isNaN(num)) num = 0xc8f169;
      let r = (num >> 16) + percent;
      let g = ((num >> 8) & 0x00ff) + percent;
      let b = (num & 0x0000ff) + percent;
      r = Math.min(255, Math.max(0, r));
      g = Math.min(255, Math.max(0, g));
      b = Math.min(255, Math.max(0, b));
      return `rgb(${r},${g},${b})`;
    };

    // Isometric projection calculation
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2 + 25;
      const voxelSize = Math.max(16, Math.floor(width / 24));

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      if (!prefersReduced) {
        angle += 0.012;
        floatOffset = Math.sin(angle * 1.5) * 8;
      }

      const currentAngle = angle + mouseRef.current.x * 0.6;
      const tiltAngle = 0.55 + mouseRef.current.y * 0.25;

      // Transform & sort voxels back-to-front (Painter's algorithm)
      const cosA = Math.cos(currentAngle);
      const sinA = Math.sin(currentAngle);

      const transformed = voxels.map((v) => {
        // Rotate around Z-axis
        const rotX = v.x * cosA - v.y * sinA;
        const rotY = v.x * sinA + v.y * cosA;
        const rotZ = v.z;

        // Isometric screen coordinates
        const isoX = (rotX - rotY) * (voxelSize * 1.15);
        const isoY = (rotX + rotY) * (voxelSize * 0.58 * tiltAngle) - rotZ * (voxelSize * 1.15) - floatOffset;
        const depth = rotX + rotY + rotZ * 1.5;

        return { ...v, isoX, isoY, depth };
      });

      // Sort by depth so furthest is drawn first
      transformed.sort((a, b) => a.depth - b.depth);

      // Draw isometric grid plane under the model
      ctx.save();
      ctx.strokeStyle = "rgba(200, 241, 105, 0.15)";
      ctx.lineWidth = 1;
      const gridRadius = 5;
      for (let gx = -gridRadius; gx <= gridRadius; gx++) {
        const x1 = (gx * cosA - -gridRadius * sinA) * (voxelSize * 1.15) + centerX;
        const y1 = (gx * sinA + -gridRadius * cosA) * (voxelSize * 0.58 * tiltAngle) + centerY;
        const x2 = (gx * cosA - gridRadius * sinA) * (voxelSize * 1.15) + centerX;
        const y2 = (gx * sinA + gridRadius * cosA) * (voxelSize * 0.58 * tiltAngle) + centerY;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.restore();

      // Render each voxel
      transformed.forEach((v) => {
        const sx = centerX + v.isoX;
        const sy = centerY + v.isoY;
        const s = voxelSize;
        const halfW = s * 0.866;
        const halfH = s * 0.5;

        const baseColor = v.color;
        const topColor = adjustColor(baseColor, 35);
        const leftColor = adjustColor(baseColor, -15);
        const rightColor = adjustColor(baseColor, -45);

        // Top Face
        ctx.fillStyle = topColor;
        ctx.beginPath();
        ctx.moveTo(sx, sy - s);
        ctx.lineTo(sx + halfW, sy - halfH);
        ctx.lineTo(sx, sy);
        ctx.lineTo(sx - halfW, sy - halfH);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.4)";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Left Face
        ctx.fillStyle = leftColor;
        ctx.beginPath();
        ctx.moveTo(sx - halfW, sy - halfH);
        ctx.lineTo(sx, sy);
        ctx.lineTo(sx, sy + s);
        ctx.lineTo(sx - halfW, sy + halfH);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right Face
        ctx.fillStyle = rightColor;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + halfW, sy - halfH);
        ctx.lineTo(sx + halfW, sy + halfH);
        ctx.lineTo(sx, sy + s);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Mouse tracking for 3D tilt
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouseRef.current.targetX = Math.max(-1, Math.min(1, nx));
      mouseRef.current.targetY = Math.max(-1, Math.min(1, ny));
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [prefersReduced]);

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="w-full max-w-[420px] aspect-square block cursor-grab active:cursor-grabbing transition-transform duration-300"
        style={{
          filter: isHovered
            ? "drop-shadow(0 15px 25px rgba(200, 241, 105, 0.25))"
            : "drop-shadow(0 10px 15px rgba(0, 0, 0, 0.15))",
        }}
      />
      {/* Retro Coordinate Overlay Badge */}
      <div className="absolute bottom-2 left-2 bg-[#171816]/90 dark:bg-[#111310]/90 backdrop-blur-md px-2.5 py-1 rounded border border-[#C8F169]/40 font-pixel text-[8px] text-[#C8F169] tracking-wider pointer-events-none">
        VOXEL // 3D MATRIX · 60FPS
      </div>
    </div>
  );
}

