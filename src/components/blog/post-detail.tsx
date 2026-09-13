import Link from "next/link";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

import { PostArticle } from "@/components/blog/post-article";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { Post } from "@/types/post";

export function PostDetail({
  post,
  prevSlug,
  nextSlug,
}: {
  post: Post;
  prevSlug?: string;
  nextSlug?: string;
}) {
  return (
    <div className="relative min-h-screen bg-ink text-paper">
      <ReadingProgress />

      <Link
        aria-label="Close"
        className="group fixed top-6 right-6 z-40 flex h-12 w-12 items-center justify-center border-2 border-paper bg-ink text-paper transition-all hover:bg-accent hover:border-accent"
        href="/"
      >
        <X size={24} />
      </Link>

      {prevSlug && (
        <Link
          aria-label="Previous post"
          className="fixed top-1/2 left-6 z-40 hidden h-12 w-12 -translate-y-1/2 items-center justify-center border-2 border-paper bg-ink text-paper transition-all hover:bg-accent hover:border-accent md:flex"
          href={`/blog/${prevSlug}`}
        >
          <ArrowLeft size={24} />
        </Link>
      )}

      {nextSlug && (
        <Link
          aria-label="Next post"
          className="fixed top-1/2 right-6 z-40 hidden h-12 w-12 -translate-y-1/2 items-center justify-center border-2 border-paper bg-ink text-paper transition-all hover:bg-accent hover:border-accent md:flex"
          href={`/blog/${nextSlug}`}
        >
          <ArrowRight size={24} />
        </Link>
      )}

      <PostArticle nextSlug={nextSlug} post={post} prevSlug={prevSlug} />
    </div>
  );
}
