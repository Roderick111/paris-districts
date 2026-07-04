import {
  defaultWeights,
  SCORE_KEYS,
  type DistrictScore,
  type DistrictScoreOverrides,
  type ScoreKey,
  type Weights
} from "@/data/districtScores";

export const WEIGHTS_STORAGE_KEY = "paris-student-map:weights:v1";
export const OVERRIDES_STORAGE_KEY = "paris-student-map:score-overrides:v1";

export type ScoreOverridesByDistrict = Record<string, DistrictScoreOverrides>;

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

function isValidScoreOverrides(value: unknown): value is ScoreOverridesByDistrict {
  if (!value || typeof value !== "object") {
    return false;
  }

  return Object.entries(value as ScoreOverridesByDistrict).every(([code, overrides]) => {
    if (typeof code !== "string" || !overrides || typeof overrides !== "object") {
      return false;
    }

    return Object.entries(overrides).every(([key, score]) => {
      return isScoreKey(key) && typeof score === "number" && Number.isFinite(score) && score >= 0 && score <= 10;
    });
  });
}

export function loadWeights(): Weights {
  if (typeof window === "undefined") {
    return { ...defaultWeights };
  }

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

export function loadScoreOverrides(): ScoreOverridesByDistrict {
  if (typeof window === "undefined") {
    return {};
  }

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

export function saveScoreOverrides(overrides: ScoreOverridesByDistrict) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
}

export function getDistrictOverrides(
  overrides: ScoreOverridesByDistrict,
  code: string
): DistrictScoreOverrides | undefined {
  const districtOverrides = overrides[code];
  return districtOverrides && Object.keys(districtOverrides).length > 0 ? districtOverrides : undefined;
}

export function getEffectiveScores(
  district: DistrictScore,
  overrides: ScoreOverridesByDistrict
): DistrictScore["scores"] {
  return { ...district.scores, ...overrides[district.code] };
}

export function weightsDifferFromDefaults(activeWeights: Weights) {
  return SCORE_KEYS.some((key) => activeWeights[key] !== defaultWeights[key]);
}

export function hasScoreOverrides(overrides: ScoreOverridesByDistrict) {
  return Object.values(overrides).some((districtOverrides) => Object.keys(districtOverrides).length > 0);
}

export function hasCustomSettings(activeWeights: Weights, overrides: ScoreOverridesByDistrict) {
  return weightsDifferFromDefaults(activeWeights) || hasScoreOverrides(overrides);
}

export function clampWeight(value: number) {
  return Math.min(5, Math.max(0, Number(value.toFixed(1))));
}

export function clampScore(value: number) {
  return Math.min(10, Math.max(0, Number(value.toFixed(1))));
}