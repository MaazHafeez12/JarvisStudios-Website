"use client";

import { motion, type Variants } from "motion/react";

// Shared scroll-reveal wrapper (docs/DESIGN.md §3.2 "scroll-triggered
// reveals") — fades/slides content in once as it enters the viewport.
// Reduced-motion support (docs/DESIGN.md §3.1) comes from <MotionConfig
// reducedMotion="user"> in app/layout.tsx, not from anything here.

const variants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

// Chrome excludes opacity:0 elements from LCP candidacy until they become
// visible, so an opacity-animated hero headline delays its own LCP
// timestamp until the fade resolves. This variant only moves (never fades)
// so an above-the-fold LCP candidate (e.g. the homepage H1) can use Reveal
// for the "assembles into place" motion without that penalty.
const transformOnlyVariants: Variants = {
  hidden: { y: 16 },
  visible: { y: 0 },
};

export function Reveal({
  children,
  delay = 0,
  className,
  lcpSafe = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  lcpSafe?: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={lcpSafe ? transformOnlyVariants : variants}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
