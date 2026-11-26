"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { MotionConfig } from "framer-motion";

// ─── Cursor Mode ───────────────────────────────────────────────────
export type CursorVariant = "default" | "hover" | "project" | "drag" | "link" | "text";

export interface CursorState {
  active: boolean;
  text?: string;
  variant?: CursorVariant;
}

// ─── Context type ─────────────────────────────────────────────────
interface MotionContextType {
  cursor: CursorState;
  setCursor: (state: CursorState) => void;
  resetCursor: () => void;
  isMenuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
}

const MotionContext = createContext<MotionContextType>({
  cursor: { active: false, variant: "default" },
  setCursor: () => {},
  resetCursor: () => {},
  isMenuOpen: false,
  setMenuOpen: () => {},
});

export const useMotionContext = () => useContext(MotionContext);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [cursor, _setCursor] = useState<CursorState>({ active: false, variant: "default" });
  const [isMenuOpen, setMenuOpen] = useState(false);

  const setCursor = useCallback((state: CursorState) => _setCursor(state), []);

  const resetCursor = useCallback(
    () => _setCursor({ active: false, variant: "default" }),
    []
  );

  return (
    <MotionConfig reducedMotion="user">
      <MotionContext.Provider value={{ cursor, setCursor, resetCursor, isMenuOpen, setMenuOpen }}>
        {children}
      </MotionContext.Provider>
    </MotionConfig>
  );
}
