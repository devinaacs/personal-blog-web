"use client";

import { useEffect, useState } from "react";

import { MAX_CLAPS_PER_READER } from "@/lib/engagement-constants";

type ClapApiResult = {
  readerClapCount: number;
  postClapCount: number;
};

export function ClapButton({
  slug,
  initialCount,
}: {
  slug: string;
  initialCount: number;
}) {
  const [postClapCount, setPostClapCount] = useState(initialCount);
  const [readerClapCount, setReaderClapCount] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/posts/${slug}/clap`)
      .then((response) => response.json())
      .then((body: { success: boolean; data?: ClapApiResult }) => {
        if (cancelled || !body.success || !body.data) return;
        setReaderClapCount(body.data.readerClapCount);
        setPostClapCount(body.data.postClapCount);
      })
      .catch(() => {
        // best-effort; leave initial values in place
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function handleClap() {
    if (readerClapCount >= MAX_CLAPS_PER_READER) return;

    setReaderClapCount((prev) => Math.min(prev + 1, MAX_CLAPS_PER_READER));
    setPostClapCount((prev) => prev + 1);
    setIsBouncing(true);
    window.setTimeout(() => setIsBouncing(false), 200);

    try {
      const response = await fetch(`/api/posts/${slug}/clap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ increment: 1 }),
      });
      const body = (await response.json()) as {
        success: boolean;
        data?: ClapApiResult;
      };

      if (body.success && body.data) {
        setReaderClapCount(body.data.readerClapCount);
        setPostClapCount(body.data.postClapCount);
      }
    } catch {
      // best-effort; optimistic state stands on network failure
    }
  }

  const hasClapped = readerClapCount > 0;
  const atCap = readerClapCount >= MAX_CLAPS_PER_READER;

  return (
    <button
      className={`group flex items-center gap-3 border-2 px-6 py-3 transition-colors ${
        hasClapped
          ? "border-zinc-900 bg-zinc-900 text-white"
          : "border-zinc-300 text-zinc-700 hover:border-zinc-900 hover:text-zinc-900"
      } ${atCap ? "cursor-default" : "cursor-pointer"}`}
      disabled={atCap}
      onClick={handleClap}
      title={
        atCap
          ? `You've clapped the max ${MAX_CLAPS_PER_READER} times`
          : "Clap for this post"
      }
      type="button"
    >
      <span
        className={`text-2xl transition-transform duration-200 ${
          isBouncing ? "scale-125" : "scale-100"
        }`}
      >
        👏
      </span>
      <span className="font-mono text-sm">
        {postClapCount.toLocaleString()}
        {hasClapped && (
          <span className="ml-2 opacity-70">
            (you: {readerClapCount}/{MAX_CLAPS_PER_READER})
          </span>
        )}
      </span>
    </button>
  );
}
