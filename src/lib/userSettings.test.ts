import { describe, expect, test } from "bun:test";
import {
  clampScore,
  clampWeight,
  loadScoreOverrides,
  loadWeights,
  pruneScoreOverrides,
  scoreOverridesStorageKey,
  saveScoreOverrides,
  saveWeights
} from "@/lib/userSettings";
import { defaultWeights, mergeScores } from "@/data/scoring";
import type { PlaceScore } from "@/data/types";

class MemoryStorage {
  private data = new Map<string, string>();

  getItem(key: string) {
    return this.data.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
}

class ThrowingStorage {
  getItem() {
    return null;
  }

  setItem() {
    throw new DOMException("quota", "QuotaExceededError");
  }
}

const samplePlace: PlaceScore = {
  id: "sample",
  cityId: "paris",
  name: "Sample",
  code: "75101",
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

describe("clamp helpers", () => {
  test("reject non-finite weight input", () => {
    expect(clampWeight(Number.NaN, 2.4)).toBe(2.4);
    expect(clampWeight(Number.POSITIVE_INFINITY)).toBe(0);
  });

  test("reject non-finite score input", () => {
    expect(clampScore(Number.NaN, 7.2)).toBe(7.2);
    expect(clampScore(Number("invalid" as unknown as number), 4)).toBe(4);
  });
});

describe("storage helpers", () => {
  test("saveWeights survives quota errors", () => {
    const storage = new MemoryStorage();
    expect(() => saveWeights(defaultWeights, storage)).not.toThrow();
    expect(() => saveWeights(defaultWeights, new ThrowingStorage())).not.toThrow();
  });

  test("saveScoreOverrides survives quota errors", () => {
    expect(() => saveScoreOverrides("paris", {}, new ThrowingStorage())).not.toThrow();
  });

  test("load helpers accept injected storage", () => {
    const storage = new MemoryStorage();
    saveWeights(defaultWeights, storage);
    expect(loadWeights(storage)).toEqual(defaultWeights);
    expect(loadScoreOverrides("paris", new Set(), storage)).toEqual({});
  });
});

describe("mergeScores", () => {
  test("returns place.scores when no override exists", () => {
    const effective = mergeScores(samplePlace);
    expect(effective).toBe(samplePlace.scores);
  });

  test("merges overrides without mutating defaults", () => {
    const effective = mergeScores(samplePlace, { security: 4 });
    expect(effective.security).toBe(4);
    expect(effective.affordability).toBe(samplePlace.scores.affordability);
    expect(samplePlace.scores.security).toBe(7);
  });
});

describe("score override migration", () => {
  test("keeps valid records when one stored record is malformed", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      scoreOverridesStorageKey("paris"),
      JSON.stringify({
        "75101": { security: 4, bogus: 8 },
        stale: { security: "bad" },
        broken: null
      })
    );

    expect(loadScoreOverrides("paris", new Set(["75101", "75102"]), storage)).toEqual({
      "75101": { security: 4 }
    });
  });

  test("migrates matching records from the shared key without removing others", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      "district-quality-map:score-overrides:v1",
      JSON.stringify({ "75101": { security: 4 }, "69101": { security: 5 } })
    );

    expect(loadScoreOverrides("paris", new Set(["75101"]), storage)).toEqual({
      "75101": { security: 4 }
    });
    expect(storage.getItem("district-quality-map:score-overrides:v1")).toContain("69101");
  });
});

describe("loadWeights forward compatibility", () => {
  test("merges valid stored keys and fills missing future keys from defaults", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      "district-quality-map:weights:v1",
      JSON.stringify({
        security: 2.5,
        affordability: 1.1,
        transport: "bad",
        studentEnergy: Number.NaN,
        services: 99,
        campusAccess: 1,
        greenCalm: 0.8,
        futureMetric: 4
      })
    );

    expect(loadWeights(storage)).toEqual({
      ...defaultWeights,
      security: 2.5,
      affordability: 1.1
    });
  });
});

describe("pruneScoreOverrides", () => {
  test("drops stale place codes and invalid score keys", () => {
    const pruned = pruneScoreOverrides(
      {
        "75101": { security: 6 },
        stale: { security: 8 },
        "75102": { security: 5, bogus: 9 } as never
      },
      new Set(["75101", "75102"])
    );

    expect(pruned).toEqual({
      "75101": { security: 6 },
      "75102": { security: 5 }
    });
  });
});
