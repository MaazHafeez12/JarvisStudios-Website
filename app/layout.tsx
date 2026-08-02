import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// TODO: Clash Display (docs/DESIGN.md §2.3) is not on Google Fonts — it needs
// to be self-hosted via next/font/local once the font files are downloaded
// from Fontshare (https://www.fontshare.com/fonts/clash-display) and license
// terms re-checked (docs/DESIGN.md §10 open question). Falls back to the
// system sans stack until then; see tailwind.config.ts `fontFamily.display`.

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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Nav />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
