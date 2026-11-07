"use client";

import { motion } from "framer-motion";
import { GraduationCap, Award, BookOpen, Layers, CheckCircle, MapPin, Compass } from "lucide-react";

export function EditorialAbout() {
  const quickFacts = [
    { label: "Education", value: "Computer Education (S.Pd.)" },
    { label: "University", value: "Universitas Lambung Mangkurat" },
    { label: "Graduation", value: "2026 · Status: Lulus" },
    { label: "Academic GPA", value: "3.54 / 4.00" },
    { label: "Primary Focus", value: "Web & Software Development" },
    { label: "Location", value: "Banjarmasin, Kalimantan Selatan" },
  ];

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
            PROFILE & PHILOSOPHY
          </span>
        </div>
        <span className="font-mono text-[11px] text-charcoal/40 dark:text-white/40">
          BANJARMASIN, ID · EST. 2026
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Headline and In-depth Natural Narrative (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-charcoal dark:text-white leading-[1.15]"
          >
            More than just writing code.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4 text-base sm:text-lg text-charcoal/80 dark:text-white/80 leading-relaxed font-normal"
          >
            <p>
              Taufik Raihandani merupakan lulusan S.Pd. Pendidikan Komputer dari Universitas Lambung Mangkurat. Memiliki pengalaman dalam pengembangan aplikasi web, pembelajaran Informatika, pengembangan teknologi pendidikan, serta kolaborasi dalam proyek teknologi.
            </p>
            <p className="text-sm sm:text-base text-charcoal/60 dark:text-white/60">
              Memiliki ketertarikan pada web development, software development, cloud computing, dan pengembangan pengalaman belajar berbasis teknologi. Saya memandang rekayasa perangkat lunak bukan semata susunan fungsi atau baris kode sintaks, melainkan sebuah media untuk menyederhanakan masalah nyata dan memberikan kegunaan nyata bagi penggunanya.
            </p>
          </motion.div>

          {/* Three Core Principles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 mt-2 border-t border-black/5 dark:border-white/10">
            <div className="p-4 rounded-xl bg-[#f5f3ec] dark:bg-[#14151b] border border-black/5 dark:border-white/5">
              <span className="font-mono text-[10px] text-forest dark:text-lime uppercase block mb-1">
                Pilar 01
              </span>
              <h3 className="font-display font-bold text-sm text-charcoal dark:text-white mb-1">
                User-Centered
              </h3>
              <p className="text-xs text-charcoal/60 dark:text-white/60 leading-snug">
                Antarmuka intuitif yang mengutamakan kemudahan navigasi dan aksesibilitas.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#f5f3ec] dark:bg-[#14151b] border border-black/5 dark:border-white/5">
              <span className="font-mono text-[10px] text-forest dark:text-lime uppercase block mb-1">
                Pilar 02
              </span>
              <h3 className="font-display font-bold text-sm text-charcoal dark:text-white mb-1">
                Reliable Code
              </h3>
              <p className="text-xs text-charcoal/60 dark:text-white/60 leading-snug">
                Arsitektur terstruktur, standar keamanan, dan performa yang teruji.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#f5f3ec] dark:bg-[#14151b] border border-black/5 dark:border-white/5">
              <span className="font-mono text-[10px] text-forest dark:text-lime uppercase block mb-1">
                Pilar 03
              </span>
              <h3 className="font-display font-bold text-sm text-charcoal dark:text-white mb-1">
                Educational Tech
              </h3>
              <p className="text-xs text-charcoal/60 dark:text-white/60 leading-snug">
                Mengintegrasikan learning analytics untuk mengukur efektivitas media digital.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Key Facts Grid & Editorial Sidebar (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-white dark:bg-[#14151b] border border-[#e4e1d7] dark:border-[#222530] shadow-editorial dark:shadow-none"
          >
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-charcoal/50 dark:text-white/40 mb-4 pb-3 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
              <span>Personal Specifications</span>
              <Compass className="w-3.5 h-3.5 text-forest dark:text-lime" />
            </h3>

            <dl className="divide-y divide-black/5 dark:divide-white/5">
              {quickFacts.map((fact) => (
                <div key={fact.label} className="py-2.5 flex items-start justify-between text-xs font-mono">
                  <dt className="text-charcoal/50 dark:text-white/40">{fact.label}</dt>
                  <dd className="font-semibold text-charcoal dark:text-white text-right max-w-[200px]">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* Context Note: Lahan Basah & Environment Relevance */}
          <div className="p-5 rounded-2xl bg-[#eeece4] dark:bg-[#0c0d10] border border-black/5 dark:border-white/10 text-xs font-mono text-charcoal/70 dark:text-white/70">
            <span className="text-forest dark:text-lime font-bold block mb-1">
              // Wetland Computing Context
            </span>
            <p className="leading-relaxed">
              Berkiprah di wilayah lahan basah Kalimantan Selatan menginspirasi saya dalam membangun media digital edukasi yang tanggap kebutuhan literasi daerah dan inklusif bagi seluruh lapisan pengguna.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

