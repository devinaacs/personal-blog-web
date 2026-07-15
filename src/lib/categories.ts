import { apiFetch, apiFetchOrNull } from "@/lib/api";
import { Category } from "@/types/taxonomy";

export async function listCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/categories");
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  return apiFetchOrNull<Category>(`/categories/${slug}`);
}
