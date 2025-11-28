"use client";

import { useEditorStore } from "../store/editorStore";
import { useBuildStore } from "../store/buildStore";

export function StatusBar() {
  const activeTab = useEditorStore((state) =>
    state.tabs.find((tab) => tab.id === state.activeTabId)
  );
  const buildStatus = useBuildStore((state) => state.status);

  return (
    <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-900 px-4 py-1 text-xs text-neutral-400">
      <span>{activeTab ? activeTab.path : "No file selected"}</span>
      <span>
        Build: {buildStatus ? buildStatus.phase : "idle"}
      </span>
    </div>
  );
}

