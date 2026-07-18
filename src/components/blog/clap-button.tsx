"use client";

import { useEffect, useRef, useState } from "react";

import { HandClapIcon } from "@/components/icons/hand-clap-icon";
import { MAX_CLAPS_PER_READER } from "@/lib/engagement-constants";

type ClapApiResult = {
  readerClapCount: number;
  postClapCount: number;
};

const HOLD_REPEAT_INTERVAL_MS = 150;
const SYNC_DEBOUNCE_MS = 400;
const FLOATER_LIFETIME_MS = 700;

export function ClapButton({
  slug,
  initialCount,
}: {
  slug: string;
  initialCount: number;
}) {
  const [postClapCount, setPostClapCount] = useState(initialCount);
  const [readerClapCount, setReaderClapCount] = useState(0);
  const [floaters, setFloaters] = useState<number[]>([]);

  const pendingRef = useRef(0);
  const readerClapCountRef = useRef(0);
  const floaterIdRef = useRef(0);
  const holdIntervalRef = useRef<number | null>(null);
  const syncTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    readerClapCountRef.current = readerClapCount;
  }, [readerClapCount]);

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

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) window.clearInterval(holdIntervalRef.current);
      if (syncTimeoutRef.current) window.clearTimeout(syncTimeoutRef.current);
    };
  }, []);

  function spawnFloater() {
    const id = floaterIdRef.current++;
    setFloaters((prev) => [...prev, id]);
    window.setTimeout(() => {
      setFloaters((prev) => prev.filter((floaterId) => floaterId !== id));
    }, FLOATER_LIFETIME_MS);
  }

  function flushClaps() {
    if (syncTimeoutRef.current) {
      window.clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = null;
    }

    const increment = pendingRef.current;
    if (increment <= 0) return;
    pendingRef.current = 0;

    fetch(`/api/posts/${slug}/clap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ increment }),
    })
      .then((response) => response.json())
      .then((body: { success: boolean; data?: ClapApiResult }) => {
        if (!body.success || !body.data) return;
        setReaderClapCount(body.data.readerClapCount);
        setPostClapCount(body.data.postClapCount);
      })
      .catch(() => {
        // best-effort; optimistic state stands on network failure
      });
  }

  function scheduleSync() {
    if (syncTimeoutRef.current) window.clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = window.setTimeout(flushClaps, SYNC_DEBOUNCE_MS);
  }

  function clapOnce() {
    if (readerClapCountRef.current >= MAX_CLAPS_PER_READER) return;

    readerClapCountRef.current += 1;
    pendingRef.current += 1;
    setReaderClapCount(readerClapCountRef.current);
    setPostClapCount((prev) => prev + 1);
    spawnFloater();
    scheduleSync();
  }

  function stopHolding() {
    if (holdIntervalRef.current) {
      window.clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    flushClaps();
  }

  function handlePointerDown() {
    clapOnce();
    holdIntervalRef.current = window.setInterval(() => {
      if (readerClapCountRef.current >= MAX_CLAPS_PER_READER) {
        stopHolding();
        return;
      }
      clapOnce();
    }, HOLD_REPEAT_INTERVAL_MS);
  }

  const atCap = readerClapCount >= MAX_CLAPS_PER_READER;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        {floaters.map((id) => (
          <span
            className="pointer-events-none absolute top-0 left-1/2 font-mono text-sm font-bold text-zinc-900"
            key={id}
            style={{ animation: `float-up ${FLOATER_LIFETIME_MS}ms ease-out forwards` }}
          >
            +1
          </span>
        ))}

        <button
          className={`flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-900 text-white transition-all hover:bg-zinc-700 active:scale-90 sm:h-16 sm:w-16 ${
            atCap ? "cursor-default opacity-70" : "cursor-pointer"
          }`}
          disabled={atCap}
          onPointerDown={handlePointerDown}
          onPointerLeave={stopHolding}
          onPointerUp={stopHolding}
          title={
            atCap
              ? `You've clapped the max ${MAX_CLAPS_PER_READER} times`
              : "Hold to clap"
          }
          type="button"
        >
          <HandClapIcon size={24} />
        </button>
      </div>

      <span className="font-mono text-sm text-zinc-500">
        {postClapCount.toLocaleString()} claps
      </span>
    </div>
  );
}
