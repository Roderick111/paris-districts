export {
  cityById,
  defaultWeights,
  getPlacesForCity,
  mergeScores,
  placeByCode as districtByCode,
  placesByCity,
  SCORE_KEYS,
  weightedTotal,
  weights,
  type PlaceScore as DistrictScore,
  type PlaceScoreOverrides as DistrictScoreOverrides,
  type ScoreKey,
  type Weights
} from "@/data/cities";

import { cityById, getPlacesForCity } from "@/data/cities";

/** @deprecated Use getPlacesForCity("paris") */
export const districts = getPlacesForCity("paris");

/** @deprecated Use cityById.get("paris")?.sources */
export const sources = cityById.get("paris")!.sources;