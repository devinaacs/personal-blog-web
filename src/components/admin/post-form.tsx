"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Save, X } from "lucide-react";

import { PostArticle } from "@/components/blog/post-article";
import { Post } from "@/types/post";

function todayInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

export function PostForm({
  number,
  postId,
  initialPost,
}: {
  number: string;
  postId?: string;
  initialPost?: Post;
}) {
  const router = useRouter();
  const isEditMode = Boolean(postId);
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [publishedAt, setPublishedAt] = useState(
    initialPost ? initialPost.publishedAt.slice(0, 10) : todayInputValue(),
  );
  const [paragraphs, setParagraphs] = useState(
    initialPost ? [...initialPost.paragraphs] : ["", "", "", ""],
  );
  const [quote, setQuote] = useState(initialPost?.quote ?? "");
  const [quoteAuthor, setQuoteAuthor] = useState(
    initialPost?.quoteAuthor ?? "",
  );
  const [subheading, setSubheading] = useState(initialPost?.subheading ?? "");
  const [listItems, setListItems] = useState(
    initialPost ? [...initialPost.list] : ["", "", "", ""],
  );
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function handleParagraphChange(index: number, value: string) {
    setParagraphs((prev) => prev.map((p, i) => (i === index ? value : p)));
  }

  function handleListItemChange(index: number, value: string) {
    setListItems((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  function handleClose() {
    const isDirty = isEditMode
      ? title !== (initialPost?.title ?? "") ||
        publishedAt !== (initialPost?.publishedAt.slice(0, 10) ?? "") ||
        subheading !== (initialPost?.subheading ?? "") ||
        quote !== (initialPost?.quote ?? "") ||
        quoteAuthor !== (initialPost?.quoteAuthor ?? "") ||
        JSON.stringify(paragraphs) !==
          JSON.stringify(initialPost?.paragraphs ?? []) ||
        JSON.stringify(listItems) !== JSON.stringify(initialPost?.list ?? [])
      : Boolean(
          title.trim() ||
          paragraphs.some((p) => p.trim()) ||
          subheading.trim() ||
          quote.trim() ||
          listItems.some((item) => item.trim()),
        );

    if (isDirty && !confirm("Discard your changes? They will be lost.")) {
      return;
    }

    router.push("/admin");
  }

  async function handleSave() {
    setError(null);

    const cleanParagraphs = paragraphs.filter((p) => p.trim() !== "");
    const cleanList = listItems.filter((item) => item.trim() !== "");

    if (!title.trim() || cleanParagraphs.length === 0) {
      setError("Title and at least one paragraph are required.");
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
          number,
          publishedAt: new Date(publishedAt).toISOString(),
          paragraphs: cleanParagraphs,
          subheading: subheading.trim() || undefined,
          quote: quote.trim() || undefined,
          quoteAuthor: quoteAuthor.trim() || undefined,
          list: cleanList.length > 0 ? cleanList : undefined,
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
    slug: "preview",
    title: title || "Your title here...",
    number: number || "000",
    publishedAt: new Date(publishedAt).toISOString(),
    subheading: subheading || null,
    quote: quote || null,
    quoteAuthor: quoteAuthor || null,
    paragraphs: paragraphs.filter((p) => p.trim() !== ""),
    list: listItems.filter((item) => item.trim() !== ""),
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
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="the art of overthinking..."
                    type="text"
                    value={title}
                  />
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
                <h2 className="text-2xl font-bold text-zinc-900">Content</h2>
              </div>

              <div className="space-y-4">
                {paragraphs.map((paragraph, index) => (
                  <div key={index}>
                    <label className="mb-2 block font-mono text-xs text-zinc-500">
                      Paragraph {index + 1}{" "}
                      {index === 0 && "(First letter will be a drop cap)"}
                    </label>
                    <textarea
                      className="w-full resize-none border border-zinc-300 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:border-zinc-900 focus:bg-white focus:outline-none"
                      onChange={(event) =>
                        handleParagraphChange(index, event.target.value)
                      }
                      placeholder="Write your thoughts..."
                      rows={4}
                      value={paragraph}
                    />
                  </div>
                ))}

                <button
                  className="border-2 border-zinc-900 px-4 py-2 font-mono text-sm text-zinc-900 transition-colors hover:bg-zinc-900 hover:text-white"
                  onClick={() => setParagraphs((prev) => [...prev, ""])}
                  type="button"
                >
                  + Add Paragraph
                </button>
              </div>
            </div>

            <div className="space-y-6 bg-white p-4 sm:p-8">
              <div className="border-l-4 border-zinc-900 pl-4">
                <h2 className="text-2xl font-bold text-zinc-900">
                  Optional Elements
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="mb-2 block font-mono text-sm text-zinc-700">
                    Subheading
                  </label>
                  <input
                    className="w-full border-2 border-zinc-900 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:bg-white focus:outline-none"
                    onChange={(event) => setSubheading(event.target.value)}
                    placeholder="A section title..."
                    type="text"
                    value={subheading}
                  />
                </div>

                <div>
                  <label className="mb-2 block font-mono text-sm text-zinc-700">
                    Pull Quote
                  </label>
                  <textarea
                    className="w-full resize-none border-2 border-zinc-900 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:bg-white focus:outline-none"
                    onChange={(event) => setQuote(event.target.value)}
                    placeholder="A memorable quote from your post..."
                    rows={3}
                    value={quote}
                  />
                </div>

                <div>
                  <label className="mb-2 block font-mono text-sm text-zinc-700">
                    Quote Author (optional)
                  </label>
                  <input
                    className="w-full border-2 border-zinc-900 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:bg-white focus:outline-none"
                    onChange={(event) => setQuoteAuthor(event.target.value)}
                    placeholder="Author name"
                    type="text"
                    value={quoteAuthor}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 bg-white p-4 sm:p-8">
              <div className="border-l-4 border-zinc-900 pl-4">
                <h2 className="text-2xl font-bold text-zinc-900">List Items</h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Numbered takeaways or key points
                </p>
              </div>

              <div className="space-y-4">
                {listItems.map((item, index) => (
                  <div key={index}>
                    <label className="mb-2 block font-mono text-xs text-zinc-500">
                      Item {index + 1}
                    </label>
                    <input
                      className="w-full border border-zinc-300 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:border-zinc-900 focus:bg-white focus:outline-none"
                      onChange={(event) =>
                        handleListItemChange(index, event.target.value)
                      }
                      placeholder="A key takeaway..."
                      type="text"
                      value={item}
                    />
                  </div>
                ))}

                <button
                  className="border-2 border-zinc-900 px-4 py-2 font-mono text-sm text-zinc-900 transition-colors hover:bg-zinc-900 hover:text-white"
                  onClick={() => setListItems((prev) => [...prev, ""])}
                  type="button"
                >
                  + Add List Item
                </button>
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
