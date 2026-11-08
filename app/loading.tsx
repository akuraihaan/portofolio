import React from "react";

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[99999] bg-[#0E1013] text-[#F4F3EE] flex flex-col items-center justify-center p-6 select-none overflow-hidden"
      role="status"
      aria-label="Memuat BWORIEY Portfolio"
    >
      {/* Subtle Background Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(200, 241, 105, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(200, 241, 105, 0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Center Brand Bumper */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        {/* BWORIEY Wordmark */}
        <div className="flex items-center justify-center font-display font-black text-[clamp(2.75rem,8.5vw,7.5rem)] tracking-tight text-[#F4F3EE] leading-none whitespace-nowrap">
          {"BWORIEY".split("").map((char, i) => (
            <span
              key={i}
              className="inline-block animate-pulse"
              style={{
                animationDelay: `${i * 90}ms`,
                animationDuration: "1.4s",
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Expanding Accent Line */}
        <div
          className="h-[2px] bg-[#C8F169] w-48 sm:w-64 max-w-full my-3.5 sm:my-4 opacity-90 animate-pulse"
          style={{ animationDuration: "1.8s" }}
        />

        {/* Subtitle */}
        <span className="font-mono text-[9px] sm:text-[11px] font-bold text-[#A1A49A] uppercase tracking-[0.3em] pl-[0.3em]">
          PORTFOLIO / DEVELOPER
        </span>
      </div>
    </div>
  );
}
