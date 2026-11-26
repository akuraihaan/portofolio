"use client";

/**
 * MotionMarquee — velocity-aware infinite scrolling ticker.
 * Accelerates when user scrolls, decelerates on idle.
 */
import React, { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";

function wrap(min: number, max: number, v: number): number {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

interface MotionMarqueeProps {
  children: React.ReactNode;
  speed?: number;
  direction?: "left" | "right";
  className?: string;
}

export function MotionMarquee({
  children,
  speed = 1,
  direction = "left",
  className = "",
}: MotionMarqueeProps) {
  const prefersReduced = useReducedMotion();
  const baseX = useMotionValue(0);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const directionFactor = useRef(direction === "left" ? 1 : -1);

  useAnimationFrame((_, delta) => {
    if (prefersReduced) return;
    let moveBy = directionFactor.current * speed * (delta / 1000) * 100;
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }
    moveBy += directionFactor.current * moveBy * velocityFactor.get() * 0.3;
    baseX.set(baseX.get() + moveBy);
  });

  if (prefersReduced) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <div className="flex whitespace-nowrap">{children}{children}</div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div className="flex whitespace-nowrap" style={{ x }}>
        {children}
        {children}
      </motion.div>
    </div>
  );
}
