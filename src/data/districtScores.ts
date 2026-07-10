export {
  cityById,
  defaultWeights,
  mergeScores,
  SCORE_KEYS,
  weightedTotal,
  weights,
  type PlaceScore as DistrictScore,
  type PlaceScoreOverrides as DistrictScoreOverrides,
  type ScoreKey,
  type Weights
} from "@/data/cities";

import { cityById } from "@/data/cityMetadata";
import { parisPlaces } from "@/data/parisPlaces";
import { isMapPlace } from "@/data/placeLoaders";

/** @deprecated Use loadPlacesForCity("paris") */
export const districts = parisPlaces.filter(isMapPlace);

/** @deprecated Use cityById.get("paris")?.sources */
export const sources = cityById.get("paris")!.sources;