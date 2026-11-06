"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Download, 
  Sparkles, 
  MapPin, 
  Terminal, 
  Code2, 
  Cloud,
  CheckCircle2,
  ExternalLink
} from "lucide-react";

interface SpaceHeroProps {
  name?: string;
  tagline?: string;
  bio?: string;
  resumeUrl?: string;
  avatarUrl?: string | null;
}

const typewriterRoles = [
  "Junior Developer",
  "Tech Enthusiast",
  "Cloud & Web Builder",
  "Frontend Explorer",
];

export function SpaceHero({
  name = "Taufik Raihandani",
  bio = "Saya merancang dan membangun website modern serta pengalaman digital dengan menggabungkan arsitektur kode yang terstruktur, fungsionalitas handal, dan estetika visual kosmik.",
  resumeUrl = "#contact",
  avatarUrl = null,
}: SpaceHeroProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = typewriterRoles[roleIndex];
    const speed = isDeleting ? 38 : 85;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setTypedText(current.substring(0, typedText.length + 1));
        if (typedText === current) {
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        setTypedText(current.substring(0, typedText.length - 1));
        if (typedText === "") {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % typewriterRoles.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, roleIndex]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20 md:py-36 overflow-hidden cursor-default"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column: Heading, Typewriter, Intro, CTA */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col text-left"
        >
          {/* Eyebrow Chip */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08102d]/80 border border-[#2c67ed]/30 text-blue-300 text-xs font-mono mb-5 shadow-[0_0_15px_rgba(44,103,237,0.2)] w-fit backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Tersedia untuk Pekerjaan & Proyek</span>
          </div>

          {/* Big Name Display */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter leading-tight text-white mb-2">
            Halo, saya{" "}
            <span className="bg-gradient-to-r from-white via-blue-100 to-[#2c67ed] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(44,103,237,0.5)]">
              {name.split(" ")[0]}
            </span>
          </h1>

          {/* Typewriter Line */}
          <div className="flex items-center gap-1.5 text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-200 mt-2 mb-4 h-9">
            <span className="text-slate-400 font-medium">Spesialis</span>
            <span className="text-[#2c67ed] font-extrabold drop-shadow-[0_0_14px_rgba(44,103,237,0.7)]">
              {typedText}
            </span>
            <span className="inline-block w-[3px] h-6 bg-[#2c67ed] animate-pulse" />
          </div>

          {/* Bio Sentences */}
          <div className="max-w-xl text-slate-300/90 text-sm sm:text-base leading-relaxed space-y-3 font-normal mb-8">
            <p>{bio}</p>
            <p className="text-slate-400 text-xs sm:text-sm">
              Alumnus Bangkit Academy (Google Cloud Computing) & Mahasiswa Pendidikan Komputer Universitas Lambung Mangkurat.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => scrollTo("projects")}
              className="group cursor-pointer text-xs sm:text-sm font-bold bg-[#2c67ed] text-white px-7 py-3.5 rounded-xl flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(44,103,237,0.5)] hover:shadow-[0_0_35px_rgba(44,103,237,0.8)] hover:bg-[#3872f7] hover:-translate-y-1 hover:scale-[1.02] active:scale-95 transition-all duration-300"
            >
              <span>Lihat Hasil Karya</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href={resumeUrl}
              target={resumeUrl.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="cursor-pointer text-xs sm:text-sm font-bold bg-[#060b24]/90 text-slate-200 border border-[#2c67ed]/35 px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 hover:border-[#2c67ed] hover:text-white hover:shadow-[0_0_20px_rgba(44,103,237,0.3)] hover:-translate-y-1 transition-all duration-300 backdrop-blur-md"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>Unduh CV</span>
            </a>
          </div>
        </motion.div>

        {/* Right Column: Aesthetic Cosmic Visual Frame */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="relative flex items-center justify-center"
        >
          {/* Subtle Ambient Behind Frame */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#2c67ed]/20 via-cyan-500/10 to-indigo-600/15 rounded-3xl blur-2xl -z-10" />

          <div className="relative w-full max-w-[380px] lg:max-w-[430px] rounded-3xl bg-[#060a20]/90 border border-[#2c67ed]/35 p-6 backdrop-blur-xl shadow-[0_0_35px_rgba(44,103,237,0.25)] flex flex-col justify-between">
            {/* Visual Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] font-mono text-slate-400 ml-2">portfolio.config.ts</span>
              </div>
              <span className="text-xs font-mono text-[#6ba0ff]">2026 Edition</span>
            </div>

            {/* Profile Avatar / Portrait Aspect Box */}
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#0c163d] via-[#091136] to-[#04081c] border border-[#2c67ed]/30 flex flex-col items-center justify-center text-center p-6 mb-5 group">
              {avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-full h-full object-cover rounded-xl transition-all duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-[#2c67ed]/20 border-2 border-[#2c67ed] flex items-center justify-center shadow-[0_0_20px_rgba(44,103,237,0.6)] mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-black text-white">TR</span>
                  </div>
                  <span className="text-xs font-bold text-white tracking-wider uppercase">
                    Taufik Raihandani
                  </span>
                  <span className="text-[11px] text-blue-300 font-mono mt-0.5">
                    @bworiey · Banjarmasin
                  </span>
                </div>
              )}

              {/* Floating tech badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#04081c]/80 backdrop-blur-md border border-white/10 text-[11px] font-mono text-slate-300">
                <span className="flex items-center gap-1.5 text-blue-300">
                  <Code2 className="w-3.5 h-3.5 text-[#2c67ed]" />
                  React · Tailwind · GCP
                </span>
                <span className="text-emerald-400 font-semibold">Active</span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-base font-extrabold text-white block">7+</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Proyek</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-base font-extrabold text-white block">5+</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Sertifikat</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-base font-extrabold text-white block">2024</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">Bangkit</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
