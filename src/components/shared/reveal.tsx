"use client";

import { ReactNode } from "react";
import { motion, Transition } from "motion/react";

const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

const TAGS = {
  div: motion.div,
  header: motion.header,
} as const;

export function Reveal({
  children,
  as = "div",
  delay = 0,
  y = 24,
  className,
  once = true,
  immediate = false,
}: {
  children: ReactNode;
  as?: keyof typeof TAGS;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
  /** Play on mount instead of waiting to scroll into view — for content already above the fold. */
  immediate?: boolean;
}) {
  const MotionComponent = TAGS[as];
  const animateProps = immediate
    ? { animate: { opacity: 1, y: 0 } }
    : { whileInView: { opacity: 1, y: 0 }, viewport: { once, amount: 0 } };

  return (
    <MotionComponent
      className={className}
      initial={{ opacity: 0, y }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      {...animateProps}
    >
      {children}
    </MotionComponent>
  );
}
