import { env } from "@/lib/env";

type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
    ...init,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API request to ${path} failed with ${response.status}`);
  }

  const body = (await response.json()) as ApiSuccessResponse<T>;

  return body.data;
}

export async function apiFetchOrNull<T>(
  path: string,
  init?: RequestInit,
): Promise<T | null> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
    ...init,
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`API request to ${path} failed with ${response.status}`);
  }

  const body = (await response.json()) as ApiSuccessResponse<T>;

  return body.data;
}
