"use client";

import { motion } from "framer-motion";
import { 
  User, 
  Target, 
  FileText, 
  MapPin, 
  GraduationCap, 
  Sparkles, 
  CheckCircle2,
  Code2,
  Terminal,
  Calendar
} from "lucide-react";

interface EducationItem {
  id?: string;
  institution: string;
  degree: string;
  field_of_study: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
}

interface ExperienceItem {
  id?: string;
  company: string;
  role_title: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
  responsibilities?: string[];
}

interface SpaceAboutProps {
  educations?: EducationItem[];
  experiences?: ExperienceItem[];
  stats?: {
    projectsCount?: number;
    certificatesCount?: number;
    technologiesCount?: number;
    experienceYears?: string;
  };
  avatarUrl?: string | null;
  ownerName?: string;
  ownerBio?: string;
  ownerLocation?: string;
}

export function SpaceAbout({
  avatarUrl = null,
  ownerName = "Taufik Raihandani",
  ownerBio = "Saya adalah seorang web developer dan mahasiswa Pendidikan Komputer di Universitas Lambung Mangkurat dengan minat mendalam pada pengembangan frontend modern dan cloud computing.",
  ownerLocation = "Banjarmasin, Kalimantan Selatan",
  stats = {
    projectsCount: 7,
    certificatesCount: 5,
    technologiesCount: 12,
    experienceYears: "2+",
  },
}: SpaceAboutProps) {
  return (
    <section id="about" className="w-full max-w-7xl mx-auto py-24 md:py-32 cursor-default px-6 md:px-12 border-t border-blue-900/20 relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#2c67ed]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Section Header with Signature Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16 md:mb-20 text-left"
      >
        <h2 className="text-sm font-bold tracking-[0.2em] text-[#6ba0ff] uppercase mb-3 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#2c67ed]" />
          <span>Discover</span>
        </h2>
        <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter">
          About <span className="text-[#2c67ed] drop-shadow-[0_0_20px_rgba(44,103,237,0.6)]">Me</span>
        </h3>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column: Portrait Card (5 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 flex flex-col items-center justify-center"
        >
          <div className="w-full max-w-[360px] lg:max-w-[420px] relative">
            <div className="relative z-10 p-2.5 bg-[#060a20]/90 border border-[#2c67ed]/30 rounded-3xl shadow-[0_0_30px_rgba(44,103,237,0.2)] overflow-hidden aspect-[4/5] w-full group transition-all duration-500 hover:border-[#2c67ed]/60 hover:shadow-[0_0_40px_rgba(44,103,237,0.4)] hover:-translate-y-1">
              {avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={avatarUrl}
                  alt={ownerName}
                  className="w-full h-full object-cover rounded-2xl transition-all duration-700 grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#0c163d] via-[#091136] to-[#04081c] flex flex-col items-center justify-center text-center p-6 transition-all duration-700 group-hover:scale-105">
                  <div className="w-24 h-24 rounded-full bg-[#2c67ed]/20 border-2 border-[#2c67ed] flex items-center justify-center text-3xl font-black text-white mb-4 shadow-[0_0_20px_rgba(44,103,237,0.5)]">
                    TR
                  </div>
                  <h4 className="text-xl font-black text-white tracking-tight">{ownerName}</h4>
                  <p className="text-xs text-[#6ba0ff] font-mono mt-1">Junior Web & Cloud Developer</p>
                  <p className="text-xs text-slate-400 mt-2 max-w-xs">Universitas Lambung Mangkurat</p>
                </div>
              )}

              {/* Inset Badge */}
              <div className="absolute bottom-5 left-5 right-5 p-3 rounded-xl bg-[#04081c]/85 border border-white/10 backdrop-blur-md flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">Pendidikan Komputer</span>
                <span className="text-blue-400 font-semibold">2022–2026</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Structured Cards (7 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:col-span-7 flex flex-col gap-6"
        >
          {/* Card 1: Who Am I */}
          <div className="p-6 md:p-8 rounded-2xl bg-[#060a20]/80 border border-[#2c67ed]/20 backdrop-blur-md hover:border-[#2c67ed]/45 transition-all">
            <h4 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-blue-900/30 pb-3">
              <User className="w-5 h-5 text-[#2c67ed]" />
              <span>Who Am I</span>
            </h4>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed font-normal">
              {ownerBio}
            </p>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed font-normal mt-3">
              Melalui program Kampus Merdeka di Bangkit Academy 2024, saya memperdalam spesialisasi Cloud Computing yang dipimpin oleh Google, GoTo, Tokopedia, dan Traveloka — berkolaborasi membangun backend cloud untuk aplikasi Android penerjemah bahasa isyarat BISINDO "Combridge".
            </p>
          </div>

          {/* Card 2: My Approach */}
          <div className="p-6 md:p-8 rounded-2xl bg-[#060a20]/80 border border-[#2c67ed]/20 backdrop-blur-md hover:border-[#2c67ed]/45 transition-all">
            <h4 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2 border-b border-blue-900/30 pb-3">
              <Target className="w-5 h-5 text-[#2c67ed]" />
              <span>My Approach</span>
            </h4>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed font-normal">
              Saya percaya bahwa produk digital terbaik lahir dari perpaduan kode yang bersih, performa tinggi, dan empati mendalam terhadap pengguna. Dari riset hingga implementasi antarmuka, setiap detail dirancang dengan cermat dan teruji.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5">
                <CheckCircle2 className="w-4 h-4 text-[#2c67ed] shrink-0" />
                <span>Responsive & Modern Architecture</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5">
                <CheckCircle2 className="w-4 h-4 text-[#2c67ed] shrink-0" />
                <span>Clean Code & Scalable Backend</span>
              </div>
            </div>
          </div>

          {/* Card 3: Personal Details */}
          <div className="p-6 md:p-8 rounded-2xl bg-[#060a20]/80 border border-[#2c67ed]/20 backdrop-blur-md hover:border-[#2c67ed]/45 transition-all">
            <h4 className="text-lg md:text-xl font-bold text-white mb-5 border-b border-blue-900/30 pb-3 border-l-4 border-l-[#2c67ed] pl-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#2c67ed]" />
              <span>Personal Details</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block uppercase">Nama Lengkap</span>
                <span className="font-semibold text-white mt-0.5 block">{ownerName}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block uppercase">Domisili</span>
                <span className="font-semibold text-white mt-0.5 block">{ownerLocation}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block uppercase">Universitas</span>
                <span className="font-semibold text-white mt-0.5 block">Universitas Lambung Mangkurat</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block uppercase">Program Studi</span>
                <span className="font-semibold text-white mt-0.5 block">S1 Pendidikan Komputer</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block uppercase">Status Kesiapan</span>
                <span className="font-semibold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Tersedia untuk Pekerjaan / Freelance
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block uppercase">Fokus Keahlian</span>
                <span className="font-semibold text-blue-300 mt-0.5 block">Frontend, Cloud, & Full Stack Web</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
