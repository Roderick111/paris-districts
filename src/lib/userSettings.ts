import {
  defaultWeights,
  round1,
  SCORE_KEYS,
  type PlaceScoreOverrides,
  type ScoreKey,
  type Weights
} from "@/data/cities";

const WEIGHTS_STORAGE_KEY = "district-quality-map:weights:v1";
const LEGACY_OVERRIDES_STORAGE_KEY = "district-quality-map:score-overrides:v1";

const LEGACY_WEIGHTS_KEYS = [
  "paris-student-map:weights:v1",
  "student-city-map:weights:v1",
] as const;
const LEGACY_OVERRIDES_KEYS = [
  "paris-student-map:score-overrides:v1",
  "student-city-map:score-overrides:v1",
] as const;

export type ScoreOverridesByPlace = Record<string, PlaceScoreOverrides>;

type StorageLike = Pick<Storage, "getItem" | "setItem">;

export function scoreOverridesStorageKey(cityId: string): string {
  return `district-quality-map:score-overrides:${cityId}:v1`;
}

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

function isValidWeightValue(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 5;
}

function mergeStoredWeights(parsed: unknown): Weights {
  const merged: Weights = { ...defaultWeights };
  if (!parsed || typeof parsed !== "object") {
    return merged;
  }

  for (const key of SCORE_KEYS) {
    const stored = (parsed as Partial<Weights>)[key];
    if (stored !== undefined && isValidWeightValue(stored)) {
      merged[key] = stored;
    }
  }

  return merged;
}

function sanitizeScoreOverrides(value: unknown): ScoreOverridesByPlace {
  if (!value || typeof value !== "object") {
    return {};
  }

  const sanitized: ScoreOverridesByPlace = {};
  for (const [code, overrides] of Object.entries(value)) {
    if (!code || !overrides || typeof overrides !== "object") {
      continue;
    }

    const cleaned: PlaceScoreOverrides = {};
    for (const [key, score] of Object.entries(overrides)) {
      if (
        isScoreKey(key) &&
        typeof score === "number" &&
        Number.isFinite(score) &&
        score >= 0 &&
        score <= 10
      ) {
        cleaned[key] = score;
      }
    }

    if (Object.keys(cleaned).length > 0) {
      sanitized[code] = cleaned;
    }
  }

  return sanitized;
}

function migrateLegacyStorage(storage: StorageLike) {
  try {
    if (!storage.getItem(WEIGHTS_STORAGE_KEY)) {
      for (const legacyKey of LEGACY_WEIGHTS_KEYS) {
        const legacyWeights = storage.getItem(legacyKey);
        if (legacyWeights) {
          storage.setItem(WEIGHTS_STORAGE_KEY, legacyWeights);
          break;
        }
      }
    }

  } catch {
    // Ignore storage errors during migration.
  }
}

function resolveStorage(storage?: StorageLike): StorageLike | null {
  if (storage) {
    return storage;
  }

  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function loadWeights(storage?: StorageLike): Weights {
  const store = resolveStorage(storage);
  if (!store) {
    return { ...defaultWeights };
  }

  migrateLegacyStorage(store);

  try {
    const raw = store.getItem(WEIGHTS_STORAGE_KEY);
    if (!raw) {
      return { ...defaultWeights };
    }

    const parsed: unknown = JSON.parse(raw);
    return mergeStoredWeights(parsed);
  } catch {
    return { ...defaultWeights };
  }
}

export function saveWeights(weights: Weights, storage?: StorageLike) {
  const store = resolveStorage(storage);
  if (!store) {
    return;
  }

  try {
    store.setItem(WEIGHTS_STORAGE_KEY, JSON.stringify(weights));
  } catch {
    // QuotaExceededError / SecurityError must not crash effects.
  }
}

export function loadScoreOverrides(
  cityId: string,
  validCodes: ReadonlySet<string>,
  storage?: StorageLike
): ScoreOverridesByPlace {
  const store = resolveStorage(storage);
  if (!store) {
    return {};
  }

  try {
    const cityKey = scoreOverridesStorageKey(cityId);
    let raw = store.getItem(cityKey);
    if (!raw) {
      raw = store.getItem(LEGACY_OVERRIDES_STORAGE_KEY);
    }
    if (!raw) {
      for (const legacyKey of LEGACY_OVERRIDES_KEYS) {
        raw = store.getItem(legacyKey);
        if (raw) {
          break;
        }
      }
    }

    if (!raw) {
      return {};
    }

    return pruneScoreOverrides(sanitizeScoreOverrides(JSON.parse(raw)), validCodes);
  } catch {
    return {};
  }
}

export function saveScoreOverrides(
  cityId: string,
  overrides: ScoreOverridesByPlace,
  storage?: StorageLike
) {
  const store = resolveStorage(storage);
  if (!store) {
    return;
  }

  try {
    store.setItem(scoreOverridesStorageKey(cityId), JSON.stringify(overrides));
  } catch {
    // QuotaExceededError / SecurityError must not crash effects.
  }
}

export function getPlaceOverrides(
  overrides: ScoreOverridesByPlace,
  code: string
): PlaceScoreOverrides | undefined {
  return overrides[code];
}

export function pruneScoreOverrides(
  overrides: ScoreOverridesByPlace,
  validCodes: ReadonlySet<string>
): ScoreOverridesByPlace {
  const pruned: ScoreOverridesByPlace = {};

  for (const [code, placeOverrides] of Object.entries(overrides)) {
    if (!validCodes.has(code) || !placeOverrides || typeof placeOverrides !== "object") {
      continue;
    }

    const cleaned: PlaceScoreOverrides = {};
    for (const [key, score] of Object.entries(placeOverrides)) {
      if (
        isScoreKey(key) &&
        typeof score === "number" &&
        Number.isFinite(score) &&
        score >= 0 &&
        score <= 10
      ) {
        cleaned[key] = score;
      }
    }

    if (Object.keys(cleaned).length > 0) {
      pruned[code] = cleaned;
    }
  }

  return pruned;
}

export function weightsDifferFromDefaults(activeWeights: Weights) {
  return SCORE_KEYS.some((key) => activeWeights[key] !== defaultWeights[key]);
}

export function hasScoreOverrides(overrides: ScoreOverridesByPlace): boolean {
  for (const code in overrides) {
    if (Object.prototype.hasOwnProperty.call(overrides, code)) {
      return true;
    }
  }

  return false;
}

export function hasCustomSettings(activeWeights: Weights, overrides: ScoreOverridesByPlace) {
  return weightsDifferFromDefaults(activeWeights) || hasScoreOverrides(overrides);
}

export function clampWeight(value: number, fallback = 0): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(5, Math.max(0, round1(value)));
}

export function clampScore(value: number, fallback = 0): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(10, Math.max(0, round1(value)));
}
