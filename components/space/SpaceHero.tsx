"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Download, 
  Sparkles, 
  Code2, 
  Cloud, 
  Layers, 
  Terminal, 
  Compass,
  Mail
} from "lucide-react";

interface SpaceHeroProps {
  name?: string;
  tagline?: string;
  bio?: string;
  resumeUrl?: string;
}

const typewriterRoles = [
  "Junior Developer",
  "Tech Enthusiast",
  "Frontend Explorer",
  "Cloud & Web Builder",
];

export function SpaceHero({
  name = "Taufik Raihandani",
  tagline = "Membangun Pengalaman Digital di Ruang Angkasa Web Modern",
  bio = "Mahasiswa Pendidikan Komputer Universitas Lambung Mangkurat & Alumnus Bangkit Academy (Cloud Computing). Bersemangat dalam merancang web interaktif, performa tinggi, dan arsitektur cloud yang handal.",
  resumeUrl = "#contact",
}: SpaceHeroProps) {
  // Typewriter state
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = typewriterRoles[roleIndex];
    const typingSpeed = isDeleting ? 45 : 95;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        setText(currentRole.substring(0, text.length + 1));
        if (text === currentRole) {
          // Pause when word is complete before deleting
          setTimeout(() => setIsDeleting(true), 1600);
        }
      } else {
        // Deleting backward
        setText(currentRole.substring(0, text.length - 1));
        if (text === "") {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % typewriterRoles.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, roleIndex]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Central Cosmic Glow Spot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] bg-[#2c67ed]/15 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto w-full text-center flex flex-col items-center">
        {/* Orbiting Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#08102d]/80 border border-[#2c67ed]/40 text-blue-200 text-xs sm:text-sm font-mono shadow-[0_0_20px_rgba(44,103,237,0.3)] backdrop-blur-md mb-6 hover:border-[#2c67ed] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
          <span>Selamat datang di orbit digital saya</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#2c67ed]" />
          <span className="text-blue-400 font-semibold">2026 Edition</span>
        </motion.div>

        {/* Big Name with Cosmic Gradient */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white mb-4"
        >
          <span className="bg-gradient-to-b from-white via-slate-100 to-blue-200 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(44,103,237,0.4)]">
            {name}
          </span>
        </motion.h1>

        {/* Dynamic Typewriter Heading */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-12 sm:h-14 flex items-center justify-center gap-2 mb-6"
        >
          <span className="text-lg sm:text-2xl md:text-3xl font-medium text-slate-300">
            Saya seorang
          </span>
          <span className="text-lg sm:text-2xl md:text-3xl font-bold text-[#2c67ed] drop-shadow-[0_0_15px_rgba(44,103,237,0.8)] inline-flex items-center">
            {text}
            <span className="inline-block w-[3px] h-6 sm:h-8 ml-1 bg-[#2c67ed] animate-pulse" />
          </span>
        </motion.div>

        {/* Subtitle / Bio */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl text-slate-300/90 text-sm sm:text-base md:text-lg leading-relaxed mb-10 text-center font-normal"
        >
          {bio}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-14"
        >
          {/* Primary Action Button */}
          <button
            onClick={() => scrollTo("portfolio")}
            className="group relative inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-full bg-[#2c67ed] text-white text-sm sm:text-base font-semibold shadow-[0_0_25px_rgba(44,103,237,0.6)] hover:shadow-[0_0_35px_rgba(44,103,237,0.85)] hover:bg-[#3672fa] hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <span>Jelajahi Portfolio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity blur-sm -z-10" />
          </button>

          {/* Secondary Action Button */}
          <button
            onClick={() => scrollTo("contact")}
            className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-[#060b24]/90 border border-[#2c67ed]/40 text-blue-200 text-sm sm:text-base font-semibold shadow-[0_0_15px_rgba(44,103,237,0.2)] hover:border-[#2c67ed] hover:text-white hover:shadow-[0_0_25px_rgba(44,103,237,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 backdrop-blur-md"
          >
            <Mail className="w-4 h-4 text-blue-400" />
            <span>Hubungi Saya</span>
          </button>

          {/* Resume Button */}
          {resumeUrl && (
            <a
              href={resumeUrl}
              target={resumeUrl.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm sm:text-base font-medium hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-200"
            >
              <Download className="w-4 h-4 text-slate-300" />
              <span>Resume / CV</span>
            </a>
          )}
        </motion.div>

        {/* Orbiting Tech Floating Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative w-full max-w-3xl flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4 border-t border-blue-900/30"
        >
          <span className="text-xs text-blue-300/50 uppercase tracking-widest font-mono w-full text-center mb-1">
            Cosmic Core Stack
          </span>

          {[
            { name: "React & Next.js", icon: Code2, color: "text-cyan-400" },
            { name: "Tailwind CSS", icon: Layers, color: "text-sky-400" },
            { name: "Framer Motion", icon: Sparkles, color: "text-blue-400" },
            { name: "Google Cloud", icon: Cloud, color: "text-amber-400" },
            { name: "TypeScript", icon: Terminal, color: "text-blue-300" },
            { name: "Laravel & PHP", icon: Compass, color: "text-rose-400" },
          ].map((tech, index) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={tech.name}
                whileHover={{ y: -4, scale: 1.05 }}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08102d]/70 border border-[#2c67ed]/20 shadow-[0_0_12px_rgba(44,103,237,0.15)] text-slate-300 text-xs font-mono backdrop-blur-sm hover:border-[#2c67ed]/60 hover:text-white transition-all cursor-default"
              >
                <Icon className={`w-3.5 h-3.5 ${tech.color}`} />
                <span>{tech.name}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
