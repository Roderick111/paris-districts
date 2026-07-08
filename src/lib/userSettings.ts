import {
  defaultWeights,
  SCORE_KEYS,
  type PlaceScore,
  type PlaceScoreOverrides,
  type ScoreKey,
  type Weights
} from "@/data/cities";

export const WEIGHTS_STORAGE_KEY = "student-city-map:weights:v1";
export const OVERRIDES_STORAGE_KEY = "student-city-map:score-overrides:v1";

const LEGACY_WEIGHTS_STORAGE_KEY = "paris-student-map:weights:v1";
const LEGACY_OVERRIDES_STORAGE_KEY = "paris-student-map:score-overrides:v1";

export type ScoreOverridesByPlace = Record<string, PlaceScoreOverrides>;

/** @deprecated Use ScoreOverridesByPlace */
export type ScoreOverridesByDistrict = ScoreOverridesByPlace;

export function metricLabel(key: ScoreKey | string) {
  const labels: Record<string, string> = {
    security: "Security",
    affordability: "Affordability",
    transport: "Transport",
    studentEnergy: "Student energy",
    services: "Services",
    campusAccess: "Campus access",
    greenCalm: "Green/calm"
  };

  return labels[key] ?? key;
}

function isScoreKey(value: string): value is ScoreKey {
  return SCORE_KEYS.includes(value as ScoreKey);
}

function isValidWeights(value: unknown): value is Weights {
  if (!value || typeof value !== "object") {
    return false;
  }

  return SCORE_KEYS.every((key) => {
    const weight = (value as Weights)[key];
    return typeof weight === "number" && Number.isFinite(weight) && weight >= 0 && weight <= 5;
  });
}

function isValidScoreOverrides(value: unknown): value is ScoreOverridesByPlace {
  if (!value || typeof value !== "object") {
    return false;
  }

  return Object.entries(value as ScoreOverridesByPlace).every(([code, overrides]) => {
    if (typeof code !== "string" || !overrides || typeof overrides !== "object") {
      return false;
    }

    return Object.entries(overrides).every(([key, score]) => {
      return isScoreKey(key) && typeof score === "number" && Number.isFinite(score) && score >= 0 && score <= 10;
    });
  });
}

function migrateLegacyStorage() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (!localStorage.getItem(WEIGHTS_STORAGE_KEY)) {
      const legacyWeights = localStorage.getItem(LEGACY_WEIGHTS_STORAGE_KEY);
      if (legacyWeights) {
        localStorage.setItem(WEIGHTS_STORAGE_KEY, legacyWeights);
      }
    }

    if (!localStorage.getItem(OVERRIDES_STORAGE_KEY)) {
      const legacyOverrides = localStorage.getItem(LEGACY_OVERRIDES_STORAGE_KEY);
      if (legacyOverrides) {
        localStorage.setItem(OVERRIDES_STORAGE_KEY, legacyOverrides);
      }
    }
  } catch {
    // Ignore storage errors during migration.
  }
}

export function loadWeights(): Weights {
  if (typeof window === "undefined") {
    return { ...defaultWeights };
  }

  migrateLegacyStorage();

  try {
    const raw = localStorage.getItem(WEIGHTS_STORAGE_KEY);
    if (!raw) {
      return { ...defaultWeights };
    }

    const parsed: unknown = JSON.parse(raw);
    return isValidWeights(parsed) ? parsed : { ...defaultWeights };
  } catch {
    return { ...defaultWeights };
  }
}

export function saveWeights(weights: Weights) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(WEIGHTS_STORAGE_KEY, JSON.stringify(weights));
}

export function loadScoreOverrides(): ScoreOverridesByPlace {
  if (typeof window === "undefined") {
    return {};
  }

  migrateLegacyStorage();

  try {
    const raw = localStorage.getItem(OVERRIDES_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed: unknown = JSON.parse(raw);
    return isValidScoreOverrides(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function saveScoreOverrides(overrides: ScoreOverridesByPlace) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
}

export function getPlaceOverrides(
  overrides: ScoreOverridesByPlace,
  code: string
): PlaceScoreOverrides | undefined {
  const placeOverrides = overrides[code];
  return placeOverrides && Object.keys(placeOverrides).length > 0 ? placeOverrides : undefined;
}

/** @deprecated Use getPlaceOverrides */
export function getDistrictOverrides(
  overrides: ScoreOverridesByPlace,
  code: string
): PlaceScoreOverrides | undefined {
  return getPlaceOverrides(overrides, code);
}

export function getEffectiveScores(
  place: PlaceScore,
  overrides: ScoreOverridesByPlace
): PlaceScore["scores"] {
  return { ...place.scores, ...overrides[place.code] };
}

export function weightsDifferFromDefaults(activeWeights: Weights) {
  return SCORE_KEYS.some((key) => activeWeights[key] !== defaultWeights[key]);
}

export function hasScoreOverrides(overrides: ScoreOverridesByPlace) {
  return Object.values(overrides).some((placeOverrides) => Object.keys(placeOverrides).length > 0);
}

export function hasCustomSettings(activeWeights: Weights, overrides: ScoreOverridesByPlace) {
  return weightsDifferFromDefaults(activeWeights) || hasScoreOverrides(overrides);
}

export function clampWeight(value: number) {
  return Math.min(5, Math.max(0, Number(value.toFixed(1))));
}

export function clampScore(value: number) {
  return Math.min(10, Math.max(0, Number(value.toFixed(1))));
}