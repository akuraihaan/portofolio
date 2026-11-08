"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Send, X, Bot, Sparkles, ChevronDown, RefreshCw } from "lucide-react";
import { playCyberSound } from "./CyberAudio";

interface ChatMessage {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: string;
}

const PRESET_QUERIES = [
  { label: "Research Skripsi", prompt: "Jelaskan riset skripsi Flowwind Learn & Learning Analytics Taufik!" },
  { label: "Cloud Bangkit", prompt: "Bagaimana arsitektur cloud Bangkit Academy & Google Cloud yang dikembangkan Taufik?" },
  { label: "Tech Stack Matrix", prompt: "Ringkas seluruh tech stack utama dan keahlian rekayasa sistem Taufik." },
  { label: "Kolaborasi & Kontak", prompt: "Bagaimana cara mengajak Taufik berkolaborasi atau merekrutnya?" },
];

export function AiCopilotTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "copilot",
      text: "Halo! Saya BWORIEY Neural Copilot v4.2. Siap menjawab pertanyaan seputar arsitektur sistem, riset skripsi, tech stack, dan riwayat profesional Taufik Raihandani. Pilih topik di bawah atau ketik langsung:",
      timestamp: "NOW",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || inputVal).trim();
    if (!q || isTyping) return;

    playCyberSound("click");
    setInputVal("");

    const nowStr = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: nowStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let reply = "";
      const lower = q.toLowerCase();

      if (lower.includes("skripsi") || lower.includes("flowwind") || lower.includes("learning analytics")) {
        reply = "Taufik mengembangkan **Flowwind Learn** sebagai tugas akhir S.Pd. Pendidikan Komputer di Universitas Lambung Mangkurat (2026). Platform ini adalah media pembelajaran web interaktif untuk materi CSS dasar hingga Tailwind CSS dengan sistem Learning Analytics terintegrasi. Instruktur dapat memantau pola belajar siswa, dwell time, dan pemahaman sintaks secara real-time tanpa perlu instalasi build tool lokal.";
      } else if (lower.includes("bangkit") || lower.includes("cloud") || lower.includes("combridge") || lower.includes("gcp")) {
        reply = "Di **Bangkit Academy 2024 Batch 2** (program kesiapan karier pimpinan Google, GoTo, Tokopedia & Traveloka), Taufik bertindak sebagai Cloud Computing Engineer pada proyek capstone **ComBridge BISINDO**. Beliau merancang arsitektur microservices berbasis Google Cloud Run, pipeline machine learning translation, RESTful API Express.js, dan kontainerisasi Docker untuk menerjemahkan bahasa isyarat ke teks secara realtime.";
      } else if (lower.includes("tech") || lower.includes("stack") || lower.includes("skill") || lower.includes("keahlian")) {
        reply = "Tech Stack Taufik mencakup:\n• **Frontend**: Next.js 16 (Turbopack), React 19, TypeScript 5, Tailwind CSS v4, Framer Motion, Three.js.\n• **Backend**: Node.js/Express, Go, PHP/Laravel, PostgreSQL, Supabase RLS, Redis.\n• **Cloud & DevOps**: Google Cloud Platform (Cloud Run, Artifact Registry), Docker, CI/CD GitHub Actions.\n• **AI & EdTech**: Python 3.12, PyTorch, Gemini API, Learning Analytics pipelines.";
      } else if (lower.includes("kontak") || lower.includes("hire") || lower.includes("email") || lower.includes("kolaborasi")) {
        reply = "Taufik saat ini terbuka untuk posisi Full-Stack Engineer, Cloud Engineer, atau Web Architect. Anda dapat menghubunginya langsung via:\n• **Email**: raihandani270204@gmail.com\n• **LinkedIn**: linkedin.com/in/taufik-raihandani\n• **GitHub**: github.com/bworiey\n• Formulir pesan langsung tersedia di bagian paling bawah halaman ini.";
      } else {
        reply = `Pertanyaan tercatat: "${q}". Taufik Raihandani adalah lulusan Sarjana Pendidikan Komputer ULM & Bangkit Academy 2024 dengan IPK 3.54/4.00. Menggabungkan kedalaman rekayasa software modern (Next.js, Cloud, AI) dengan metodologi pedagogis dan analitik data interaktif.`;
      }

      playCyberSound("telemetry");
      setMessages((prev) => [
        ...prev,
        {
          id: `cop-${Date.now()}`,
          sender: "copilot",
          text: reply,
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => {
            playCyberSound("open");
            setIsOpen(!isOpen);
          }}
          className="group flex items-center gap-2.5 px-3.5 py-2.5 bg-[#171816] dark:bg-[#0E1013] text-[#C8F169] border-2 border-[#C8F169] shadow-pixel hover:shadow-pixel-lg active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer font-pixel text-[9px] tracking-wider"
          aria-label="Buka AI Copilot Terminal"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8F169] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C8F169]" />
          </span>
          <Terminal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI COPILOT // HUD</span>
          <span className="sm:hidden">AI HUD</span>
        </button>
      </div>

      {/* Terminal Window Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[440px] max-h-[580px] h-[75vh] z-50 flex flex-col bg-[#0E1013] border-2 border-[#C8F169] shadow-[0_0_30px_rgba(200,241,105,0.15)] text-[#F4F3EE] select-none overflow-hidden"
          >
            {/* Terminal Title Bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#171816] border-b border-[#C8F169]/30">
              <div className="flex items-center gap-2 font-pixel text-[9px] text-[#C8F169]">
                <Bot className="w-3.5 h-3.5" />
                <span>BWORIEY_NEURAL_COPILOT // V4.2</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    playCyberSound("click");
                    setMessages([
                      {
                        id: "init",
                        sender: "copilot",
                        text: "Terminal direset. Silakan tanyakan informasi seputar karya dan latar belakang Taufik.",
                        timestamp: "NOW",
                      },
                    ]);
                  }}
                  className="text-[#A1A49A] hover:text-[#C8F169] p-1"
                  title="Reset Chat"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
                <button
                  onClick={() => {
                    playCyberSound("click");
                    setIsOpen(false);
                  }}
                  className="text-[#A1A49A] hover:text-red-400 p-1"
                  title="Tutup Terminal"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Terminal Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs leading-relaxed">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.sender === "user" ? "items-end text-right" : "items-start text-left"
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-pixel text-[8px] text-[#777970] mb-1">
                    <span>{m.sender === "user" ? "GUEST" : "NEURAL_COPILOT"}</span>
                    <span>·</span>
                    <span>{m.timestamp}</span>
                  </div>
                  <div
                    className={`max-w-[88%] p-3 border ${
                      m.sender === "user"
                        ? "bg-[#1C1F1A] border-[#C8F169]/40 text-[#F4F3EE]"
                        : "bg-[#111310] border-white/10 text-[#C8F169]/90"
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 font-pixel text-[8px] text-[#C8F169] p-2 bg-[#111310] border border-white/10 self-start">
                  <span className="w-1.5 h-1.5 bg-[#C8F169] animate-pulse" />
                  <span>SYNTHESIZING RESPONSE...</span>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Quick Query Pills */}
            <div className="px-3 py-2 bg-[#111310] border-t border-white/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar whitespace-nowrap">
              {PRESET_QUERIES.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.prompt)}
                  className="px-2 py-1 bg-[#171816] hover:bg-[#C8F169] text-[#A1A49A] hover:text-[#171816] border border-white/20 font-pixel text-[8px] transition-colors cursor-pointer"
                >
                  [{item.label}]
                </button>
              ))}
            </div>

            {/* Terminal Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-2.5 bg-[#171816] border-t border-[#C8F169]/30 flex items-center gap-2"
            >
              <span className="font-pixel text-[10px] text-[#C8F169] pl-1">{">"}</span>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Tanya copilot tentang Taufik..."
                className="flex-1 bg-transparent font-mono text-xs text-[#F4F3EE] placeholder:text-[#777970] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isTyping}
                className="p-1.5 bg-[#C8F169] text-[#171816] font-bold border border-[#C8F169] hover:bg-white transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
