import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { BlogSection } from "@/components/blog/blog-section";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { createMetadata } from "@/config/metadata";
import { getCategoryBySlug } from "@/lib/categories";
import { listPublishedPosts } from "@/lib/posts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return createMetadata(`/blog/category/${slug}`);
  }

  return createMetadata(`/blog/category/${category.slug}`, {
    title: `Category: ${category.name}`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const { items: posts } = await listPublishedPosts({
    category: category.slug,
    limit: 100,
  });

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-zinc-50">
        <BlogSection
          description={`// posts filed under ${category.name}`}
          emptyMessage="No posts in this category yet"
          heading={category.name}
          posts={posts}
        />
      </main>
      <SiteFooter />
    </>
  );
}
