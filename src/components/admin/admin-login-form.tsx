"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!body.success) {
        setError(body.message ?? "Invalid email or password");
        setPassword("");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative max-w-md w-full">
      <div className="bg-white p-8 md:p-12">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-zinc-900">
            Admin Access
          </h1>
          <p className="font-mono text-sm text-zinc-600">
            {"// sign in to continue"}
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              className="mb-2 block font-mono text-sm text-zinc-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              autoFocus
              className="w-full border-2 border-zinc-900 bg-zinc-50 px-4 py-3 text-lg text-zinc-900 transition-colors focus:bg-white focus:outline-none"
              id="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              type="email"
              value={email}
            />
          </div>

          <div>
            <label
              className="mb-2 block font-mono text-sm text-zinc-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full border-2 border-zinc-900 bg-zinc-50 px-4 py-3 text-lg text-zinc-900 transition-colors focus:bg-white focus:outline-none"
              id="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="•••••••"
              type="password"
              value={password}
            />
            {error && (
              <p className="mt-2 font-mono text-sm text-red-600">
                ✗ {error}
              </p>
            )}
          </div>

          <button
            className="w-full bg-zinc-900 py-4 font-bold text-white transition-colors hover:bg-zinc-800 disabled:opacity-50"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Signing in..." : "Login →"}
          </button>
        </form>
      </div>

      <div className="absolute -right-4 -bottom-4 -z-10 h-full w-full border-2 border-zinc-700" />
    </div>
  );
}
