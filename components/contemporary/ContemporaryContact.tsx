"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, MapPin, Send, CheckCircle2, Copy, Check, MessageSquare } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "../space/SocialIcons";
import { EASINGS, DURATION } from "../motion/MotionSystem";

interface ContemporaryContactProps {
  ownerEmail?: string;
  ownerLocation?: string;
  ownerName?: string;
  socialLinks?: Array<{ platform: string; label: string; url: string }>;
}

export function ContemporaryContact({
  ownerEmail = "raihandani270204@gmail.com",
  ownerLocation = "Banjarmasin, Kalimantan Selatan, Indonesia",
  ownerName = "Taufik Raihandani",
}: ContemporaryContactProps) {
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const prefersReduced = useReducedMotion();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(ownerEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("Pesan gagal dikirim. Silakan hubungi langsung via email.");
      }
    } catch {
      alert("Terjadi kendala jaringan. Silakan hubungi langsung via email.");
    } finally {
      setLoading(false);
    }
  };

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
      id="kontak"
      className="w-full max-w-7xl mx-auto py-24 md:py-36 px-6 sm:px-8 border-t border-black/[0.08] dark:border-white/[0.1]"
    >
      {/* Section Header */}
      <motion.div {...inView(0)} className="flex items-center gap-3 mb-16">
        <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#2563EB] dark:text-[#C8F169] uppercase">
          08 // HUBUNGI SAYA
        </span>
        <div className="h-px flex-1 bg-black/[0.08] dark:border-white/[0.1]" />
        <span className="font-mono text-xs text-[#71717A] dark:text-[#A1A1AA] uppercase">
          KOLABORASI &amp; PERTANYAAN
        </span>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Direct Inquiries (5 cols) */}
        <motion.div {...inView(0.06)} className="lg:col-span-5 space-y-8">
          <div>
            <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight text-[#121214] dark:text-[#F4F4F6] leading-tight mb-4">
              Mari berkolaborasi dan membangun solusi digital berdampak.
            </h2>
            <p className="font-sans text-base text-[#71717A] dark:text-[#A1A1AA] leading-relaxed">
              Terbuka untuk posisi Full-Stack Developer, Cloud Software Engineer, kolaborasi riset teknologi pendidikan, maupun pengembangan produk digital kustom.
            </p>
          </div>

          <div className="space-y-6 pt-2 font-mono text-xs">
            {/* Email Address */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#121214] border border-black/[0.08] dark:border-white/[0.1]">
              <span className="text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider block mb-1">
                ALAMAT EMAIL RESMI
              </span>
              <div className="flex items-center justify-between gap-3 pt-1">
                <a
                  href={`mailto:${ownerEmail}`}
                  className="font-bold text-sm text-[#121214] dark:text-[#F4F4F6] hover:text-[#2563EB] dark:hover:text-[#C8F169] transition-colors"
                >
                  {ownerEmail}
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="p-1.5 rounded-lg text-[#71717A] hover:text-[#121214] dark:hover:text-[#F4F4F6] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] cursor-pointer"
                  title="Salin alamat email"
                  aria-label="Salin email"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Location */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#121214] border border-black/[0.08] dark:border-white/[0.1]">
              <span className="text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider block mb-1">
                LOKASI &amp; DOMISILI
              </span>
              <span className="font-semibold text-sm text-[#121214] dark:text-[#F4F4F6] block">
                {ownerLocation}
              </span>
            </div>

            {/* Social Channels */}
            <div>
              <span className="text-[#71717A] dark:text-[#A1A1AA] uppercase tracking-wider block mb-3">
                JARINGAN SOSIAL &amp; KODE
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/bworiey"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-full bg-white dark:bg-[#121214] border border-black/[0.08] dark:border-white/[0.1] text-[#121214] dark:text-[#F4F4F6] hover:text-[#2563EB] dark:hover:text-[#C8F169] transition-colors shadow-sm"
                  aria-label="GitHub Profil"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com/in/taufik-raihandani"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-full bg-white dark:bg-[#121214] border border-black/[0.08] dark:border-white/[0.1] text-[#121214] dark:text-[#F4F4F6] hover:text-[#2563EB] dark:hover:text-[#C8F169] transition-colors shadow-sm"
                  aria-label="LinkedIn Profil"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com/bworiey"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-full bg-white dark:bg-[#121214] border border-black/[0.08] dark:border-white/[0.1] text-[#121214] dark:text-[#F4F4F6] hover:text-[#2563EB] dark:hover:text-[#C8F169] transition-colors shadow-sm"
                  aria-label="Instagram Profil"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Contact Form (7 cols) */}
        <motion.div
          {...inView(0.12)}
          className="lg:col-span-7 bg-white dark:bg-[#121214] rounded-2xl sm:rounded-3xl p-7 sm:p-10 border border-black/[0.08] dark:border-white/[0.1] shadow-sm"
        >
          {submitted ? (
            <div className="p-8 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-2xl text-[#121214] dark:text-[#F4F4F6]">
                Pesan Berhasil Terkirim
              </h3>
              <p className="font-sans text-sm text-[#71717A] dark:text-[#A1A1AA] max-w-sm leading-relaxed">
                Terima kasih telah menghubungi saya. Saya telah menerima pesan Anda dan akan segera merespons melalui email.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider bg-[#121214] text-white dark:bg-[#F4F4F6] dark:text-[#121214]"
              >
                Kirim Pesan Lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-mono text-xs font-semibold uppercase tracking-wider text-[#121214] dark:text-[#F4F4F6] block mb-2">
                  Nama Lengkap Anda
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F8F6] dark:bg-[#0B0B0C] border border-black/[0.08] dark:border-white/[0.1] text-sm text-[#121214] dark:text-[#F4F4F6] placeholder-[#71717A] focus:outline-none focus:ring-1 focus:ring-[#2563EB] dark:focus:ring-[#C8F169]"
                />
              </div>

              <div>
                <label className="font-mono text-xs font-semibold uppercase tracking-wider text-[#121214] dark:text-[#F4F4F6] block mb-2">
                  Alamat Email Anda
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="nama@perusahaan.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F8F6] dark:bg-[#0B0B0C] border border-black/[0.08] dark:border-white/[0.1] text-sm text-[#121214] dark:text-[#F4F4F6] placeholder-[#71717A] focus:outline-none focus:ring-1 focus:ring-[#2563EB] dark:focus:ring-[#C8F169]"
                />
              </div>

              <div>
                <label className="font-mono text-xs font-semibold uppercase tracking-wider text-[#121214] dark:text-[#F4F4F6] block mb-2">
                  Pesan atau Rencana Proyek
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Ceritakan rencana proyek, tawaran pekerjaan, atau topik kolaborasi yang ingin Anda bicarakan..."
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F8F6] dark:bg-[#0B0B0C] border border-black/[0.08] dark:border-white/[0.1] text-sm text-[#121214] dark:text-[#F4F4F6] placeholder-[#71717A] focus:outline-none focus:ring-1 focus:ring-[#2563EB] dark:focus:ring-[#C8F169] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider bg-[#121214] text-white dark:bg-[#F4F4F6] dark:text-[#121214] hover:bg-[#2563EB] dark:hover:bg-[#C8F169] dark:hover:text-[#121214] transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? "Mengirim Pesan..." : "Kirim Pesan Sekarang"}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
