"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

// The store is the `data-theme` attribute on <html>, written before paint by
// the inline script in app/layout.tsx from the same localStorage key. Reading
// it from the DOM rather than holding a copy in state is what keeps every
// toggle in agreement. Nav renders two of these (desktop and mobile), and
// with per-instance state, flipping one left the other showing a stale icon
// until it remounted.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

// Normalised the same way the inline script does, so anything but "light"
// reads as the dark default.
function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

// Unknown on the server: the theme lives in the visitor's localStorage.
function getServerSnapshot(): Theme | null {
  return null;
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggleTheme() {
    const next: Theme = theme === "light" ? "dark" : "light";
    // The attribute write is the state change. The observer picks it up and
    // re-renders every subscribed toggle.
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage blocked (private mode, disabled site data): the theme still
      // switches for this page view, it just won't be remembered.
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-(--border) text-(--text-primary) transition-colors duration-150 ease-confident hover:border-(--accent) hover:text-(--accent)"
    >
      {/* Nothing during the server render and hydration, where the theme is
          unknown, so the wrong icon never flashes. */}
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
