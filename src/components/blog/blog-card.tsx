import Link from "next/link";
import { format } from "date-fns";

import { getPostExcerpt } from "@/lib/posts";
import { Post } from "@/types/post";

export function BlogCard({ post, isLarge }: { post: Post; isLarge?: boolean }) {
  const excerpt = getPostExcerpt(post);
  const date = format(new Date(post.publishedAt), "MMM d, yyyy").toLowerCase();

  return (
    <Link
      className={`group relative block cursor-pointer overflow-hidden border border-zinc-200 bg-white transition-all duration-300 hover:border-zinc-900 ${
        isLarge ? "md:col-span-2 md:row-span-2" : ""
      }`}
      href={`/blog/${post.slug}`}
    >
      <div className="absolute top-0 right-0 bg-zinc-900 px-3 py-1 font-mono text-xs text-white">
        {post.number}
      </div>

      <div className="flex h-full flex-col p-6 md:p-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px w-8 bg-zinc-300 transition-all group-hover:w-12" />
          <time className="font-mono text-xs tracking-wider text-zinc-500 uppercase">
            {date}
          </time>
          {post.category && (
            <span className="border border-zinc-300 px-2 py-0.5 font-mono text-xs tracking-wider text-zinc-600 uppercase">
              {post.category.name}
            </span>
          )}
        </div>

        <h3
          className={`mb-4 leading-tight font-bold text-zinc-900 ${
            isLarge ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"
          }`}
        >
          {post.title}
        </h3>

        <p
          className={`grow leading-relaxed text-zinc-600 ${
            isLarge ? "text-lg" : "text-base"
          }`}
        >
          {excerpt}
        </p>

        <div className="mt-6 flex items-center gap-2 text-zinc-900 transition-all group-hover:gap-4">
          <span className="font-mono text-sm">read</span>
          <div className="h-px grow bg-zinc-900 opacity-0 transition-opacity group-hover:opacity-100" />
          <span className="text-xl">→</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-0 w-0 border-b-[20px] border-l-[20px] border-b-zinc-900 border-l-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}
