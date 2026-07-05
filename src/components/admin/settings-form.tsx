"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Save, X } from "lucide-react";

import { SiteSettings } from "@/types/settings";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [siteName, setSiteName] = useState(settings.siteName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [establishedYear, setEstablishedYear] = useState(
    String(settings.establishedYear),
  );
  const [bio, setBio] = useState(settings.bio);
  const [currentlyUsing, setCurrentlyUsing] = useState(settings.currentlyUsing);
  const [otherInterests, setOtherInterests] = useState(settings.otherInterests);
  const [email, setEmail] = useState(settings.email);
  const [github, setGithub] = useState(settings.github ?? "");
  const [threads, setThreads] = useState(settings.threads ?? "");
  const [linkedin, setLinkedin] = useState(settings.linkedin ?? "");
  const [workspaceImageUrl, setWorkspaceImageUrl] = useState(
    settings.workspaceImageUrl ?? "",
  );
  const [footerBlurb, setFooterBlurb] = useState(settings.footerBlurb);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  function updateListItem(
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string,
  ) {
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  function isDirty(): boolean {
    return (
      siteName !== settings.siteName ||
      tagline !== settings.tagline ||
      establishedYear !== String(settings.establishedYear) ||
      email !== settings.email ||
      github !== (settings.github ?? "") ||
      threads !== (settings.threads ?? "") ||
      linkedin !== (settings.linkedin ?? "") ||
      workspaceImageUrl !== (settings.workspaceImageUrl ?? "") ||
      footerBlurb !== settings.footerBlurb ||
      JSON.stringify(bio) !== JSON.stringify(settings.bio) ||
      JSON.stringify(currentlyUsing) !==
        JSON.stringify(settings.currentlyUsing) ||
      JSON.stringify(otherInterests) !== JSON.stringify(settings.otherInterests)
    );
  }

  function handleClose() {
    if (isDirty() && !confirm("Discard your changes? They will be lost.")) {
      return;
    }

    router.push("/admin");
  }

  async function handleSave() {
    setError(null);
    setJustSaved(false);

    const cleanBio = bio.filter((p) => p.trim() !== "");
    const year = Number.parseInt(establishedYear, 10);

    if (!siteName.trim() || !tagline.trim() || cleanBio.length === 0) {
      setError(
        "Site name, tagline, and at least one bio paragraph are required.",
      );
      return;
    }

    if (!Number.isInteger(year) || year < 1990 || year > 2100) {
      setError("Established year must be a valid year between 1990 and 2100.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName: siteName.trim(),
          tagline: tagline.trim(),
          establishedYear: year,
          bio: cleanBio,
          currentlyUsing: currentlyUsing.filter((item) => item.trim() !== ""),
          otherInterests: otherInterests.filter((item) => item.trim() !== ""),
          email: email.trim(),
          github: github.trim() || null,
          threads: threads.trim() || null,
          linkedin: linkedin.trim() || null,
          workspaceImageUrl: workspaceImageUrl.trim() || null,
          footerBlurb: footerBlurb.trim(),
        }),
      });
      const body = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!body.success) {
        setError(body.message ?? "Failed to save settings");
        return;
      }

      setJustSaved(true);
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="sticky top-0 z-10 border-b border-zinc-700 bg-zinc-900">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Site Settings</h1>
            <p className="font-mono text-sm text-zinc-400">
              {"// update your site content"}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="flex flex-1 items-center justify-center gap-2 bg-white px-4 py-2 font-bold text-zinc-900 transition-colors hover:bg-zinc-200 disabled:opacity-50 sm:flex-none sm:px-6"
              disabled={isSaving}
              onClick={handleSave}
              type="button"
            >
              <Save size={18} />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>

            <button
              className="flex h-10 w-10 shrink-0 items-center justify-center border border-zinc-700 bg-zinc-800 text-white transition-colors hover:bg-zinc-700"
              onClick={handleClose}
              type="button"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {error && (
          <div className="mb-6 border-2 border-red-600 bg-red-950 px-4 py-3 font-mono text-sm text-red-400">
            ✗ {error}
          </div>
        )}

        {justSaved && !error && (
          <div className="mb-6 flex items-center gap-2 border-2 border-green-600 bg-green-950 px-4 py-3 font-mono text-sm text-green-400">
            <Check size={16} />
            Settings saved
          </div>
        )}

        <div className="space-y-8">
          <div className="space-y-6 bg-white p-4 sm:p-8">
            <div className="border-l-4 border-zinc-900 pl-4">
              <h2 className="text-2xl font-bold text-zinc-900">Identity</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-mono text-sm text-zinc-700">
                  Site Name *
                </label>
                <input
                  className="w-full border-2 border-zinc-900 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:bg-white focus:outline-none"
                  onChange={(event) => setSiteName(event.target.value)}
                  type="text"
                  value={siteName}
                />
              </div>

              <div>
                <label className="mb-2 block font-mono text-sm text-zinc-700">
                  Established Year *
                </label>
                <input
                  className="w-full border-2 border-zinc-900 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:bg-white focus:outline-none"
                  onChange={(event) => setEstablishedYear(event.target.value)}
                  type="number"
                  value={establishedYear}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block font-mono text-sm text-zinc-700">
                  Tagline *
                </label>
                <input
                  className="w-full border-2 border-zinc-900 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:bg-white focus:outline-none"
                  onChange={(event) => setTagline(event.target.value)}
                  placeholder="developer / writer / overthinker"
                  type="text"
                  value={tagline}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 bg-white p-4 sm:p-8">
            <div className="border-l-4 border-zinc-900 pl-4">
              <h2 className="text-2xl font-bold text-zinc-900">About Me</h2>
              <p className="mt-1 text-sm text-zinc-600">
                Bio paragraphs shown in the About section
              </p>
            </div>

            <div className="space-y-4">
              {bio.map((paragraph, index) => (
                <div key={index}>
                  <label className="mb-2 block font-mono text-xs text-zinc-500">
                    Paragraph {index + 1}
                  </label>
                  <textarea
                    className="w-full resize-none border border-zinc-300 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:border-zinc-900 focus:bg-white focus:outline-none"
                    onChange={(event) =>
                      updateListItem(setBio, index, event.target.value)
                    }
                    rows={3}
                    value={paragraph}
                  />
                </div>
              ))}

              <button
                className="border-2 border-zinc-900 px-4 py-2 font-mono text-sm text-zinc-900 transition-colors hover:bg-zinc-900 hover:text-white"
                onClick={() => setBio((prev) => [...prev, ""])}
                type="button"
              >
                + Add Paragraph
              </button>
            </div>
          </div>

          <div className="space-y-6 bg-white p-4 sm:p-8">
            <div className="border-l-4 border-zinc-900 pl-4">
              <h2 className="text-2xl font-bold text-zinc-900">
                Workspace Photo
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                Image shown next to your bio in the About section
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-[1fr_auto]">
              <div>
                <label className="mb-2 block font-mono text-sm text-zinc-700">
                  Image URL
                </label>
                <input
                  className="w-full border-2 border-zinc-900 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:bg-white focus:outline-none"
                  onChange={(event) => setWorkspaceImageUrl(event.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  type="url"
                  value={workspaceImageUrl}
                />
              </div>

              <div className="h-24 w-24 shrink-0 overflow-hidden border-2 border-zinc-900 bg-zinc-100">
                {workspaceImageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element -- live preview of an arbitrary admin-entered URL
                  <img
                    alt="Workspace preview"
                    className="h-full w-full object-cover"
                    src={workspaceImageUrl}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6 bg-white p-4 sm:p-8">
            <div className="border-l-4 border-zinc-900 pl-4">
              <h2 className="text-2xl font-bold text-zinc-900">
                Currently Using
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {currentlyUsing.map((item, index) => (
                <input
                  className="w-full border border-zinc-300 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:border-zinc-900 focus:bg-white focus:outline-none"
                  key={index}
                  onChange={(event) =>
                    updateListItem(setCurrentlyUsing, index, event.target.value)
                  }
                  value={item}
                />
              ))}
            </div>

            <button
              className="border-2 border-zinc-900 px-4 py-2 font-mono text-sm text-zinc-900 transition-colors hover:bg-zinc-900 hover:text-white"
              onClick={() => setCurrentlyUsing((prev) => [...prev, ""])}
              type="button"
            >
              + Add Item
            </button>
          </div>

          <div className="space-y-6 bg-white p-4 sm:p-8">
            <div className="border-l-4 border-zinc-900 pl-4">
              <h2 className="text-2xl font-bold text-zinc-900">
                Other Interests
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {otherInterests.map((item, index) => (
                <input
                  className="w-full border border-zinc-300 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:border-zinc-900 focus:bg-white focus:outline-none"
                  key={index}
                  onChange={(event) =>
                    updateListItem(setOtherInterests, index, event.target.value)
                  }
                  value={item}
                />
              ))}
            </div>

            <button
              className="border-2 border-zinc-900 px-4 py-2 font-mono text-sm text-zinc-900 transition-colors hover:bg-zinc-900 hover:text-white"
              onClick={() => setOtherInterests((prev) => [...prev, ""])}
              type="button"
            >
              + Add Item
            </button>
          </div>

          <div className="space-y-6 bg-white p-4 sm:p-8">
            <div className="border-l-4 border-zinc-900 pl-4">
              <h2 className="text-2xl font-bold text-zinc-900">
                Contact &amp; Links
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-mono text-sm text-zinc-700">
                  Email
                </label>
                <input
                  className="w-full border-2 border-zinc-900 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:bg-white focus:outline-none"
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  value={email}
                />
              </div>

              <div>
                <label className="mb-2 block font-mono text-sm text-zinc-700">
                  GitHub URL
                </label>
                <input
                  className="w-full border-2 border-zinc-900 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:bg-white focus:outline-none"
                  onChange={(event) => setGithub(event.target.value)}
                  placeholder="Leave blank if not used"
                  type="url"
                  value={github}
                />
              </div>

              <div>
                <label className="mb-2 block font-mono text-sm text-zinc-700">
                  Threads URL
                </label>
                <input
                  className="w-full border-2 border-zinc-900 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:bg-white focus:outline-none"
                  onChange={(event) => setThreads(event.target.value)}
                  placeholder="Leave blank if not used"
                  type="url"
                  value={threads}
                />
              </div>

              <div>
                <label className="mb-2 block font-mono text-sm text-zinc-700">
                  LinkedIn URL
                </label>
                <input
                  className="w-full border-2 border-zinc-900 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:bg-white focus:outline-none"
                  onChange={(event) => setLinkedin(event.target.value)}
                  placeholder="Leave blank if not used"
                  type="url"
                  value={linkedin}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 bg-white p-4 sm:p-8">
            <div className="border-l-4 border-zinc-900 pl-4">
              <h2 className="text-2xl font-bold text-zinc-900">Footer Blurb</h2>
              <p className="mt-1 text-sm text-zinc-600">
                Shown in the site footer and used as the page description
              </p>
            </div>

            <textarea
              className="w-full resize-none border-2 border-zinc-900 bg-zinc-50 px-4 py-3 text-zinc-900 transition-colors focus:bg-white focus:outline-none"
              onChange={(event) => setFooterBlurb(event.target.value)}
              rows={3}
              value={footerBlurb}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
