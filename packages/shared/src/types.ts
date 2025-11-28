export type FileKind = "file" | "folder";

export interface ProjectTreeNode {
  id: string;
  name: string;
  path: string;
  kind: FileKind;
  children?: ProjectTreeNode[];
}

export interface EditorTab {
  id: string;
  path: string;
  language: "gdscript" | "text" | "json";
  dirty: boolean;
  content: string;
}

export interface EditorState {
  tabs: EditorTab[];
  activeTabId?: string;
}

export type BuildPhase = "idle" | "queued" | "building" | "failed" | "completed";

export interface BuildStatus {
  id: string;
  phase: BuildPhase;
  message?: string;
  startedAt?: string;
  finishedAt?: string;
}

export interface SceneProperty {
  name: string;
  type: "int" | "float" | "bool" | "string" | "vector2" | "color";
  value: string | number | boolean;
}

export interface SceneNode {
  name: string;
  type: string;
  properties: SceneProperty[];
}

