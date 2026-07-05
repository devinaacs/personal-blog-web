"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function AdminLogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      className="flex items-center gap-2 border border-zinc-700 bg-zinc-800 px-4 py-3 text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
      disabled={isLoggingOut}
      onClick={handleLogout}
      type="button"
    >
      <LogOut size={18} />
      <span className="font-mono text-sm">
        {isLoggingOut ? "Logging out..." : "Logout"}
      </span>
    </button>
  );
}
