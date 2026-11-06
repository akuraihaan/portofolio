"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, Calendar, Sparkles, ArrowUpRight } from "lucide-react";

export interface ExperienceItem {
  id?: string;
  company: string;
  role_title: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
  responsibilities?: string[];
  organization_url?: string;
}

interface SpaceExperienceProps {
  experiences?: ExperienceItem[];
}

export function SpaceExperience({
  experiences = [
    {
      company: "Bangkit Academy Batch 2024",
      role_title: "Cloud Computing Cohort & Cloud Engineer",
      location: "Jakarta, Indonesia (Kampus Merdeka)",
      start_date: "Agu 2024",
      end_date: "Jan 2025",
      is_current: false,
      description:
        "Program kesiapan karier bersertifikat dari Kampus Merdeka, yang dipimpin oleh Google, GoTo, Tokopedia, dan Traveloka. Bertanggung jawab atas perancangan arsitektur Google Cloud, implementasi RESTful API, dan integrasi backend ke aplikasi Android 'Combridge'.",
      responsibilities: [
        "Google Cloud Platform",
        "Cloud Run & Storage",
        "RESTful API",
        "Express.js",
        "Microservices",
        "Team Collaboration",
      ],
      organization_url: "https://grow.google/intl/id_id/bangkit/",
    },
    {
      company: "Universitas Lambung Mangkurat",
      role_title: "Asistensi Web & Laboratorium Komputer",
      location: "Banjarmasin, Indonesia",
      start_date: "2023",
      end_date: "2024",
      is_current: false,
      description:
        "Mendampingi mahasiswa dan siswa dalam pembelajaran pemrograman web (HTML, CSS, Tailwind CSS), logika algoritma dasar, dan pengelolaan basis data MySQL.",
      responsibilities: ["Tailwind CSS", "Web Development", "MySQL", "Mentoring"],
    },
  ],
}: SpaceExperienceProps) {
  return (
    <section
      id="experience"
      className="w-full max-w-7xl mx-auto py-24 md:py-32 cursor-default px-6 md:px-12 border-t border-blue-900/20 relative"
    >
      {/* Ambient Backdrop */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Eyebrow & Section Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16 md:mb-20 text-left"
      >
        <h2 className="text-sm font-bold tracking-[0.2em] text-[#6ba0ff] uppercase mb-3 flex items-center gap-2">
          <Briefcase className="w-3.5 h-3.5 text-[#2c67ed]" />
          <span>Career Path</span>
        </h2>
        <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter">
          Work <span className="text-[#2c67ed] drop-shadow-[0_0_20px_rgba(44,103,237,0.6)]">Experience</span>
        </h3>
      </motion.div>

      {/* Interactive Spotlight List (group/list with hover dimming effect) */}
      <div className="relative group/list flex flex-col space-y-4">
        {experiences.map((exp, idx) => (
          <motion.div
            key={exp.id || idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="group/item relative grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 p-6 md:p-8 rounded-2xl transition-all duration-500 hover:!opacity-100 hover:!blur-none group-hover/list:opacity-40 group-hover/list:blur-[1px] hover:bg-[#060a20]/90 hover:shadow-[0_0_30px_rgba(44,103,237,0.25)] border border-transparent hover:border-[#2c67ed]/40"
          >
            {/* Period & Location (4 cols) */}
            <div className="md:col-span-4 flex flex-col justify-start">
              <span className="text-xs font-mono text-blue-300 tracking-wider uppercase mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#2c67ed]" />
                <span>
                  {exp.start_date} — {exp.is_current ? "Sekarang" : exp.end_date}
                </span>
              </span>
              <span className="text-sm font-bold text-slate-200">
                {exp.company}
              </span>
              {exp.location && (
                <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>{exp.location}</span>
                </span>
              )}
            </div>

            {/* Role, Description, & Skills (8 cols) */}
            <div className="md:col-span-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover/item:text-blue-300 transition-colors">
                    {exp.role_title}
                  </h4>
                  {exp.organization_url && (
                    <a
                      href={exp.organization_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      title="Kunjungi website"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <p className="text-sm text-slate-300 leading-relaxed font-normal mb-5">
                  {exp.description}
                </p>
              </div>

              {/* Technologies / Skills Pills */}
              {exp.responsibilities && exp.responsibilities.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                  {exp.responsibilities.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-blue-200/90"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

