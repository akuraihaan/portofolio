"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useMotionContext } from "./MotionProvider";

export function CursorFollower() {
  const { cursor } = useMotionContext();
  const prefersReduced = useReducedMotion();
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for liquid motion
  const springX = useSpring(mouseX, { stiffness: 450, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 450, damping: 30 });

  useEffect(() => {
    // Detect if device supports fine hover (desktop mouse)
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    setIsTouchDevice(!isFinePointer);

    if (!isFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouchDevice || prefersReduced || !isVisible) {
    return null;
  }

  const isExpanded = cursor.active && Boolean(cursor.text);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
      style={{
        x: springX,
        y: springY,
      }}
    >
      <motion.div
        animate={{
          scale: isExpanded ? 1 : cursor.active ? 1.6 : 1,
          width: isExpanded ? "auto" : cursor.active ? 36 : 12,
          height: isExpanded ? 36 : cursor.active ? 36 : 12,
          borderRadius: 999,
          backgroundColor: isExpanded ? "#C8F169" : cursor.active ? "#C8F169" : "#171816",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={`flex items-center justify-center px-3 shadow-lg select-none ${
          isExpanded ? "dark:text-[#171816] text-[#171816]" : ""
        }`}
      >
        {isExpanded && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="font-mono text-[10px] font-black uppercase tracking-widest text-[#171816] whitespace-nowrap"
          >
            {cursor.text}
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}

