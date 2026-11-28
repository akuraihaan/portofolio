"use client";

import React, { useRef, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { SPRINGS } from "./MotionSystem";

interface HoverImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  tiltStrength?: number;
}

/**
 * HoverImage — Sharp-edged image container with desktop 3D pointer tilt
 * and smooth scale/crop response.
 */
export function HoverImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  tiltStrength = 7,
}: HoverImageProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(
    useTransform(my, [-0.5, 0.5], [tiltStrength, -tiltStrength]),
    SPRINGS.tilt
  );
  const rotateY = useSpring(
    useTransform(mx, [-0.5, 0.5], [-tiltStrength, tiltStrength]),
    SPRINGS.tilt
  );

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (prefersReduced || e.pointerType !== "mouse" || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      mx.set((e.clientX - rect.left) / rect.width - 0.5);
      my.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [prefersReduced, mx, my]
  );

  const onLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <div ref={ref} className={`[perspective:900px] ${className}`}>
      <motion.div
        style={
          prefersReduced
            ? {}
            : { rotateX, rotateY, transformStyle: "preserve-3d" }
        }
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="w-full h-full overflow-hidden bg-[#1A1917]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06] ${imgClassName}`}
        />
      </motion.div>
    </div>
  );
}
