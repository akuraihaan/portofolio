import type { Metadata } from "next";
/* ── Cosmos heading font ── */
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
/* ── Body / UI font ── */
import "@fontsource/inter/latin-300.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
/* ── Admin / legacy fonts (kept for admin panel) ── */
import "@fontsource/bebas-neue/latin-400.css";
import "@fontsource/cormorant/latin-300.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "@fontsource/press-start-2p/latin-400.css";
import "./globals.css";
import "./onyx.css";
import "./space-theme.css";
import { Analytics } from "@/components/analytics";
import { origin } from "@/lib/data";
export const metadata: Metadata = {
  metadataBase: new URL(origin()),
  title: { default: "Portofolio Digital", template: "%s · Portofolio Digital" },
  description: "Proyek dan pengalaman Taufik Raihandani.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <a className="skip-link" href="#main">
          Lewati navigasi
        </a>
        {children}
        {process.env.PORTFOLIO_ANALYTICS === "true" && <Analytics />}
      </body>
    </html>
  );
}
