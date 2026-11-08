"use client";

import { motion } from "framer-motion";
import { GraduationCap, Award, BookOpen, Layers, CheckCircle2, MapPin, Compass, Sparkles, Code2 } from "lucide-react";

interface EditorialAboutProps {
  avatarUrl?: string | null;
  ownerName?: string;
  stats?: {
    projectsCount: number;
    certificatesCount: number;
    gpa: string;
    graduationYear: string;
  };
}

export function EditorialAbout({
  avatarUrl = null,
  ownerName = "Taufik Raihandani",
  stats = {
    projectsCount: 6,
    certificatesCount: 6,
    gpa: "3.54",
    graduationYear: "2026",
  },
}: EditorialAboutProps) {
  return (
    <section
      id="about"
      className="w-full max-w-7xl mx-auto py-24 md:py-32 px-6 md:px-12 border-t border-[#e4e1d7] dark:border-[#222530]"
    >
      {/* Section Header with Editorial Numbering */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-16 gap-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold tracking-widest text-forest dark:text-lime uppercase">
            01 / ABOUT
          </span>
          <span className="h-px w-8 bg-black/15 dark:bg-white/20"></span>
          <span className="font-mono text-xs text-charcoal/50 dark:text-white/40">
            DISCOVER PROFILE
          </span>
        </div>
        <span className="font-mono text-[11px] text-charcoal/40 dark:text-white/40">
          BANJARMASIN, ID · EST. 2026
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column: Authentic Portrait Card matching resturhmn.me layout (5 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 flex flex-col items-center justify-center"
        >
          <div className="w-full max-w-[380px] relative">
            {/* Aspect-[4/5] Profile Card with Corner Accents */}
            <div className="relative z-10 p-3 bg-white dark:bg-[#14151b] border border-[#e4e1d7] dark:border-[#222530] rounded-3xl shadow-editorial dark:shadow-none overflow-hidden aspect-[4/5] w-full group transition-all duration-500 hover:border-black/25 dark:hover:border-white/25">
              {/* Corner crosshairs (+) matching reference styling */}
              <div className="absolute top-4 left-4 z-20 font-mono text-xs text-charcoal/30 dark:text-white/30 pointer-events-none select-none">+</div>
              <div className="absolute top-4 right-4 z-20 font-mono text-xs text-charcoal/30 dark:text-white/30 pointer-events-none select-none">+</div>
              <div className="absolute bottom-4 left-4 z-20 font-mono text-xs text-charcoal/30 dark:text-white/30 pointer-events-none select-none">+</div>
              <div className="absolute bottom-4 right-4 z-20 font-mono text-xs text-charcoal/30 dark:text-white/30 pointer-events-none select-none">+</div>

              {/* Media Container */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#faf8f5] dark:bg-[#0c0d10] border border-black/5 dark:border-white/5 flex flex-col items-center justify-center p-6 text-center">
                {avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={avatarUrl}
                    alt={ownerName}
                    className="w-full h-full object-cover rounded-2xl transition-all duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-105">
                    <div className="w-24 h-24 rounded-full bg-forest/10 dark:bg-lime/20 border-2 border-forest/20 dark:border-lime/30 flex items-center justify-center text-3xl font-display font-bold text-forest dark:text-lime mb-4 shadow-sm">
                      TR
                    </div>
                    <h3 className="font-display font-bold text-xl text-charcoal dark:text-white">
                      {ownerName}
                    </h3>
                    <p className="font-mono text-xs text-forest dark:text-lime mt-1 font-semibold">
                      Web & Software Developer
                    </p>
                    <p className="font-mono text-[11px] text-charcoal/50 dark:text-white/40 mt-1">
                      Universitas Lambung Mangkurat
                    </p>
                  </div>
                )}

                {/* Floating Bottom Inset Pill */}
                <div className="absolute bottom-4 left-4 right-4 p-2.5 rounded-xl bg-white/90 dark:bg-[#14151b]/90 border border-black/10 dark:border-white/10 backdrop-blur-md flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-charcoal/80 dark:text-white/80">
                    <span className="w-2 h-2 rounded-full bg-forest dark:bg-lime"></span>
                    S.Pd. Komputer
                  </span>
                  <span className="font-bold text-forest dark:text-lime">Lulus 2026</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar below card */}
            <div className="grid grid-cols-3 gap-2 text-center pt-3 mt-1">
              <div className="p-3 rounded-2xl bg-white dark:bg-[#14151b] border border-[#e4e1d7] dark:border-[#222530]">
                <span className="font-display font-bold text-base text-charcoal dark:text-white block">
                  {stats.projectsCount}+
                </span>
                <span className="font-mono text-[10px] text-charcoal/50 dark:text-white/40 uppercase">
                  Proyek
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-[#14151b] border border-[#e4e1d7] dark:border-[#222530]">
                <span className="font-display font-bold text-base text-charcoal dark:text-white block">
                  {stats.certificatesCount}+
                </span>
                <span className="font-mono text-[10px] text-charcoal/50 dark:text-white/40 uppercase">
                  Sertifikat
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white dark:bg-[#14151b] border border-[#e4e1d7] dark:border-[#222530]">
                <span className="font-display font-bold text-base text-forest dark:text-lime block">
                  {stats.gpa}
                </span>
                <span className="font-mono text-[10px] text-charcoal/50 dark:text-white/40 uppercase">
                  IPK Lulus
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Three Structured Narrative Cards (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-charcoal dark:text-white leading-[1.12] mb-6">
              More than just writing code.
            </h2>
          </motion.div>

          {/* Card 01: Who Am I */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#14151b] border border-[#e4e1d7] dark:border-[#222530] shadow-editorial dark:shadow-none hover:border-black/20 dark:hover:border-white/20 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold text-forest dark:text-lime uppercase tracking-wider">
                01 // Who Am I
              </span>
              <span className="font-mono text-[11px] text-charcoal/40 dark:text-white/40">
                Pendidikan Komputer
              </span>
            </div>
            <h3 className="font-display font-bold text-xl text-charcoal dark:text-white mb-2">
              Lulusan S.Pd. dengan Fokus Rekayasa Web & EdTech
            </h3>
            <p className="text-sm sm:text-base text-charcoal/80 dark:text-white/80 leading-relaxed font-normal">
              Taufik Raihandani merupakan lulusan S.Pd. Pendidikan Komputer dari Universitas Lambung Mangkurat. Memiliki pengalaman dalam pengembangan aplikasi web, pembelajaran Informatika, pengembangan teknologi pendidikan, serta kolaborasi dalam proyek teknologi.
            </p>
            <p className="text-xs sm:text-sm text-charcoal/60 dark:text-white/60 leading-relaxed mt-2">
              Memiliki ketertarikan pada web development, software development, cloud computing, dan pengembangan pengalaman belajar berbasis teknologi.
            </p>
          </motion.div>

          {/* Card 02: My Approach */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#14151b] border border-[#e4e1d7] dark:border-[#222530] shadow-editorial dark:shadow-none hover:border-black/20 dark:hover:border-white/20 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold text-forest dark:text-lime uppercase tracking-wider">
                02 // My Approach
              </span>
              <span className="font-mono text-[11px] text-charcoal/40 dark:text-white/40">
                Metodologi Kerja
              </span>
            </div>
            <h3 className="font-display font-bold text-xl text-charcoal dark:text-white mb-2">
              User-Centered, Performa Teruji, dan Skalabilitas
            </h3>
            <p className="text-sm text-charcoal/80 dark:text-white/80 leading-relaxed">
              Memadukan pemahaman pedagogi (cara orang belajar dan berinteraksi dengan informasi) dengan ketelitian arsitektur software. Antarmuka web dibangun responsif dengan Tailwind CSS, sementara logika backend dan cloud dirancang aman, terstruktur, dan efisien.
            </p>
          </motion.div>

          {/* Card 03: Personal Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#14151b] border border-[#e4e1d7] dark:border-[#222530] shadow-editorial dark:shadow-none hover:border-black/20 dark:hover:border-white/20 transition-all font-mono text-xs"
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-black/5 dark:border-white/10">
              <span className="font-bold text-forest dark:text-lime uppercase tracking-wider">
                03 // Personal Specifications
              </span>
              <span className="text-charcoal/40 dark:text-white/40">Verified Data</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-charcoal/40 dark:text-white/40 block text-[10px] uppercase">Domisili</span>
                <span className="font-bold text-charcoal dark:text-white">Banjarmasin, Kalimantan Selatan</span>
              </div>
              <div>
                <span className="text-charcoal/40 dark:text-white/40 block text-[10px] uppercase">Gelar Akademik</span>
                <span className="font-bold text-charcoal dark:text-white">S.Pd. Pendidikan Komputer</span>
              </div>
              <div>
                <span className="text-charcoal/40 dark:text-white/40 block text-[10px] uppercase">Status Kelulusan</span>
                <span className="font-bold text-forest dark:text-lime">Lulus (Graduated 2026) · GPA 3.54</span>
              </div>
              <div>
                <span className="text-charcoal/40 dark:text-white/40 block text-[10px] uppercase">Kesiapan Kerja</span>
                <span className="font-bold text-forest dark:text-lime">Tersedia untuk Peluang & Proyek</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
