"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  Mail,
  Send,
  Copy,
  Check,
  ArrowUpRight,
  Sparkles,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "../space/SocialIcons";
import { BrutalistMagnetic } from "../motion/BrutalistMagnetic";
import { useMotionContext } from "../motion/MotionProvider";

interface BrutalistContactProps {
  email?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
}

export function BrutalistContact({
  email = "raihan@bworiey.my.id",
  githubUrl = "https://github.com/akuraihaan",
  linkedinUrl = "https://linkedin.com/in/taufik-raihandani",
  instagramUrl = "https://instagram.com/bworiey",
}: BrutalistContactProps) {
  const { setCursor, resetCursor } = useMotionContext();
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      setStatus("error");
      setErrorMessage("Harap lengkapi semua kolom formulir sebelum mengirim.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_name: formState.name,
          sender_email: formState.email,
          subject: `Pesan Portofolio dari ${formState.name}`,
          message: formState.message,
          topic: "Peluang Kerja / Kolaborasi",
        }),
      });

      if (!res.ok) {
        throw new Error("Gagal mengirimkan pesan. Silakan coba lagi atau hubungi via email langsung.");
      }

      setStatus("success");
      setFormState({ name: "", email: "", message: "" });

      // Celebration Confetti in Neo-Brutalist Colors
      try {
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.65 },
          colors: ["#FFE500", "#FF5C00", "#0047FF", "#C8F169", "#000000"],
        });
      } catch {}
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Terjadi kendala jaringan saat pengiriman pesan.");
    }
  };

  return (
    <section
      id="contact"
      className="py-20 md:py-28 px-4 md:px-8 bg-[#F4F4F0] dark:bg-[#0A0A0A] text-black dark:text-[#F4F4F0] border-b-4 border-black dark:border-white transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs font-black bg-black text-[#FFE500] dark:bg-white dark:text-black px-2.5 py-1 border-2 border-black dark:border-white shadow-[2px_2px_0px_#FF5C00]">
                07 // CONTACT
              </span>
              <span className="font-mono text-xs font-bold text-[#FF5C00] uppercase">
                KOLABORASI & REKRUTMEN
              </span>
            </div>
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tighter">
              GOT SOMETHING INTERESTING?
            </h2>
          </div>

          <p className="font-sans text-base md:text-lg max-w-md text-neutral-700 dark:text-neutral-300">
            Terbuka untuk posisi Software Engineer, Full-Stack Web Developer, konsultasi teknologi edukasi, atau proyek lepas inovatif.
          </p>
        </div>

        {/* Asymmetrical 2-Column Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Connection & Social Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Email Copy Card */}
            <div className="p-6 bg-[#FFE500] text-black border-4 border-black shadow-[6px_6px_0px_#000]">
              <span className="font-mono text-xs font-black uppercase block mb-1">
                // SURAT ELEKTRONIK UTAMA
              </span>
              <div className="font-display font-black text-xl md:text-2xl break-all mb-4">
                {email}
              </div>

              <button
                onClick={copyEmail}
                className="w-full py-3 bg-black text-[#FFE500] hover:bg-neutral-800 font-display font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_#FF5C00] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-emerald-400 stroke-[3]" />
                    <span>ALAMAT EMAIL BERHASIL DISALIN!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>SALIN ALAMAT EMAIL KE PAPAN KLIP</span>
                  </>
                )}
              </button>
            </div>

            {/* Social Channels Strip */}
            <div className="space-y-3">
              <span className="font-mono text-xs font-black uppercase text-neutral-600 dark:text-neutral-400 block">
                SALURAN DIGITAL & PROFIL RESMI:
              </span>

              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white dark:bg-[#141414] border-3 border-black dark:border-white shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#FFF] hover:shadow-[6px_6px_0px_#0047FF] hover:-translate-x-1 hover:-translate-y-1 transition-all no-underline text-inherit group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-black text-white dark:bg-white dark:text-black border-2 border-black">
                    <GithubIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-display font-black text-base uppercase">GITHUB</div>
                    <div className="font-mono text-xs text-neutral-500">@akuraihaan / @bworiey</div>
                  </div>
                </div>
                <ArrowUpRight size={20} className="stroke-[2.5] group-hover:rotate-45 transition-transform" />
              </a>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white dark:bg-[#141414] border-3 border-black dark:border-white shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#FFF] hover:shadow-[6px_6px_0px_#0047FF] hover:-translate-x-1 hover:-translate-y-1 transition-all no-underline text-inherit group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#0047FF] text-white border-2 border-black">
                    <LinkedinIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-display font-black text-base uppercase">LINKEDIN</div>
                    <div className="font-mono text-xs text-neutral-500">in/taufik-raihandani</div>
                  </div>
                </div>
                <ArrowUpRight size={20} className="stroke-[2.5] group-hover:rotate-45 transition-transform" />
              </a>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-white dark:bg-[#141414] border-3 border-black dark:border-white shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#FFF] hover:shadow-[6px_6px_0px_#FF5C00] hover:-translate-x-1 hover:-translate-y-1 transition-all no-underline text-inherit group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#FF5C00] text-white border-2 border-black">
                    <InstagramIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-display font-black text-base uppercase">INSTAGRAM</div>
                    <div className="font-mono text-xs text-neutral-500">@bworiey</div>
                  </div>
                </div>
                <ArrowUpRight size={20} className="stroke-[2.5] group-hover:rotate-45 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right Column: Neo-Brutalist Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 md:p-8 bg-white dark:bg-[#141414] border-4 border-black dark:border-white shadow-[8px_8px_0px_#000] dark:shadow-[8px_8px_0px_#FFF]">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-black dark:border-neutral-700 font-mono text-xs font-black">
                <MessageSquare size={16} />
                <span>FORMULIR PENGIRIMAN PESAN LANGSUNG</span>
              </div>

              {status === "success" && (
                <div className="mb-6 p-4 bg-[#C8F169] text-black border-3 border-black shadow-[4px_4px_0px_#000] font-mono text-xs font-bold space-y-1">
                  <div className="text-sm font-display font-black">✓ PESAN TERKIRIM DENGAN SUKSES!</div>
                  <p>
                    Terima kasih telah menghubungi. Pesan telah tercatat di basis data Supabase dan saya akan membalas via email secepat mungkin.
                  </p>
                </div>
              )}

              {status === "error" && (
                <div className="mb-6 p-4 bg-red-100 text-red-900 border-3 border-red-600 font-mono text-xs font-bold flex items-start gap-2">
                  <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Field: Name */}
                <div>
                  <label className="block font-mono text-xs font-black uppercase text-black dark:text-white mb-1.5">
                    NAMA LENGKAP ATAU PERUSAHAAN *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="cth. Sarah Wijaya / PT Inovasi Digital"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-[#1A1A1A] text-black dark:text-white border-3 border-black dark:border-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#FFE500] shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_#FFF]"
                  />
                </div>

                {/* Field: Email */}
                <div>
                  <label className="block font-mono text-xs font-black uppercase text-black dark:text-white mb-1.5">
                    ALAMAT EMAIL AKTIF *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama@domain.com"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-[#1A1A1A] text-black dark:text-white border-3 border-black dark:border-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#FFE500] shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_#FFF]"
                  />
                </div>

                {/* Field: Message */}
                <div>
                  <label className="block font-mono text-xs font-black uppercase text-black dark:text-white mb-1.5">
                    DETAIL PESAN / PENAWARAN PROYEK *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Ceritakan gambaran proyek, target waktu pengerjaan, atau diskusi yang ingin dilakukan..."
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-[#1A1A1A] text-black dark:text-white border-3 border-black dark:border-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#FFE500] shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_#FFF] resize-none"
                  />
                </div>

                {/* Submit Button with Magnetic Feel */}
                <BrutalistMagnetic strength={0.2} className="w-full">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    onMouseEnter={() => setCursor({ active: true, text: "KIRIM" })}
                    onMouseLeave={resetCursor}
                    className="w-full py-4 bg-[#FF5C00] text-white hover:bg-[#e05200] font-display font-black text-base uppercase tracking-wider border-3 border-black shadow-[5px_5px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {status === "loading" ? (
                      <span>SEDANG MEMPROSES PENGIRIMAN...</span>
                    ) : (
                      <>
                        <Send size={18} className="stroke-[2.5]" />
                        <span>KIRIMKAN PESAN SEKARANG</span>
                      </>
                    )}
                  </button>
                </BrutalistMagnetic>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
