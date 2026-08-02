import type { Config } from "tailwindcss";

// Color/type tokens per docs/DESIGN.md §2.2 (color system) and §2.3 (typography).
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neutral: {
          950: "#141414",
          900: "#1B1B1B",
          800: "#222222", // brand base
          600: "#4A4A4A",
          400: "#8A8A8A",
          200: "#E4E4E4",
          100: "#F4F4F4",
          0: "#FFFFFF",
        },
        brand: {
          700: "#0088BE",
          500: "#00ADEF", // brand base
          300: "#5FD0FF",
          100: "#D6F3FF",
        },
        success: { 500: "#2FAE66" },
        error: { 500: "#E5484D" },
        warning: { 500: "#E5A000" },
      },
      fontFamily: {
        display: ["var(--font-clash-display)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      transitionTimingFunction: {
        confident: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
