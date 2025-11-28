import { create } from "zustand";
import type { EditorTab } from "@gaze/shared";

interface EditorStoreState {
  tabs: EditorTab[];
  activeTabId?: string;
  openTab: (tab: EditorTab) => void;
  setActiveTab: (id: string) => void;
  updateTabContent: (id: string, content: string, dirty?: boolean) => void;
  closeTab: (id: string) => void;
}

export const useEditorStore = create<EditorStoreState>((set) => ({
  tabs: [],
  activeTabId: undefined,
  openTab: (tab) =>
    set((state) => {
      const exists = state.tabs.find((t) => t.id === tab.id);
      const tabs = exists
        ? state.tabs.map((t) => (t.id === tab.id ? tab : t))
        : [...state.tabs, tab];
      return { tabs, activeTabId: tab.id };
    }),
  setActiveTab: (id) => set({ activeTabId: id }),
  updateTabContent: (id, content, dirty = true) =>
    set((state) => ({
      tabs: state.tabs.map((tab) =>
        tab.id === id ? { ...tab, content, dirty } : tab
      )
    })),
  closeTab: (id) =>
    set((state) => ({
      tabs: state.tabs.filter((tab) => tab.id !== id),
      activeTabId:
        state.activeTabId === id ? state.tabs.find((t) => t.id !== id)?.id : state.activeTabId
    }))
}));

