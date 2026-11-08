"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { PixelCard } from "../pixel3d/PixelCard";
import { PixelReveal } from "../motion/PixelReveal";
import { MagneticButton } from "../motion/MagneticButton";
import { Mail, Send, Copy, Check, MapPin, Terminal, ShieldCheck, ArrowUpRight } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "../space/SocialIcons";

interface PixelContactProps {
  ownerEmail?: string;
  ownerLocation?: string;
  ownerName?: string;
  socialLinks?: Array<{ platform: string; url: string; label?: string }>;
}

export function PixelContact({
  ownerEmail = "raihandani270204@gmail.com",
  ownerLocation = "Banjarmasin, Kalimantan Selatan, Indonesia",
  ownerName = "Taufik Raihandani",
  socialLinks = [
    { platform: "GitHub", url: "https://github.com/bworiey", label: "github.com/bworiey" },
    { platform: "LinkedIn", url: "https://www.linkedin.com/in/taufik-raihandani", label: "linkedin.com/in/taufik-raihandani" },
    { platform: "Instagram", url: "https://instagram.com/bworiey", label: "@bworiey" },
  ],
}: PixelContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Kolaborasi",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(ownerEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg("Mohon lengkapi nama, email, dan pesan Anda.");
      return;
    }
    if (formData.message.trim().length < 20) {
      setErrorMsg("Pesan minimal 20 karakter agar dapat tersampaikan secara jelas.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const submissionId =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
          });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject,
          message: formData.message.trim(),
          submissionId,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirimkan pesan. Silakan coba kembali.");
      }

      setSubmitted(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.75 },
        colors: ["#C8F169", "#38BDF8", "#171816", "#F4F3EE"],
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kendala jaringan saat transmisi pesan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative border-t border-[#171816]/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <PixelReveal delay={0.1}>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-pixel text-[9px] px-2.5 py-1 bg-[#171816] dark:bg-[#C8F169] text-[#C8F169] dark:text-[#171816] font-bold">
              [07 // TERMINAL]
            </span>
            <span className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] tracking-wider uppercase">
              TRANSMIT DISPATCH // DIRECT COMMS
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-[#171816] dark:text-[#F4F3EE] tracking-tight">
              Have something worth building?
            </h2>
            <p className="font-mono text-xs sm:text-sm text-[#777970] dark:text-[#A1A49A] max-w-md">
              Terbuka untuk diskusi proyek web development, software engineering, rekayasa produk digital, dan kolaborasi edukasi teknologi.
            </p>
          </div>
        </PixelReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Channels & Geolocation Readout (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <PixelReveal delay={0.2}>
              <PixelCard variant="default" className="p-6 sm:p-8 space-y-6">
                <div>
                  <span className="font-pixel text-[8px] text-[#777970] dark:text-[#A1A49A] uppercase block mb-1">
                    // DIRECT EMAIL DISPATCH
                  </span>
                  <div className="flex items-center justify-between gap-3 p-3 bg-[#171816]/5 dark:bg-[#111310] border border-[#171816]/20 dark:border-white/10">
                    <span className="font-mono text-xs sm:text-sm text-[#171816] dark:text-[#C8F169] font-bold truncate">
                      {ownerEmail}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="p-1.5 border border-[#171816] dark:border-[#C8F169] bg-white dark:bg-[#1C1F1A] text-[#171816] dark:text-[#C8F169] text-xs font-pixel"
                      title="Salin email ke clipboard"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="font-pixel text-[8px] text-[#777970] dark:text-[#A1A49A] uppercase block mb-1">
                    // BASE COORDINATES
                  </span>
                  <div className="p-3 bg-[#171816]/5 dark:bg-[#111310] border border-[#171816]/20 dark:border-white/10 font-mono text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#171816] dark:text-[#F4F3EE]">
                      <MapPin className="w-3.5 h-3.5 text-[#C8F169]" />
                      <span>{ownerLocation}</span>
                    </div>
                    <span className="text-[10px] text-[#777970] dark:text-[#A1A49A] block">
                      LAT -3.3167 / LON 114.5900 · TIMEZONE UTC+8 (WITA)
                    </span>
                  </div>
                </div>

                <div>
                  <span className="font-pixel text-[8px] text-[#777970] dark:text-[#A1A49A] uppercase block mb-2">
                    // SOCIAL TRANSMISSIONS
                  </span>
                  <div className="space-y-2">
                    {socialLinks.map((soc) => (
                      <a
                        key={soc.platform}
                        href={soc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-2.5 bg-[#171816]/5 dark:bg-[#111310] border border-[#171816]/10 dark:border-white/5 hover:border-[#171816] dark:hover:border-[#C8F169] transition-colors font-mono text-xs text-[#171816] dark:text-[#F4F3EE] no-underline group"
                      >
                        <span className="font-bold">{soc.platform}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    ))}
                  </div>
                </div>
              </PixelCard>
            </PixelReveal>
          </div>

          {/* Right Column: Terminal Command Form (7 cols) */}
          <div className="lg:col-span-7">
            <PixelReveal delay={0.25}>
              <PixelCard variant="default" className="p-6 sm:p-8">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#171816]/10 dark:border-white/10">
                  <div className="flex items-center gap-2 font-pixel text-[9px] text-[#171816] dark:text-[#C8F169]">
                    <Terminal className="w-4 h-4" />
                    <span>TERMINAL_DISPATCH // RPC.SECURE</span>
                  </div>
                  <span className="font-pixel text-[8px] px-2 py-0.5 bg-[#C8F169]/20 text-[#171816] dark:text-[#C8F169] border border-[#C8F169]/40">
                    256-BIT ENCRYPTION
                  </span>
                </div>

                {submitted ? (
                  <div className="p-8 bg-[#C8F169]/10 border-2 border-[#C8F169] text-center space-y-4">
                    <Check className="w-12 h-12 text-[#C8F169] mx-auto" />
                    <h3 className="font-display font-black text-2xl text-[#171816] dark:text-[#F4F3EE]">
                      Transmisi Pesan Berhasil!
                    </h3>
                    <p className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] max-w-md mx-auto">
                      Pesan Anda telah tersimpan dengan aman di database Supabase. Saya akan membalas melalui email secepatnya.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: "", email: "", subject: "Kolaborasi", message: "" });
                      }}
                      className="px-4 py-2 bg-[#171816] text-[#C8F169] font-pixel text-[8px] border border-black"
                    >
                      KIRIM PESAN BARU
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
                    {errorMsg && (
                      <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-pixel text-[8px]">
                        [ERROR]: {errorMsg}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-pixel text-[8px] text-[#777970] dark:text-[#A1A49A] block mb-1">
                          NAMA LENGKAP *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="cth. John Doe"
                          className="w-full px-3 py-2.5 bg-white dark:bg-[#111310] border-2 border-[#171816]/30 dark:border-white/20 text-[#171816] dark:text-[#F4F3EE] focus:outline-none focus:border-[#171816] dark:focus:border-[#C8F169]"
                        />
                      </div>

                      <div>
                        <label className="font-pixel text-[8px] text-[#777970] dark:text-[#A1A49A] block mb-1">
                          ALAMAT EMAIL *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="nama@perusahaan.com"
                          className="w-full px-3 py-2.5 bg-white dark:bg-[#111310] border-2 border-[#171816]/30 dark:border-white/20 text-[#171816] dark:text-[#F4F3EE] focus:outline-none focus:border-[#171816] dark:focus:border-[#C8F169]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-pixel text-[8px] text-[#777970] dark:text-[#A1A49A] block mb-1">
                        TOPIK DISKUSI
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["Kolaborasi", "Peluang Kerja", "Konsultasi Web", "Lainnya"].map((subj) => (
                          <button
                            key={subj}
                            type="button"
                            onClick={() => setFormData({ ...formData, subject: subj })}
                            className={`px-3 py-1.5 border font-pixel text-[8px] transition-colors ${
                              formData.subject === subj
                                ? "bg-[#171816] text-[#C8F169] dark:bg-[#C8F169] dark:text-[#171816] border-[#171816] dark:border-[#C8F169]"
                                : "bg-white dark:bg-[#111310] text-[#171816] dark:text-[#F4F3EE] border-[#171816]/20 dark:border-white/10"
                            }`}
                          >
                            [{subj.toUpperCase()}]
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="font-pixel text-[8px] text-[#777970] dark:text-[#A1A49A] block mb-1">
                        PESAN TRANSMISI (MIN. 20 KARAKTER) *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tuliskan tentang proyek, pertanyaan, atau penawaran kerja sama Anda di sini..."
                        className="w-full px-3 py-2.5 bg-white dark:bg-[#111310] border-2 border-[#171816]/30 dark:border-white/20 text-[#171816] dark:text-[#F4F3EE] focus:outline-none focus:border-[#171816] dark:focus:border-[#C8F169] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-[#171816] dark:bg-[#C8F169] text-[#C8F169] dark:text-[#171816] border-2 border-[#171816] dark:border-[#C8F169] font-pixel text-[10px] tracking-wider uppercase shadow-pixel hover:shadow-pixel-lg active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <span>TRANSMITTING DATA...</span>
                      ) : (
                        <>
                          <span>KIRIM PESAN SEKARANG</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </PixelCard>
            </PixelReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

