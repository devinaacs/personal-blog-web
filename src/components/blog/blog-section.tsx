import { BlogFilterGrid } from "@/components/blog/blog-filter-grid";
import { WoodTexture } from "@/components/shared/wood-texture";
import { Post } from "@/types/post";

export function BlogSection({
  posts,
  heading = "recent writings",
  description = "// unfiltered thoughts from the past few weeks",
  emptyMessage = "No posts yet",
}: {
  posts: Post[];
  heading?: string;
  description?: string;
  emptyMessage?: string;
}) {
  return (
    <section
      className="relative overflow-hidden bg-zinc-100 px-6 py-20"
      id="posts"
    >
      <WoodTexture />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16">
          <div className="mb-4 flex items-center gap-4">
            <div className="h-px w-16 bg-zinc-900" />
            <h2 className="text-4xl font-bold text-zinc-900 md:text-5xl">
              {heading}
            </h2>
          </div>
          <p className="font-mono text-sm text-zinc-600 md:ml-20">
            {description}
          </p>
        </div>

        <BlogFilterGrid emptyMessage={emptyMessage} posts={posts} />
      </div>
    </section>
  );
}
