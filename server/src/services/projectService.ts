import { randomUUID } from "crypto";
import { EventEmitter } from "events";
import { promises as fs } from "fs";
import path from "path";
import type { ProjectTreeNode } from "@gaze/shared";

const workspaceRoot =
  process.env.GAZE_WORKSPACE ??
  path.resolve(process.cwd(), "..", "godot-projects");

export const projectEvents = new EventEmitter();

async function ensureWorkspace() {
  await fs.mkdir(workspaceRoot, { recursive: true });
}

async function buildTree(dir: string): Promise<ProjectTreeNode[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nodes: ProjectTreeNode[] = [];
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    const relativePath = path.relative(workspaceRoot, entryPath);
    if (entry.isDirectory()) {
      nodes.push({
        id: randomUUID(),
        name: entry.name,
        path: relativePath,
        kind: "folder",
        children: await buildTree(entryPath)
      });
    } else {
      nodes.push({
        id: randomUUID(),
        name: entry.name,
        path: relativePath,
        kind: "file"
      });
    }
  }
  return nodes;
}

function resolvePath(relativePath: string) {
  const fullPath = path.resolve(workspaceRoot, relativePath);
  if (!fullPath.startsWith(workspaceRoot)) {
    throw new Error("Invalid path");
  }
  return fullPath;
}

export async function getProjectTree() {
  await ensureWorkspace();
  return buildTree(workspaceRoot);
}

export async function readFileContent(relativePath: string) {
  const fullPath = resolvePath(relativePath);
  return fs.readFile(fullPath, "utf-8");
}

export async function saveFileContent(relativePath: string, content: string) {
  const fullPath = resolvePath(relativePath);
  await fs.writeFile(fullPath, content, "utf-8");
  projectEvents.emit("file:saved", { path: relativePath });
}

export async function createFile(relativePath: string, content = "") {
  const fullPath = resolvePath(relativePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, content, "utf-8");
  projectEvents.emit("file:created", { path: relativePath });
}

export async function deletePath(relativePath: string) {
  const fullPath = resolvePath(relativePath);
  await fs.rm(fullPath, { recursive: true, force: true });
  projectEvents.emit("file:deleted", { path: relativePath });
}

export const projectService = {
  workspaceRoot,
  getProjectTree,
  readFileContent,
  saveFileContent,
  createFile,
  deletePath,
  events: projectEvents
};

