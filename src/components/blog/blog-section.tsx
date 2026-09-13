import { BlogFilterGrid } from "@/components/blog/blog-filter-grid";
import { Reveal } from "@/components/shared/reveal";
import { Post } from "@/types/post";

export function BlogSection({
  posts,
  heading = "recent writings",
  description = "// unfiltered thoughts from the past few weeks",
  emptyMessage = "No posts yet",
  index = "02",
}: {
  posts: Post[];
  heading?: string;
  description?: string;
  emptyMessage?: string;
  index?: string;
}) {
  return (
    <section className="border-b-2 border-ink bg-paper-dim px-6 py-20" id="posts">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-16 flex items-baseline gap-6 border-b-2 border-ink pb-6">
          <span className="font-mono text-2xl font-bold text-ink-faint">
            {index}
          </span>
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
              {heading}
            </h2>
            <p className="mt-2 font-mono text-sm text-ink-soft">
              {description}
            </p>
          </div>
        </Reveal>

        <BlogFilterGrid emptyMessage={emptyMessage} posts={posts} />
      </div>
    </section>
  );
}
