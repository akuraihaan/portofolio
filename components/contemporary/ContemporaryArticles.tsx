"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, Clock, ArrowRight, Calendar, BookOpen } from "lucide-react";
import { EASINGS, DURATION } from "../motion/MotionSystem";

export interface ContemporaryArticleItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content?: string;
  thumbnail_url?: string | null;
  tags?: string[];
  created_at?: string;
  reading_time?: string;
}

export const defaultContemporaryArticles: ContemporaryArticleItem[] = [
  {
    id: "art-1",
    slug: "learning-analytics-tailwind-css",
    title: "Implementasi Learning Analytics pada Web Tutorial Tailwind CSS Interaktif",
    category: "Teknologi Pendidikan",
    excerpt:
      "Bagaimana mengukur waktu pengerjaan (dwell time) dan pola kesalahan sintaks mahasiswa saat mempelajari utility-first CSS langsung di browser.",
    tags: ["Learning Analytics", "Tailwind CSS", "Laravel", "Pedagogi"],
    created_at: "12 Maret 2026",
    reading_time: "6 Menit Baca",
    thumbnail_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/projects/cover-flowwind.png",
  },
  {
    id: "art-2",
    slug: "arsitektur-cloud-serverless-bisindo",
    title: "Membangun Arsitektur Microservices Serverless BISINDO di Google Cloud Run",
    category: "Cloud Computing",
    excerpt:
      "Arsitektur backend capstone Bangkit Academy 2024: kontainerisasi Docker, auto-scaling GCP Cloud Run, dan integrasi API inferensi model machine learning.",
    tags: ["GCP", "Cloud Run", "Docker", "Express.js", "BISINDO"],
    created_at: "20 Januari 2025",
    reading_time: "8 Menit Baca",
    thumbnail_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/experiences/logos/ef4d0997-13e2-4034-97ee-328963e2351a/b7d3bc6d-213a-41eb-81d8-c63ba5b9640a-images.png",
  },
  {
    id: "art-3",
    slug: "state-management-react-19-server-actions",
    title: "Eksplorasi React 19: Server Actions, useActionState, dan Optimistic UI",
    category: "Rekayasa Web",
    excerpt:
      "Menganalisis pergeseran paradigma data fetching dan mutasi formulir pada React 19 tanpa library state management eksternal.",
    tags: ["React 19", "Next.js 16", "TypeScript", "Frontend"],
    created_at: "05 November 2024",
    reading_time: "5 Menit Baca",
    thumbnail_url: null,
  },
];

interface ContemporaryArticlesProps {
  articles?: ContemporaryArticleItem[];
}

