"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  Heading,
  List as ListIcon,
  Quote as QuoteIcon,
  Save,
  Text,
  Trash2,
  X,
} from "lucide-react";

import { PostArticle } from "@/components/blog/post-article";
import { slugify } from "@/lib/slugify";
import { ContentBlock } from "@/types/content-block";
import { Post } from "@/types/post";
import { Category, Tag } from "@/types/taxonomy";

function todayInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

function createEmptyBlock(type: ContentBlock["type"]): ContentBlock {
  switch (type) {
    case "paragraph":
      return { type: "paragraph", text: "" };
    case "heading":
      return { type: "heading", text: "" };
    case "quote":
      return { type: "quote", text: "", author: "" };
    case "list":
      return { type: "list", items: [""] };
  }
}

function cleanBlocks(blocks: ContentBlock[]): ContentBlock[] {
  return blocks
    .map((block): ContentBlock => {
      if (block.type === "list") {
        return { ...block, items: block.items.map((item) => item.trim()).filter(Boolean) };
      }
      if (block.type === "quote") {
        const author = block.author?.trim();
        return { ...block, text: block.text.trim(), author: author || undefined };
      }
      return { ...block, text: block.text.trim() };
    })
    .filter((block) =>
      block.type === "list" ? block.items.length > 0 : block.text !== "",
    );
}

const BLOCK_LABELS: Record<ContentBlock["type"], string> = {
  paragraph: "Paragraph",
  heading: "Heading",
  quote: "Quote",
  list: "List",
};

const BLOCK_ICONS: Record<ContentBlock["type"], typeof Text> = {
  paragraph: Text,
  heading: Heading,
  quote: QuoteIcon,
  list: ListIcon,
};

