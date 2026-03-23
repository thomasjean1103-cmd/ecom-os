"use client";

import { createContext, useContext, useMemo, useState } from "react";

import { SCREENS } from "@/config/screens";
import { dashboardData } from "@/lib/mock-data";
import type { ScreenId } from "@/lib/types";

type OsContextValue = {
  activeScreen: ScreenId;
  setActiveScreen: (screen: ScreenId) => void;
  screens: typeof SCREENS;
  dashboard: typeof dashboardData;
};

const OsContext = createContext<OsContextValue | null>(null);

export function OsProvider({ children }: { children: React.ReactNode }) {
  const [activeScreen, setActiveScreen] = useState<ScreenId>("command-center");

  const value = useMemo<OsContextValue>(
    () => ({
      activeScreen,
      setActiveScreen,
      screens: SCREENS,
      dashboard: dashboardData,
    }),
    [activeScreen],
  );

  return <OsContext.Provider value={value}>{children}</OsContext.Provider>;
}

export function useOs() {
  const context = useContext(OsContext);
  if (!context) {
    throw new Error("useOs must be used inside OsProvider.");
  }
  return context;
}
