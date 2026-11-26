"use client";

/**
 * MotionModal — spring-based modal with clip-path enter and backdrop.
 * Supports drag-to-close, keyboard navigation, and shared layout.
 */
import React, { useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { EASINGS, DURATION } from "./MotionSystem";

interface MotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function MotionModal({ isOpen, onClose, children, className = "" }: MotionModalProps) {
  const prefersReduced = useReducedMotion();

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKey]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.base, ease: EASINGS.gentle }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            className={`fixed z-[1001] ${className}`}
            initial={prefersReduced ? { opacity: 0 } : {
              opacity: 0,
              scale: 0.94,
              y: 24,
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : {
              opacity: 0,
              scale: 0.94,
              y: 24,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.8 }}
            drag={prefersReduced ? false : "y"}
            dragConstraints={{ top: 0, bottom: 80 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.y > 60) onClose();
            }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
