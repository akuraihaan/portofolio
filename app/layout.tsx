import type { Metadata } from "next";
/* ── Modern Editorial Tech Fonts ── */
import "@fontsource/space-grotesk/latin-400.css";
import "@fontsource/space-grotesk/latin-500.css";
import "@fontsource/space-grotesk/latin-700.css";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-500.css";
import "@fontsource/jetbrains-mono/latin-700.css";
/* ── Body / UI font ── */
import "@fontsource/inter/latin-300.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
/* ── Admin / legacy fonts (kept for admin panel) ── */
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/bebas-neue/latin-400.css";
import "@fontsource/cormorant/latin-300.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "@fontsource/press-start-2p/latin-400.css";
import "./globals.css";
import "./onyx.css";
import "./space-theme.css";
import { Analytics } from "@/components/analytics";
import { origin } from "@/lib/data";

export const metadata: Metadata = {
  metadataBase: new URL(origin()),
  title: { default: "BWORIEY — Taufik Raihandani · Portofolio Personal", template: "%s · BWORIEY" },
  description: "Portofolio personal Taufik Raihandani — Web Developer, Software Developer, dan Lulusan Pendidikan Komputer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="antialiased">
        <a className="skip-link sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-charcoal focus:text-white" href="#main">
          Lewati navigasi
        </a>
        {children}
        {process.env.PORTFOLIO_ANALYTICS === "true" && <Analytics />}
      </body>
    </html>
  );
}
