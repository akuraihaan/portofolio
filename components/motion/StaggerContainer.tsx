"use client";

/**
 * StaggerContainer + StaggerItem
 * Reusable choreography primitives for section entrances.
 */
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer, staggerItem, VIEWPORT_ONCE } from "./MotionSystem";

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  once?: boolean;
}

export function StaggerContainer({
  children,
  className = "",
  stagger = 0.07,
  delay = 0,
  once = true,
}: StaggerContainerProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: VIEWPORT_ONCE.margin }}
      variants={staggerContainer(stagger, delay)}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}
