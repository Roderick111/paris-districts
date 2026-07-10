import { describe, expect, test } from "bun:test";
import { colorForScore, defaultWeights, formatScore, weightedTotal } from "@/data/scoring";
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

describe("weightedTotal", () => {
  test("returns zero when all weights are zero", () => {
    const zeroWeights = Object.fromEntries(
      Object.keys(defaultWeights).map((key) => [key, 0])
    ) as typeof defaultWeights;

    expect(weightedTotal(samplePlace, zeroWeights)).toBe(0);
  });

  test("rounds to one decimal without string conversion", () => {
    const place: PlaceScore = {
      ...samplePlace,
      scores: {
        security: 7,
        affordability: 7,
        transport: 7,
        studentEnergy: 7,
        services: 7,
        campusAccess: 7,
        greenCalm: 7
      }
    };

    const total = weightedTotal(place, defaultWeights);
    expect(total).toBe(7);
    expect(Number.isInteger(total * 10)).toBe(true);
  });

  test("respects security cap at low safety scores", () => {
    const unsafePlace: PlaceScore = {
      ...samplePlace,
      scores: {
        ...samplePlace.scores,
        security: 2
      }
    };

    expect(weightedTotal(unsafePlace, defaultWeights)).toBeLessThanOrEqual(3.4);
  });
});