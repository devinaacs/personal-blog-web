"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Select as SelectPrimitive } from "radix-ui";

import { BlogCard } from "@/components/blog/blog-card";
import { getPostExcerpt } from "@/lib/content-blocks";
import { Post } from "@/types/post";

type SortOrder = "newest" | "oldest";

const SORT_LABELS: Record<SortOrder, string> = {
  newest: "newest first",
  oldest: "oldest first",
};

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
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { categories, tags } = useUniqueTaxonomy(posts);
  const categoryName = categories.find((c) => c.slug === activeCategory)?.name;
  const activeCount = (activeCategory ? 1 : 0) + activeTags.length;

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

      const diff = Number(a.number) - Number(b.number);
      return sortOrder === "newest" ? -diff : diff;
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
      <div className="mb-10 border-2 border-ink">
        <div className="flex flex-col divide-y-2 divide-ink sm:flex-row sm:divide-x-2 sm:divide-y-0">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-faint"
              size={16}
            />
            <input
              className="w-full bg-paper py-3 pr-4 pl-11 font-mono text-sm text-ink focus:bg-paper-dim focus:outline-none"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="search posts, tags..."
              type="text"
              value={search}
            />
          </div>

          <SelectPrimitive.Root
            onValueChange={(value) => setSortOrder(value as SortOrder)}
            value={sortOrder}
          >
            <SelectPrimitive.Trigger className="group flex w-full items-center justify-between gap-8 bg-paper py-3 pr-4 pl-4 font-mono text-sm text-ink uppercase tracking-wider outline-none data-[state=open]:bg-ink data-[state=open]:text-paper sm:w-auto">
              <SelectPrimitive.Value />
              <SelectPrimitive.Icon>
                <ChevronDown
                  className="text-ink-faint transition-transform group-data-[state=open]:rotate-180 group-data-[state=open]:text-paper"
                  size={14}
                />
              </SelectPrimitive.Icon>
            </SelectPrimitive.Trigger>
            <SelectPrimitive.Portal>
              <SelectPrimitive.Content
                className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden border-2 border-ink bg-paper text-ink shadow-[4px_4px_0_0_var(--color-ink)] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
                position="popper"
                sideOffset={8}
              >
                <SelectPrimitive.Viewport className="p-0">
                  {(Object.keys(SORT_LABELS) as SortOrder[]).map((value) => (
                    <SelectPrimitive.Item
                      className="flex cursor-pointer items-center justify-between gap-6 px-4 py-2.5 font-mono text-sm text-ink-soft uppercase tracking-wider outline-none select-none data-[highlighted]:bg-ink data-[highlighted]:text-paper data-[state=checked]:bg-ink data-[state=checked]:text-paper"
                      key={value}
                      value={value}
                    >
                      <SelectPrimitive.ItemText>
                        {SORT_LABELS[value]}
                      </SelectPrimitive.ItemText>
                      <SelectPrimitive.ItemIndicator>
                        <Check size={14} />
                      </SelectPrimitive.ItemIndicator>
                    </SelectPrimitive.Item>
                  ))}
                </SelectPrimitive.Viewport>
              </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
          </SelectPrimitive.Root>

          <button
            className={`flex items-center justify-center gap-2 px-4 py-3 font-mono text-xs tracking-wider uppercase transition-colors ${
              filtersOpen ? "bg-ink text-paper" : "text-ink-soft hover:bg-paper-dim"
            }`}
            onClick={() => setFiltersOpen((prev) => !prev)}
            type="button"
          >
            <SlidersHorizontal size={14} />
            filters
            {activeCount > 0 && (
              <span
                className={`flex h-4 w-4 items-center justify-center text-[10px] ${
                  filtersOpen ? "bg-paper text-ink" : "bg-ink text-paper"
                }`}
              >
                {activeCount}
              </span>
            )}
            <ChevronDown
              className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`}
              size={14}
            />
          </button>
        </div>

        {!filtersOpen && activeCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-t-2 border-ink px-4 py-3">
            {activeCategory && (
              <button
                className="flex items-center gap-1.5 border border-ink bg-paper-dim px-2.5 py-1 font-mono text-xs text-ink-soft uppercase"
                onClick={() => setActiveCategory(null)}
                type="button"
              >
                {categoryName}
                <X size={12} />
              </button>
            )}
            {activeTags.map((slug) => (
              <button
                className="flex items-center gap-1.5 border border-dashed border-ink bg-paper-dim px-2.5 py-1 font-mono text-xs text-ink-soft"
                key={slug}
                onClick={() => toggleTag(slug)}
                type="button"
              >
                #{tags.find((tag) => tag.slug === slug)?.name}
                <X size={12} />
              </button>
            ))}
            <button
              className="font-mono text-xs text-ink-faint underline-offset-2 hover:text-ink hover:underline"
              onClick={() => {
                setActiveCategory(null);
                setActiveTags([]);
              }}
              type="button"
            >
              clear all
            </button>
          </div>
        )}

        <AnimatePresence initial={false}>
          {filtersOpen && (
            <motion.div
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              initial={{ height: 0 }}
              style={{ overflow: "hidden" }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {categories.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 border-t-2 border-ink px-4 py-4">
                  <span className="mr-1 font-mono text-xs tracking-wider text-ink-faint uppercase">
                    Category
                  </span>
                  {categories.map((category) => (
                    <button
                      className={`border border-ink px-3 py-1.5 font-mono text-xs tracking-wider uppercase transition-colors ${
                        activeCategory === category.slug
                          ? "bg-ink text-paper"
                          : "text-ink-soft hover:bg-paper-dim"
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
                <div className="flex flex-wrap items-center gap-2 border-t-2 border-ink px-4 py-4">
                  <span className="mr-1 font-mono text-xs tracking-wider text-ink-faint uppercase">
                    Tags
                  </span>
                  {tags.map((tag) => (
                    <button
                      className={`border border-dashed border-ink px-3 py-1 font-mono text-xs transition-colors ${
                        activeTags.includes(tag.slug)
                          ? "bg-ink text-paper"
                          : "text-ink-soft hover:bg-paper-dim"
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
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3 border-t-2 border-ink px-4 py-2.5 font-mono text-xs text-ink-faint">
          <motion.span key={filteredPosts.length}>
            {filteredPosts.length}{" "}
            {filteredPosts.length === 1 ? "post" : "posts"}
          </motion.span>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="border-2 border-ink py-16 text-center">
          <div className="mb-4 text-6xl">{posts.length === 0 ? "📝" : "🔍"}</div>
          <p className="text-xl font-bold text-ink-soft">
            {posts.length === 0 ? emptyMessage : "No posts match your filters"}
          </p>
        </div>
      ) : (
        <div className="grid auto-rows-fr grid-cols-1 gap-px bg-ink md:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
