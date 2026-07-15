import { redirect } from "next/navigation";

import { CategoryManager } from "@/components/admin/category-manager";
import { createMetadata } from "@/config/metadata";
import { getAdminUser } from "@/lib/admin-session";
import { listCategories } from "@/lib/categories";

export const metadata = createMetadata("/admin/categories", {
  title: "Manage Categories",
  robots: { index: false, follow: false },
});

export default async function AdminCategoriesPage() {
  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  const categories = await listCategories();

  return (
    <div className="min-h-screen bg-zinc-100">
      <CategoryManager categories={categories} />
    </div>
  );
}
