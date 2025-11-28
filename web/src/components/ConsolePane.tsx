"use client";

import { useEffect, useState } from "react";
import { useBuildStore } from "../store/buildStore";

export function ConsolePane() {
  const [lines, setLines] = useState<string[]>([]);
  const status = useBuildStore((state) => state.status);

  useEffect(() => {
    if (!status) return;
    setLines((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()} ${status.phase}: ${
        status.message ?? ""
      }`
    ]);
  }, [status]);

  return (
    <div className="h-32 border-t border-neutral-800 bg-black px-3 py-2 text-xs font-mono text-neutral-300 overflow-auto">
      {lines.length === 0 ? (
        <p className="text-neutral-600">Console output will appear here.</p>
      ) : (
        lines.map((line, idx) => <div key={idx}>{line}</div>)
      )}
    </div>
  );
}

