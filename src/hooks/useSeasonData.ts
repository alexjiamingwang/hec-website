"use client";

import { useSeason } from "@/context/SeasonContext";
import { getServicesBySeason } from "../../data/services";
import { getGuidesBySeason } from "../../data/guides";
import { getGalleryBySeason } from "../../data/gallery";
import { getLocationsBySeason } from "../../data/locations";

/**
 * useSeasonData — returns all data slices filtered by the current active season.
 * Components use this instead of importing data files directly, so they
 * automatically re-render when the season toggle fires.
 */
export function useSeasonData() {
  const { season, isWinter, isSummer, accentColor, glowColor } = useSeason();

  return {
    season,
    isWinter,
    isSummer,
    accentColor,
    glowColor,
    services:  getServicesBySeason(season),
    guides:    getGuidesBySeason(season),
    gallery:   getGalleryBySeason(season),
    locations: getLocationsBySeason(season),
  };
}
