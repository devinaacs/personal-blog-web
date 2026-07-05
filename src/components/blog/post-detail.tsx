import Link from "next/link";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

import { PostArticle } from "@/components/blog/post-article";
import { WoodTexture } from "@/components/shared/wood-texture";
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
    <div className="relative min-h-screen bg-zinc-900">
      <WoodTexture />

      <Link
        aria-label="Close"
        className="group fixed top-6 right-6 z-10 flex h-12 w-12 items-center justify-center border-2 border-zinc-900 bg-white text-zinc-900 transition-all hover:bg-zinc-900 hover:text-white"
        href="/"
      >
        <X size={24} />
      </Link>

      {prevSlug && (
        <Link
          aria-label="Previous post"
          className="fixed top-1/2 left-6 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center border-2 border-zinc-900 bg-white text-zinc-900 transition-all hover:bg-zinc-900 hover:text-white"
          href={`/blog/${prevSlug}`}
        >
          <ArrowLeft size={24} />
        </Link>
      )}

      {nextSlug && (
        <Link
          aria-label="Next post"
          className="fixed top-1/2 right-6 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center border-2 border-zinc-900 bg-white text-zinc-900 transition-all hover:bg-zinc-900 hover:text-white"
          href={`/blog/${nextSlug}`}
        >
          <ArrowRight size={24} />
        </Link>
      )}

      <PostArticle nextSlug={nextSlug} post={post} prevSlug={prevSlug} />
    </div>
  );
}
