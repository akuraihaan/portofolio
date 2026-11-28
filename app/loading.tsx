import React from "react";

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[99999] bg-[#1A1917] text-[#FAF8F5] flex flex-col items-center justify-center p-6 select-none pointer-events-none"
      role="status"
      aria-label="Memuat bworiey"
    >
      <div className="flex flex-col items-center justify-center text-center">
        <span className="font-editorial italic text-4xl sm:text-5xl tracking-tight text-[#FAF8F5]">
          bworiey
        </span>
        <div className="h-[1.5px] bg-[#F05A28] w-24 my-3" />
      </div>
    </div>
  );
}
