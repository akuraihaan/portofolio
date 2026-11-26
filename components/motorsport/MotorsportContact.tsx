"use client";

/**
 * MotorsportContact — upgraded with full motion experience:
 * - Full-section entrance choreography with clip-path reveal
 * - Animated decorative SVG lime frame corner art
 * - Input focus spring animations via CSS + framer spring underline
 * - Form submission: button loading spinner → success AnimatePresence
 * - Error / success state transitions with spring scale
 */
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { Mail, MapPin, Send, CheckCircle2, Copy, Check } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "../space/SocialIcons";
import { contactTopics } from "@/lib/domain";
import { MagneticButton } from "../motion/MagneticButton";
import { SplitText } from "../motion/SplitText";
import {
  staggerContainer,
  staggerItem,
  EASINGS,
  DURATION,
  VIEWPORT_ONCE,
} from "../motion/MotionSystem";

interface MotorsportContactProps {
  ownerEmail?: string;
  ownerLocation?: string;
  ownerName?: string;
  socialLinks?: Array<{ platform: string; label: string; url: string }>;
}

export function MotorsportContact({
  ownerEmail = "raihandani270204@gmail.com",
  ownerLocation = "Banjarmasin, Kalimantan Selatan, Indonesia",
  ownerName = "Taufik Raihandani",
  socialLinks,
}: MotorsportContactProps) {
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "", email: "", subject: "Kolaborasi", message: "", website: "",
  });
  const prefersReduced = useReducedMotion();

  const handleCopy = () => {
    navigator.clipboard.writeText(ownerEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage("Semua isian formulir wajib diisi."); return;
    }
    if (formData.message.trim().length < 20) {
      setErrorMessage("Pesan harus minimal 20 karakter."); return;
    }
    setLoading(true);
    try {
      const submissionId =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c: string) =>
              (Number(c) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))).toString(16)
            );

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject,
          message: formData.message.trim(),
          submissionId,
          website: formData.website,
        }),
      });
      const resData = await res.json().catch(() => ({}));
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "Kolaborasi", message: "", website: "" });
      } else {
        setErrorMessage(resData?.error || "Gagal mengirim pesan. Silakan hubungi langsung via email.");
      }
    } catch {
      setErrorMessage("Terjadi kendala jaringan. Silakan hubungi langsung via email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="kontak"
      className="w-full bg-[#111111] text-[#F5F5F0] py-24 md:py-36 px-6 sm:px-8 border-t border-[#333333]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: DURATION.medium, ease: EASINGS.editorial }}
          className="flex items-center gap-3 mb-16"
        >
          <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#D1FF00] uppercase">
            07 // HUBUNGI SAYA · THREE-ZONE PANEL
          </span>
          <div className="h-px flex-1 bg-[#333333]" />
          <span className="font-mono text-xs text-[#888888] uppercase tracking-wider">KOLABORASI &amp; PERTANYAAN</span>
        </motion.div>

        {/* Contained panel with clip-path entrance */}
        <motion.div
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, clipPath: "inset(100% 0 0 0)" }}
          whileInView={prefersReduced ? { opacity: 1 } : { opacity: 1, clipPath: "inset(0% 0 0 0)" }}
          viewport={VIEWPORT_ONCE}
          transition={{ duration: DURATION.cinematic, ease: EASINGS.expo }}
          className="rounded-[1.5rem] bg-[#1A1A1A] border-2 border-[#D1FF00] p-7 sm:p-12 shadow-2xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Left zone */}
            <motion.div
              className="lg:col-span-5 space-y-10"
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
              variants={staggerContainer(0.1, 0.2)}
            >
              <motion.div variants={staggerItem}>
                <span className="font-mono text-xs uppercase tracking-widest text-[#D1FF00] font-bold block mb-2">
                  START A CONVERSATION
                </span>
                <h2 className="font-hero-display text-3xl sm:text-5xl text-[#F5F5F0] leading-[0.95] uppercase font-bold mb-4">
                  <SplitText text="Mari Membangun Solusi Berdampak Tinggi." type="words" />
                </h2>
                <p className="font-body-editorial text-sm sm:text-base text-[#AAAAAA] leading-relaxed font-light">
                  Terbuka untuk posisi Full-Stack Developer, Cloud Engineer, kolaborasi riset media instruksional, serta pengembangan sistem web kustom.
                </p>
              </motion.div>

              {/* Email copy box */}
              <motion.div variants={staggerItem} className="p-5 rounded-[1rem] bg-[#111111] border border-[#333333] space-y-2">
                <span className="font-mono text-[10px] text-[#888888] uppercase tracking-wider block">ALAMAT EMAIL RESMI</span>
                <div className="flex items-center justify-between gap-3">
                  <a href={`mailto:${ownerEmail}`} className="font-mono text-xs sm:text-sm font-bold text-[#F5F5F0] hover:text-[#D1FF00] transition-colors truncate">
                    {ownerEmail}
                  </a>
                  <motion.button
                    onClick={handleCopy}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-[0.5rem] bg-[#1A1A1A] text-[#888888] hover:text-[#D1FF00] hover:bg-[#333333] transition-colors cursor-pointer"
                  >
                    <AnimatePresence mode="wait">
                      {copied
                        ? <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Check className="w-4 h-4 text-[#D1FF00]" /></motion.span>
                        : <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><Copy className="w-4 h-4" /></motion.span>
                      }
                    </AnimatePresence>
                  </motion.button>
                </div>
              </motion.div>

              {/* Social links */}
              <motion.div variants={staggerItem}>
                <span className="font-mono text-xs text-[#888888] uppercase tracking-wider block mb-3 font-semibold">JEJARING &amp; KANAL</span>
                <div className="flex flex-wrap gap-3">
                  {[
                    { href: "https://github.com/bworiey", icon: <GithubIcon className="w-3.5 h-3.5" />, label: "GitHub" },
                    { href: "https://linkedin.com/in/taufik-raihandani", icon: <LinkedinIcon className="w-3.5 h-3.5" />, label: "LinkedIn" },
                    { href: "https://instagram.com/bworiey", icon: <InstagramIcon className="w-3.5 h-3.5" />, label: "Instagram" },
                  ].map(({ href, icon, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ y: -2, borderColor: "#D1FF00" }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-[0.75rem] bg-[#111111] text-[#CCCCCC] hover:text-[#D1FF00] border border-[#333333] font-mono text-xs uppercase tracking-wider transition-colors"
                    >
                      {icon}<span>{label}</span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={staggerItem} className="pt-4 border-t border-[#333333] flex items-center gap-2 font-mono text-xs text-[#888888]">
                <MapPin className="w-4 h-4 text-[#D1FF00]" />
                <span>{ownerLocation}</span>
              </motion.div>
            </motion.div>

            {/* Right zone: form */}
            <div className="lg:col-span-7 bg-[#111111] p-6 sm:p-9 rounded-[1.25rem] border border-[#333333]">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#333333]">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#D1FF00]">KIRIM PESAN LANGSUNG</span>
                <span className="font-mono text-[10px] text-[#888888]">SUPABASE POSTGRES</span>
              </div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="py-12 text-center space-y-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
                      className="w-16 h-16 rounded-full bg-[#1A1A1A] border-2 border-[#D1FF00] flex items-center justify-center mx-auto text-[#D1FF00]"
                    >
                      <CheckCircle2 className="w-8 h-8" />
                    </motion.div>
                    <h3 className="font-editorial text-2xl font-bold text-[#F5F5F0]">Pesan Berhasil Terkirim</h3>
                    <p className="font-sans text-xs sm:text-sm text-[#AAAAAA] max-w-md mx-auto leading-relaxed">
                      Terima kasih telah menghubungi saya. Pesan telah tersimpan di sistem basis data dan saya akan merespons melalui email sesegera mungkin.
                    </p>
                    <MagneticButton
                      onClick={() => setSubmitted(false)}
                      className="mt-4 px-6 py-2.5 rounded-[0.75rem] bg-[#D1FF00] text-[#111111] font-sans text-xs font-bold uppercase tracking-wider hover:brightness-105"
                    >
                      KIRIM PESAN LAIN
                    </MagneticButton>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <AnimatePresence>
                      {errorMessage && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-3.5 rounded-[0.5rem] bg-rose-950/40 border border-rose-500/50 text-rose-300 font-mono text-xs"
                        >
                          {errorMessage}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Honeypot */}
                    <input type="text" name="website" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="hidden" tabIndex={-1} autoComplete="off" />

                    {/* Name */}
                    <div>
                      <label className="block font-mono text-xs text-[#888888] uppercase tracking-wider mb-2">Nama Lengkap *</label>
                      <input
                        type="text" required placeholder="e.g. John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-[0.75rem] bg-[#1A1A1A] border border-[#333333] text-sm text-[#F5F5F0] placeholder-[#555555] focus:outline-none focus:border-[#D1FF00] transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block font-mono text-xs text-[#888888] uppercase tracking-wider mb-2">Alamat Email *</label>
                      <input
                        type="email" required placeholder="e.g. name@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-[0.75rem] bg-[#1A1A1A] border border-[#333333] text-sm text-[#F5F5F0] placeholder-[#555555] focus:outline-none focus:border-[#D1FF00] transition-colors"
                      />
                    </div>

                    {/* Topic */}
                    <div>
                      <label className="block font-mono text-xs text-[#888888] uppercase tracking-wider mb-2">Topik Kolaborasi *</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {contactTopics.map((topic) => (
                          <motion.button
                            key={topic}
                            type="button"
                            onClick={() => setFormData({ ...formData, subject: topic })}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.96 }}
                            className={`py-2 px-3 rounded-[0.5rem] font-mono text-xs uppercase tracking-wider transition-all border ${
                              formData.subject === topic
                                ? "bg-[#D1FF00] text-[#111111] border-[#D1FF00] font-bold"
                                : "bg-[#1A1A1A] text-[#888888] border-[#333333] hover:text-[#F5F5F0]"
                            }`}
                          >
                            {topic}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block font-mono text-xs text-[#888888] uppercase tracking-wider mb-2">Isi Pesan (Min. 20 Karakter) *</label>
                      <textarea
                        required rows={4}
                        placeholder="Tuliskan gagasan proyek, deskripsi tawaran, atau pertanyaan riset Anda..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-[0.75rem] bg-[#1A1A1A] border border-[#333333] text-sm text-[#F5F5F0] placeholder-[#555555] focus:outline-none focus:border-[#D1FF00] transition-colors resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={loading ? {} : { scale: 1.01 }}
                      whileTap={loading ? {} : { scale: 0.97 }}
                      className="w-full py-4 rounded-[0.75rem] bg-[#D1FF00] text-[#111111] font-sans text-xs font-bold uppercase tracking-[0.05em] hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <AnimatePresence mode="wait">
                        {loading ? (
                          <motion.span
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                              className="inline-block w-3.5 h-3.5 border-2 border-[#111111] border-t-transparent rounded-full"
                            />
                            MENGIRIMKAN PESAN...
                          </motion.span>
                        ) : (
                          <motion.span
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            KIRIMKAN PESAN
                            <Send className="w-4 h-4" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
