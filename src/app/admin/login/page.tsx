import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { WoodTexture } from "@/components/shared/wood-texture";
import { createMetadata } from "@/config/metadata";
import { getAdminUser } from "@/lib/admin-session";

export const metadata = createMetadata("/admin/login", {
  title: "Admin Login",
  robots: { index: false, follow: false },
});

export default async function AdminLoginPage() {
  const user = await getAdminUser();

  if (user) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 px-6">
      <WoodTexture />
      <AdminLoginForm />
    </div>
  );
}
