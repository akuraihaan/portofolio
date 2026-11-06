"use client";

import { motion } from "framer-motion";
import { ArrowUp, Sparkles, Rocket, Heart } from "lucide-react";

interface SpaceFooterProps {
  ownerName?: string;
}

export function SpaceFooter({
  ownerName = "Taufik Raihandani",
}: SpaceFooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-[#2c67ed]/20 bg-[#030617]/90 backdrop-blur-md pt-12 pb-8 px-4 sm:px-6 lg:px-8 text-center">
      {/* Top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-[1px] bg-gradient-to-r from-transparent via-[#2c67ed] to-transparent shadow-[0_0_15px_#2c67ed]" />

      <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-6 sm:flex-row text-xs text-slate-400">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#2c67ed]/20 border border-[#2c67ed] flex items-center justify-center text-blue-300">
            <Sparkles className="w-3 h-3" />
          </div>
          <span className="font-semibold text-slate-200">
            {ownerName} · Portofolio Luar Angkasa
          </span>
        </div>

        {/* Tech Credits */}
        <div className="flex items-center gap-1.5 text-slate-400 font-mono">
          <span>Dibuat dengan</span>
          <span className="text-blue-400 font-semibold">React</span>
          <span>+</span>
          <span className="text-cyan-400 font-semibold">Tailwind CSS</span>
          <span>+</span>
          <span className="text-[#60a5fa] font-semibold">Framer Motion</span>
        </div>

        {/* Back To Top Button */}
        <button
          onClick={scrollToTop}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#08102d] border border-[#2c67ed]/40 text-blue-300 hover:text-white hover:border-[#2c67ed] hover:shadow-[0_0_15px_rgba(44,103,237,0.5)] transition-all font-mono"
        >
          <span>Kembali ke Orbit</span>
          <Rocket className="w-3.5 h-3.5 text-blue-400 -rotate-45" />
        </button>
      </div>

      <div className="mt-8 text-slate-500 text-[11px] font-mono">
        © {new Date().getFullYear()} {ownerName}. All space rights reserved.
      </div>
    </footer>
  );
}

