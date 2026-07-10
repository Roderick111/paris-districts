import { describe, expect, test } from "bun:test";
import { colorForScore, formatScore, weightedTotal } from "@/data/scoring";
import type { PlaceScore } from "@/data/types";

const samplePlace: PlaceScore = {
  id: "sample",
  cityId: "paris",
  name: "Sample",
  code: "sample",
  kind: "quartier",
  area: "Paris",
  scores: {
    security: 7,
    affordability: 5,
    transport: 8,
    studentEnergy: 6,
    services: 7,
    campusAccess: 6,
    greenCalm: 5
  },
  rentLevel: "medium",
  studentFit: "good",
  summary: "sample",
  caveat: "sample"
};

describe("scoring finite guards", () => {
  test("weightedTotal never returns NaN", () => {
    const brokenWeights = {
      security: Number.NaN,
      affordability: 1.6,
      transport: 1.4,
      studentEnergy: 1.2,
      services: 1,
      campusAccess: 1,
      greenCalm: 0.8
    };

    const total = weightedTotal(samplePlace, brokenWeights);
    expect(Number.isFinite(total)).toBe(true);
  });

  test("colorForScore handles non-finite values", () => {
    expect(colorForScore(Number.NaN)).toEqual([180, 180, 180, 185]);
  });

  test("formatScore handles non-finite values", () => {
    expect(formatScore(Number.NaN)).toBe("—");
  });
});