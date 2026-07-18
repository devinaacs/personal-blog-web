"use client";

import { ComponentType, useEffect, useRef, useState } from "react";
import { Check, Link as LinkIcon, Share2 } from "lucide-react";

// import { FacebookIcon } from "@/components/icons/facebook-icon";
// import { TwitterIcon } from "@/components/icons/twitter-icon";
import { SharePlatform } from "@/lib/engagement-constants";

type ShareOption = {
  platform: Exclude<SharePlatform, "email">;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  hrefFor?: (url: string, title: string) => string;
};

const SHARE_OPTIONS: ShareOption[] = [
  { platform: "copy-link", label: "Copy link", icon: LinkIcon },
  // {
  //   platform: "twitter",
  //   label: "Twitter / X",
  //   icon: TwitterIcon,
  //   hrefFor: (url, title) =>
  //     `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  // },
  // {
  //   platform: "facebook",
  //   label: "Facebook",
  //   icon: FacebookIcon,
  //   hrefFor: (url) =>
  //     `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  // },
];

export function ShareButtons({
  slug,
  title,
  url,
}: {
  slug: string;
  title: string;
  url: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleOutsideClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  function recordShare(platform: SharePlatform) {
    fetch(`/api/posts/${slug}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform }),
    }).catch(() => {
      // best-effort; the share itself already happened
    });
  }

  async function handleOptionClick(option: ShareOption) {
    if (option.platform === "copy-link") {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      recordShare("copy-link");
      window.setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1200);
      return;
    }

    recordShare(option.platform);
    window.open(
      option.hrefFor?.(url, title),
      "_blank",
      "noopener,noreferrer,width=600,height=500",
    );
    setIsOpen(false);
  }

  return (
    <div className="flex flex-col items-center gap-2" ref={containerRef}>
      <div className="relative">
        {isOpen && (
          <div className="absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 border-2 border-zinc-900 bg-white shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            {SHARE_OPTIONS.map((option) => {
              const showCopied = option.platform === "copy-link" && copied;
              const Icon = showCopied ? Check : option.icon;

              return (
                <button
                  className="flex w-full items-center gap-3 border-b border-zinc-200 px-4 py-3 text-left font-mono text-sm text-zinc-900 transition-colors last:border-b-0 hover:bg-zinc-100"
                  key={option.platform}
                  onClick={() => handleOptionClick(option)}
                  type="button"
                >
                  <Icon size={16} />
                  {showCopied ? "Copied" : option.label}
                </button>
              );
            })}
          </div>
        )}

        <button
          className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-900 text-white transition-all hover:bg-zinc-700 active:scale-90 sm:h-16 sm:w-16"
          onClick={() => setIsOpen((prev) => !prev)}
          title="Share this post"
          type="button"
        >
          <Share2 size={22} />
        </button>
      </div>

      <span className="font-mono text-sm text-zinc-500">Share</span>
    </div>
  );
}
