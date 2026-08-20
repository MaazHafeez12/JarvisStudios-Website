import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MotionConfig } from "motion/react";
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

// Dark is the default, and only an explicit choice moves off it. This used to
// consult `prefers-color-scheme: light`, which made the OS the deciding vote
// and handed a light-mode visitor the light theme on first paint — contrary to
// globals.css, whose `:root` holds the dark tokens, and to docs/DESIGN.md §4.
// The CSS and the design doc already agreed; this script was the one dissenter.
//
// Normalized against the literal 'light' rather than `stored || 'dark'` so the
// attribute is always exactly one of the two valid values. A junk localStorage
// entry would otherwise be written through to `data-theme`, matching no CSS
// block and leaving ThemeToggle reading a theme that does not exist.
const themeInitScript = `
  (function () {
    try {
      var stored = localStorage.getItem('theme');
      document.documentElement.setAttribute(
        'data-theme',
        stored === 'light' ? 'light' : 'dark'
      );
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
        {/* WCAG 2.4.1 Bypass Blocks — lets keyboard/screen-reader users
            skip the nav instead of tabbing through it on every page. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-neutral-950"
        >
          Skip to content
        </a>
        <MotionConfig reducedMotion="user">
          <Nav />
          <div id="main-content" className="flex-1">
            {children}
          </div>
          <Footer />
        </MotionConfig>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
