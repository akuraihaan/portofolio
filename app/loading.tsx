import React from "react";

export default function Loading() {
  return (
    <div
      className="w-full py-16 flex flex-col items-center justify-center text-center select-none"
      role="status"
      aria-label="Memuat BWORIEY Portfolio"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#171816] dark:bg-[#C8F169] text-[#C8F169] dark:text-[#171816] font-pixel text-[9px] tracking-widest border border-black/30 shadow-pixel">
        <span className="w-2 h-2 bg-[#C8F169] dark:bg-[#171816] animate-ping" />
        <span>BWORIEY // MEMUAT DATA PORTFOLIO...</span>
      </div>
    </div>
  );
}
