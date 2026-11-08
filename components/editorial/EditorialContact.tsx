"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Mail, Send, Copy, Check, MapPin, MessageSquare, ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "../space/SocialIcons";
import { MagneticElement } from "../motion/MagneticElement";
import { useMotionContext } from "../motion/MotionProvider";
import { EASINGS, DURATION } from "../motion/MotionSystem";

interface EditorialContactProps {
  ownerEmail?: string;
  ownerLocation?: string;
  ownerName?: string;
  socialLinks?: Array<{ platform: string; url: string; label?: string }>;
}

export function EditorialContact({
  ownerEmail = "raihandani270204@gmail.com",
  ownerLocation = "Banjarmasin, Kalimantan Selatan, Indonesia",
  ownerName = "Taufik Raihandani",
  socialLinks,
}: EditorialContactProps) {
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
  const { setCursor, resetCursor } = useMotionContext();

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
        if (data.fields) {
          const firstErr = Object.values(data.fields)[0];
          throw new Error(String(firstErr || data.error || "Gagal mengirim pesan."));
        }
        throw new Error(data.error || "Layanan pesan belum dapat merespons.");
      }

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#C8F169", "#171816", "#F4F3EE", "#10B981"],
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

  const defaultChannels = [
    {
      name: "GitHub",
      url: "https://github.com/bworiey",
      handle: "@bworiey",
      icon: GithubIcon,
      desc: "Open source & academic repos",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/taufik-raihandani",
      handle: "Taufik Raihandani",
      icon: LinkedinIcon,
      desc: "Professional career profile",
    },
    {
      name: "Instagram",
      url: "https://instagram.com/bworiey",
      handle: "@bworiey",
      icon: InstagramIcon,
      desc: "Personal & creative updates",
    },
  ];

  const socialChannels =
    socialLinks && socialLinks.length > 0
      ? socialLinks.map((s) => {
          const platformLower = (s.platform || "").toLowerCase();
          const icon = platformLower.includes("github")
            ? GithubIcon
            : platformLower.includes("linkedin")
            ? LinkedinIcon
            : platformLower.includes("instagram")
            ? InstagramIcon
            : GithubIcon;
          return {
            name: s.label || s.platform || "Social Link",
            url: s.url,
            handle: s.label || s.platform || "@bworiey",
            icon,
            desc: `${s.platform || "Media sosial"} resmi`,
          };
        })
      : defaultChannels;

  return (
    <section
      id="contact"
      className="w-full max-w-7xl mx-auto py-28 md:py-36 px-6 md:px-12 border-t border-[#171816]/10 dark:border-[#F4F3EE]/10"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-16 gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold tracking-widest text-[#171816] dark:text-[#C8F169] uppercase">
            07 / CONTACT
          </span>
          <span className="h-px w-8 bg-[#171816]/20 dark:bg-[#F4F3EE]/20"></span>
          <span className="font-mono text-xs text-[#777970] dark:text-[#A1A49A] uppercase tracking-wider">
            TRANSMISSION & COLLABORATION
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#777970] dark:text-[#A1A49A] tracking-widest">
          BANJARMASIN (WITA / UTC+8)
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Headline, Statements, & Direct Cards (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="fluid-h2 font-display font-black tracking-tight text-[#171816] dark:text-[#F4F3EE]"
          >
            Have something worth building?
          </motion.h2>

          <p className="text-base sm:text-lg text-[#777970] dark:text-[#A1A49A] leading-relaxed font-normal">
            Saya terbuka untuk peluang kerja sama, rekayasa perangkat lunak, pengembangan media edukasi, dan diskusi teknologi bermakna.
          </p>

          {/* Quick Copy Email Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#1C1F1A] border border-[#171816]/10 dark:border-[#F4F3EE]/10 shadow-xl flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] text-[#777970] dark:text-[#A1A49A] uppercase tracking-wider block mb-0.5">
                Primary Direct Email
              </span>
              <a
                href={`mailto:${ownerEmail}`}
                className="font-mono text-xs sm:text-sm font-bold text-[#171816] dark:text-[#F4F3EE] hover:text-[#171816] dark:hover:text-[#C8F169] transition-colors"
              >
                {ownerEmail}
              </a>
            </div>

            <button
              onClick={handleCopyEmail}
              className="p-2.5 rounded-xl bg-[#E9E8E1] dark:bg-[#111310] text-[#171816] dark:text-[#F4F3EE] hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
              title="Salin alamat email"
            >
              {copied ? <Check className="w-4 h-4 text-[#C8F169]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Verified Social Channels */}
          <div className="space-y-2.5">
            <span className="font-mono text-[10px] text-[#777970] dark:text-[#A1A49A] uppercase tracking-wider block">
              Verified Profiles
            </span>
            {socialChannels.map((ch) => {
              const Icon = ch.icon;
              return (
                <a
                  key={ch.name}
                  href={ch.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-2xl bg-white dark:bg-[#1C1F1A] border border-[#171816]/10 dark:border-[#F4F3EE]/10 hover:border-[#171816]/30 dark:hover:border-[#C8F169]/40 shadow-sm flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#E9E8E1] dark:bg-[#111310] flex items-center justify-center text-[#171816] dark:text-[#C8F169]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-display font-bold text-sm text-[#171816] dark:text-[#F4F3EE] block">
                        {ch.name}
                      </span>
                      <span className="font-mono text-[11px] text-[#777970] dark:text-[#A1A49A] block">
                        {ch.handle}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#777970] dark:text-[#A1A49A] group-hover:text-[#171816] dark:group-hover:text-[#C8F169] transition-colors" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Contact Form (7 cols) */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#1C1F1A] border border-[#171816]/10 dark:border-[#F4F3EE]/10 shadow-2xl"
          >
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#C8F169]/20 text-[#171816] dark:text-[#C8F169] flex items-center justify-center mx-auto mb-4 border border-[#C8F169]/40">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-[#171816] dark:text-[#F4F3EE]">
                  Pesan Berhasil Terkirim!
                </h3>
                <p className="text-sm text-[#777970] dark:text-[#A1A49A] max-w-md mx-auto leading-relaxed">
                  Terima kasih atas pesan Anda. Pesan telah disimpan ke inbox Supabase dan saya akan merespons melalui email secepatnya.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2.5 rounded-full bg-[#171816] dark:bg-[#C8F169] text-[#F4F3EE] dark:text-[#171816] font-mono text-xs font-bold"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="pb-4 border-b border-[#171816]/10 dark:border-[#F4F3EE]/10 mb-6 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#171816] dark:text-[#F4F3EE]">
                    Kirim Pesan Langsung
                  </span>
                  <span className="font-mono text-[10px] text-[#777970] dark:text-[#A1A49A]">
                    SECURE SUPABASE RPC
                  </span>
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 font-mono text-xs border border-red-500/20">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="font-mono text-xs font-bold text-[#171816] dark:text-[#F4F3EE] block">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Nama Anda"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#F4F3EE] dark:bg-[#111310] border border-[#171816]/10 dark:border-[#F4F3EE]/10 text-sm font-sans text-[#171816] dark:text-[#F4F3EE] focus:outline-none focus:border-[#C8F169]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-mono text-xs font-bold text-[#171816] dark:text-[#F4F3EE] block">
                      Alamat Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="email@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#F4F3EE] dark:bg-[#111310] border border-[#171816]/10 dark:border-[#F4F3EE]/10 text-sm font-sans text-[#171816] dark:text-[#F4F3EE] focus:outline-none focus:border-[#C8F169]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-xs font-bold text-[#171816] dark:text-[#F4F3EE] block">
                    Topik / Subjek
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F4F3EE] dark:bg-[#111310] border border-[#171816]/10 dark:border-[#F4F3EE]/10 text-sm font-mono text-[#171816] dark:text-[#F4F3EE] focus:outline-none focus:border-[#C8F169]"
                  >
                    <option value="Kolaborasi">Kolaborasi Proyek</option>
                    <option value="Peluang Kerja">Peluang Kerja / Rekrutmen</option>
                    <option value="Pengembangan Web">Pengembangan Web & Aplikasi</option>
                    <option value="Konsultasi Pendidikan">Teknologi Pembelajaran / Edukasi</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-xs font-bold text-[#171816] dark:text-[#F4F3EE] block">
                    Pesan Anda *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Ceritakan proyek, ide, atau tujuan kolaborasi Anda secara ringkas..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F4F3EE] dark:bg-[#111310] border border-[#171816]/10 dark:border-[#F4F3EE]/10 text-sm font-sans text-[#171816] dark:text-[#F4F3EE] focus:outline-none focus:border-[#C8F169]"
                  />
                </div>

                <div className="pt-2">
                  <MagneticElement strength={0.3}>
                    <button
                      type="submit"
                      disabled={loading}
                      onMouseEnter={() => setCursor({ active: true, text: "SEND" })}
                      onMouseLeave={resetCursor}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#171816] dark:bg-[#C8F169] text-[#F4F3EE] dark:text-[#171816] font-mono text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>{loading ? "Mengirim Pesan…" : "Kirimkan Pesan"}</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </MagneticElement>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
