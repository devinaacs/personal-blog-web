"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

import { Tag } from "@/types/taxonomy";

export function TagManager({ tags }: { tags: Tag[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;

    setError(null);
    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const body = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!body.success) {
        setError(body.message ?? "Failed to create tag");
        return;
      }

      setName("");
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(tag: Tag) {
    if (!confirm(`Delete "${tag.name}"? It will be removed from all posts.`)) {
      return;
    }

    setDeletingId(tag.id);

    try {
      const response = await fetch(`/api/admin/tags/${tag.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const body = (await response.json()) as { message?: string };
        alert(body.message ?? "Failed to delete tag");
        return;
      }

      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="mb-1 text-2xl font-bold text-zinc-900 sm:text-3xl">
        Tags
      </h1>
      <p className="mb-8 font-mono text-sm text-zinc-500">
        {"// posts can have any number of tags"}
      </p>

      <form className="mb-8 flex gap-3" onSubmit={handleCreate}>
        <input
          className="flex-1 border-2 border-zinc-900 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:bg-white focus:outline-none"
          onChange={(event) => setName(event.target.value)}
          placeholder="New tag name..."
          type="text"
          value={name}
        />
        <button
          className="flex items-center gap-2 bg-zinc-900 px-4 py-3 font-bold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
          disabled={isSaving || !name.trim()}
          type="submit"
        >
          <Plus size={18} />
          Add
        </button>
      </form>

      {error && (
        <div className="mb-6 border-2 border-red-600 bg-red-50 px-4 py-3 font-mono text-sm text-red-700">
          {error}
        </div>
      )}

      {tags.length === 0 ? (
        <p className="text-zinc-500">No tags yet.</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <div
              className="flex items-center gap-2 border-2 border-zinc-200 bg-white px-3 py-2"
              key={tag.id}
            >
              <span className="font-mono text-sm text-zinc-900">
                {tag.name}
              </span>
              <button
                className="text-zinc-400 transition-colors hover:text-red-600 disabled:opacity-50"
                disabled={deletingId === tag.id}
                onClick={() => handleDelete(tag)}
                title="Delete tag"
                type="button"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
