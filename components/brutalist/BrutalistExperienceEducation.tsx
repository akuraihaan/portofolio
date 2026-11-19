"use client";

import React from "react";
import { Briefcase, GraduationCap, Award, Calendar, MapPin, CheckCircle2 } from "lucide-react";

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  type: string;
  description: string;
  highlights: string[];
  badgeColor: string;
}

interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  gpa: string;
  focus: string;
  thesis: string;
  highlights: string[];
}

const EXPERIENCES: ExperienceItem[] = [
  {
    id: "exp-1",
    role: "Cloud Computing Cohort Lead",
    company: "Bangkit Academy (Google, GoTo, Traveloka)",
    period: "Februari 2024 — Juli 2024",
    location: "Remote / Indonesia",
    type: "Program Studi Independen Bersertifikat",
    description:
      "Memimpin kelompok mahasiswa dalam jalur Cloud Computing. Mengkoordinasikan weekly sync, mentoring teknis GCP, pemecahan masalah deployment, dan monitoring capstone project.",
    highlights: [
      "Mengawal tim capstone hingga meraih predikat kelompok berkinerja unggul.",
      "Mendampingi implementasi Google Cloud Platform (Cloud Run, Cloud Storage, Compute Engine).",
      "Lulus dengan sertifikasi resmi Google Cloud & Bangkit Graduate Distinction.",
    ],
    badgeColor: "bg-[#0047FF] text-white",
  },
  {
    id: "exp-2",
    role: "Lead Software Engineer & Educational Researcher",
    company: "Riset Skripsi S1 Pendidikan Komputer ULM",
    period: "2024 — 2026",
    location: "Banjarmasin, Kalimantan Selatan",
    type: "Riset & Pengembangan Skripsi",
    description:
      "Merancang dan membangun media pembelajaran interaktif Flowwind Learn untuk mengajarkan sintaks dasar framework Tailwind CSS berbasis Learning Analytics.",
    highlights: [
      "Membangun interactive code runner dan pipeline pengumpulan metrik aktivitas mahasiswa.",
      "Menguji efektivitas materi secara empiris terhadap pemahaman sintaks utility CSS.",
      "Hasil penelitian dipresentasikan dalam Seminar Nasional Komputer (SENDIKOM 2026).",
    ],
    badgeColor: "bg-[#FFE500] text-black",
  },
  {
    id: "exp-3",
    role: "Asisten Dosen & Laboratorium Komputer",
    company: "FKIP Universitas Lambung Mangkurat",
    period: "2022 — 2024",
    location: "Banjarmasin, Kalimantan Selatan",
    type: "Asistensi Akademik",
    description:
      "Membimbing mahasiswa junior dalam praktikum mata kuliah pemrograman web, algoritma & struktur data, serta pengelolaan jaringan laboratorium komputer.",
    highlights: [
      "Membantu evaluasi tugas pemrograman HTML, CSS, JavaScript, dan basis data SQL.",
      "Memelihara kelayakan workstation praktikum lab komputer kampus.",
    ],
    badgeColor: "bg-[#FF5C00] text-white",
  },
  {
    id: "exp-4",
    role: "Juara 2 Nasional Desain Media Kampanye Sosial",
    company: "Pekan Seni Mahasiswa (Peksiminas XVI)",
    period: "2022",
    location: "Tingkat Nasional / Universitas",
    type: "Prestasi Kompetisi Desain",
    description:
      "Merancang materi komunikasi visual dan komik digital interaktif berpesan sosial dalam ajang Pekan Seni Mahasiswa tingkat FKIP ULM.",
    highlights: [
      "Mengintegrasikan prinsip komposisi visual, tipografi naratif, dan pesan edukatif.",
      "Meraih trofi dan piagam penghargaan resmi Juara 2 tingkat universitas.",
    ],
    badgeColor: "bg-[#C8F169] text-black",
  },
];

const EDUCATION: EducationItem = {
  institution: "Universitas Lambung Mangkurat",
  degree: "S1 Pendidikan Komputer (Sarjana Pendidikan / S.Pd.)",
  period: "2020 — 2026",
  gpa: "3.54 / 4.00 (Sangat Memuaskan)",
  focus: "Rekayasa Perangkat Lunak Web, Komputasi Awan & Media Pembelajaran Interaktif",
  thesis: "Penerapan Learning Analytics pada Web Pembelajaran Interaktif Framework CSS Tailwind Dasar",
  highlights: [
    "Konsentrasi keahlian pada rekayasa web frontend modern dan integrasi basis data awan.",
    "Skripsi berhasil diuji dan dinyatakan lulus dengan nilai memuaskan.",
    "Aktif dalam organisasi kepengurusan mahasiswa teknologi dan asisten laboratorium.",
  ],
};

