"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

import { BlogCard } from "@/components/blog/blog-card";
import { getPostExcerpt } from "@/lib/posts";
import { Post } from "@/types/post";

type SortOrder = "newest" | "oldest";

function useUniqueTaxonomy(posts: Post[]) {
  return useMemo(() => {
    const categoryMap = new Map<string, string>();
    const tagMap = new Map<string, string>();

    posts.forEach((post) => {
      if (post.category) categoryMap.set(post.category.slug, post.category.name);
      post.tags.forEach((tag) => tagMap.set(tag.slug, tag.name));
    });

    return {
      categories: Array.from(categoryMap, ([slug, name]) => ({ slug, name })),
      tags: Array.from(tagMap, ([slug, name]) => ({ slug, name })),
    };
  }, [posts]);
}

export function BlogFilterGrid({
  posts,
  emptyMessage = "No posts yet",
}: {
  posts: Post[];
  emptyMessage?: string;
}) {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const { categories, tags } = useUniqueTaxonomy(posts);

  const filteredPosts = useMemo(() => {
    let result = posts;

    if (activeCategory) {
      result = result.filter((post) => post.category?.slug === activeCategory);
    }

    if (activeTags.length > 0) {
      result = result.filter((post) =>
        activeTags.every((tagSlug) =>
          post.tags.some((tag) => tag.slug === tagSlug),
        ),
      );
    }

    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          getPostExcerpt(post).toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.name.toLowerCase().includes(query)),
      );
    }

    return [...result].sort((a, b) => {
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }

      const aTime = new Date(a.publishedAt).getTime();
      const bTime = new Date(b.publishedAt).getTime();
      return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
    });
  }, [posts, activeCategory, activeTags, search, sortOrder]);

  function toggleCategory(slug: string) {
    setActiveCategory((prev) => (prev === slug ? null : slug));
  }

  function toggleTag(slug: string) {
    setActiveTags((prev) =>
      prev.includes(slug) ? prev.filter((tag) => tag !== slug) : [...prev, slug],
    );
  }

  return (
    <>
      <div className="mb-10 border-2 border-zinc-200 bg-white p-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400"
              size={18}
            />
            <input
              className="w-full border border-zinc-300 bg-zinc-50 py-3 pr-4 pl-10 font-mono text-sm text-zinc-900 transition-colors focus:border-zinc-900 focus:bg-white focus:outline-none"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="search posts, tags..."
              type="text"
              value={search}
            />
          </div>

          <div className="relative">
            <select
              className="w-full appearance-none border border-zinc-300 bg-zinc-50 py-3 pr-10 pl-4 font-mono text-sm text-zinc-900 transition-colors focus:border-zinc-900 focus:bg-white focus:outline-none sm:w-auto"
              onChange={(event) => setSortOrder(event.target.value as SortOrder)}
              value={sortOrder}
            >
              <option value="newest">newest first</option>
              <option value="oldest">oldest first</option>
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400"
              size={16}
            />
          </div>
        </div>

        {categories.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="mr-1 font-mono text-xs tracking-wider text-zinc-400 uppercase">
              Category
            </span>
            {categories.map((category) => (
              <button
                className={`border px-3 py-1.5 font-mono text-xs tracking-wider uppercase transition-colors ${
                  activeCategory === category.slug
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-300 text-zinc-600 hover:border-zinc-900"
                }`}
                key={category.slug}
                onClick={() => toggleCategory(category.slug)}
                type="button"
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 font-mono text-xs tracking-wider text-zinc-400 uppercase">
              Tags
            </span>
            {tags.map((tag) => (
              <button
                className={`border border-dashed px-3 py-1 font-mono text-xs transition-colors ${
                  activeTags.includes(tag.slug)
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-300 text-zinc-600 hover:border-zinc-900"
                }`}
                key={tag.slug}
                onClick={() => toggleTag(tag.slug)}
                type="button"
              >
                #{tag.name}
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center gap-3 border-t border-zinc-100 pt-4 font-mono text-xs text-zinc-500">
          <div className="h-px w-6 bg-zinc-300" />
          {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="border-2 border-zinc-200 bg-white py-16 text-center">
          <div className="mb-4 text-6xl">{posts.length === 0 ? "📝" : "🔍"}</div>
          <p className="text-xl text-zinc-600">
            {posts.length === 0 ? emptyMessage : "No posts match your filters"}
          </p>
        </div>
      ) : (
        <div className="grid auto-rows-fr gap-6 md:grid-cols-3">
          {filteredPosts.map((post, index) => (
            <BlogCard isLarge={index === 0} key={post.id} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
