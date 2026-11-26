"use client";

import React, { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useMotionContext } from "./MotionProvider";

export function CustomCursor() {
  const { cursor } = useMotionContext();
  const prefersReduced = useReducedMotion();
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDown, setIsDown] = useState(false);

  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);

  const dx = useSpring(mx, { stiffness: 920, damping: 38, mass: 0.25 });
  const dy = useSpring(my, { stiffness: 920, damping: 38, mass: 0.25 });

  const rx = useSpring(mx, { stiffness: 180, damping: 22, mass: 0.9 });
  const ry = useSpring(my, { stiffness: 180, damping: 22, mass: 0.9 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    setIsPointer(fine);
    if (!fine) return;

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setIsVisible(true);
    };
    const onDown = () => setIsDown(true);
    const onUp = () => setIsDown(false);
    const onLeave = () => setIsVisible(false);
    const onEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [mx, my]);

  if (!isPointer || prefersReduced) return null;

  const hasLabel = cursor.active && Boolean(cursor.text);
  const isProject = cursor.variant === "project";
  const isDrag = cursor.variant === "drag";
  const isHover = cursor.active && !hasLabel;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none fixed top-0 left-0 z-[9998] -translate-x-1/2 -translate-y-1/2 select-none"
            style={{ x: rx, y: ry }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              animate={{
                scale: isDown ? 0.8 : hasLabel ? 1 : isHover ? 1.6 : 1,
                width: hasLabel ? "auto" : isDrag ? 48 : 28,
                height: hasLabel ? "auto" : isDrag ? 48 : 28,
                borderRadius: 9999,
                borderColor: hasLabel
                  ? "transparent"
                  : isProject
                  ? "#F05A28"
                  : isHover
                  ? "rgba(240,90,40,0.65)"
                  : "rgba(0,0,0,0.35)",
                backgroundColor: hasLabel
                  ? "#F05A28"
                  : isProject
                  ? "rgba(240,90,40,0.14)"
                  : "transparent",
                borderWidth: hasLabel ? 0 : 1.5,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 26 }}
              className="flex items-center justify-center px-3 py-1 border"
            >
              <AnimatePresence mode="wait">
                {hasLabel && (
                  <motion.span
                    key="label"
                    initial={{ opacity: 0, scale: 0.82 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.82 }}
                    transition={{ duration: 0.18 }}
                    className="font-mono text-[9px] font-medium uppercase tracking-[0.2em] text-[#FAF8F5] whitespace-nowrap"
                  >
                    {cursor.text}
                  </motion.span>
                )}
                {isDrag && !hasLabel && (
                  <motion.span
                    key="drag"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="font-mono text-[9px] text-[#000000] dark:text-[#FAF8F5]"
                  >
                    ↔
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          <motion.div
            aria-hidden
            className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 select-none"
            style={{ x: dx, y: dy }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              animate={{
                scale: isDown ? 0.5 : cursor.active ? 1.3 : 1,
                width: cursor.active ? 6 : 5,
                height: cursor.active ? 6 : 5,
                backgroundColor: isProject
                  ? "#F05A28"
                  : cursor.active
                  ? "#F05A28"
                  : "#000000",
                opacity: hasLabel ? 0 : 1,
              }}
              transition={{ type: "spring", stiffness: 600, damping: 32 }}
              className="rounded-full dark:bg-[#FAF8F5]"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