export function BrutalistExperienceEducation() {
  return (
    <section
      id="experience"
      className="py-20 md:py-28 px-4 md:px-8 bg-[#F4F4F0] dark:bg-[#0A0A0A] text-black dark:text-[#F4F4F0] border-b-4 border-black dark:border-white transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs font-black bg-black text-[#FFE500] dark:bg-white dark:text-black px-2.5 py-1 border-2 border-black dark:border-white shadow-[2px_2px_0px_#FF5C00]">
                05 // TIMELINE
              </span>
              <span className="font-mono text-xs font-bold text-[#FF5C00] uppercase">
                REKAM JEJAK PROFESIONAL & AKADEMIK
              </span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tighter">
              EXPERIENCE & EDUCATION
            </h2>
          </div>

          <p className="font-sans text-base md:text-lg max-w-md text-neutral-700 dark:text-neutral-300">
            Perjalanan kepemimpinan industri, pengabdian laboratorium, serta pondasi keilmuan Pendidikan Komputer.
          </p>
        </div>

        {/* Asymmetrical Split Grid: Experiences (7 cols) + Education (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Professional Experiences (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-3 bg-black text-[#FFE500] dark:bg-white dark:text-black border-3 border-black font-mono text-xs font-black flex items-center justify-between shadow-[3px_3px_0px_#0047FF]">
              <span className="flex items-center gap-2">
                <Briefcase size={16} />
                <span>PENGALAMAN REKAYASA & KEPEMIMPINAN</span>
              </span>
              <span>4 RECORD RESMI</span>
            </div>

            <div className="space-y-4">
              {EXPERIENCES.map((exp, idx) => (
                <div
                  key={exp.id}
                  className="p-5 md:p-6 bg-white dark:bg-[#141414] border-4 border-black dark:border-white shadow-[5px_5px_0px_#000] dark:shadow-[5px_5px_0px_#FFF] hover:shadow-[8px_8px_0px_#FFE500] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200"
                >
                  {/* Top Bar with Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span
                      className={`font-mono text-[10px] font-black px-2.5 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000] ${exp.badgeColor}`}
                    >
                      {exp.type}
                    </span>
                    <span className="font-mono text-xs font-bold text-neutral-600 dark:text-neutral-400">
                      {exp.period}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-xl md:text-2xl uppercase tracking-tight text-black dark:text-white mt-1">
                    {exp.role}
                  </h3>

                  <div className="font-mono text-xs font-bold text-[#0047FF] dark:text-[#FFE500] mb-3">
                    {exp.company} • {exp.location}
                  </div>

                  <p className="font-sans text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed mb-4">
                    {exp.description}
                  </p>

                  <ul className="space-y-1.5 border-t-2 border-dashed border-neutral-300 dark:border-neutral-700 pt-3">
                    {exp.highlights.map((h, hIdx) => (
                      <li
                        key={hIdx}
                        className="font-mono text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2"
                      >
                        <span className="text-[#FF5C00] font-bold">›</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Academic Education Focus Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-3 bg-[#FFE500] text-black border-3 border-black font-mono text-xs font-black flex items-center justify-between shadow-[3px_3px_0px_#000]">
              <span className="flex items-center gap-2">
                <GraduationCap size={18} />
                <span>PENDIDIKAN TINGGI FORMAL</span>
              </span>
              <span>TERAKREDITASI</span>
            </div>

            {/* Neo-brutalist Master Degree Card */}
            <div className="p-6 md:p-8 bg-white dark:bg-[#141414] border-4 border-black dark:border-white shadow-[8px_8px_0px_#FF5C00]">
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-black dark:border-neutral-700">
                <span className="font-mono text-xs font-black bg-[#FF5C00] text-white px-2.5 py-1 border border-black shadow-[2px_2px_0px_#000]">
                  STRATA 1 (S1)
                </span>
                <span className="font-mono text-xs font-bold text-neutral-500">
                  {EDUCATION.period}
                </span>
              </div>

              <h3 className="font-display font-black text-2xl md:text-3xl uppercase tracking-tight mb-1">
                {EDUCATION.institution}
              </h3>
              <p className="font-mono text-sm font-bold text-[#0047FF] dark:text-[#FFE500] mb-4">
                {EDUCATION.degree}
              </p>

              {/* GPA Stamp Box */}
              <div className="p-4 bg-[#FFE500] text-black border-3 border-black shadow-[4px_4px_0px_#000] mb-6">
                <span className="font-mono text-[10px] font-black uppercase text-neutral-800 block">
                  INDEKS PRESTASI KUMULATIF (IPK):
                </span>
                <div className="font-display font-black text-3xl tracking-tight">
                  {EDUCATION.gpa}
                </div>
              </div>

              {/* Thesis Specification Box */}
              <div className="p-4 bg-neutral-100 dark:bg-[#1A1A1A] border-2 border-black dark:border-neutral-700 mb-6">
                <span className="font-mono text-xs font-black uppercase text-[#FF5C00] block mb-1">
                  JUDUL SKRIPSI PENELITIAN:
                </span>
                <p className="font-sans text-sm font-medium italic leading-relaxed text-neutral-900 dark:text-neutral-100">
                  "{EDUCATION.thesis}"
                </p>
              </div>

              {/* Competency Highlights */}
              <div className="space-y-2">
                <span className="font-mono text-xs font-black uppercase text-neutral-600 dark:text-neutral-400 block">
                  KOMPETENSI AKADEMIK UTAMA:
                </span>
                <ul className="space-y-2 font-mono text-xs">
                  {EDUCATION.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-neutral-800 dark:text-neutral-200">
                      <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick Sticker Tag */}
            <div className="p-4 bg-[#0047FF] text-white border-3 border-black shadow-[4px_4px_0px_#000] font-mono text-xs font-bold leading-relaxed">
              ✦ "Menggabungkan pemahaman pedagogi kurikulum dengan keahlian implementasi kode rekayasa perangkat lunak modern."
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
