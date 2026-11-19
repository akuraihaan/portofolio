"use client";

import React from "react";
import { GraduationCap, Award, MapPin, CheckCircle, Terminal, ExternalLink } from "lucide-react";
import { CardTilt3D, FloatingObject, Reveal, TextScramble } from "../motion";
import { useMotionContext } from "../motion/MotionProvider";

interface BrutalistAboutProps {
  avatarUrl?: string | null;
  bioParagraphs?: string[];
  ownerName?: string;
  almamater?: string;
  degree?: string;
  gpa?: string;
  tags?: string[];
}

export function BrutalistAbout({
  avatarUrl = "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/avatars/avatar-bworiey.png",
  bioParagraphs,
  ownerName = "Taufik Raihandani",
  almamater = "UNIV. LAMBUNG MANGKURAT",
  degree = "S.Pd. KOMPUTER 2026",
  gpa = "IPK 3.54 / 4.00",
  tags = [
    "Web Engineering",
    "Cloud Computing (GCP)",
    "Educational Technology",
    "Learning Analytics",
    "Interactive UI/UX",
    "TypeScript Ecosystem",
  ],
}: BrutalistAboutProps) {
  const { setCursor, resetCursor } = useMotionContext();

  const defaultBio = [
    `Saya ${ownerName}, lulusan Sarjana Pendidikan Komputer dari Universitas Lambung Mangkurat yang berfokus pada rekayasa web modern, arsitektur komputasi awan, dan teknologi edukasi interaktif.`,
    "Saya memadukan prinsip rekayasa perangkat lunak modern dengan pendekatan pedagogi komputasi untuk merancang solusi digital yang berkinerja tinggi, terukur, dan bermakna bagi pengguna.",
    "Berpengalaman memimpin tim sebagai Cloud Computing Cohort Lead di Bangkit Academy serta aktif mempublikasikan riset media pembelajaran interaktif di forum nasional.",
  ];

  const paragraphs = bioParagraphs && bioParagraphs.length > 0 ? bioParagraphs : defaultBio;

  return (
    <section
      id="about"
      className="py-20 md:py-28 px-4 md:px-8 bg-[#F4F4F0] dark:bg-[#0A0A0A] text-black dark:text-[#F4F4F0] border-b-4 border-black dark:border-white transition-colors duration-200 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header Tag */}
        <Reveal direction="down">
          <div className="flex items-center gap-3 mb-10">
            <span className="font-mono text-xs font-black bg-black text-[#FFE500] dark:bg-white dark:text-black px-2.5 py-1 border-2 border-black dark:border-white shadow-[2px_2px_0px_#FF5C00]">
              <TextScramble text="02 // ABOUT" />
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight">
              PROFIL & REKAM JEJAK
            </h2>
          </div>
        </Reveal>

        {/* Asymmetrical Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Visual Profile Card & Stickers (5 cols) */}
          <div className="lg:col-span-5 relative">
            <CardTilt3D tiltMax={8} scaleHover={1.02}>
              <div
                onMouseEnter={() => setCursor({ active: true, text: "PROFIL" })}
                onMouseLeave={resetCursor}
                className="relative p-4 bg-white dark:bg-[#141414] border-4 border-black dark:border-white shadow-[8px_8px_0px_#0047FF]"
              >
                {/* Top Card Bar */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-black dark:border-neutral-700 font-mono text-xs font-bold">
                  <span className="text-black dark:text-white flex items-center gap-1.5">
                    <Terminal size={14} />
                    <span>ID: TAUFIK_R.SPEC</span>
                  </span>
                  <span className="bg-[#FFE500] text-black px-2 py-0.5 border border-black text-[10px]">
                    VERIFIED
                  </span>
                </div>

                {/* Profile Image with neo-brutalist treatment */}
                <div className="relative aspect-[4/5] w-full border-3 border-black overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                  <img
                    src={
                      avatarUrl ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                    }
                    alt="Taufik Raihandani - Creative Developer"
                    className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 hover:scale-105 transition-all duration-300"
                  />

                  {/* Floating Stamp over Image */}
                  <div className="absolute bottom-3 left-3 bg-[#FF5C00] text-white font-mono text-[11px] font-black px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_#000] rotate-[-3deg]">
                    {degree}
                  </div>
                </div>

                {/* Identity Footer Strip */}
                <div className="mt-3 pt-3 border-t-2 border-black dark:border-neutral-700 grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div>
                    <span className="text-neutral-500 block">ALMAMATER:</span>
                    <span className="font-bold">{almamater}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">STATUS KELULUSAN:</span>
                    <span className="font-bold text-[#0047FF] dark:text-[#FFE500]">{gpa}</span>
                  </div>
                </div>
              </div>
            </CardTilt3D>

            {/* Sticker Behind Profile with Floating Animation */}
            <div className="hidden sm:block absolute -bottom-5 -right-4 z-10">
              <FloatingObject amplitude={6} duration={4} rotateAmplitude={4}>
                <div className="bg-[#FFE500] text-black font-mono text-xs font-black px-3 py-1.5 border-3 border-black shadow-[4px_4px_0px_#000]">
                  ✦ CLOUD COHORT LEAD 2024
                </div>
              </FloatingObject>
            </div>
          </div>

          {/* Right Column: Editorial Narrative (Strictly 3 Sentences Max) & Spec Grid (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* The 3-Sentence Bio with Staggered Reveals */}
            <Reveal direction="up" delay={0.1}>
              <div className="p-6 md:p-8 bg-white dark:bg-[#141414] border-4 border-black dark:border-white shadow-[8px_8px_0px_#FF5C00]">
                <span className="font-mono text-xs font-bold text-[#FF5C00] uppercase block mb-2">
                  // RINGKASAN PROFIL EKSEKUTIF
                </span>
                {paragraphs.map((p, pIdx) => (
                  <p
                    key={pIdx}
                    className={`font-sans text-lg md:text-xl font-medium leading-relaxed text-neutral-900 dark:text-neutral-100 ${
                      pIdx > 0 ? "mt-4" : ""
                    }`}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>

            {/* Neo-Brutalist Specs Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#FFE500] text-black border-3 border-black shadow-[4px_4px_0px_#000]">
                <div className="flex items-center gap-2 font-display font-black text-sm mb-1">
                  <GraduationCap size={18} className="stroke-[2.5]" />
                  <span>AKADEMIK & RISET</span>
                </div>
                <p className="font-mono text-xs font-semibold leading-relaxed">
                  Lulusan Pendidikan Komputer ULM dengan skripsi implementasi <em>Learning Analytics</em> pada media pembelajaran interaktif Tailwind CSS.
                </p>
              </div>

              <div className="p-4 bg-[#0047FF] text-white border-3 border-black shadow-[4px_4px_0px_#000]">
                <div className="flex items-center gap-2 font-display font-black text-sm mb-1">
                  <Award size={18} className="stroke-[2.5]" />
                  <span>INDUSTRI & KOMPETISI</span>
                </div>
                <p className="font-mono text-xs font-semibold leading-relaxed">
                  Alumni Bangkit Academy (Google, GoTo, Traveloka) & Juara 2 Pekan Seni Mahasiswa (Peksiminas) bidang desain media kampanye.
                </p>
              </div>
            </div>

            {/* Personal Tags & Core Focus */}
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white font-mono text-xs font-bold border-2 border-black dark:border-neutral-600 shadow-[2px_2px_0px_#000] dark:shadow-[2px_2px_0px_#FFE500]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
