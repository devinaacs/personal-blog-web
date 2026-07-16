"use client";

import { useState } from "react";
import { Check, Copy, Mail } from "lucide-react";

import { SharePlatform } from "@/lib/engagement-constants";

type ShareTarget = {
  platform: Exclude<SharePlatform, "copy-link">;
  label: string;
  hrefFor: (url: string, title: string) => string;
};

const SHARE_TARGETS: ShareTarget[] = [
  {
    platform: "twitter",
    label: "X",
    hrefFor: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    platform: "facebook",
    label: "Facebook",
    hrefFor: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    platform: "linkedin",
    label: "LinkedIn",
    hrefFor: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    platform: "whatsapp",
    label: "WhatsApp",
    hrefFor: (url, title) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
];

export function ShareButtons({ slug, title, url }: { slug: string; title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  function recordShare(platform: SharePlatform) {
    fetch(`/api/posts/${slug}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform }),
    }).catch(() => {
      // best-effort; the share itself already happened
    });
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
    recordShare("copy-link");
  }

  function handleShareClick(target: ShareTarget) {
    recordShare(target.platform);
    window.open(
      target.hrefFor(url, title),
      "_blank",
      "noopener,noreferrer,width=600,height=500",
    );
  }

  const emailHref = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-sm text-zinc-500">Share:</span>

      <button
        className="flex items-center gap-2 border border-zinc-300 px-3 py-1.5 font-mono text-sm text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900"
        onClick={handleCopyLink}
        type="button"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? "Copied" : "Copy link"}
      </button>

      {SHARE_TARGETS.map((target) => (
        <button
          className="border border-zinc-300 px-3 py-1.5 font-mono text-sm text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900"
          key={target.platform}
          onClick={() => handleShareClick(target)}
          type="button"
        >
          {target.label}
        </button>
      ))}

      <a
        className="flex items-center gap-2 border border-zinc-300 px-3 py-1.5 font-mono text-sm text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900"
        href={emailHref}
        onClick={() => recordShare("email")}
      >
        <Mail size={14} />
        Email
      </a>
    </div>
  );
}
