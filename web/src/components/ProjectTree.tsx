"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchProjectTree, readFileContent } from "../lib/api";
import type { ProjectTreeNode } from "@gaze/shared";
import { useEditorStore } from "../store/editorStore";

export function ProjectTree() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["project-tree"],
    queryFn: fetchProjectTree
  });
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const openTab = useEditorStore((state) => state.openTab);

  async function handleOpen(node: ProjectTreeNode) {
    if (node.kind === "folder") {
      setExpanded((prev) => ({ ...prev, [node.id]: !prev[node.id] }));
      return;
    }

    try {
      const file = await readFileContent(node.path);
      openTab({
        id: node.id,
        path: node.path,
        language: file.language as "gdscript",
        dirty: false,
        content: file.content
      });
    } catch (err) {
      console.error("Failed to open file", err);
    }
  }

  return (
    <div className="w-64 bg-neutral-900 border-r border-neutral-800 overflow-auto">
      <div className="flex items-center justify-between px-3 py-2 text-sm font-semibold">
        <span>Project</span>
        <button
          type="button"
          className="text-xs text-neutral-400 hover:text-white"
          onClick={() => refetch()}
        >
          Refresh
        </button>
      </div>
      {isLoading && <p className="px-3 text-sm text-neutral-500">Loading...</p>}
      <ul className="px-2">
        {data?.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            depth={0}
            expanded={expanded}
            onToggle={handleOpen}
          />
        ))}
      </ul>
    </div>
  );
}

function TreeNode({
  node,
  depth,
  expanded,
  onToggle
}: {
  node: ProjectTreeNode;
  depth: number;
  expanded: Record<string, boolean>;
  onToggle: (node: ProjectTreeNode) => void;
}) {
  const isFolder = node.kind === "folder";
  const isExpanded = expanded[node.id] ?? depth === 0;
  return (
    <li>
      <button
        type="button"
        className="flex w-full items-center gap-2 px-2 py-1 text-left text-sm hover:bg-neutral-800 rounded"
        style={{ paddingLeft: depth * 12 + 8 }}
        onClick={() => onToggle(node)}
      >
        <span className="text-xs text-neutral-500">
          {isFolder ? (isExpanded ? "▾" : "▸") : "•"}
        </span>
        <span>{node.name}</span>
      </button>
      {isFolder && isExpanded && node.children && (
        <ul>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

