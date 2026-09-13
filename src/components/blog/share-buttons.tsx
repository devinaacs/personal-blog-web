"use client";

import { ComponentType, useEffect, useRef, useState } from "react";
import { Check, Link as LinkIcon, Share2 } from "lucide-react";

import { SharePlatform } from "@/lib/engagement-constants";

type ShareOption = {
  platform: Exclude<SharePlatform, "email">;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  hrefFor?: (url: string, title: string) => string;
};

const SHARE_OPTIONS: ShareOption[] = [
  { platform: "copy-link", label: "Copy link", icon: LinkIcon },
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
    }).catch(() => {});
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
          <div className="absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 border-2 border-ink bg-paper shadow-[4px_4px_0_0_rgba(17,17,17,0.4)]">
            {SHARE_OPTIONS.map((option) => {
              const showCopied = option.platform === "copy-link" && copied;
              const Icon = showCopied ? Check : option.icon;

              return (
                <button
                  className="flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left font-mono text-sm text-ink transition-colors last:border-b-0 hover:bg-paper-dim"
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
          className="flex h-14 w-14 items-center justify-center border-2 border-paper bg-ink text-paper transition-all hover:bg-paper hover:text-ink active:scale-90 sm:h-16 sm:w-16"
          onClick={() => setIsOpen((prev) => !prev)}
          title="Share this post"
          type="button"
        >
          <Share2 size={22} />
        </button>
      </div>

      <span className="font-mono text-sm text-paper/50">Share</span>
    </div>
  );
}
