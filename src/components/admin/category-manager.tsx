"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

import { Category } from "@/types/taxonomy";

export function CategoryManager({
  categories,
}: {
  categories: Category[];
}) {
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
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const body = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!body.success) {
        setError(body.message ?? "Failed to create category");
        return;
      }

      setName("");
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(category: Category) {
    if (
      !confirm(
        `Delete "${category.name}"? Posts using it will become uncategorized.`,
      )
    ) {
      return;
    }

    setDeletingId(category.id);

    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const body = (await response.json()) as { message?: string };
        alert(body.message ?? "Failed to delete category");
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
        Categories
      </h1>
      <p className="mb-8 font-mono text-sm text-zinc-500">
        {"// each post has exactly one category"}
      </p>

      <form className="mb-8 flex gap-3" onSubmit={handleCreate}>
        <input
          className="flex-1 border-2 border-zinc-900 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:bg-white focus:outline-none"
          onChange={(event) => setName(event.target.value)}
          placeholder="New category name..."
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

      {categories.length === 0 ? (
        <p className="text-zinc-500">No categories yet.</p>
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              className="flex items-center justify-between border-2 border-zinc-200 bg-white px-4 py-3"
              key={category.id}
            >
              <div>
                <p className="font-bold text-zinc-900">{category.name}</p>
                <p className="font-mono text-xs text-zinc-500">
                  {category.slug}
                </p>
              </div>

              <button
                className="border-2 border-red-600 p-2 text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50"
                disabled={deletingId === category.id}
                onClick={() => handleDelete(category)}
                title="Delete category"
                type="button"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
