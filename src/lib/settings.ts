import { apiFetch } from "@/lib/api";
import { SiteSettings } from "@/types/settings";

export async function getSiteSettings(): Promise<SiteSettings> {
  return apiFetch<SiteSettings>("/settings");
}
