import { randomUUID } from "crypto";
import type { BuildStatus } from "@gaze/shared";
import { realtimeHub } from "../realtime";

export async function queuePreviewBuild(
  scenePath: string
): Promise<BuildStatus> {
  const buildId = randomUUID();
  const queued: BuildStatus = {
    id: buildId,
    phase: "queued",
    message: `Building ${scenePath}`,
    startedAt: new Date().toISOString()
  };
  realtimeHub.broadcast("build", queued);

  setTimeout(() => {
    const completed: BuildStatus = {
      id: buildId,
      phase: "completed",
      message: "HTML5 export ready",
      finishedAt: new Date().toISOString()
    };
    realtimeHub.broadcast("build", completed);
  }, 2_000);

  return queued;
}

