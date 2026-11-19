"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function Brutalist3DMesh() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReduced) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let isVisible = true;

    // Set canvas dimensions
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // 3D Geometry: Truncated Icosahedron / Geodesic Cube Vertices
    const phi = (1 + Math.sqrt(5)) / 2;
    const rawVertices = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
    ];

    // Normalize and scale vertices
    const radius = 80;
    const vertices = rawVertices.map(([x, y, z]) => {
      const len = Math.sqrt(x * x + y * y + z * z);
      return [(x / len) * radius, (y / len) * radius, (z / len) * radius];
    });

    // Edges
    const edges: [number, number][] = [];
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const [x1, y1, z1] = vertices[i];
        const [x2, y2, z2] = vertices[j];
        const dist = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2);
        if (dist < radius * 1.15) {
          edges.push([i, j]);
        }
      }
    }

    // Rotation state
    let angleX = 0.4;
    let angleY = 0.6;
    let targetSpeedX = 0.006;
    let targetSpeedY = 0.009;
    let currentSpeedX = 0.006;
    let currentSpeedY = 0.009;

    let mouseX = 0;
    let mouseY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      mouseX = x;
      mouseY = y;
      targetSpeedX = y * 0.025;
      targetSpeedY = x * 0.025;
    };

    const handleClick = () => {
      // Impulse burst spin
      currentSpeedX += (Math.random() - 0.5) * 0.15;
      currentSpeedY += (Math.random() - 0.5) * 0.15;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    canvas.addEventListener("click", handleClick);

    // Pause when out of screen view
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    // Render loop
    const render = () => {
      if (isVisible) {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const centerX = width / 2;
        const centerY = height / 2;

        ctx.clearRect(0, 0, width, height);

        // Interpolate speed
        currentSpeedX += (targetSpeedX - currentSpeedX) * 0.05;
        currentSpeedY += (targetSpeedY - currentSpeedY) * 0.05;
        angleX += currentSpeedX + 0.004;
        angleY += currentSpeedY + 0.006;

        // Rotation matrix calculations
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);

        const projected: { x: number; y: number; z: number }[] = [];

        for (const [vx, vy, vz] of vertices) {
          // Rotate around Y
          const x1 = vx * cosY + vz * sinY;
          const y1 = vy;
          const z1 = -vx * sinY + vz * cosY;

          // Rotate around X
          const x2 = x1;
          const y2 = y1 * cosX - z1 * sinX;
          const z2 = y1 * sinX + z1 * cosX;

          // Perspective projection
          const fov = 300;
          const scale = fov / (fov + z2 + 100);
          projected.push({
            x: centerX + x2 * scale,
            y: centerY + y2 * scale,
            z: z2,
          });
        }

        // Draw edges (Neo-Brutalist Thick Wireframe)
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "#0A0A0A";

        for (const [i, j] of edges) {
          const p1 = projected[i];
          const p2 = projected[j];
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }

        // Draw vertex nodes (Acid Yellow & Electric Orange Dots)
        for (let i = 0; i < projected.length; i++) {
          const p = projected[i];
          const size = p.z > 0 ? 5 : 3.5;

          ctx.fillStyle = i % 2 === 0 ? "#FFE500" : "#FF5C00";
          ctx.strokeStyle = "#000";
          ctx.lineWidth = 1.5;

          ctx.beginPath();
          ctx.rect(p.x - size / 2, p.y - size / 2, size, size);
          ctx.fill();
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handlePointerMove);
      canvas.removeEventListener("click", handleClick);
    };
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-48 h-48 sm:w-56 sm:h-56 p-2 bg-white dark:bg-[#141414] border-4 border-black dark:border-white shadow-[6px_6px_0px_#FFE500] group select-none cursor-pointer"
      title="Klik untuk memutar objek 3D interaktif"
    >
      {/* Top Header Tag */}
      <div className="absolute top-2 left-2 z-10 font-mono text-[9px] font-black bg-black text-[#FFE500] px-1.5 py-0.5 border border-black uppercase tracking-wider">
        3D.MESH // INTERACTIVE
      </div>

      <div className="absolute bottom-2 right-2 z-10 font-mono text-[9px] font-bold text-neutral-500">
        [CLICK TO SPIN]
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