export function ContemporaryArticles({
  articles = defaultContemporaryArticles,
}: ContemporaryArticlesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const prefersReduced = useReducedMotion();

  const categories = useMemo(() => {
    const list = Array.from(new Set(articles.map((a) => a.category).filter(Boolean)));
    return ["Semua", ...list];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchCat =
        selectedCategory === "Semua" || a.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags?.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [articles, selectedCategory, searchQuery]);

  const inView = (delay = 0) =>
    prefersReduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-6%" },
          transition: { duration: DURATION.medium, delay, ease: EASINGS.editorial },
        };

  return (
    <section
      id="artikel"
      className="w-full max-w-7xl mx-auto py-24 md:py-36 px-6 sm:px-8 border-t border-black/[0.08] dark:border-white/[0.1]"
    >
      {/* Section Header */}
      <motion.div {...inView(0)} className="flex items-center gap-3 mb-16">
        <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#2563EB] dark:text-[#C8F169] uppercase">
          07 // ARTIKEL &amp; TULISAN
        </span>
        <div className="h-px flex-1 bg-black/[0.08] dark:border-white/[0.1]" />
        <span className="font-mono text-xs text-[#71717A] dark:text-[#A1A1AA] uppercase">
          BASIS PENGETAHUAN
        </span>
      </motion.div>

      {/* Main Headline */}
      <motion.div {...inView(0.06)} className="max-w-3xl mb-12">
        <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight text-[#121214] dark:text-[#F4F4F6] leading-tight mb-4">
          Tulisan ilmiah, catatan arsitektur sistem, dan diseminasi komputasi.
        </h2>
        <p className="font-sans text-base text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
          Dokumentasi mendalam seputar riset teknologi pendidikan, arsitektur komputasi awan serverless, dan eksplorasi implementasi framework web modern.
        </p>
      </motion.div>

      {/* Search & Category Filter */}
      <motion.div
        {...inView(0.1)}
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-14 pb-6 border-b border-black/[0.08] dark:border-white/[0.1]"
      >
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#121214] text-white dark:bg-[#F4F4F6] dark:text-[#121214] font-bold"
                  : "bg-black/[0.04] text-[#71717A] dark:bg-white/[0.06] hover:text-[#121214] dark:hover:text-[#F4F4F6]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari artikel atau topik..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-white dark:bg-[#121214] border border-black/[0.12] dark:border-white/[0.15] text-xs font-mono text-[#121214] dark:text-[#F4F4F6] placeholder-[#71717A] focus:outline-none focus:ring-1 focus:ring-[#2563EB] dark:focus:ring-[#C8F169]"
          />
        </div>
      </motion.div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <AnimatePresence mode="popLayout">
          {filteredArticles.map((art, idx) => (
            <motion.div
              key={art.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.28, delay: idx * 0.06, ease: EASINGS.editorial }}
              className="bg-white dark:bg-[#121214] rounded-2xl border border-black/[0.08] dark:border-white/[0.1] p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:border-black/20 dark:hover:border-white/20 transition-all group"
            >
              <div>
                {/* Meta Strip */}
                <div className="flex items-center justify-between font-mono text-xs text-[#71717A] dark:text-[#A1A1AA] mb-4 pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
                  <span className="font-semibold text-[#2563EB] dark:text-[#C8F169]">
                    {art.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{art.reading_time || "5 Menit Baca"}</span>
                  </div>
                </div>

                {/* Thumbnail if available */}
                {art.thumbnail_url && (
                  <div className="relative aspect-[16/9] mb-4 overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-[#F0EFEB] dark:bg-[#080809]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={art.thumbnail_url}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Title */}
                <h3 className="font-display font-bold text-lg sm:text-xl text-[#121214] dark:text-[#F4F4F6] mb-3 leading-snug group-hover:text-[#2563EB] dark:group-hover:text-[#C8F169] transition-colors line-clamp-2">
                  <Link href={`/articles/${art.slug}`}>
                    {art.title}
                  </Link>
                </h3>

                {/* Excerpt */}
                <p className="font-sans text-xs sm:text-sm text-[#121214]/75 dark:text-[#F4F4F6]/75 leading-relaxed mb-5 line-clamp-3">
                  {art.excerpt}
                </p>

                {/* Tags */}
                {art.tags && art.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {art.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/[0.04] dark:bg-white/[0.06] text-[#71717A] dark:text-[#A1A1AA]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Read Action Footer */}
              <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between font-mono text-xs">
                <span className="text-[#71717A] dark:text-[#A1A1AA] flex items-center gap-1.5 text-[11px]">
                  <Calendar className="w-3.5 h-3.5" />
                  {art.created_at || "2026"}
                </span>
                <Link
                  href={`/articles/${art.slug}`}
                  className="font-bold text-[#121214] dark:text-[#F4F4F6] group-hover:text-[#2563EB] dark:group-hover:text-[#C8F169] inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
                >
                  <span>Baca Artikel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredArticles.length === 0 && (
        <div className="p-12 text-center rounded-2xl border border-dashed border-black/15 dark:border-white/15">
          <BookOpen className="w-8 h-8 mx-auto text-[#71717A] mb-2 opacity-50" />
          <p className="font-mono text-sm text-[#71717A] dark:text-[#A1A1AA]">
            Tidak ada artikel yang cocok dengan pencarian Anda.
          </p>
        </div>
      )}
    </section>
  );
}
