import type {
  BuildStatus,
  ProjectTreeNode
} from "@gaze/shared";

const baseUrl =
  process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, "") ??
  "http://localhost:4000";

async function request<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed: ${res.status}`);
  }

  return (await res.json()) as T;
}

export function fetchProjectTree() {
  return request<ProjectTreeNode[]>("/projects/tree");
}

export function readFileContent(path: string) {
  return request<{ content: string; language: string }>(
    `/projects/file?path=${encodeURIComponent(path)}`
  );
}

export function saveFileContent(path: string, content: string) {
  return request<{ success: boolean }>(`/projects/file`, {
    method: "PUT",
    body: JSON.stringify({ path, content })
  });
}

export function triggerBuild(scenePath: string) {
  return request<BuildStatus>(`/projects/build`, {
    method: "POST",
    body: JSON.stringify({ scenePath })
  });
}

export function subscribeBuildStatus(
  onMessage: (status: BuildStatus) => void
) {
  const protocol = baseUrl.startsWith("https") ? "wss" : "ws";
  const url = new URL("/ws/build", baseUrl);
  url.protocol = protocol;
  const socket = new WebSocket(url);
  socket.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data) as BuildStatus;
      onMessage(payload);
    } catch {
      // swallow malformed payloads
    }
  };
  return () => socket.close();
}

