"use client";

import { motion } from "motion/react";

import { RegisterMark } from "@/components/shared/grid-lines";

const EASE = [0.16, 1, 0.3, 1] as const;

const LINES = [
  { text: "thoughts,", tone: "text-ink" },
  { text: "code,", tone: "text-ink" },
  { text: "& everything", tone: "text-ink-faint" },
  { text: "in between", tone: "text-ink-faint" },
];

export function Hero() {
  return (
    <section className="relative border-b-2 border-ink bg-paper">
      <div className="relative mx-auto max-w-6xl">
        <RegisterMark className="absolute -top-2 -left-2 hidden lg:block" />
        <RegisterMark className="absolute -top-2 -right-2 hidden lg:block" />

        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="border-ink px-6 py-16 lg:col-span-8 lg:border-r-2 lg:py-24">
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="mb-8 flex items-center gap-3"
              initial={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <div className="h-px w-12 bg-accent" />
              <span className="font-mono text-xs tracking-widest text-ink-soft uppercase">
                Personal Journal
              </span>
            </motion.div>

            <h1 className="font-sans text-6xl leading-[0.92] font-bold tracking-tight sm:text-7xl md:text-8xl">
              {LINES.map((line, index) => (
                <span className="block overflow-hidden" key={line.text}>
                  <motion.span
                    animate={{ y: 0 }}
                    className={`block ${line.tone}`}
                    initial={{ y: "110%" }}
                    transition={{
                      duration: 0.7,
                      delay: 0.15 + index * 0.08,
                      ease: EASE,
                    }}
                  >
                    {line.text}
                  </motion.span>
                </span>
              ))}
            </h1>
          </div>

          <div className="flex flex-col divide-y-2 divide-ink lg:col-span-4">
            <div className="flex items-center justify-between px-6 py-6 font-mono text-xs tracking-widest uppercase">
              <span className="text-ink-faint">Issue</span>
              <span className="text-ink">est. 2026</span>
            </div>

            <motion.div
              animate={{ opacity: 1 }}
              className="flex-1 px-6 py-8"
              initial={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <p className="text-lg leading-relaxed text-ink-soft">
                Welcome to my digital corner. I write about the things that
                keep me up at night, usually bugs in my code, but sometimes
                life stuff too. No templates here, just raw thoughts typed
                out at 2am.
              </p>
            </motion.div>

            <div className="flex items-center justify-between px-6 py-6 font-mono text-xs tracking-widest uppercase">
              <span className="text-ink-faint">Status</span>
              <span className="flex items-center gap-2 text-ink">
                <span className="h-1.5 w-1.5 bg-accent" />
                currently writing
              </span>
            </div>

            <div className="flex items-center gap-3 px-6 py-6">
              <motion.div
                animate={{ y: [0, 6, 0] }}
                className="h-4 w-px bg-ink-faint"
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="font-mono text-xs tracking-widest text-ink-faint uppercase">
                scroll
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
