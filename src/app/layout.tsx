import type { Metadata, Viewport } from "next";
import { Anton, Caveat, Gaegu, IBM_Plex_Mono, Nunito } from "next/font/google";
import "@/styles/base.css";
import "@/styles/pastel.css";
import "@/styles/studio.css";

// Self-hosted Google fonts, exposed as CSS variables for the theme tokens in src/styles.
const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });
const gaegu = Gaegu({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-gaegu" });
const plexMono = IBM_Plex_Mono({ weight: ["400", "600"], subsets: ["latin"], variable: "--font-plex-mono" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "You & Me",
  description: "five favorite pictures, two little photo books, and a few notes i meant to say out loud.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={[anton, caveat, gaegu, plexMono, nunito].map((f) => f.variable).join(" ")}>
      <body>{children}</body>
    </html>
  );
}
