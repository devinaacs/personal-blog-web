import { redirect } from "next/navigation";

import { SettingsForm } from "@/components/admin/settings-form";
import { createMetadata } from "@/config/metadata";
import { getAdminUser } from "@/lib/admin-session";
import { getSiteSettings } from "@/lib/settings";

export const metadata = createMetadata("/admin/settings", {
  title: "Site Settings",
  robots: { index: false, follow: false },
});

export default async function AdminSettingsPage() {
  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  const settings = await getSiteSettings();

  return <SettingsForm settings={settings} />;
}
