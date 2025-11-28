import { create } from "zustand";
import type { BuildStatus } from "@gaze/shared";

interface BuildStore {
  status?: BuildStatus;
  setStatus: (status?: BuildStatus) => void;
}

export const useBuildStore = create<BuildStore>((set) => ({
  status: undefined,
  setStatus: (status) => set({ status })
}));

