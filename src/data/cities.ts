export type {
  CityConfig,
  CityId,
  CoverageRole,
  GeometryBasis,
  PlaceConfidence,
  PlaceGranularity,
  PlaceKind,
  PlaceScore,
  PlaceScoreOverrides,
  RentLevel,
  ScoreKey,
  Source,
  StudentFit,
  Weights
} from "@/data/types";

export {
  cities,
  cityById
} from "@/data/cityMetadata";

export {
  SCORE_KEYS,
  colorForScore,
  defaultWeights,
  formatScore,
  mergeScores,
  scoreForMode,
  UNKNOWN_FEATURE_COLOR,
  weightedTotal,
  weights
} from "@/data/scoring";

export {
  isMapPlace,
  loadMacroPlacesForCity,
  loadPlacesForCity
} from "@/data/placeLoaders";

export { parisPlaces } from "@/data/parisPlaces";

/** @deprecated Use loadPlacesForCity(cityId) */
export async function getPlacesForCity(cityId: import("@/data/types").CityId) {
  const { loadPlacesForCity } = await import("@/data/placeLoaders");
  return loadPlacesForCity(cityId);
}

/** @deprecated Use loadMacroPlacesForCity(cityId) */
export async function getMacroPlacesForCity(cityId: import("@/data/types").CityId) {
  const { loadMacroPlacesForCity } = await import("@/data/placeLoaders");
  return loadMacroPlacesForCity(cityId);
}