"use client";

/**
 * ParallaxImage — pointer-linked image parallax layer
 */
import React, { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  strength?: number;
}

export function ParallaxImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  strength = 0.15,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [`${-strength * 60}px`, `${strength * 60}px`]);
  const y = useSpring(rawY, { stiffness: 60, damping: 18 });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        style={{ y: prefersReduced ? undefined : y, scale: 1 + strength * 0.3 }}
        className="w-full h-full"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={`w-full h-full object-cover ${imgClassName}`} />
      </motion.div>
    </div>
  );
}
