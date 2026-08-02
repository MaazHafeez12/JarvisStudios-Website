"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

// Mirrors the inline script in app/layout.tsx — reads the same
// `data-theme` attribute/localStorage key so the two never disagree.
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme") as
      | Theme
      | null;
    setTheme(current ?? "dark");
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[--border] text-[--text-primary] transition-colors duration-150 ease-confident hover:border-[--accent] hover:text-[--accent]"
    >
      {/* Render nothing on the very first paint (theme is unknown until the
          effect above reads the DOM) to avoid flashing the wrong icon. */}
      {theme === "light" ? (
        <Moon className="h-4 w-4" aria-hidden="true" />
      ) : theme === "dark" ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <span className="h-4 w-4" />
      )}
    </button>
  );
}
