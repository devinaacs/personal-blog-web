import { About } from "@/components/blog/about";
import { BlogSection } from "@/components/blog/blog-section";
import { Hero } from "@/components/blog/hero";
import { createMetadata } from "@/config/metadata";
import { listPublishedPosts } from "@/lib/posts";

export const metadata = createMetadata("/");

export default async function Home() {
  const { items: posts, pagination } = await listPublishedPosts();

  return (
    <main className="min-h-screen bg-zinc-50">
      <Hero />
      <BlogSection posts={posts} />
      <About postsWrittenCount={pagination.total} />
    </main>
  );
}
