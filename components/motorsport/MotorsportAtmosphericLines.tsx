"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASINGS } from "../motion/MotionSystem";

export function MotorsportAtmosphericLines({ className = "" }: { className?: string }) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
        <svg
          viewBox="0 0 1440 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover opacity-25"
        >
          <path
            d="M-100 250 C 350 150, 750 450, 1550 200"
            stroke="#555555"
            strokeWidth="1.2"
            strokeDasharray="4 6"
          />
          <path
            d="M-50 420 C 450 300, 900 600, 1600 380"
            stroke="#555555"
            strokeWidth="1"
          />
          <path
            d="M0 600 C 500 480, 1000 720, 1650 500"
            stroke="#D1FF00"
            strokeWidth="1.2"
            opacity="0.6"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 1440 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
      >
        {/* Aerodynamic streamline 1 */}
        <motion.path
          d="M-100 220 C 320 120, 720 420, 1550 180"
          stroke="#555555"
          strokeWidth="1.2"
          strokeDasharray="6 8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.28 }}
          transition={{ duration: 2.8, ease: EASINGS.editorial }}
        />

        {/* Aerodynamic streamline 2 - Main flow */}
        <motion.path
          d="M-50 390 C 420 280, 880 580, 1600 340"
          stroke="#555555"
          strokeWidth="1.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.22 }}
          transition={{ duration: 3.2, delay: 0.2, ease: EASINGS.editorial }}
        />

        {/* Aerodynamic streamline 3 - Velocity track */}
        <motion.path
          d="M-80 540 C 480 430, 960 680, 1620 460"
          stroke="#555555"
          strokeWidth="0.8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.18 }}
          transition={{ duration: 3.6, delay: 0.4, ease: EASINGS.editorial }}
        />

        {/* Action Lime accent streak */}
        <motion.path
          d="M200 360 C 520 290, 840 500, 1400 320"
          stroke="#D1FF00"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1], opacity: [0, 0.7, 0.45] }}
          transition={{ duration: 2.4, delay: 0.6, ease: "easeInOut" }}
        />

        {/* Subtle grid reference lines */}
        <line x1="240" y1="0" x2="240" y2="800" stroke="#555555" strokeWidth="0.5" opacity="0.1" strokeDasharray="2 4" />
        <line x1="960" y1="0" x2="960" y2="800" stroke="#555555" strokeWidth="0.5" opacity="0.1" strokeDasharray="2 4" />
      </svg>
    </div>
  );
}
