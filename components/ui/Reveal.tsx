"use client";

import { motion, type Variants } from "motion/react";

// Shared scroll-reveal wrapper (docs/DESIGN.md §3.2 "scroll-triggered
// reveals") — fades/slides content in once as it enters the viewport.
// Motion respects prefers-reduced-motion for users who've asked for less
// motion (docs/DESIGN.md §3.1); no extra handling needed here since Motion
// disables transform/opacity animation automatically in that case.

const variants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
