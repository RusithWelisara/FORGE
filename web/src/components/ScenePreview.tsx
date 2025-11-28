"use client";

import { useEffect, useRef } from "react";
import { subscribeBuildStatus } from "../lib/api";
import { useBuildStore } from "../store/buildStore";

export function ScenePreview() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { status, setStatus } = useBuildStore();

  useEffect(() => {
    const unsubscribe = subscribeBuildStatus((nextStatus) => {
      setStatus(nextStatus);
      if (nextStatus.phase === "completed") {
        iframeRef.current?.contentWindow?.postMessage(
          { type: "reload-scene" },
          "*"
        );
      }
    });
    return unsubscribe;
  }, [setStatus]);

  return (
    <div className="mt-3 flex flex-col border border-neutral-800 bg-neutral-950">
      <div className="border-b border-neutral-800 px-3 py-2 text-xs uppercase tracking-wide text-neutral-400">
        Scene Preview
      </div>
      <iframe
        ref={iframeRef}
        src="/godot-runtime/placeholder.html"
        className="h-64 w-full bg-black"
        title="Godot Preview"
      />
      <div className="px-3 py-2 text-xs text-neutral-400">
        {status ? `${status.phase}: ${status.message ?? ""}` : "Awaiting build output"}
      </div>
    </div>
  );
}

