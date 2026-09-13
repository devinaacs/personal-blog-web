import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { format } from "date-fns";

import { ClapButton } from "@/components/blog/clap-button";
import { InlineText } from "@/components/blog/inline-text";
import { ShareButtons } from "@/components/blog/share-buttons";
import { ViewTracker } from "@/components/blog/view-tracker";
import { Reveal } from "@/components/shared/reveal";
import { NEXT_PUBLIC_APP_URL } from "@/lib/public-env";
import { estimateReadingMinutes } from "@/lib/reading-time";
import { BlockAlign, ContentBlock } from "@/types/content-block";
import { Post } from "@/types/post";

const ALIGN_CLASS: Record<BlockAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

function ContentBlockView({
  block,
  isFirstParagraph,
}: {
  block: ContentBlock;
  isFirstParagraph: boolean;
}) {
  switch (block.type) {
    case "paragraph":
      return isFirstParagraph ? (
        <p
          className={`text-xl leading-relaxed text-ink-soft ${ALIGN_CLASS[block.align ?? "left"]}`}
        >
          <span className="float-left mt-1 mr-3 text-6xl leading-none font-bold text-accent sm:text-7xl">
            {block.text.charAt(0)}
          </span>
          <InlineText text={block.text.slice(1)} />
        </p>
      ) : (
        <p
          className={`text-lg leading-relaxed text-ink-soft ${ALIGN_CLASS[block.align ?? "left"]}`}
        >
          <InlineText text={block.text} />
        </p>
      );

    case "heading":
      return (
        <div
          className={`my-12 border-l-4 border-ink pl-8 ${ALIGN_CLASS[block.align ?? "left"]}`}
        >
          <h2 className="text-3xl font-bold tracking-tight text-ink">
            <InlineText text={block.text} />
          </h2>
        </div>
      );

    case "quote":
      return (
        <blockquote
          className={`relative my-16 border-2 border-ink ${ALIGN_CLASS[block.align ?? "left"]}`}
        >
          <div className="p-8 md:p-12">
            <p className="mb-4 text-2xl leading-relaxed font-bold text-ink md:text-3xl">
              &ldquo;<InlineText text={block.text} />&rdquo;
            </p>
            {block.author && (
              <cite className="font-mono text-sm text-ink-soft not-italic">
                — {block.author}
              </cite>
            )}
          </div>
        </blockquote>
      );

    case "list":
      return (
        <div className={`my-12 space-y-4 ${ALIGN_CLASS[block.align ?? "left"]}`}>
          {block.items.map((item, itemIndex) => (
            <div className="flex items-start gap-4" key={itemIndex}>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-ink font-mono text-sm text-ink">
                {itemIndex + 1}
              </div>
              <p className="pt-1 text-lg leading-relaxed text-ink-soft">
                <InlineText text={item} />
              </p>
            </div>
          ))}
        </div>
      );

    case "image":
      return (
        <figure className="my-12">
          {block.width && block.height ? (
            <Image
              alt={block.alt}
              className="h-auto w-full border-2 border-ink"
              height={block.height}
              sizes="(max-width: 768px) 100vw, 768px"
              src={block.url}
              width={block.width}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- legacy posts saved before dimensions were captured
            <img
              alt={block.alt}
              className="w-full border-2 border-ink"
              src={block.url}
            />
          )}
          {block.caption && (
            <figcaption
              className={`mt-3 font-mono text-sm text-ink-faint ${ALIGN_CLASS[block.align ?? "center"]}`}
            >
              <InlineText text={block.caption} />
            </figcaption>
          )}
        </figure>
      );

    case "table":
      return (
        <div className="my-12 overflow-x-auto border-2 border-ink">
          <table className={`w-full border-collapse ${ALIGN_CLASS[block.align ?? "left"]}`}>
            <thead>
              <tr className="bg-ink">
                {block.headers.map((header, headerIndex) => (
                  <th
                    className="px-4 py-3 font-mono text-xs tracking-wider text-paper uppercase"
                    key={headerIndex}
                  >
                    <InlineText text={header} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr className="border-t border-line" key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      className="px-4 py-3 text-lg text-ink-soft"
                      key={cellIndex}
                    >
                      <InlineText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

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
  const readingMinutes = estimateReadingMinutes(post.content);
  const firstParagraphIndex = post.content.findIndex(
    (block) => block.type === "paragraph",
  );

  return (
    <article className="relative mx-auto max-w-6xl px-6 py-20">
      <ViewTracker slug={post.slug} />

      <Reveal
        as="header"
        className="mb-16 border-b-2 border-paper/20 pb-10"
        immediate
        y={20}
      >
        <div className="mb-6 inline-block border border-paper/30 px-4 py-2">
          <span className="font-mono text-sm text-paper">
            No. {post.number}
          </span>
        </div>

        <h1 className="text-5xl leading-[0.95] font-bold tracking-tight text-paper md:text-7xl">
          {post.title}
        </h1>

        {post.subtitle && (
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-paper/60">
            {post.subtitle}
          </p>
        )}
      </Reveal>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]">
        <Reveal
          as="div"
          className="lg:sticky lg:top-24 lg:h-fit"
          immediate
          y={16}
        >
          <div className="space-y-3 font-mono text-xs tracking-wider text-paper/50 uppercase">
            <div className="flex items-center justify-between border-b border-paper/15 pb-2">
              <span>date</span>
              <span className="text-paper">{date}</span>
            </div>
            <div className="flex items-center justify-between border-b border-paper/15 pb-2">
              <span>read</span>
              <span className="text-paper">{readingMinutes} min</span>
            </div>
            <div className="flex items-center justify-between border-b border-paper/15 pb-2">
              <span className="flex items-center gap-1.5">
                <Eye size={12} />
                reads
              </span>
              <span className="text-paper">
                {post.viewCount.toLocaleString()}
              </span>
            </div>
            {post.category && (
              <div className="flex items-center justify-between pb-2">
                <span>filed</span>
                <Link
                  className="text-paper transition-colors hover:text-accent"
                  href={`/blog/category/${post.category.slug}`}
                >
                  {post.category.name}
                </Link>
              </div>
            )}
          </div>

          {post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1 border-t border-paper/15 pt-4">
              {post.tags.map((tag) => (
                <Link
                  className="font-mono text-xs text-paper/40 transition-colors hover:text-accent"
                  href={`/blog/tag/${tag.slug}`}
                  key={tag.id}
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center gap-6 border-t border-paper/15 pt-6 lg:flex-col lg:items-start lg:gap-8">
            <ClapButton initialCount={post.clapCount} slug={post.slug} />
            <ShareButtons
              slug={post.slug}
              title={post.title}
              url={`${NEXT_PUBLIC_APP_URL}/blog/${post.slug}`}
            />
          </div>
        </Reveal>

        <div>
          <Reveal as="div" className="border-2 border-paper" delay={0.1} immediate y={24}>
            <div className="h-2 bg-accent" />

            <div className="space-y-8 bg-paper-raised p-8 md:p-16">
              {post.content.map((block, index) => (
                <ContentBlockView
                  block={block}
                  isFirstParagraph={index === firstParagraphIndex}
                  key={index}
                />
              ))}

              <p className="border-t-2 border-line pt-8 font-mono text-sm text-ink-soft">
                Thanks for reading. If this resonated with you, or if you
                think I&apos;m completely wrong, I&apos;d love to hear about
                it.
              </p>
            </div>
          </Reveal>

          <div className="mt-16 flex items-center justify-between border-t-2 border-paper/20 pt-8">
            {prevSlug ? (
              <Link
                className="group flex items-center gap-3 text-paper transition-colors hover:text-accent"
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
                className="group flex items-center gap-3 text-paper transition-colors hover:text-accent"
                href={`/blog/${nextSlug}`}
              >
                <span className="font-mono text-sm">Next post</span>
                <ArrowRight size={20} />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
