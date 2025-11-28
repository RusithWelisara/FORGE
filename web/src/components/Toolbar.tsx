"use client";

import { useState } from "react";
import { saveFileContent, triggerBuild } from "../lib/api";
import { useEditorStore } from "../store/editorStore";
import { useBuildStore } from "../store/buildStore";

export function Toolbar() {
  const activeTabId = useEditorStore((state) => state.activeTabId);
  const activeTab = useEditorStore((state) =>
    state.tabs.find((tab) => tab.id === state.activeTabId)
  );
  const updateTabContent = useEditorStore((state) => state.updateTabContent);
  const { status, setStatus } = useBuildStore();
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!activeTab) return;
    setSaving(true);
    try {
      await saveFileContent(activeTab.path, activeTab.content);
      updateTabContent(activeTab.id, activeTab.content, false);
    } finally {
      setSaving(false);
    }
  }

  async function handleBuild() {
    if (!activeTab) return;
    try {
      const buildStatus = await triggerBuild(activeTab.path);
      setStatus(buildStatus);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-900 px-4 py-2 text-sm">
      <span className="font-semibold">GAZE IDE</span>
      <div className="flex gap-2">
        <button
          type="button"
          className="rounded bg-neutral-800 px-3 py-1 hover:bg-neutral-700 disabled:opacity-50"
          disabled={!activeTabId || saving}
          onClick={handleSave}
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          className="rounded bg-emerald-700 px-3 py-1 hover:bg-emerald-600 disabled:opacity-50"
          disabled={!activeTabId}
          onClick={handleBuild}
        >
          Build HTML5
        </button>
      </div>
      <div className="ml-auto text-xs text-neutral-400">
        {status ? `${status.phase.toUpperCase()}: ${status.message ?? ""}` : "Idle"}
      </div>
    </div>
  );
}

