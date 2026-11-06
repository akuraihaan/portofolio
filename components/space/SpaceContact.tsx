"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  Mail, 
  Send, 
  Copy, 
  Check, 
  MapPin, 
  Sparkles, 
  MessageSquare,
  Clock,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "./SocialIcons";

interface SpaceContactProps {
  ownerEmail?: string;
  ownerLocation?: string;
  ownerName?: string;
}

export function SpaceContact({
  ownerEmail = "raihandani270204@gmail.com",
  ownerLocation = "Banjarmasin, Kalimantan Selatan, Indonesia",
  ownerName = "Taufik Raihandani",
}: SpaceContactProps) {
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
      setErrorMsg("Pesan minimal 20 karakter agar dapat tersampaikan dengan jelas.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    // Generate valid UUID for Supabase RPC
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
        if (data.fields) {
          const firstErr = Object.values(data.fields)[0];
          throw new Error(String(firstErr || data.error || "Gagal mengirim pesan."));
        }
        throw new Error(data.error || "Layanan pesan belum dapat merespons.");
      }

      // Trigger Confetti fireworks celebration
      try {
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#2c67ed", "#60a5fa", "#ffffff", "#818cf8"],
        });
      } catch {}

      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "Kolaborasi", message: "" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kendala saat mengirim pesan.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/bworiey",
      handle: "@bworiey",
      icon: GithubIcon,
      color: "hover:text-white hover:border-white/40",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/taufik-raihandani",
      handle: "Taufik Raihandani",
      icon: LinkedinIcon,
      color: "hover:text-[#6ba0ff] hover:border-[#2c67ed]",
    },
    {
      name: "Instagram",
      url: "https://instagram.com/bworiey",
      handle: "@bworiey",
      icon: InstagramIcon,
      color: "hover:text-pink-400 hover:border-pink-500/40",
    },
    {
      name: "Email Langsung",
      url: `mailto:${ownerEmail}`,
      handle: ownerEmail,
      icon: Mail,
      color: "hover:text-[#60a5fa] hover:border-[#2c67ed]",
    },
  ];

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background Cosmic Atmosphere */}
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-[#2c67ed]/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08102d]/80 border border-[#2c67ed]/30 text-blue-300 text-xs font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(44,103,237,0.2)] mb-3"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Hubungi Saya · Transmisi Terbuka</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight"
        >
          Mari Membangun{" "}
          <span className="text-[#2c67ed] drop-shadow-[0_0_20px_rgba(44,103,237,0.6)]">
            Sesuatu yang Luar Biasa
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-3 text-slate-300/80 text-sm sm:text-base max-w-2xl mx-auto"
        >
          Punya tawaran proyek, peluang magang/karier, atau sekadar ingin berdiskusi seputar teknologi? Kirimkan pesan melalui form atau hubungi lewat tautan sosial di bawah.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form Card (7 Cols) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 rounded-2xl bg-[#060a20]/80 border border-[#2c67ed]/25 p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_25px_rgba(44,103,237,0.15)] relative"
        >
          <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-white/10">
            <MessageSquare className="w-5 h-5 text-[#60a5fa]" />
            <h3 className="text-xl font-bold text-white">Kirim Pesan Langsung</h3>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="py-12 text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#2c67ed]/20 border border-[#2c67ed] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(44,103,237,0.6)]">
                  <ShieldCheck className="w-8 h-8 text-[#60a5fa]" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">
                  Transmisi Berhasil Dikirim!
                </h4>
                <p className="text-slate-300 text-sm max-w-md mb-6 leading-relaxed">
                  Terima kasih sudah menghubungi. Pesan Anda telah sampai ke orbit saya dan akan segera saya balas secepat mungkin.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-full bg-[#2c67ed] text-white text-xs font-semibold shadow-[0_0_15px_rgba(44,103,237,0.5)] hover:bg-[#3974f8] transition-all"
                >
                  Kirim Pesan Lainnya
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                      Nama Lengkap <span className="text-[#2c67ed]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/60 text-white text-sm focus:outline-none focus:border-[#2c67ed] focus:ring-2 focus:ring-[#2c67ed]/30 shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all placeholder:text-slate-500"
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                      Alamat Email <span className="text-[#2c67ed]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. email@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/60 text-white text-sm focus:outline-none focus:border-[#2c67ed] focus:ring-2 focus:ring-[#2c67ed]/30 shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Subject Topic Select */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                    Topik Diskusi <span className="text-[#2c67ed]">*</span>
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/60 text-white text-sm focus:outline-none focus:border-[#2c67ed] focus:ring-2 focus:ring-[#2c67ed]/30 shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all cursor-pointer"
                  >
                    <option value="Kolaborasi" className="bg-slate-900 text-white">Kolaborasi Proyek</option>
                    <option value="Pekerjaan" className="bg-slate-900 text-white">Peluang Pekerjaan / Rekrutmen</option>
                    <option value="Pertanyaan proyek" className="bg-slate-900 text-white">Pertanyaan seputar Proyek</option>
                    <option value="Lainnya" className="bg-slate-900 text-white">Lainnya / Diskusi Teknologi</option>
                  </select>
                </div>

                {/* Message Input with Character Count */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                      Pesan Anda <span className="text-[#2c67ed]">*</span>
                    </label>
                    <span
                      className={`text-[11px] font-mono ${
                        formData.message.trim().length >= 20 ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {formData.message.trim().length}/20 min
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    required
                    placeholder="Tuliskan detail ide kolaborasi, tawaran pekerjaan, atau pertanyaan Anda di sini (minimal 20 karakter)..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/60 text-white text-sm focus:outline-none focus:border-[#2c67ed] focus:ring-2 focus:ring-[#2c67ed]/30 shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all placeholder:text-slate-500 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#2c67ed] to-[#1d4ed8] text-white text-sm font-semibold shadow-[0_0_20px_rgba(44,103,237,0.5)] hover:shadow-[0_0_30px_rgba(44,103,237,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Mengirim Transmisi...</span>
                    </>
                  ) : (
                    <>
                      <span>Luncurkan Pesan</span>
                      <Send className="w-4 h-4 text-blue-200" />
                    </>
                  )}
                </button>
              </form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Contact Info & Social Media Links (5 Cols) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 space-y-6"
        >
          {/* Quick Info Card */}
          <div className="rounded-2xl bg-[#060a20]/80 border border-[#2c67ed]/25 p-6 backdrop-blur-xl shadow-[0_0_20px_rgba(44,103,237,0.15)]">
            <h4 className="text-sm font-mono text-blue-300 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Detail Kontak</span>
            </h4>

            <div className="space-y-4">
              {/* Email Copy Card */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2.5 rounded-lg bg-[#2c67ed]/20 text-[#60a5fa]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[11px] text-slate-400 block font-mono">Email Pribadi</span>
                    <span className="text-xs sm:text-sm font-mono text-white truncate block">
                      {ownerEmail}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors shrink-0"
                  title="Salin email"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Location Card */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/60 flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-mono">Lokasi Domisili</span>
                  <span className="text-xs sm:text-sm text-white">
                    {ownerLocation}
                  </span>
                </div>
              </div>

              {/* Availability */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/60 flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-mono">Status Kerja</span>
                  <span className="text-xs sm:text-sm text-emerald-300 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Terbuka untuk Freelance & Full-time
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Constellation Grid */}
          <div className="rounded-2xl bg-[#060a20]/80 border border-[#2c67ed]/25 p-6 backdrop-blur-xl shadow-[0_0_20px_rgba(44,103,237,0.15)]">
            <h4 className="text-sm font-mono text-blue-300 uppercase tracking-widest mb-4">
              Jaringan Sosial & Media
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`group p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-center justify-between text-slate-300 transition-all duration-200 ${item.color} hover:bg-white/5 hover:scale-[1.02] shadow-[0_0_12px_rgba(0,0,0,0.3)]`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <span className="text-xs font-semibold block text-white">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {item.handle}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
