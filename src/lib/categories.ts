import { apiFetch, apiFetchOrNull } from "@/lib/api";
import { Category } from "@/types/taxonomy";

export async function listCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/categories", {
    next: { revalidate: 60, tags: ["categories"] },
  });
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  return apiFetchOrNull<Category>(`/categories/${slug}`, {
    next: { revalidate: 60, tags: ["categories"] },
  });
}
