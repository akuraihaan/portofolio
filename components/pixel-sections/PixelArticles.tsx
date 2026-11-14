"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PixelCard } from "../pixel3d/PixelCard";
import { PixelReveal } from "../motion/PixelReveal";
import {
  BookOpen,
  Search,
  Clock,
  ArrowRight,
  Tag,
  Calendar,
  Sparkles,
} from "lucide-react";

export interface ArticleItem {
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

export const defaultArticles: ArticleItem[] = [
  {
    id: "art-1",
    slug: "learning-analytics-tailwind-css",
    title: "Implementasi Learning Analytics pada Web Tutorial Tailwind CSS Interaktif",
    category: "Educational Tech",
    excerpt:
      "Bagaimana mengukur waktu pengerjaan (dwell time) dan pola kesalahan sintaks mahasiswa saat mempelajari utility-first CSS langsung di browser.",
    tags: ["Learning Analytics", "Tailwind CSS", "Laravel", "Pedagogy"],
    created_at: "2026-03-12",
    reading_time: "6 MIN READ",
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
    created_at: "2025-01-20",
    reading_time: "8 MIN READ",
    thumbnail_url: "https://txsqhxhnamgteofarqfz.supabase.co/storage/v1/object/public/portfolio-public/experiences/logos/ef4d0997-13e2-4034-97ee-328963e2351a/b7d3bc6d-213a-41eb-81d8-c63ba5b9640a-images.png",
  },
  {
    id: "art-3",
    slug: "state-management-react-19-server-actions",
    title: "Eksplorasi React 19: Server Actions, useActionState, dan Optimistic UI",
    category: "Web Engineering",
    excerpt:
      "Menganalisis pergeseran paradigma data fetching dan mutasi form pada React 19 tanpa library state management eksternal.",
    tags: ["React 19", "Next.js 16", "TypeScript", "Frontend"],
    created_at: "2024-11-05",
    reading_time: "5 MIN READ",
    thumbnail_url: null,
  },
];

interface PixelArticlesProps {
  articles?: ArticleItem[];
}

export function PixelArticles({ articles = defaultArticles }: PixelArticlesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const categories = useMemo(() => {
    const list = Array.from(new Set(articles.map((a) => a.category).filter(Boolean)));
    return ["ALL", ...list];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchCat =
        selectedCategory === "ALL" || a.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags?.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [articles, selectedCategory, searchQuery]);

  return (
    <section
      id="articles"
      className="relative py-28 px-4 sm:px-8 border-b-2 border-[#171816]/10 dark:border-[#C8F169]/15 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <PixelReveal direction="up" delay={0.1}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block w-2.5 h-2.5 bg-[#8E44AD] dark:bg-[#C8F169] animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#777970] dark:text-[#A1A49A]">
                  // SECTION_06 · KNOWLEDGE BASE
                </span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight text-[#171816] dark:text-[#F4F3EE]">
                ARTICLES &amp;{" "}
                <span className="text-[#8E44AD] dark:text-[#C8F169] underline decoration-wavy decoration-2">
                  WRITINGS
                </span>
              </h2>
            </div>
            <p className="font-sans text-sm text-[#777970] dark:text-[#A1A49A] max-w-md">
              Diseminasi riset komputasi, dokumentasi arsitektur cloud, dan panduan rekayasa perangkat lunak modern.
            </p>
          </div>
        </PixelReveal>

        {/* Search & Filter Controls */}
        <PixelReveal direction="up" delay={0.15}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10 pb-6 border-b-2 border-dashed border-[#171816]/15 dark:border-[#C8F169]/20">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider whitespace-nowrap pixel-btn cursor-pointer transition-all ${
                    selectedCategory === cat
                      ? "bg-[#171816] text-[#C8F169] dark:bg-[#C8F169] dark:text-[#171816] font-bold"
                      : "bg-[#E9E8E1] text-[#171816] dark:bg-[#1C1F1A] dark:text-[#A1A49A]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777970] dark:text-[#A1A49A]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari artikel..."
                className="w-full pl-9 pr-3 py-1.5 font-mono text-xs bg-white dark:bg-[#1C1F1A] text-[#171816] dark:text-[#F4F3EE] border-2 border-[#171816] dark:border-[#C8F169]/50 focus:outline-none focus:ring-1 focus:ring-[#C8F169]"
              />
            </div>
          </div>
        </PixelReveal>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredArticles.map((art, idx) => (
              <motion.div
                key={art.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
              >
                <PixelCard
                  variant={idx % 2 === 0 ? "lime" : "default"}
                  className="h-full flex flex-col justify-between p-5 bg-white dark:bg-[#1C1F1A]"
                >
                  <div>
                    {/* Top Meta Strip */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#777970] dark:text-[#A1A49A] mb-3 pb-2 border-b border-[#171816]/10 dark:border-white/10">
                      <span className="px-2 py-0.5 bg-[#8E44AD]/10 text-[#8E44AD] dark:bg-[#C8F169]/10 dark:text-[#C8F169] font-bold">
                        {art.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{art.reading_time || "5 MIN READ"}</span>
                      </div>
                    </div>

                    {/* Thumbnail if available */}
                    {art.thumbnail_url && (
                      <div className="relative aspect-[16/9] mb-4 overflow-hidden border-2 border-[#171816] dark:border-[#C8F169]/40 bg-black/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={art.thumbnail_url}
                          alt={art.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="font-display font-bold text-lg text-[#171816] dark:text-[#F4F3EE] mb-2 leading-snug line-clamp-2">
                      <Link
                        href={`/articles/${art.slug}`}
                        className="hover:text-[#8E44AD] dark:hover:text-[#C8F169] transition-colors"
                      >
                        {art.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="font-sans text-xs text-[#777970] dark:text-[#A1A49A] leading-relaxed mb-4 line-clamp-3">
                      {art.excerpt}
                    </p>

                    {/* Tags */}
                    {art.tags && art.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {art.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-mono px-1.5 py-0.5 bg-[#E9E8E1] dark:bg-[#111310] text-[#171816] dark:text-[#A1A49A] border border-[#171816]/15 dark:border-white/10"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Read Article Link */}
                  <div className="pt-3 border-t border-[#171816]/10 dark:border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#777970] dark:text-[#A1A49A] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {art.created_at || "2026"}
                    </span>
                    <Link
                      href={`/articles/${art.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#8E44AD] dark:text-[#C8F169] hover:translate-x-0.5 transition-transform"
                    >
                      <span>READ_POST</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </PixelCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="p-12 text-center border-2 border-dashed border-[#171816]/20 dark:border-[#C8F169]/30">
            <BookOpen className="w-8 h-8 mx-auto text-[#777970] mb-2 opacity-50" />
            <p className="font-mono text-sm text-[#777970] dark:text-[#A1A49A]">
              TIDAK ADA ARTIKEL YANG DITEMUKAN.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
