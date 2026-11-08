"use client";

import React, { createContext, useContext, useState } from "react";
import { MotionConfig } from "framer-motion";

export interface CursorState {
  active: boolean;
  text?: string;
  variant?: "default" | "pointer" | "action" | "text";
}

interface MotionContextType {
  cursor: CursorState;
  setCursor: (state: CursorState) => void;
  resetCursor: () => void;
}

const MotionContext = createContext<MotionContextType>({
  cursor: { active: false },
  setCursor: () => {},
  resetCursor: () => {},
});

export const useMotionContext = () => useContext(MotionContext);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [cursor, setCursor] = useState<CursorState>({ active: false });

  const resetCursor = () => {
    setCursor({ active: false });
  };

  return (
    <MotionConfig reducedMotion="user">
      <MotionContext.Provider value={{ cursor, setCursor, resetCursor }}>
        {children}
      </MotionContext.Provider>
    </MotionConfig>
  );
}

