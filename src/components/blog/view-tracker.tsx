"use client";

import { useEffect, useRef } from "react";

export function ViewTracker({ slug }: { slug: string }) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;

    fetch(`/api/posts/${slug}/view`, { method: "POST" }).catch(() => {});
  }, [slug]);

  return null;
}
