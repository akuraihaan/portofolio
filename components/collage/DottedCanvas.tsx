"use client";

import React from "react";

interface DottedCanvasProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * DottedCanvas — Warm off-white (#FAF8F5) / warm charcoal (#1A1917)
 * canvas with subtle 1rem (16px) dot grid texture.
 */
export function DottedCanvas({ children, className = "" }: DottedCanvasProps) {
  return (
    <div
      className={`dotted-canvas min-h-screen text-[#000000] dark:text-[#FAF8F5] transition-colors duration-500 ${className}`}
    >
      {children}
    </div>
  );
}
