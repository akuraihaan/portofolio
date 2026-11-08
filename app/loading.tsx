import React from "react";

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[99999] bg-[#000000] text-[#F5F5F7] flex flex-col items-center justify-center p-6 select-none pointer-events-none"
      role="status"
      aria-label="Loading BWORIEY Portfolio"
    >
      <div className="flex flex-col items-center justify-center text-center">
        <span className="font-display font-black text-4xl sm:text-5xl tracking-tight text-[#F5F5F7]">
          BWORIEY
        </span>
        <div className="h-[1px] bg-white/30 w-32 my-3" />
        <span className="font-mono text-[10px] text-[#86868B] uppercase tracking-[0.25em]">
          PORTFOLIO / DEVELOPER
        </span>
      </div>
    </div>
  );
}