function BlockEditor({
  block,
  index,
  total,
  onChange,
  onRemove,
  onMove,
}: {
  block: ContentBlock;
  index: number;
  total: number;
  onChange: (block: ContentBlock) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
}) {
  const Icon = BLOCK_ICONS[block.type];

  return (
    <div className="border border-zinc-300 bg-zinc-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 font-mono text-xs tracking-wider text-zinc-500 uppercase">
          <Icon size={14} />
          {BLOCK_LABELS[block.type]}
        </span>

        <div className="flex items-center gap-1">
          <button
            className="p-1.5 text-zinc-500 transition-colors hover:text-zinc-900 disabled:opacity-30"
            disabled={index === 0}
            onClick={() => onMove(-1)}
            title="Move up"
            type="button"
          >
            <ArrowUp size={16} />
          </button>
          <button
            className="p-1.5 text-zinc-500 transition-colors hover:text-zinc-900 disabled:opacity-30"
            disabled={index === total - 1}
            onClick={() => onMove(1)}
            title="Move down"
            type="button"
          >
            <ArrowDown size={16} />
          </button>
          <button
            className="p-1.5 text-red-600 transition-colors hover:text-red-800"
            onClick={onRemove}
            title="Remove block"
            type="button"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {block.type === "paragraph" && (
        <textarea
          className="w-full resize-none border border-zinc-300 bg-white px-4 py-3 text-zinc-900 transition-colors focus:border-zinc-900 focus:outline-none"
          onChange={(event) => onChange({ ...block, text: event.target.value })}
          placeholder="Write your thoughts..."
          rows={4}
          value={block.text}
        />
      )}

      {block.type === "heading" && (
        <input
          className="w-full border border-zinc-300 bg-white px-4 py-3 text-lg font-bold text-zinc-900 transition-colors focus:border-zinc-900 focus:outline-none"
          onChange={(event) => onChange({ ...block, text: event.target.value })}
          placeholder="A section title..."
          type="text"
          value={block.text}
        />
      )}

      {block.type === "quote" && (
        <div className="space-y-3">
          <textarea
            className="w-full resize-none border border-zinc-300 bg-white px-4 py-3 text-zinc-900 transition-colors focus:border-zinc-900 focus:outline-none"
            onChange={(event) => onChange({ ...block, text: event.target.value })}
            placeholder="A memorable quote..."
            rows={3}
            value={block.text}
          />
          <input
            className="w-full border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition-colors focus:border-zinc-900 focus:outline-none"
            onChange={(event) =>
              onChange({ ...block, author: event.target.value })
            }
            placeholder="Author (optional)"
            type="text"
            value={block.author ?? ""}
          />
        </div>
      )}

      {block.type === "list" && (
        <div className="space-y-2">
          {block.items.map((item, itemIndex) => (
            <div className="flex items-center gap-2" key={itemIndex}>
              <input
                className="w-full border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 transition-colors focus:border-zinc-900 focus:outline-none"
                onChange={(event) => {
                  const items = block.items.map((existing, i) =>
                    i === itemIndex ? event.target.value : existing,
                  );
                  onChange({ ...block, items });
                }}
                placeholder="A list item..."
                type="text"
                value={item}
              />
              <button
                className="shrink-0 p-2 text-zinc-400 transition-colors hover:text-red-600 disabled:opacity-30"
                disabled={block.items.length === 1}
                onClick={() =>
                  onChange({
                    ...block,
                    items: block.items.filter((_, i) => i !== itemIndex),
                  })
                }
                title="Remove item"
                type="button"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          <button
            className="border border-zinc-300 px-3 py-1.5 font-mono text-xs text-zinc-700 transition-colors hover:border-zinc-900"
            onClick={() => onChange({ ...block, items: [...block.items, ""] })}
            type="button"
          >
            + Add item
          </button>
        </div>
      )}
    </div>
  );
}

export function PostForm({
  number,
  postId,
  initialPost,
  categories,
  tags,
}: {
  number: string;
  postId?: string;
  initialPost?: Post;
  categories: Category[];
  tags: Tag[];
}) {
  const router = useRouter();
  const isEditMode = Boolean(postId);
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [slug, setSlug] = useState(initialPost?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditMode);
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? "");
  const [subtitle, setSubtitle] = useState(initialPost?.subtitle ?? "");
  const [publishedAt, setPublishedAt] = useState(
    initialPost ? initialPost.publishedAt.slice(0, 10) : todayInputValue(),
  );
  const [blocks, setBlocks] = useState<ContentBlock[]>(
    initialPost
      ? [...initialPost.content]
      : [createEmptyBlock("paragraph"), createEmptyBlock("paragraph")],
  );
  const [categoryId, setCategoryId] = useState(
    initialPost?.category?.id ?? "",
  );
  const [selectedTagIds, setSelectedTagIds] = useState(
    initialPost ? initialPost.tags.map((tag) => tag.id) : [],
  );
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  function handleSlugChange(value: string) {
    if (value.trim() === "") {
      setSlug(slugify(title));
      setSlugTouched(false);
      return;
    }
    setSlug(value);
    setSlugTouched(true);
  }

  function toggleTag(tagId: string) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  }

  function addBlock(type: ContentBlock["type"]) {
    setBlocks((prev) => [...prev, createEmptyBlock(type)]);
  }

  function updateBlockAt(index: number, block: ContentBlock) {
    setBlocks((prev) => prev.map((existing, i) => (i === index ? block : existing)));
  }

  function removeBlockAt(index: number) {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  }

  function moveBlockAt(index: number, direction: -1 | 1) {
    setBlocks((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function handleClose() {
    const isDirty = isEditMode
      ? title !== (initialPost?.title ?? "") ||
        slug !== (initialPost?.slug ?? "") ||
        excerpt !== (initialPost?.excerpt ?? "") ||
        subtitle !== (initialPost?.subtitle ?? "") ||
        publishedAt !== (initialPost?.publishedAt.slice(0, 10) ?? "") ||
        categoryId !== (initialPost?.category?.id ?? "") ||
        JSON.stringify(blocks) !== JSON.stringify(initialPost?.content ?? []) ||
        JSON.stringify([...selectedTagIds].sort()) !==
          JSON.stringify(
            (initialPost?.tags.map((tag) => tag.id) ?? []).sort(),
          )
      : Boolean(
          title.trim() ||
          slug.trim() ||
          excerpt.trim() ||
          subtitle.trim() ||
          blocks.some((block) =>
            block.type === "list"
              ? block.items.some((item) => item.trim())
              : block.text.trim(),
          ) ||
          categoryId ||
          selectedTagIds.length > 0,
        );

    if (isDirty && !confirm("Discard your changes? They will be lost.")) {
      return;
    }

    router.push("/admin");
  }

  async function handleSave() {
    setError(null);

    const cleanedBlocks = cleanBlocks(blocks);
    const hasParagraph = cleanedBlocks.some((block) => block.type === "paragraph");

    if (!title.trim() || !hasParagraph) {
      setError("Title and at least one paragraph are required.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    setIsSaving(true);

    try {
      const url = isEditMode
        ? `/api/admin/posts/${postId}`
        : "/api/admin/posts";
      const method = isEditMode ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim() || undefined,
          number,
          publishedAt: new Date(publishedAt).toISOString(),
          excerpt: excerpt.trim() || undefined,
          subtitle: subtitle.trim() || undefined,
          content: cleanedBlocks,
          categoryId,
          tagIds: selectedTagIds,
        }),
      });
      const body = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!body.success) {
        setError(body.message ?? "Failed to save post");
        return;
      }

      router.push("/admin");
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  const previewPost: Post = {
    id: "preview",
    slug: slug || "preview",
    title: title || "Your title here...",
    number: number || "000",
    publishedAt: new Date(publishedAt).toISOString(),
    excerpt: excerpt || null,
    subtitle: subtitle || null,
    content: cleanBlocks(blocks),
    archived: false,
    pinned: initialPost?.pinned ?? false,
    clapCount: initialPost?.clapCount ?? 0,
    shareCount: initialPost?.shareCount ?? 0,
    category: categories.find((c) => c.id === categoryId) ?? null,
    tags: tags.filter((tag) => selectedTagIds.includes(tag.id)),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="sticky top-0 z-10 border-b border-zinc-700 bg-zinc-900">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isEditMode ? "Edit Post" : "Create New Post"}
            </h1>
            <p className="font-mono text-sm text-zinc-400">
              {isEditMode
                ? "// update your post"
                : "// fill in the details below"}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="flex flex-1 items-center justify-center gap-2 border border-zinc-700 bg-zinc-800 px-4 py-2 text-white transition-colors hover:bg-zinc-700 sm:flex-none"
              onClick={() => setShowPreview((prev) => !prev)}
              type="button"
            >
              <Eye size={18} />
              <span className="font-mono text-sm">
                {showPreview ? "Edit" : "Preview"}
              </span>
            </button>

            <button
              className="flex flex-1 items-center justify-center gap-2 bg-white px-4 py-2 font-bold text-zinc-900 transition-colors hover:bg-zinc-200 disabled:opacity-50 sm:flex-none sm:px-6"
              disabled={isSaving}
              onClick={handleSave}
              type="button"
            >
              <Save size={18} />
              {isSaving ? "Saving..." : "Save Post"}
            </button>

            <button
              className="flex h-10 w-10 shrink-0 items-center justify-center border border-zinc-700 bg-zinc-800 text-white transition-colors hover:bg-zinc-700"
              onClick={handleClose}
              type="button"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {error && (
          <div className="mb-6 border-2 border-red-600 bg-red-950 px-4 py-3 font-mono text-sm text-red-400">
            ✗ {error}
          </div>
        )}

        {!showPreview ? (
          <div className="space-y-8">
            <div className="space-y-6 bg-white p-4 sm:p-8">
              <div className="border-l-4 border-zinc-900 pl-4">
                <h2 className="text-2xl font-bold text-zinc-900">
                  Basic Information
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block font-mono text-sm text-zinc-700">
                    Title *
                  </label>
                  <input
                    className="w-full border-2 border-zinc-900 bg-zinc-50 px-4 py-3 text-lg text-zinc-900 transition-colors focus:bg-white focus:outline-none"
                    onChange={(event) => handleTitleChange(event.target.value)}
                    placeholder="the art of overthinking..."
                    type="text"
                    value={title}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block font-mono text-sm text-zinc-700">
                    Subtitle
                  </label>
                  <input
                    className="w-full border-2 border-zinc-900 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:bg-white focus:outline-none"
                    onChange={(event) => setSubtitle(event.target.value)}
                    placeholder="A one-line tagline shown under the title..."
                    type="text"
                    value={subtitle}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block font-mono text-sm text-zinc-700">
                    Slug
                  </label>
                  <input
                    className="w-full border-2 border-zinc-900 bg-zinc-50 px-4 py-3 font-mono text-sm text-zinc-900 transition-colors focus:bg-white focus:outline-none"
                    onChange={(event) => handleSlugChange(event.target.value)}
                    placeholder="the-art-of-overthinking"
                    type="text"
                    value={slug}
                  />
                  <p className="mt-1 font-mono text-xs text-zinc-500">
                    /blog/{slug || "your-slug-here"} — auto-generated from the
                    title, clear the field to resume auto-generating
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block font-mono text-sm text-zinc-700">
                    Excerpt
                  </label>
                  <textarea
                    className="w-full resize-none border-2 border-zinc-900 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:bg-white focus:outline-none"
                    onChange={(event) => setExcerpt(event.target.value)}
                    placeholder="A short summary shown on the blog list..."
                    rows={2}
                    value={excerpt}
                  />
                  <p className="mt-1 font-mono text-xs text-zinc-500">
                    Falls back to the first paragraph if left empty
                  </p>
                </div>

                <div>
                  <label className="mb-2 block font-mono text-sm text-zinc-700">
                    Date *
                  </label>
                  <input
                    className="w-full border-2 border-zinc-900 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:bg-white focus:outline-none"
                    onChange={(event) => setPublishedAt(event.target.value)}
                    type="date"
                    value={publishedAt}
                  />
                </div>

                <div>
                  <label className="mb-2 block font-mono text-sm text-zinc-700">
                    Post Number
                  </label>
                  <input
                    className="w-full cursor-not-allowed border-2 border-zinc-300 bg-zinc-100 px-4 py-3 text-zinc-500"
                    disabled
                    readOnly
                    type="text"
                    value={number}
                  />
                  <p className="mt-1 font-mono text-xs text-zinc-500">
                    {isEditMode
                      ? "Assigned when this post was created"
                      : "Auto-assigned, next in sequence"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 bg-white p-4 sm:p-8">
              <div className="border-l-4 border-zinc-900 pl-4">
                <h2 className="text-2xl font-bold text-zinc-900">
                  Category &amp; Tags
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="mb-2 block font-mono text-sm text-zinc-700">
                    Category *
                  </label>
                  {categories.length === 0 ? (
                    <p className="font-mono text-sm text-zinc-500">
                      No categories yet — create one in Admin &gt;
                      Categories.
                    </p>
                  ) : (
                    <select
                      className="w-full border-2 border-zinc-900 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:bg-white focus:outline-none"
                      onChange={(event) => setCategoryId(event.target.value)}
                      value={categoryId}
                    >
                      <option value="">Select a category…</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-mono text-sm text-zinc-700">
                    Tags
                  </label>
                  {tags.length === 0 ? (
                    <p className="font-mono text-sm text-zinc-500">
                      No tags yet — create some in Admin &gt; Tags.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => {
                        const isSelected = selectedTagIds.includes(tag.id);

                        return (
                          <button
                            className={`border-2 px-3 py-2 font-mono text-sm transition-colors ${
                              isSelected
                                ? "border-zinc-900 bg-zinc-900 text-white"
                                : "border-zinc-300 bg-zinc-50 text-zinc-700 hover:border-zinc-900"
                            }`}
                            key={tag.id}
                            onClick={() => toggleTag(tag.id)}
                            type="button"
                          >
                            {tag.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6 bg-white p-4 sm:p-8">
              <div className="border-l-4 border-zinc-900 pl-4">
                <h2 className="text-2xl font-bold text-zinc-900">Content</h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Build the article from paragraph, heading, quote, and list
                  blocks — reorder or remove them as needed
                </p>
              </div>

              <div className="space-y-4">
                {blocks.map((block, index) => (
                  <BlockEditor
                    block={block}
                    index={index}
                    key={index}
                    onChange={(next) => updateBlockAt(index, next)}
                    onMove={(direction) => moveBlockAt(index, direction)}
                    onRemove={() => removeBlockAt(index)}
                    total={blocks.length}
                  />
                ))}

                <div className="flex flex-wrap gap-2">
                  <button
                    className="flex items-center gap-2 border-2 border-zinc-900 px-4 py-2 font-mono text-sm text-zinc-900 transition-colors hover:bg-zinc-900 hover:text-white"
                    onClick={() => addBlock("paragraph")}
                    type="button"
                  >
                    <Text size={16} />+ Paragraph
                  </button>
                  <button
                    className="flex items-center gap-2 border-2 border-zinc-900 px-4 py-2 font-mono text-sm text-zinc-900 transition-colors hover:bg-zinc-900 hover:text-white"
                    onClick={() => addBlock("heading")}
                    type="button"
                  >
                    <Heading size={16} />+ Heading
                  </button>
                  <button
                    className="flex items-center gap-2 border-2 border-zinc-900 px-4 py-2 font-mono text-sm text-zinc-900 transition-colors hover:bg-zinc-900 hover:text-white"
                    onClick={() => addBlock("quote")}
                    type="button"
                  >
                    <QuoteIcon size={16} />+ Quote
                  </button>
                  <button
                    className="flex items-center gap-2 border-2 border-zinc-900 px-4 py-2 font-mono text-sm text-zinc-900 transition-colors hover:bg-zinc-900 hover:text-white"
                    onClick={() => addBlock("list")}
                    type="button"
                  >
                    <ListIcon size={16} />+ List
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <PostArticle post={previewPost} />
        )}
      </div>
    </div>
  );
}
