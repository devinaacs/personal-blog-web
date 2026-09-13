"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Pin } from "lucide-react";
import { motion } from "motion/react";

import { getPostExcerpt } from "@/lib/content-blocks";
import { Post } from "@/types/post";

const EASE = [0.16, 1, 0.3, 1] as const;

export function BlogCard({ post }: { post: Post }) {
  const excerpt = getPostExcerpt(post);
  const date = format(new Date(post.publishedAt), "MMM d, yyyy").toLowerCase();
  const featured = post.pinned;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={`group relative bg-paper ${featured ? "md:col-span-3" : ""}`}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      initial={{ opacity: 0, y: 12 }}
      layout
      transition={{ duration: 0.35, ease: EASE }}
    >
      <Link
        className={`flex h-full flex-col justify-between p-6 transition-colors duration-200 hover:bg-ink hover:text-paper md:p-8 ${
          featured ? "gap-6 md:flex-row md:items-center md:gap-10" : ""
        }`}
        href={`/blog/${post.slug}`}
      >
        {featured ? (
          <>
            <div className="flex shrink-0 items-center gap-5 md:w-56">
              <span className="font-mono text-5xl font-bold text-ink-faint transition-colors group-hover:text-paper/25">
                {post.number}
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-mono text-xs tracking-wider text-ink-faint uppercase transition-colors group-hover:text-paper/60">
                  <Pin size={12} />
                  pinned
                </div>
                <time className="block font-mono text-xs text-ink-faint transition-colors group-hover:text-paper/60">
                  {date}
                </time>
              </div>
            </div>

            <h3 className="flex-1 text-2xl leading-tight font-bold md:text-3xl">
              {post.title}
            </h3>

            <p className="hidden max-w-xs text-sm leading-relaxed text-ink-soft transition-colors group-hover:text-paper/70 lg:block">
              {excerpt}
            </p>

            <span className="hidden shrink-0 items-center gap-2 font-mono text-sm md:flex">
              read <span className="text-xl">→</span>
            </span>
          </>
        ) : (
          <>
            <div>
              <div className="mb-6 flex items-center justify-between">
                <time className="font-mono text-xs tracking-wider text-ink-faint uppercase transition-colors group-hover:text-paper/60">
                  {date}
                </time>
                <span className="font-mono text-xs text-ink-faint transition-colors group-hover:text-paper/60">
                  {post.number}
                </span>
              </div>

              {post.category && (
                <span className="mb-4 inline-block border border-ink px-2 py-0.5 font-mono text-xs tracking-wider uppercase transition-colors group-hover:border-paper">
                  {post.category.name}
                </span>
              )}

              <h3 className="mb-4 text-xl leading-tight font-bold md:text-2xl">
                {post.title}
              </h3>

              <p className="text-base leading-relaxed text-ink-soft transition-colors group-hover:text-paper/70">
                {excerpt}
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between gap-3">
              <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-ink-faint transition-colors group-hover:text-paper/50">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag.id}>#{tag.name}</span>
                ))}
              </div>
              <span className="text-xl transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </div>
          </>
        )}
      </Link>
    </motion.div>
  );
}
