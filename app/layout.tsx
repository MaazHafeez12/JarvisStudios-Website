import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Clash Display (docs/DESIGN.md §2.3) isn't on Google Fonts — self-hosted
// via next/font/local. Downloaded from Fontshare directly (not via their
// CDN <link>) so it's subject to Next.js's own font optimization/caching.
// License: Fontshare Free Font EULA — free for commercial use, unlimited
// time, web included, no attribution required (docs/DESIGN.md §10
// resolved). Full license text: public/fonts/clash-display/LICENSE.txt.
const clashDisplay = localFont({
  src: [
    { path: "../public/fonts/clash-display/ClashDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/clash-display/ClashDisplay-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/clash-display/ClashDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-clash-display",
  display: "swap",
});

const themeInitScript = `
  (function () {
    try {
      var stored = localStorage.getItem('theme');
      var theme = stored || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}
  })();
`;

export const metadata: Metadata = {
  metadataBase: new URL("https://jarvisstudios.net"),
  title: "Jarvis Studios",
  description:
    "Jarvis Studios — web development, app development, SaaS, CRM, and marketing/design for growing businesses.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // suppressHydrationWarning: themeInitScript below intentionally sets
  // data-theme on this element before React hydrates, so the attribute
  // legitimately differs between the server-rendered and initial client
  // markup — this is expected, not a real hydration bug.
  return (
    <html
      lang="en"
      className={`${inter.variable} ${clashDisplay.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Nav />
        <div className="flex-1">{children}</div>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
