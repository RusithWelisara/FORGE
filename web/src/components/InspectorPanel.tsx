"use client";

import { useMemo } from "react";
import { parseSceneFile } from "../lib/sceneParser";
import { useEditorStore } from "../store/editorStore";

export function InspectorPanel() {
  const activeTab = useEditorStore((state) =>
    state.tabs.find((tab) => tab.id === state.activeTabId)
  );

  const nodes = useMemo(() => {
    if (!activeTab || !activeTab.path.endsWith(".tscn")) return [];
    return parseSceneFile(activeTab.content);
  }, [activeTab]);

  if (!activeTab) {
    return (
      <aside className="w-80 border-l border-neutral-800 bg-neutral-950 p-3 text-sm text-neutral-500">
        No selection
      </aside>
    );
  }

  if (!nodes.length) {
    return (
      <aside className="w-80 border-l border-neutral-800 bg-neutral-950 p-3 text-sm text-neutral-500">
        Open a `.tscn` scene to edit properties.
      </aside>
    );
  }

  return (
    <aside className="w-80 border-l border-neutral-800 bg-neutral-950 p-3">
      <h3 className="text-xs uppercase tracking-wide text-neutral-400">Inspector</h3>
      {nodes.map((node) => (
        <div key={node.name} className="mt-3 rounded border border-neutral-800 p-2">
          <p className="text-sm font-semibold">{node.name}</p>
          <p className="text-xs text-neutral-500">{node.type}</p>
          <dl className="mt-2 space-y-2 text-sm">
            {node.properties.map((prop) => (
              <div key={prop.name}>
                <dt className="text-neutral-400">{prop.name}</dt>
                <dd className="text-neutral-200">{String(prop.value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </aside>
  );
}

