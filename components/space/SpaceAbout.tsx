"use client";

import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Briefcase, 
  Award, 
  Code2, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Terminal,
  Sparkles,
  BookOpen,
  Orbit
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
  educations = [
    {
      institution: "Universitas Lambung Mangkurat",
      degree: "Sarjana Pendidikan",
      field_of_study: "Pendidikan Komputer",
      location: "Banjarmasin, Kalimantan Selatan",
      start_date: "2022",
      end_date: "2026",
      is_current: true,
      description:
        "Mendalami ilmu rekayasa perangkat lunak, pengembangan media pembelajaran interaktif, web development, dan learning analytics untuk mendukung inovasi di bidang teknologi informasi.",
    },
  ],
  experiences = [
    {
      company: "Bangkit Academy Batch 2024",
      role_title: "Cloud Computing Cohort & Cloud Engineer",
      location: "Jakarta, Indonesia (Kampus Merdeka)",
      start_date: "Agu 2024",
      end_date: "Jan 2025",
      is_current: false,
      description:
        "Program kesiapan karier bersertifikat dari Kampus Merdeka yang dipimpin oleh Google, GoTo, Tokopedia, dan Traveloka. Bertanggung jawab atas perancangan arsitektur Google Cloud, implementasi RESTful API, dan integrasi backend ke aplikasi Android 'Combridge'.",
      responsibilities: [
        "Merancang & mendeploy RESTful API di Google Cloud Platform",
        "Menyiapkan autentikasi pengguna dan integrasi Cloud Storage untuk dataset kamus isyarat",
        "Berkolaborasi lintas disiplin bersama tim Machine Learning dan Mobile Development",
      ],
    },
  ],
  stats = {
    projectsCount: 7,
    certificatesCount: 5,
    technologiesCount: 12,
    experienceYears: "2+",
  },
  avatarUrl = null,
  ownerName = "Taufik Raihandani",
  ownerBio = "Halo! Saya adalah seorang pengembang yang berfokus pada ekosistem web modern (React, Next.js, Tailwind CSS) dan fondasi backend (Laravel, Express, Google Cloud). Saya senang memecahkan masalah nyata melalui kode yang terstruktur, antarmuka yang intuitif, dan pengalaman pengguna yang memikat.",
  ownerLocation = "Banjarmasin, Kalimantan Selatan",
}: SpaceAboutProps) {
  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background Section Glow */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-[#2c67ed]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-indigo-900/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08102d]/80 border border-[#2c67ed]/30 text-blue-300 text-xs font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(44,103,237,0.2)] mb-3"
        >
          <Orbit className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: "12s" }} />
          <span>About Me · Profil & Riwayat</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight"
        >
          Eksplorasi, Pendidikan, &{" "}
          <span className="text-[#2c67ed] drop-shadow-[0_0_20px_rgba(44,103,237,0.6)]">
            Pengalaman
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-3 text-slate-300/80 text-sm sm:text-base max-w-2xl mx-auto"
        >
          Mengenal perjalanan saya dalam dunia teknologi, pendidikan komputer, dan arsitektur web modern.
        </motion.p>
      </div>

      {/* Top Grid: Profile Bio Card & Interactive Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-stretch">
        {/* Profile Card (5 Cols) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 relative group rounded-2xl bg-[#060a20]/80 border border-[#2c67ed]/25 p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_25px_rgba(44,103,237,0.15)] hover:border-[#2c67ed]/50 hover:shadow-[0_0_30px_rgba(44,103,237,0.3)] transition-all duration-300 flex flex-col justify-between"
        >
          {/* Cosmic Corner Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2c67ed]/15 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Profile Avatar / Photo with Glowing Cosmic Ring */}
            <div className="flex items-center gap-5 mb-6">
              <div className="relative">
                {/* Glowing Outer Ring */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#2c67ed] to-cyan-400 opacity-75 blur-[6px] animate-pulse" />
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#08102d] border-2 border-[#2c67ed] flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(44,103,237,0.5)]">
                  {avatarUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={avatarUrl}
                      alt={ownerName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    /* Cosmic Avatar Artwork Fallback */
                    <div className="w-full h-full bg-gradient-to-br from-[#121f57] via-[#091136] to-[#030617] flex flex-col items-center justify-center text-white">
                      <span className="text-2xl sm:text-3xl font-black tracking-wider text-blue-100">
                        {ownerName.split(" ").map((w) => w[0]).slice(0, 2).join("") || "TR"}
                      </span>
                      <span className="text-[9px] uppercase tracking-widest text-blue-300 font-mono">
                        Bworiey
                      </span>
                    </div>
                  )}
                </div>
                {/* Active orbiting indicator */}
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#2c67ed] border-2 border-[#04081c] shadow-[0_0_8px_#2c67ed]" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {ownerName}
                </h3>
                <p className="text-xs sm:text-sm text-[#6ba0ff] font-mono mt-0.5">
                  Junior Web & Cloud Developer
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{ownerLocation}</span>
                </div>
              </div>
            </div>

            {/* Narrative Bio */}
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {ownerBio}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
                <span className="text-slate-400">Pendidikan Terakhir</span>
                <span className="text-blue-200 font-semibold truncate">Pendidikan Komputer</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-1">
                <span className="text-slate-400">Minat Spesialisasi</span>
                <span className="text-blue-200 font-semibold truncate">Frontend & Cloud</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Siap Kolaborasi Proyek
            </span>
            <span className="text-blue-300/60 font-mono">ID: 270204</span>
          </div>
        </motion.div>

        {/* Project Stats (7 Cols) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 grid grid-cols-2 gap-4 sm:gap-6"
        >
          {[
            {
              label: "Proyek Selesai",
              value: `${stats.projectsCount}+`,
              desc: "Aplikasi web, mobile, & tugas akhir interaktif.",
              icon: Code2,
              color: "text-blue-400",
              glow: "shadow-[0_0_20px_rgba(44,103,237,0.25)]",
            },
            {
              label: "Sertifikasi Resmi",
              value: `${stats.certificatesCount}+`,
              desc: "Seminar nasional, GDSC, & kompetensi teknologi.",
              icon: Award,
              color: "text-cyan-400",
              glow: "shadow-[0_0_20px_rgba(6,182,212,0.2)]",
            },
            {
              label: "Tech Stack & Tools",
              value: `${stats.technologiesCount}+`,
              desc: "React, Tailwind, Google Cloud, Laravel, MySQL.",
              icon: Terminal,
              color: "text-indigo-400",
              glow: "shadow-[0_0_20px_rgba(99,102,241,0.2)]",
            },
            {
              label: "Dedikasi & Akurasi",
              value: "100%",
              desc: "Komitmen tinggi pada standar kode dan UI clean.",
              icon: Sparkles,
              color: "text-sky-300",
              glow: "shadow-[0_0_20px_rgba(56,189,248,0.2)]",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className={`relative rounded-2xl bg-[#060a20]/80 border border-[#2c67ed]/25 p-5 sm:p-6 backdrop-blur-xl flex flex-col justify-between ${item.glow} hover:border-[#2c67ed]/60 transition-all`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-[#2c67ed]/15 border border-[#2c67ed]/30">
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span className="text-xs font-mono text-slate-500">0{idx + 1}</span>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-1">
                    <span className="bg-gradient-to-r from-white via-blue-100 to-[#2c67ed] bg-clip-text text-transparent">
                      {item.value}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-semibold text-slate-200">
                    {item.label}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Two-Column Grid: Education & Experience Timelines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Education History (Riwayat Pendidikan) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-[#060a20]/80 border border-[#2c67ed]/25 p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_20px_rgba(44,103,237,0.15)] hover:border-[#2c67ed]/40 transition-all"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="p-2.5 rounded-xl bg-[#2c67ed]/20 text-[#60a5fa] border border-[#2c67ed]/40 shadow-[0_0_12px_rgba(44,103,237,0.4)]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Riwayat Pendidikan
              </h3>
              <p className="text-xs text-slate-400">
                Pendidikan formal & landasan akademis
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {educations.map((edu, i) => (
              <div key={i} className="relative pl-6 border-l-2 border-[#2c67ed]/30 group">
                {/* Node Orb */}
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#04081c] border-2 border-[#2c67ed] group-hover:scale-125 group-hover:bg-[#2c67ed] shadow-[0_0_10px_#2c67ed] transition-all" />

                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                    {edu.institution}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-mono">
                    {edu.start_date} — {edu.is_current ? "Sekarang" : edu.end_date}
                  </span>
                </div>

                <p className="text-sm text-blue-200/90 font-medium mb-1">
                  {edu.degree} · {edu.field_of_study}
                </p>

                {edu.location && (
                  <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{edu.location}</span>
                  </p>
                )}

                {edu.description && (
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Experience History (Riwayat Pengalaman) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl bg-[#060a20]/80 border border-[#2c67ed]/25 p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_20px_rgba(44,103,237,0.15)] hover:border-[#2c67ed]/40 transition-all"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.4)]">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Pengalaman & Karier
              </h3>
              <p className="text-xs text-slate-400">
                Kolaborasi industri, peran teknis, & kontribusi tim
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {experiences.map((exp, i) => (
              <div key={i} className="relative pl-6 border-l-2 border-indigo-500/30 group">
                {/* Node Orb */}
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#04081c] border-2 border-indigo-400 group-hover:scale-125 group-hover:bg-indigo-500 shadow-[0_0_10px_#6366f1] transition-all" />

                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {exp.role_title}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs font-mono">
                    {exp.start_date} — {exp.is_current ? "Sekarang" : exp.end_date}
                  </span>
                </div>

                <p className="text-sm text-indigo-200/90 font-medium mb-1">
                  {exp.company}
                </p>

                {exp.location && (
                  <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{exp.location}</span>
                  </p>
                )}

                {exp.description && (
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                    {exp.description}
                  </p>
                )}

                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {exp.responsibilities.map((resp, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2c67ed] shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

