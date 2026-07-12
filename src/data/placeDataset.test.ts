import { describe, expect, test } from "bun:test";
import bordeaux from "@/data/places/bordeaux.json";
import grenoble from "@/data/places/grenoble.json";
import lille from "@/data/places/lille.json";
import lyon from "@/data/places/lyon.json";
import marseille from "@/data/places/marseille.json";
import montpellier from "@/data/places/montpellier.json";
import nantes from "@/data/places/nantes.json";
import nice from "@/data/places/nice.json";
import paris from "@/data/places/paris.json";
import rennes from "@/data/places/rennes.json";
import strasbourg from "@/data/places/strasbourg.json";
import toulon from "@/data/places/toulon.json";
import toulouse from "@/data/places/toulouse.json";
import { validatePlaceDataset } from "@/data/placeDataset";

const datasets = {
  paris,
  bordeaux,
  lyon,
  toulouse,
  lille,
  marseille,
  nice,
  nantes,
  strasbourg,
  montpellier,
  rennes,
  toulon,
  grenoble
} as const;

describe("canonical place datasets", () => {
  test.each(Object.entries(datasets))("validates %s", (cityId, raw) => {
    const dataset = validatePlaceDataset(raw, cityId as keyof typeof datasets);
    expect(dataset.places.length).toBeGreaterThan(0);
  });

  test("rejects duplicate place codes", () => {
    const raw = { ...paris, places: [paris.places[0], paris.places[0]] };
    expect(() => validatePlaceDataset(raw, "paris")).toThrow("duplicate places id/code");
  });
});
