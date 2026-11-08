"use client";

import React, { useEffect } from "react";

interface BrandPreloaderProps {
  onComplete?: () => void;
}

/**
 * Non-blocking brand bumper notification:
 * Immediately completes so all portfolio data is 100% visible on first paint.
 */
export function BrandPreloader({ onComplete }: BrandPreloaderProps) {
  useEffect(() => {
    onComplete?.();
  }, [onComplete]);

  return null;
}
