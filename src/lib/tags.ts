import { apiFetch, apiFetchOrNull } from "@/lib/api";
import { Tag } from "@/types/taxonomy";

export async function listTags(): Promise<Tag[]> {
  return apiFetch<Tag[]>("/tags");
}

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  return apiFetchOrNull<Tag>(`/tags/${slug}`);
}
