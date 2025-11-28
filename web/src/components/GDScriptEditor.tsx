"use client";

import Editor from "@monaco-editor/react";
import { useMemo } from "react";
import { gdscriptLanguageConfiguration, gdscriptMonarchTokens } from "@gaze/shared";
import { useEditorStore } from "../store/editorStore";
import type { EditorTab } from "@gaze/shared";

export function GDScriptEditor() {
  const tabs = useEditorStore((state) => state.tabs);
  const activeTabId = useEditorStore((state) => state.activeTabId);
  const setActiveTab = useEditorStore((state) => state.setActiveTab);
  const updateTabContent = useEditorStore((state) => state.updateTabContent);
  const closeTab = useEditorStore((state) => state.closeTab);

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.id === activeTabId),
    [tabs, activeTabId]
  );

  if (!activeTab) {
    return (
      <div className="flex flex-1 flex-col bg-neutral-950 text-neutral-500">
        <TabStrip tabs={tabs} activeTabId={activeTabId} onSelect={setActiveTab} onClose={closeTab} />
        <div className="flex flex-1 items-center justify-center">
          <p>Select a file to edit</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-neutral-950">
      <TabStrip tabs={tabs} activeTabId={activeTabId} onSelect={setActiveTab} onClose={closeTab} />
      <Editor
        height="100%"
        defaultLanguage="gdscript"
        language="gdscript"
        theme="vs-dark"
        value={activeTab.content}
        onChange={(value) =>
          updateTabContent(activeTab.id, value ?? "", true)
        }
        beforeMount={(monaco) => {
          monaco.languages.register({ id: "gdscript" });
          monaco.languages.setMonarchTokensProvider(
            "gdscript",
            gdscriptMonarchTokens
          );
          monaco.languages.setLanguageConfiguration(
            "gdscript",
            gdscriptLanguageConfiguration
          );
        }}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "JetBrains Mono, monospace",
          automaticLayout: true
        }}
      />
    </div>
  );
}

function TabStrip({
  tabs,
  activeTabId,
  onSelect,
  onClose
}: {
  tabs: EditorTab[];
  activeTabId?: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}) {
  return (
    <div className="flex gap-1 border-b border-neutral-900 bg-neutral-950 px-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`flex items-center gap-2 rounded-t px-3 py-1 text-sm ${
            tab.id === activeTabId
              ? "bg-neutral-900 text-white"
              : "text-neutral-400 hover:text-white"
          }`}
          onClick={() => onSelect(tab.id)}
        >
          <span>
            {tab.path.split("/").pop()}
            {tab.dirty ? "*" : ""}
          </span>
          <span
            className="text-xs text-neutral-500 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              onClose(tab.id);
            }}
          >
            ×
          </span>
        </button>
      ))}
    </div>
  );
}

