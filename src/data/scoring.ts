import type { PlaceScore, PlaceScoreOverrides, ScoreKey, Weights } from "@/data/types";

export const SCORE_KEYS: ScoreKey[] = [
  "security",
  "affordability",
  "transport",
  "studentEnergy",
  "services",
  "campusAccess",
  "greenCalm"
];

export const weights: Weights = {
  security: 3,
  affordability: 1.6,
  transport: 1.4,
  studentEnergy: 1.2,
  services: 1,
  campusAccess: 1,
  greenCalm: 0.8
};

export const defaultWeights: Weights = { ...weights };

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

export function mergeScores(
  place: PlaceScore,
  scoreOverrides?: PlaceScoreOverrides
): PlaceScore["scores"] {
  return scoreOverrides ? { ...place.scores, ...scoreOverrides } : place.scores;
}

function securityCap(security: number) {
  const s = finiteOr(security, 0);
  if (s < 3) {
    return 3.4;
  }
  if (s < 4) {
    return 4.4;
  }
  if (s < 5) {
    return 5.2;
  }
  if (s < 6) {
    return 6.2;
  }
  if (s < 7) {
    return 7.0;
  }
  if (s < 8) {
    return 7.8;
  }
  return 10;
}

export function weightedTotal(
  place: PlaceScore,
  activeWeights: Weights,
  scoreOverrides?: PlaceScoreOverrides
) {
  const scores = mergeScores(place, scoreOverrides);
  const maxWeightedScore = SCORE_KEYS.reduce(
    (sum, key) => sum + finiteOr(activeWeights[key], 0) * 10,
    0
  );
  const total = SCORE_KEYS.reduce(
    (sum, key) => sum + finiteOr(scores[key], 0) * finiteOr(activeWeights[key], 0),
    0
  );
  const rawScore = maxWeightedScore > 0 ? (total / maxWeightedScore) * 10 : 0;
  const capped = Math.min(finiteOr(rawScore, 0), securityCap(scores.security));
  return Number(finiteOr(capped, 0).toFixed(1));
}

export function scoreForMode(
  place: PlaceScore,
  mode: "overall" | ScoreKey,
  activeWeights: Weights,
  effectiveScores: PlaceScore["scores"],
  overallScore: number
) {
  if (mode === "overall") {
    return finiteOr(overallScore, 0);
  }

  return finiteOr(effectiveScores[mode], 0);
}

export const UNKNOWN_FEATURE_COLOR: [number, number, number, number] = [180, 180, 180, 185];

export function colorForScore(score: number, alpha = 185): [number, number, number, number] {
  if (!Number.isFinite(score)) {
    return UNKNOWN_FEATURE_COLOR;
  }

  const clamped = Math.max(0, Math.min(10, score));
  if (clamped <= 4) {
    const t = clamped / 4;
    return [Math.round(185 + 64 * t), Math.round(28 + 87 * t), Math.round(28 - 6 * t), alpha];
  }

  if (clamped <= 6.5) {
    const t = (clamped - 4) / 2.5;
    return [Math.round(249 + 1 * t), Math.round(115 + 89 * t), Math.round(22 - 1 * t), alpha];
  }

  if (clamped <= 8) {
    const t = (clamped - 6.5) / 1.5;
    return [Math.round(250 - 118 * t), Math.round(204 - 28 * t), Math.round(21 + 11 * t), alpha];
  }

  const t = (clamped - 8) / 2;
  return [Math.round(132 - 110 * t), Math.round(176 - 13 * t), Math.round(32 + 42 * t), alpha];
}

export function formatScore(value: number) {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return value.toFixed(1).replace(".0", "");
}