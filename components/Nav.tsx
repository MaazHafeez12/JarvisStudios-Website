"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Logo } from "./ui/Logo";
import { ThemeToggle } from "./ui/ThemeToggle";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
];

// The house curve (tailwind.config.ts `ease-confident`), in the array form
// Motion wants. Same tuple as Reveal and ProcessSteps.
const EASE = [0.16, 1, 0.3, 1] as const;

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // <MotionConfig reducedMotion="user"> suppresses transform animations, so
  // the icon swap below needs no guard. It does *not* cover `height`, which
  // is neither a transform nor CSS — hence the explicit branch on the panel.
  //
  // useReducedMotion resolves to null on the server and settles after
  // hydration. That null-first window is harmless here, unlike in
  // ServiceTour, because nothing reads it until the visitor taps the toggle
  // — which cannot happen before hydration. Branching *layout* on it is what
  // would cost a shift; branching an interaction's transition does not.
  const reduceMotion = useReducedMotion();

  // Escape closes the menu and hands focus back to the control that opened
  // it, so a keyboard user isn't stranded on a link that just disappeared.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMobileOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-[--border] bg-[--surface]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo />

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-[--text-secondary] transition-colors duration-150 ease-confident hover:text-[--text-primary]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
          <Link
            href="/contact"
            className="rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-neutral-950 transition-colors duration-150 ease-confident hover:bg-brand-300"
          >
            Start a project
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[--border] text-[--text-primary] transition-colors duration-150 ease-confident hover:border-[--accent] hover:text-[--accent]"
          >
            {/* The two glyphs rotate through each other rather than cutting.
                mode="wait" is safe at this duration — 120ms each way is a
                240ms round trip, still under the ~300ms where a control
                starts feeling unresponsive, and it avoids having to stack
                the icons absolutely to let them cross-fade in place. */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? "close" : "open"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.12, ease: EASE }}
                className="inline-flex"
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5" aria-hidden="true" />
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile menu panel (docs/MOTION_REDESIGN.md §5 item 3). The panel
          rolls down from zero height rather than appearing outright, which
          is what makes it read as belonging to the header instead of
          materialising over the page.

          The border and background sit on the *inner* element, not the
          animating one: on a wrapper collapsing to height 0 the border-t
          stays 1px tall the whole way down and lands as a stray rule
          directly under the header's own border-b for the last frames of
          the exit. */}
      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            id="mobile-menu"
            initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={
              reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }
            }
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="overflow-hidden md:hidden"
          >
            <div className="border-t border-[--border] bg-[--surface]">
              <ul className="flex flex-col gap-1 px-6 py-4">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-2 text-base text-[--text-secondary] transition-colors duration-150 ease-confident hover:text-[--text-primary]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-2">
                  <Link
                    href="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-md bg-brand-500 px-4 py-2 text-center text-sm font-medium text-neutral-950 transition-colors duration-150 ease-confident hover:bg-brand-300"
                  >
                    Start a project
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
