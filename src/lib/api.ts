import { env } from "@/lib/env";

type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { next?: NextFetchRequestConfig },
): Promise<T> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, init);

  if (!response.ok) {
    throw new Error(`API request to ${path} failed with ${response.status}`);
  }

  const body = (await response.json()) as ApiSuccessResponse<T>;

  return body.data;
}
