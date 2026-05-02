"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useTransition,
  type ReactNode,
} from "react";
import type { Season } from "@/types";

interface SeasonContextValue {
  season: Season;
  toggleSeason: () => void;
  isWinter: boolean;
  isSummer: boolean;
  isTransitioning: boolean;
  accentColor: string;
  glowColor: string;
}

const SeasonContext = createContext<SeasonContextValue | null>(null);

export function SeasonProvider({ children }: { children: ReactNode }) {
  const [season, setSeason] = useState<Season>("winter");
  const [isPending, startTransition] = useTransition();

  const toggleSeason = useCallback(() => {
    startTransition(() => {
      setSeason((prev) => (prev === "winter" ? "summer" : "winter"));
    });
  }, []);

  // Sync the CSS [data-season] attribute so globals.css transitions fire
  useEffect(() => {
    document.documentElement.setAttribute("data-season", season);
  }, [season]);

  const value: SeasonContextValue = {
    season,
    toggleSeason,
    isWinter: season === "winter",
    isSummer: season === "summer",
    isTransitioning: isPending,
    // Design tokens exposed for components that need dynamic theming
    accentColor: season === "winter" ? "#7BB3D4" : "#D4956A",
    glowColor:   season === "winter" ? "#A8CFEA" : "#E8B594",
  };

  return (
    <SeasonContext.Provider value={value}>
      {children}
    </SeasonContext.Provider>
  );
}

export function useSeason(): SeasonContextValue {
  const ctx = useContext(SeasonContext);
  if (!ctx) throw new Error("useSeason must be used within <SeasonProvider>");
  return ctx;
}
