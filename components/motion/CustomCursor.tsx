"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useMotionContext } from "./MotionProvider";

export function CustomCursor() {
  const { cursor } = useMotionContext();
  const prefersReduced = useReducedMotion();
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Fast tracking for core dot
  const springX = useSpring(mouseX, { stiffness: 850, damping: 35 });
  const springY = useSpring(mouseY, { stiffness: 850, damping: 35 });

  // Liquid trail for outer ring
  const trailSpringX = useSpring(mouseX, { stiffness: 350, damping: 28 });
  const trailSpringY = useSpring(mouseY, { stiffness: 350, damping: 28 });

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    setIsTouchDevice(!isFinePointer);

    if (!isFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsPointerDown(true);
    const handleMouseUp = () => setIsPointerDown(false);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouchDevice || prefersReduced || !isVisible) {
    return null;
  }

  const hasLabel = cursor.active && Boolean(cursor.text);

  return (
    <>
      {/* Outer Trailing Ring / Morphing Pill */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9998] -translate-x-1/2 -translate-y-1/2 select-none"
        style={{
          x: trailSpringX,
          y: trailSpringY,
        }}
      >
        <motion.div
          animate={{
            scale: isPointerDown ? 0.85 : hasLabel ? 1.15 : cursor.active ? 1.5 : 1,
            width: hasLabel ? "auto" : 28,
            height: hasLabel ? "auto" : 28,
            borderRadius: 9999,
            borderColor: hasLabel
              ? "transparent"
              : cursor.active
              ? "rgba(37, 99, 235, 0.6)"
              : "rgba(113, 113, 122, 0.45)",
            backgroundColor: hasLabel
              ? "rgba(18, 18, 20, 0.92)"
              : cursor.active
              ? "rgba(37, 99, 235, 0.08)"
              : "transparent",
            borderWidth: hasLabel ? 0 : 1.5,
          }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
          className="flex items-center justify-center px-3 py-1 shadow-sm"
        >
          {hasLabel && (
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white dark:text-[#F4F4F6] whitespace-nowrap"
            >
              {cursor.text}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* Center Core Precision Dot */}
      {!hasLabel && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-[9999] flex items-center justify-center -translate-x-1/2 -translate-y-1/2 select-none"
          style={{
            x: springX,
            y: springY,
          }}
        >
          <motion.div
            animate={{
              scale: isPointerDown ? 0.6 : cursor.active ? 0.8 : 1,
              width: 5,
              height: 5,
              backgroundColor: cursor.active ? "#2563EB" : "#121214",
            }}
            transition={{ type: "spring", stiffness: 600, damping: 30 }}
            className="rounded-full dark:bg-[#F4F4F6]"
          />
        </motion.div>
      )}
    </>
  );
}
