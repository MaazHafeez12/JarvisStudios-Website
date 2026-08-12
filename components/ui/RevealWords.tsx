"use client";

import { motion, type Variants } from "motion/react";
import { EASE } from "@/lib/motion";

// Word-by-word arrival for a headline. The sibling of components/ui/Reveal —
// same curve, same viewport rule, but the unit of motion is the word instead
// of the block.
//
// ACCESSIBILITY. The words are real text nodes, each carrying its own
// trailing space (`whitespace-pre`), so screen readers, Reader Mode,
// translation and copy/paste all get an ordinary sentence. The obvious
// alternative — aria-label on the heading with the spans aria-hidden — makes
// the visible text invisible to translation and to Reader Mode, and is not
// worth it for a purely decorative split.
//
// LCP. `lcpSafe` moves without fading, for the same reason
// components/ui/Reveal.tsx carries the option: Chrome excludes opacity:0
// elements from LCP candidacy, so fading a page's H1 in defers its own LCP
// timestamp until the fade resolves. Any headline above the fold wants it.
//
// Text wrapping is unaffected: inline-block words are unbreakable atoms,
// which is exactly how `text-balance` already treats them.

const CONTAINER: Variants = {
  hidden: {},
  visible: {},
};

const WORD: Record<"fade" | "lcp", Variants> = {
  fade: {
    hidden: { opacity: 0, y: "0.45em" },
    visible: { opacity: 1, y: 0 },
  },
  lcp: {
    hidden: { y: "0.45em" },
    visible: { y: 0 },
  },
};

export function RevealWords({
  text,
  className,
  lcpSafe = false,
  stagger = 0.045,
  delay = 0,
}: {
  text: string;
  className?: string;
  lcpSafe?: boolean;
  stagger?: number;
  delay?: number;
}) {
  const words = text.split(" ");

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={CONTAINER}
      transition={{ delayChildren: delay, staggerChildren: stagger }}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span
          // Words repeat within a headline, so the index has to be part of
          // the key or Motion reuses the wrong child on a re-render.
          key={`${word}-${i}`}
          variants={WORD[lcpSafe ? "lcp" : "fade"]}
          transition={{ duration: 0.6, ease: EASE }}
          className="inline-block whitespace-pre"
        >
          {i === words.length - 1 ? word : `${word} `}
        </motion.span>
      ))}
    </motion.span>
  );
}
