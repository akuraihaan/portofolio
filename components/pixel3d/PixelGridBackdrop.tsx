"use client";

import React from "react";

export function PixelGridBackdrop() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Pixel coordinate grid */}
      <div className="absolute inset-0 pixel-grid opacity-70 dark:opacity-30" />

      {/* Subtle pixel dots matrix */}
      <div className="absolute inset-0 pixel-dots opacity-40 dark:opacity-20" />

      {/* Retro HUD Corner Brackets */}
      <div className="absolute top-4 left-4 font-mono text-[10px] text-[#171816]/30 dark:text-[#F4F3EE]/30 select-none">
        ┌── [SYS: BWORIEY.2026]
      </div>
      <div className="absolute top-4 right-4 font-mono text-[10px] text-[#171816]/30 dark:text-[#F4F3EE]/30 select-none text-right">
        [LAT -3.3167 / LON 114.5900] ──┐
      </div>
      <div className="absolute bottom-4 left-4 font-mono text-[10px] text-[#171816]/30 dark:text-[#F4F3EE]/30 select-none">
        └── [ENVIRONMENT: PIXEL_3D]
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-[10px] text-[#171816]/30 dark:text-[#F4F3EE]/30 select-none text-right">
        [STATUS: ONLINE 200] ──┘
      </div>

      {/* Floating subtle ambient pixel glow in corners */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#C8F169]/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-[#38BDF8]/5 blur-3xl pointer-events-none" />
    </div>
  );
}

