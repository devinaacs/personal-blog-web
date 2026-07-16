import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { format } from "date-fns";

import { ClapButton } from "@/components/blog/clap-button";
import { ShareButtons } from "@/components/blog/share-buttons";
import { env } from "@/lib/env";
import { estimateReadingMinutes } from "@/lib/reading-time";
import { Post } from "@/types/post";

export function PostArticle({
  post,
  prevSlug,
  nextSlug,
}: {
  post: Post;
  prevSlug?: string;
  nextSlug?: string;
}) {
  const date = format(new Date(post.publishedAt), "MMM d, yyyy").toLowerCase();
  const readingMinutes = estimateReadingMinutes(post.paragraphs);
  const subheadingAfterIndex = Math.min(2, post.paragraphs.length - 1);

  return (
    <article className="relative mx-auto max-w-4xl px-6 py-20">
      <header className="mb-16">
        <div className="mb-6 inline-block bg-white px-4 py-2">
          <span className="font-mono text-sm text-zinc-900">
            No. {post.number}
          </span>
        </div>

        <h1 className="mb-8 text-5xl leading-none font-bold text-white md:text-7xl">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-zinc-400">
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-zinc-600" />
            <time className="font-mono text-sm tracking-wider uppercase">
              {date}
            </time>
          </div>
          <span className="font-mono text-sm">{readingMinutes} min read</span>
          {post.category && (
            <Link
              className="border border-zinc-600 px-3 py-1 font-mono text-sm text-zinc-300 transition-colors hover:border-white hover:text-white"
              href={`/blog/category/${post.category.slug}`}
            >
              {post.category.name}
            </Link>
          )}
        </div>

        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                className="font-mono text-sm text-zinc-500 transition-colors hover:text-white"
                href={`/blog/tag/${tag.slug}`}
                key={tag.id}
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className="bg-white">
        <div className="h-2 bg-zinc-900" />

        <div className="space-y-8 p-8 md:p-16">
          {post.paragraphs.map((paragraph, index) => (
            <div key={index}>
              {index === 0 ? (
                <p className="text-xl leading-relaxed text-zinc-700">
                  <span className="float-left mt-2 mr-3 text-7xl leading-none font-bold text-zinc-900">
                    {paragraph.charAt(0)}
                  </span>
                  {paragraph.slice(1)}
                </p>
              ) : (
                <p className="text-lg leading-relaxed text-zinc-700">
                  {paragraph}
                </p>
              )}

              {index === subheadingAfterIndex && post.subheading && (
                <div className="my-12 border-l-4 border-zinc-900 pl-8">
                  <h2 className="text-3xl font-bold text-zinc-900">
                    {post.subheading}
                  </h2>
                </div>
              )}
            </div>
          ))}

          {post.quote && (
            <blockquote className="relative my-16">
              <div className="absolute top-0 -left-4 h-full w-1 bg-zinc-900" />
              <div className="bg-zinc-50 p-8 md:p-12">
                <p className="mb-4 text-2xl leading-relaxed font-bold text-zinc-900 md:text-3xl">
                  &ldquo;{post.quote}&rdquo;
                </p>
                {post.quoteAuthor && (
                  <cite className="font-mono text-sm text-zinc-600 not-italic">
                    — {post.quoteAuthor}
                  </cite>
                )}
              </div>
            </blockquote>
          )}

          {post.list.length > 0 && (
            <div className="my-12 space-y-4">
              {post.list.map((item, index) => (
                <div className="flex items-start gap-4" key={index}>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-zinc-900 font-mono text-sm text-white">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-lg leading-relaxed text-zinc-700">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-16 border-t-2 border-zinc-200 pt-8">
            <p className="mb-8 font-mono text-sm text-zinc-600">
              Thanks for reading. If this resonated with you, or if you think
              I&apos;m completely wrong, I&apos;d love to hear about it.
            </p>

            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <ClapButton initialCount={post.clapCount} slug={post.slug} />
              <ShareButtons
                slug={post.slug}
                title={post.title}
                url={`${env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 flex items-center justify-between">
        {prevSlug ? (
          <Link
            className="group flex items-center gap-3 text-white transition-colors hover:text-zinc-300"
            href={`/blog/${prevSlug}`}
          >
            <ArrowLeft size={20} />
            <span className="font-mono text-sm">Previous post</span>
          </Link>
        ) : (
          <div />
        )}

        {nextSlug ? (
          <Link
            className="group flex items-center gap-3 text-white transition-colors hover:text-zinc-300"
            href={`/blog/${nextSlug}`}
          >
            <span className="font-mono text-sm">Next post</span>
            <ArrowRight size={20} />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </article>
  );
}
