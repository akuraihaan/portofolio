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
            scale: isPointerDown ? 0.8 : hasLabel ? 1.3 : cursor.active ? 1.7 : 1,
            width: hasLabel ? "auto" : 32,
            height: hasLabel ? "auto" : 32,
            borderRadius: hasLabel ? 4 : 999,
            borderColor: hasLabel ? "#000" : "#FFE500",
            backgroundColor: hasLabel ? "#FFE500" : "transparent",
            borderWidth: 2,
            boxShadow: hasLabel ? "4px 4px 0px #000" : "none",
          }}
          transition={{ type: "spring", stiffness: 450, damping: 25 }}
          className="flex items-center justify-center px-2.5 py-1 border-dashed"
        >
          {hasLabel && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="font-mono text-[11px] font-black uppercase tracking-wider text-black whitespace-nowrap"
            >
              {cursor.text}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* Center Core Pixel Point */}
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
              scale: isPointerDown ? 0.6 : cursor.active ? 1.4 : 1,
              width: cursor.active ? 10 : 6,
              height: cursor.active ? 10 : 6,
              backgroundColor: cursor.active ? "#FF5C00" : "#0A0A0A",
            }}
            transition={{ type: "spring", stiffness: 600, damping: 30 }}
            className="rounded-none dark:bg-white border border-black shadow-[1px_1px_0px_#FFE500]"
          />
        </motion.div>
      )}
    </>
  );
}
