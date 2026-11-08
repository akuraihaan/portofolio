"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Server, Database, Globe, Cloud, Cpu, Lock, Sparkles, Layers, ArrowRight } from "lucide-react";
import { playCyberSound } from "./CyberAudio";

interface ArchitectureNode {
  id: string;
  tier: string;
  title: string;
  tech: string[];
  specs: string;
  status: "ACTIVE" | "ARMORED" | "SCALABLE";
}

const NODES: ArchitectureNode[] = [
  {
    id: "edge",
    tier: "TIER 01 // INGRESS",
    title: "Global Edge & Routing",
    tech: ["Vercel Edge Network", "HTTP/3", "Anycast DNS"],
    specs: "Latency: <15ms · 100+ PoPs worldwide · Automatic SSL/TLS",
    status: "ACTIVE",
  },
  {
    id: "app",
    tier: "TIER 02 // RUNTIME",
    title: "Next.js 16 Turbopack",
    tech: ["React 19 SSR", "Framer Motion", "TypeScript 5.5"],
    specs: "Zero-bundle server components · Fluid 60fps animations · Dynamic SEO",
    status: "SCALABLE",
  },
  {
    id: "data",
    tier: "TIER 03 // PERSISTENCE",
    title: "Supabase Relational Vault",
    tech: ["PostgreSQL 15", "Row-Level Security (RLS)", "Storage Buckets"],
    specs: "ACID compliance · Real-time CDC replication · AES-256 encrypted",
    status: "ARMORED",
  },
  {
    id: "cloud",
    tier: "TIER 04 // CLUSTER",
    title: "Google Cloud Infrastructure",
    tech: ["Cloud Run Microservices", "Artifact Registry", "Docker"],
    specs: "Bangkit Capstone infrastructure · Serverless auto-scaling 0→N",
    status: "ACTIVE",
  },
];

export function SystemArchitectureDiagram() {
  const [activeNode, setActiveNode] = useState<ArchitectureNode>(NODES[1]);

  return (
    <section className="py-20 relative border-t border-[#171816]/10 dark:border-white/10 bg-[#171816]/[0.02] dark:bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <span className="font-pixel text-[9px] px-2.5 py-1 bg-[#171816] dark:bg-[#C8F169] text-[#C8F169] dark:text-[#171816] font-bold">
            [SCHEMATIC // ARCHITECTURE]
          </span>
          <span className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] tracking-wider uppercase">
            FULL-STACK SYSTEM TOPOLOGY
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-[#171816] dark:text-[#F4F3EE] tracking-tight">
            Engineering Blueprint.
          </h2>
          <p className="font-mono text-xs sm:text-sm text-[#777970] dark:text-[#A1A49A] max-w-md">
            Arsitektur cloud-native dan standar rekayasa perangkat lunak yang menopang seluruh platform BWORIEY.
          </p>
        </div>

        {/* Interactive Architecture Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 4 Tiers */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {NODES.map((node) => {
              const isSelected = activeNode.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => {
                    playCyberSound("click");
                    setActiveNode(node);
                  }}
                  className={`p-5 border-2 transition-all cursor-pointer relative ${
                    isSelected
                      ? "bg-white dark:bg-[#1C1F1A] border-[#171816] dark:border-[#C8F169] shadow-pixel-lg"
                      : "bg-white/60 dark:bg-[#111310] border-[#171816]/20 dark:border-white/10 hover:border-[#171816] dark:hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#171816]/10 dark:border-white/10 font-pixel text-[8px]">
                    <span className="text-[#777970] dark:text-[#A1A49A]">{node.tier}</span>
                    <span
                      className={`px-1.5 py-0.5 font-bold ${
                        node.status === "ARMORED"
                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/30"
                          : "bg-[#C8F169]/10 text-[#171816] dark:text-[#C8F169] border border-[#C8F169]/30"
                      }`}
                    >
                      [{node.status}]
                    </span>
                  </div>

                  <h3 className="font-display font-black text-xl text-[#171816] dark:text-[#F4F3EE] mb-3">
                    {node.title}
                  </h3>

                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {node.tech.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[9px] px-2 py-0.5 bg-[#171816]/5 dark:bg-white/5 border border-[#171816]/10 dark:border-white/10 text-[#171816] dark:text-[#F4F3EE]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-[#C8F169]" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Node Inspector Panel */}
          <div className="lg:col-span-5 bg-[#171816] text-[#F4F3EE] border-2 border-[#171816] dark:border-[#C8F169] p-6 shadow-pixel-lg">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 font-pixel text-[9px] text-[#C8F169]">
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5" />
                <span>INSPECTOR // {activeNode.id.toUpperCase()}</span>
              </div>
              <span className="animate-pulse">● LIVE METRICS</span>
            </div>

            <span className="font-pixel text-[9px] text-[#A1A49A] block mb-1">
              {activeNode.tier}
            </span>
            <h4 className="font-display font-black text-2xl text-white mb-4">
              {activeNode.title}
            </h4>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-3 bg-[#0E1013] border border-white/10">
                <span className="text-[#A1A49A] block text-[10px] uppercase font-pixel mb-1">
                  SPESIFIKASI TEKNIS
                </span>
                <p className="text-[#F4F3EE] leading-relaxed">{activeNode.specs}</p>
              </div>

              <div className="p-3 bg-[#0E1013] border border-white/10">
                <span className="text-[#A1A49A] block text-[10px] uppercase font-pixel mb-1">
                  STACK MODEREN
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {activeNode.tech.map((item) => (
                    <span
                      key={item}
                      className="px-2 py-0.5 bg-[#C8F169]/10 border border-[#C8F169]/40 text-[#C8F169] text-[10px]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#0E1013] border border-white/10">
                <span className="text-[#A1A49A] block text-[10px] uppercase font-pixel mb-1">
                  KEUNGGULAN OPERASIONAL
                </span>
                <p className="text-[#A1A49A] text-[11px] leading-relaxed">
                  Semua transaksi data dilindungi RLS, build dioptimasi dengan Next.js Turbopack, dan aset statis terdistribusi ke edge untuk responsifitas instan tanpa jeda rendering.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

