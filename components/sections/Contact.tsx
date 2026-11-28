"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Send, CheckCircle2, Copy, Check, MapPin } from "lucide-react";
import { contactTopics } from "@/lib/domain";
import { InfoCard, TextCard, Sprite } from "../collage";
import { SplitText } from "../motion/SplitText";
import { MagneticButton } from "../motion/MagneticButton";
import { SPRINGS } from "../motion/MotionSystem";

interface ContactProps {
  ownerEmail?: string;
  ownerLocation?: string;
}

export function Contact({
  ownerEmail = "raihandani270204@gmail.com",
  ownerLocation = "Banjarmasin, Kalimantan Selatan, Indonesia",
}: ContactProps) {
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Kolaborasi",
    message: "",
    website: "",
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
      setErrorMessage("Semua isian formulir wajib diisi.");
      return;
    }
    if (formData.message.trim().length < 20) {
      setErrorMessage("Pesan harus minimal 20 karakter.");
      return;
    }

    setLoading(true);
    try {
      const submissionId =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c: string) =>
              (
                Number(c) ^
                (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
              ).toString(16)
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
        setFormData({
          name: "",
          email: "",
          subject: "Kolaborasi",
          message: "",
          website: "",
        });
      } else {
        setErrorMessage(
          resData?.error || "Gagal mengirim pesan. Silakan hubungi langsung via email."
        );
      }
    } catch {
      setErrorMessage("Terjadi kendala jaringan. Silakan hubungi langsung via email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full max-w-7xl mx-auto py-24 md:py-32 px-6 sm:px-8 border-t border-[#000000]/10 dark:border-[#FAF8F5]/10"
    >
      <Sprite kind="smile" color="green" size="md" className="hidden md:inline-block absolute top-16 right-14" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Rotated Orange & Peach Info Cluster */}
        <div className="lg:col-span-5 space-y-6">
          <span className="inline-block px-2.5 py-1 rounded-[0.5rem] bg-[#C4D94E] text-[#000000] font-mono text-xs uppercase tracking-[0.05em]">
            07 // LET&rsquo;S CONNECT
          </span>

          <h2 className="font-hero-display text-4xl sm:text-5xl text-[#000000] dark:text-[#FAF8F5] leading-[1.08]">
            <SplitText text="Say hello or start a project together." type="words" />
          </h2>

          <InfoCard rotate={-2} mobileRotate={-1} binderHoles={false} className="mt-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#FAF8F5]/80 block mb-2">
              OFFICIAL EMAIL
            </span>
              <div className="flex items-center justify-between gap-2">
                <a
                  href={`mailto:${ownerEmail}`}
                  className="font-mono text-xs sm:text-sm text-[#FAF8F5] hover:underline truncate"
                >
                  {ownerEmail}
                </a>
                <div className="relative">
                  <button
                    type="button"
                    onClick={handleCopy}
                    aria-label="Copy email"
                    className="p-2 rounded-[0.4rem] bg-[#FAF8F5]/15 hover:bg-[#FAF8F5]/25 text-[#FAF8F5] cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <AnimatePresence>
                    {copied && (
                      <motion.span
                        initial={{ opacity: 0, y: 6, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.9 }}
                        className="absolute -top-9 right-0 px-2.5 py-1 rounded-[0.35rem] bg-[#C4D94E] text-[#000000] font-mono text-[10px] uppercase whitespace-nowrap"
                      >
                        COPIED!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
          </InfoCard>

          <TextCard rotate={1.5} mobileRotate={1} foldedCorner>
            <div className="flex items-center gap-2 font-mono text-xs text-[#000000]">
              <MapPin className="w-4 h-4 text-[#F05A28]" />
              <span>{ownerLocation}</span>
            </div>
          </TextCard>
        </div>

        {/* Right: Flat Form Connected to Supabase */}
        <div className="lg:col-span-7 bg-[#FAF8F5] dark:bg-[#252420] border border-[#000000]/15 dark:border-[#FAF8F5]/15 rounded-[0.75rem] p-6 sm:p-9">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={SPRINGS.fluid}
                className="py-12 text-center space-y-4"
              >
                <div className="w-14 h-14 rounded-full bg-[#C4D94E] text-[#000000] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-editorial text-3xl text-[#000000] dark:text-[#FAF8F5]">
                  Pesan Berhasil Terkirim
                </h3>
                <p className="font-body-editorial text-sm text-[#000000]/75 dark:text-[#FAF8F5]/75 max-w-md mx-auto">
                  Terima kasih telah menghubungi saya. Pesan telah tersimpan di basis data Supabase dan akan segera saya balas.
                </p>
                <MagneticButton
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 rounded-[0.5rem] bg-[#F05A28] text-[#FAF8F5] font-mono text-xs uppercase tracking-wider"
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
                {errorMessage && (
                  <div className="p-3 rounded-[0.5rem] bg-[#F05A28]/15 border border-[#F05A28] text-[#F05A28] font-mono text-xs">
                    {errorMessage}
                  </div>
                )}

                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#000000]/70 dark:text-[#FAF8F5]/70 mb-1.5">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-[0.5rem] bg-[#FAF8F5] dark:bg-[#1A1917] border border-[#000000]/20 dark:border-[#FAF8F5]/20 text-sm font-figtree text-[#000000] dark:text-[#FAF8F5] focus:outline-none focus:border-[#F05A28]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#000000]/70 dark:text-[#FAF8F5]/70 mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-[0.5rem] bg-[#FAF8F5] dark:bg-[#1A1917] border border-[#000000]/20 dark:border-[#FAF8F5]/20 text-sm font-figtree text-[#000000] dark:text-[#FAF8F5] focus:outline-none focus:border-[#F05A28]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[#000000]/70 dark:text-[#FAF8F5]/70 mb-1.5">
                    Topic *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {contactTopics.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => setFormData({ ...formData, subject: topic })}
                        className={`py-2 px-2.5 rounded-[0.45rem] font-mono text-[11px] uppercase tracking-wider cursor-pointer transition-colors ${
                          formData.subject === topic
                            ? "bg-[#F05A28] text-[#FAF8F5]"
                            : "bg-[#FFD4C2]/60 dark:bg-[#1A1917] text-[#000000] dark:text-[#FAF8F5]"
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-[#000000]/70 dark:text-[#FAF8F5]/70 mb-1.5">
                    Message (Min. 20 chars) *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Share your idea, role, or research inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-[0.5rem] bg-[#FAF8F5] dark:bg-[#1A1917] border border-[#000000]/20 dark:border-[#FAF8F5]/20 text-sm font-figtree text-[#000000] dark:text-[#FAF8F5] focus:outline-none focus:border-[#F05A28] resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={loading ? {} : { scale: 0.98 }}
                  className="w-full py-3.5 rounded-[0.5rem] bg-[#F05A28] text-[#FAF8F5] font-mono text-xs uppercase tracking-[0.06em] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{loading ? "SENDING..." : "SEND MESSAGE"}</span>
                  <Send className="w-3.5 h-3.5" />
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
