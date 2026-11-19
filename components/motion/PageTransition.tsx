"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASINGS } from "./MotionSystem";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: EASINGS.editorial }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
