"use client";

/**
 * RevealImage — Clip-path image reveal with scale + parallax.
 */
import React, { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { EASINGS, DURATION } from "./MotionSystem";

interface RevealImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Enable scroll parallax after reveal */
  parallax?: boolean;
  parallaxStrength?: number;
  once?: boolean;
}

export function RevealImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  parallax = false,
  parallaxStrength = 0.12,
  once = true,
}: RevealImageProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], ["0%", `${parallaxStrength * -100}%`]);
  const smoothY = useSpring(rawY, { stiffness: 80, damping: 20 });

  if (prefersReduced) {
    return (
      <div ref={ref} className={`overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={`w-full h-full object-cover ${imgClassName}`} />
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden ${className}`}
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      whileInView={{ clipPath: "inset(0% 0 0 0)" }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: DURATION.cinematic, ease: EASINGS.expo }}
    >
      <motion.div
        style={{ y: parallax && !prefersReduced ? smoothY : undefined }}
        className="w-full h-full"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src={src}
          alt={alt}
          initial={{ scale: 1.12 }}
          whileInView={{ scale: 1 }}
          viewport={{ once, margin: "-80px" }}
          transition={{ duration: DURATION.cinematic * 1.1, ease: EASINGS.expo }}
          className={`w-full h-full object-cover ${imgClassName}`}
        />
      </motion.div>
    </motion.div>
  );
}
