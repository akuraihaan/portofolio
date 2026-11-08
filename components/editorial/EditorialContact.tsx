"use client";

import React, { useState } from "react";
import { Mail, MapPin, Send, CheckCircle2, Copy, Check } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "../space/SocialIcons";

interface EditorialContactProps {
  ownerEmail?: string;
  ownerLocation?: string;
  ownerName?: string;
  socialLinks?: Array<{ platform: string; label: string; url: string }>;
}

export function EditorialContact({
  ownerEmail = "raihandani270204@gmail.com",
  ownerLocation = "Banjarmasin, Kalimantan Selatan, Indonesia",
  ownerName = "Taufik Raihandani",
}: EditorialContactProps) {
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

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
        alert("Pesan gagal terkirim. Silakan coba lagi atau kirim via email langsung.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan. Silakan hubungi langsung via email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="w-full max-w-5xl mx-auto py-24 md:py-32 px-6 md:px-8 border-t border-black/[0.08] dark:border-white/[0.1]"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-12">
        <span className="text-xs font-semibold tracking-[0.2em] text-[#86868B] uppercase">
          07 / Contact
        </span>
        <div className="h-px flex-1 bg-black/[0.06] dark:bg-white/[0.08]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Direct Inquiries & Narrative (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] leading-tight">
            Let&rsquo;s build together.
          </h2>

          <p className="text-base text-[#86868B] leading-relaxed font-normal">
            Terbuka untuk posisi Full-Stack Engineer, Cloud Engineer, penelitian teknologi pendidikan, atau kolaborasi proyek rekayasa perangkat lunak.
          </p>

          <div className="space-y-4 pt-2">
            <div>
              <span className="text-xs text-[#86868B] block mb-1">Direct Email</span>
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${ownerEmail}`}
                  className="font-medium text-sm text-[#1D1D1F] dark:text-[#F5F5F7] hover:underline"
                >
                  {ownerEmail}
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="p-1 rounded text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] cursor-pointer"
                  title="Copy email address"
                  aria-label="Copy email"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <span className="text-xs text-[#86868B] block mb-1">Location</span>
              <span className="text-sm text-[#1D1D1F] dark:text-[#F5F5F7] font-normal">
                {ownerLocation}
              </span>
            </div>

            <div>
              <span className="text-xs text-[#86868B] block mb-2">Social Channels</span>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/bworiey"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-[#F5F5F7] dark:bg-[#161617] text-[#1D1D1F] dark:text-[#F5F5F7] hover:opacity-80 transition-opacity"
                  aria-label="GitHub"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com/in/taufik-raihandani"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-[#F5F5F7] dark:bg-[#161617] text-[#1D1D1F] dark:text-[#F5F5F7] hover:opacity-80 transition-opacity"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://instagram.com/bworiey"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-[#F5F5F7] dark:bg-[#161617] text-[#1D1D1F] dark:text-[#F5F5F7] hover:opacity-80 transition-opacity"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Apple-Style Contact Form (7 cols) */}
        <div className="md:col-span-7 bg-[#F5F5F7] dark:bg-[#161617] rounded-3xl p-6 sm:p-8 border border-black/[0.04] dark:border-white/[0.06]">
          {submitted ? (
            <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              <h3 className="font-display font-bold text-xl text-[#1D1D1F] dark:text-[#F5F5F7]">
                Pesan Berhasil Terkirim
              </h3>
              <p className="text-sm text-[#86868B] max-w-sm">
                Terima kasih telah menghubungi saya. Saya akan merespons pesan Anda secepatnya.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-5 py-2 rounded-full text-xs font-medium bg-[#1D1D1F] text-white dark:bg-[#F5F5F7] dark:text-[#1D1D1F]"
              >
                Kirim Pesan Lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7] block mb-1.5">
                  Nama Anda
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#0B0B0C] border border-black/[0.08] dark:border-white/[0.1] text-sm text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#86868B] focus:outline-none focus:ring-1 focus:ring-[#1D1D1F] dark:focus:ring-white"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7] block mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#0B0B0C] border border-black/[0.08] dark:border-white/[0.1] text-sm text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#86868B] focus:outline-none focus:ring-1 focus:ring-[#1D1D1F] dark:focus:ring-white"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#1D1D1F] dark:text-[#F5F5F7] block mb-1.5">
                  Pesan
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tuliskan pesan, tawaran kolaborasi, atau pertanyaan Anda..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#0B0B0C] border border-black/[0.08] dark:border-white/[0.1] text-sm text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#86868B] focus:outline-none focus:ring-1 focus:ring-[#1D1D1F] dark:focus:ring-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full text-sm font-medium bg-[#1D1D1F] text-white dark:bg-[#F5F5F7] dark:text-[#1D1D1F] hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <span>{loading ? "Mengirim..." : "Kirim Pesan"}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
