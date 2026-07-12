import type {
  CityId,
  PlaceScore,
  PlaceKind,
  PlaceGranularity,
  PlaceConfidence,
  CoverageRole,
  GeometryBasis,
  RentLevel,
  StudentFit,
  ScoreKey
} from "@/data/types";

export type PlaceDataset = {
  cityId: CityId;
  places: PlaceScore[];
  macroPlaces: PlaceScore[];
};

const SCORE_KEYS: ScoreKey[] = [
  "security",
  "affordability",
  "transport",
  "studentEnergy",
  "services",
  "campusAccess",
  "greenCalm"
];
const PLACE_KINDS: PlaceKind[] = ["arrondissement", "quartier", "commune"];
const GRANULARITIES: PlaceGranularity[] = ["micro", "macro"];
const CONFIDENCES: PlaceConfidence[] = ["high", "medium", "low"];
const COVERAGE_ROLES: CoverageRole[] = ["primary", "context", "campus", "risk_cap", "low_relevance"];
const GEOMETRY_BASES: GeometryBasis[] = [
  "iris_partition",
  "iris_district_partition",
  "iris_fallback_major_zone",
  "official_quartier",
  "official_quartier_group",
  "arrondissement",
  "commune",
  "commune_context"
];
const RENT_LEVELS: RentLevel[] = ["lower", "medium", "high", "very high"];
const STUDENT_FITS: StudentFit[] = ["excellent", "good", "mixed", "weak"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || isString(value);
}

function isOneOf<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === "string" && values.includes(value as T);
}

function validatePlace(value: unknown, expectedCityId: CityId, index: number): PlaceScore {
  if (!isRecord(value)) {
    throw new Error(`${expectedCityId}: place ${index} must be an object`);
  }

  if (value.cityId !== expectedCityId) {
    throw new Error(`${expectedCityId}: place ${index} has cityId ${String(value.cityId)}`);
  }

  if (!isString(value.id) || !isString(value.code) || !isString(value.name) || !isString(value.area)) {
    throw new Error(`${expectedCityId}: place ${index} is missing identity fields`);
  }
  if (!isOneOf(PLACE_KINDS, value.kind) || !isOneOf(RENT_LEVELS, value.rentLevel) || !isOneOf(STUDENT_FITS, value.studentFit)) {
    throw new Error(`${expectedCityId}: place ${value.code} has invalid categorical fields`);
  }
  if (!isString(value.summary) || !isString(value.caveat) || !isRecord(value.scores)) {
    throw new Error(`${expectedCityId}: place ${value.code} has invalid text or score fields`);
  }

  const scoreKeys = Object.keys(value.scores).sort();
  if (scoreKeys.join("\0") !== [...SCORE_KEYS].sort().join("\0")) {
    throw new Error(`${expectedCityId}: place ${value.code} must contain exactly seven score keys`);
  }
  for (const key of SCORE_KEYS) {
    const score = value.scores[key];
    if (typeof score !== "number" || !Number.isFinite(score) || score < 0 || score > 10) {
      throw new Error(`${expectedCityId}: place ${value.code} has invalid ${key} score`);
    }
  }

  if (value.granularity !== undefined && !isOneOf(GRANULARITIES, value.granularity)) {
    throw new Error(`${expectedCityId}: place ${value.code} has invalid granularity`);
  }
  if (value.confidence !== undefined && !isOneOf(CONFIDENCES, value.confidence)) {
    throw new Error(`${expectedCityId}: place ${value.code} has invalid confidence`);
  }
  if (value.coverageRole !== undefined && !isOneOf(COVERAGE_ROLES, value.coverageRole)) {
    throw new Error(`${expectedCityId}: place ${value.code} has invalid coverage role`);
  }
  if (value.geometryBasis !== undefined && !isOneOf(GEOMETRY_BASES, value.geometryBasis)) {
    throw new Error(`${expectedCityId}: place ${value.code} has invalid geometry basis`);
  }
  if (!isOptionalString(value.parentCode) || !isOptionalString(value.parentName) || !isOptionalString(value.evidenceNote)) {
    throw new Error(`${expectedCityId}: place ${value.code} has invalid optional metadata`);
  }

  return value as unknown as PlaceScore;
}

export function validatePlaceDataset(value: unknown, expectedCityId: CityId): PlaceDataset {
  if (!isRecord(value) || value.cityId !== expectedCityId || !Array.isArray(value.places) || !Array.isArray(value.macroPlaces)) {
    throw new Error(`${expectedCityId}: invalid place dataset envelope`);
  }

  const places = value.places.map((place, index) => validatePlace(place, expectedCityId, index));
  const macroPlaces = value.macroPlaces.map((place, index) => validatePlace(place, expectedCityId, index));
  for (const [label, collection] of [["places", places], ["macroPlaces", macroPlaces]] as const) {
    const seenIds = new Set<string>();
    const seenCodes = new Set<string>();
    for (const place of collection) {
      if (seenIds.has(place.id) || seenCodes.has(place.code)) {
        throw new Error(`${expectedCityId}: duplicate ${label} id/code ${place.id}/${place.code}`);
      }
      seenIds.add(place.id);
      seenCodes.add(place.code);
    }
  }

  return { cityId: expectedCityId, places, macroPlaces };
}
