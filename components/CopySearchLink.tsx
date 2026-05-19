"use client";

import { useState } from "react";

export function CopySearchLink() {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copyCurrentUrl() {
    if (!navigator.clipboard) {
      setStatus("failed");
      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <button
      type="button"
      onClick={copyCurrentUrl}
      className="rounded-full border border-leaf/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-leaf transition hover:border-leaf hover:bg-white"
    >
      {status === "copied" ? "Link tersalin" : status === "failed" ? "Gagal salin" : "Salin link"}
    </button>
  );
}
