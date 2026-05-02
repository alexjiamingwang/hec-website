"use client";

import { useSeason } from "@/context/SeasonContext";
import { clsx } from "clsx";

export function SeasonToggle() {
  const { toggleSeason, isWinter, isTransitioning } = useSeason();

  return (
    <button
      onClick={toggleSeason}
      disabled={isTransitioning}
      aria-label={isWinter ? "Switch to Summer" : "Switch to Winter"}
      className={clsx(
        "relative inline-flex items-center rounded-full",
        "border transition-all duration-300 ease-hec select-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "p-1",
        isWinter
          ? "border-winter-accent/40 bg-winter-accent/10 hover:border-winter-accent/70"
          : "border-summer-accent/40 bg-summer-accent/10 hover:border-summer-accent/70"
      )}
    >
      {/* Track */}
      <span
        className={clsx(
          "relative flex h-8 w-16 shrink-0 items-center rounded-full transition-colors duration-300",
          isWinter ? "bg-winter-accent/15" : "bg-summer-accent/15"
        )}
      >
        {/* Thumb */}
        <span
          className={clsx(
            "absolute h-6 w-6 rounded-full transition-all duration-300 ease-hec shadow-md flex items-center justify-center text-sm",
            isWinter
              ? "left-[4px] bg-winter-accent"
              : "left-[calc(100%-28px)] bg-summer-accent"
          )}
        >
          {isWinter ? "❄" : "☀"}
        </span>

        {/* Dimmed opposite icon on the far side */}
        <span
          className={clsx(
            "absolute text-sm pointer-events-none transition-opacity duration-300",
            isWinter ? "right-[6px] opacity-25" : "left-[6px] opacity-25"
          )}
        >
          {isWinter ? "☀" : "❄"}
        </span>
      </span>
    </button>
  );
}
