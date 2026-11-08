"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Mail, Send, Copy, Check, MapPin, MessageSquare, ArrowUpRight, ShieldCheck } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "../space/SocialIcons";

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
          colors: ["#d4ff00", "#0c382f", "#141518", "#10b981"],
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
      className="w-full max-w-7xl mx-auto py-24 md:py-32 px-6 md:px-12 border-t border-[#e4e1d7] dark:border-[#222530]"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-16 gap-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold tracking-widest text-forest dark:text-lime uppercase">
            07 / CONTACT
          </span>
          <span className="h-px w-8 bg-black/15 dark:bg-white/20"></span>
          <span className="font-mono text-xs text-charcoal/50 dark:text-white/40">
            TRANSMISSION & COLLABORATION
          </span>
        </div>
        <span className="font-mono text-[11px] text-charcoal/40 dark:text-white/40">
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
            className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-charcoal dark:text-white leading-[1.08]"
          >
            Have something worth building?
          </motion.h2>

          <p className="text-base sm:text-lg text-charcoal/70 dark:text-white/70 leading-relaxed font-normal">
            I&apos;m open to opportunities, collaborations, and meaningful conversations around technology.
          </p>

          {/* Quick Copy Email Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#14151b] border border-[#e4e1d7] dark:border-[#222530] shadow-editorial dark:shadow-none flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] text-charcoal/40 dark:text-white/40 uppercase block mb-0.5">
                Primary Direct Email
              </span>
              <a
                href={`mailto:${ownerEmail}`}
                className="font-mono text-xs sm:text-sm font-bold text-charcoal dark:text-white hover:text-forest dark:hover:text-lime transition-colors"
              >
                {ownerEmail}
              </a>
            </div>

            <button
              onClick={handleCopyEmail}
              className="p-2 rounded-xl bg-[#f0eee6] dark:bg-[#1f212a] text-charcoal dark:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none"
              title="Salin alamat email"
            >
              {copied ? <Check className="w-4 h-4 text-forest dark:text-lime" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Verified Social Channels */}
          <div className="space-y-2.5">
            <span className="font-mono text-[10px] text-charcoal/40 dark:text-white/40 uppercase tracking-wider block">
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
                  className="group p-3.5 rounded-xl bg-white dark:bg-[#14151b] border border-[#e4e1d7] dark:border-[#222530] shadow-editorial dark:shadow-none flex items-center justify-between hover:border-black/20 dark:hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#faf8f5] dark:bg-[#0c0d10] flex items-center justify-center text-charcoal dark:text-white">
                      <Icon className="w-4 h-4 text-forest dark:text-lime" />
                    </span>
                    <div>
                      <span className="font-mono text-xs font-bold text-charcoal dark:text-white block group-hover:text-forest dark:group-hover:text-lime transition-colors">
                        {ch.name}
                      </span>
                      <span className="font-mono text-[11px] text-charcoal/50 dark:text-white/40 block">
                        {ch.desc}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-charcoal/40 dark:text-white/40 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Right Column: Functional Message Form connected to backend (7 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-7 p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#14151b] border border-[#e4e1d7] dark:border-[#222530] shadow-editorial dark:shadow-none"
        >
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-black/5 dark:border-white/10 font-mono text-xs">
            <MessageSquare className="w-4 h-4 text-forest dark:text-lime" />
            <span className="font-bold text-charcoal dark:text-white uppercase tracking-wider">
              Send a Direct Message
            </span>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center space-y-3 font-mono"
            >
              <div className="w-12 h-12 rounded-full bg-forest/10 dark:bg-lime/20 text-forest dark:text-lime flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-charcoal dark:text-white">
                Pesan Berhasil Terkirim
              </h3>
              <p className="text-xs text-charcoal/70 dark:text-white/70 max-w-sm mx-auto leading-relaxed font-sans">
                Terima kasih! Pesan Anda telah tersimpan di sistem basis data dan saya akan segera membalasnya melalui email Anda.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 rounded-full border border-black/10 dark:border-white/10 text-xs text-charcoal dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Kirim Pesan Lain
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-charcoal/60 dark:text-white/50 uppercase tracking-wider text-[10px] mb-1.5 font-bold">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] dark:bg-[#0c0d10] border border-black/10 dark:border-white/10 text-charcoal dark:text-white placeholder:text-charcoal/30 dark:placeholder:text-white/30 focus:outline-none focus:border-charcoal dark:focus:border-lime transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-charcoal/60 dark:text-white/50 uppercase tracking-wider text-[10px] mb-1.5 font-bold">
                    Alamat Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] dark:bg-[#0c0d10] border border-black/10 dark:border-white/10 text-charcoal dark:text-white placeholder:text-charcoal/30 dark:placeholder:text-white/30 focus:outline-none focus:border-charcoal dark:focus:border-lime transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-charcoal/60 dark:text-white/50 uppercase tracking-wider text-[10px] mb-1.5 font-bold">
                  Topik Diskusi *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] dark:bg-[#0c0d10] border border-black/10 dark:border-white/10 text-charcoal dark:text-white focus:outline-none focus:border-charcoal dark:focus:border-lime transition-colors"
                >
                  <option value="Kolaborasi">Kolaborasi Proyek</option>
                  <option value="Pekerjaan">Tawaran Pekerjaan / Internship</option>
                  <option value="Pertanyaan proyek">Pertanyaan Proyek Teknis</option>
                  <option value="Lainnya">Diskusi Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-charcoal/60 dark:text-white/50 uppercase tracking-wider text-[10px] mb-1.5 font-bold">
                  Pesan Anda (Min. 20 Karakter) *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Ceritakan tentang proyek, peluang, atau pertanyaan yang ingin Anda diskusikan..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf8f5] dark:bg-[#0c0d10] border border-black/10 dark:border-white/10 text-charcoal dark:text-white placeholder:text-charcoal/30 dark:placeholder:text-white/30 focus:outline-none focus:border-charcoal dark:focus:border-lime transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-charcoal dark:bg-lime text-white dark:text-charcoal font-bold text-xs uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? (
                  <span>Mengirimkan Pesan...</span>
                ) : (
                  <>
                    <span>Kirim Pesan</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-charcoal/40 dark:text-white/40 text-center font-mono">
                Transmisi pesan terenkripsi dan disimpan langsung ke Supabase RPC backend.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

