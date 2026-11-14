import { create } from "zustand";
import { persist } from "zustand/middleware";
import { advance, initialMission } from "../engine/simulationEngine";
import type { Mission, Scenario, Metric, Region } from "../types";
export type Checkin = {
  date: string;
  timestamp: string;
  provenance: "SELF-REPORTED";
  answers: Record<string, string>;
};
type Store = {
  mission: Mission;
  page: string;
  entered: boolean;
  region: Region;
  metric: Metric;
  quality: "high" | "low";
  reduced: boolean;
  checkins: Checkin[];
  subpage: string | null;
  setPage: (p: string) => void;
  setSubpage: (sp: string | null) => void;
  enter: () => void;
  select: (r: Region) => void;
  trend: (m: Metric) => void;
  scenario: (s: Scenario) => void;
  run: (b: boolean) => void;
  tick: (n?: number) => void;
  reset: () => void;
  settings: (v: Partial<Pick<Store, "quality" | "reduced">>) => void;
  save: (c: Checkin) => void;
  clear: () => void;
};
export const useStore = create<Store>()(
  persist(
    (set) => ({
      mission: initialMission(),
      page: "Overview",
      entered: false,
      region: "Chest",
      metric: "hr",
      quality: "high",
      reduced: false,
      checkins: [],
      subpage: null,
      setPage: (page) => set({ page, subpage: null }),
      setSubpage: (subpage) => set({ subpage }),
      enter: () => set({ entered: true }),
      select: (region) => set({ region }),
      trend: (metric) => set({ metric, page: "My Health" }),
      scenario: (scenario) =>
        set((s) => ({ mission: { ...s.mission, scenario } })),
      run: (running) => set((s) => ({ mission: { ...s.mission, running } })),
      tick: (n = 1) => set((s) => ({ mission: advance(s.mission, n) })),
      reset: () => set({ mission: initialMission() }),
      settings: (v) => set(v),
      save: (c) =>
        set((s) => ({
          checkins: [...s.checkins.filter((x) => x.date !== c.date), c],
        })),
      clear: () => set({ checkins: [] }),
    }),
    {
      name: "astra-profile-v1",
      partialize: (s) => ({
        checkins: s.checkins,
        quality: s.quality,
        reduced: s.reduced,
      }),
    },
  ),
);
