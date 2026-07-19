import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { format } from "date-fns";

import { PostDetail } from "@/components/blog/post-detail";
import { createMetadata, metadata as baseMetadata } from "@/config/metadata";
import {
  getPostBySlug,
  getPostExcerpt,
  getSurroundingPosts,
  listPublishedPosts,
} from "@/lib/posts";
import { estimateReadingMinutes } from "@/lib/reading-time";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const { items } = await listPublishedPosts({ limit: 100 });

  return items.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return createMetadata(`/blog/${slug}`);
  }

  const description = getPostExcerpt(post).slice(0, 160);
  const ogParams = new URLSearchParams({
    title: post.title,
    subheading: description,
    number: post.number,
    date: format(new Date(post.publishedAt), "MMM d, yyyy").toLowerCase(),
    readingMinutes: String(estimateReadingMinutes(post.content)),
  });
  if (post.category) {
    ogParams.set("category", post.category.name);
  }
  if (post.tags.length > 0) {
    ogParams.set("tags", post.tags.map((tag) => tag.name).join(","));
  }
  const ogImage = `/og?${ogParams.toString()}`;

  return createMetadata(`/blog/${post.slug}`, {
    title: post.title,
    description,
    openGraph: {
      ...baseMetadata.openGraph,
      title: post.title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      ...baseMetadata.twitter,
      title: post.title,
      description,
      images: [ogImage],
    },
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { prev, next } = await getSurroundingPosts(slug);

  return <PostDetail nextSlug={next?.slug} post={post} prevSlug={prev?.slug} />;
}
