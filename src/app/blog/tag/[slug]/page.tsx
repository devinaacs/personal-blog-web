import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { BlogSection } from "@/components/blog/blog-section";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { createMetadata } from "@/config/metadata";
import { listPublishedPosts } from "@/lib/posts";
import { getTagBySlug } from "@/lib/tags";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    return createMetadata(`/blog/tag/${slug}`);
  }

  return createMetadata(`/blog/tag/${tag.slug}`, {
    title: `Tag: ${tag.name}`,
  });
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  const { items: posts } = await listPublishedPosts({
    tag: tag.slug,
    limit: 100,
  });

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-zinc-50">
        <BlogSection
          description={`// posts tagged #${tag.name}`}
          emptyMessage="No posts with this tag yet"
          heading={`#${tag.name}`}
          posts={posts}
        />
      </main>
      <SiteFooter />
    </>
  );
}
