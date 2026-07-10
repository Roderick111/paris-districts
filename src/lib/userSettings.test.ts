import { describe, expect, test } from "bun:test";
import {
  clampScore,
  clampWeight,
  loadScoreOverrides,
  loadWeights,
  saveScoreOverrides,
  saveWeights,
  WEIGHTS_STORAGE_KEY
} from "@/lib/userSettings";
import { defaultWeights } from "@/data/scoring";

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
    expect(() => saveScoreOverrides({}, new ThrowingStorage())).not.toThrow();
  });

  test("load helpers accept injected storage", () => {
    const storage = new MemoryStorage();
    storage.setItem(WEIGHTS_STORAGE_KEY, JSON.stringify(defaultWeights));
    expect(loadWeights(storage)).toEqual(defaultWeights);
    expect(loadScoreOverrides(storage)).toEqual({});
  });
});