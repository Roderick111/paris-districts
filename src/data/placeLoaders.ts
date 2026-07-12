import type { CityId, PlaceScore } from "@/data/types";
import { validatePlaceDataset, type PlaceDataset } from "@/data/placeDataset";

export function isMapPlace(place: PlaceScore) {
  return place.granularity !== "macro";
}

const CITY_LOADERS: Record<CityId, () => Promise<PlaceDataset>> = {
  paris: async () => validatePlaceDataset((await import("@/data/places/paris.json")).default, "paris"),
  bordeaux: async () => validatePlaceDataset((await import("@/data/places/bordeaux.json")).default, "bordeaux"),
  lyon: async () => validatePlaceDataset((await import("@/data/places/lyon.json")).default, "lyon"),
  toulouse: async () => validatePlaceDataset((await import("@/data/places/toulouse.json")).default, "toulouse"),
  lille: async () => validatePlaceDataset((await import("@/data/places/lille.json")).default, "lille"),
  marseille: async () => validatePlaceDataset((await import("@/data/places/marseille.json")).default, "marseille"),
  nice: async () => validatePlaceDataset((await import("@/data/places/nice.json")).default, "nice"),
  nantes: async () => validatePlaceDataset((await import("@/data/places/nantes.json")).default, "nantes"),
  strasbourg: async () => validatePlaceDataset((await import("@/data/places/strasbourg.json")).default, "strasbourg"),
  montpellier: async () => validatePlaceDataset((await import("@/data/places/montpellier.json")).default, "montpellier"),
  rennes: async () => validatePlaceDataset((await import("@/data/places/rennes.json")).default, "rennes"),
  toulon: async () => validatePlaceDataset((await import("@/data/places/toulon.json")).default, "toulon"),
  grenoble: async () => validatePlaceDataset((await import("@/data/places/grenoble.json")).default, "grenoble")
};

export async function loadPlacesForCity(cityId: CityId): Promise<PlaceScore[]> {
  const dataset = await CITY_LOADERS[cityId]();
  return dataset.places.filter(isMapPlace);
}

export async function loadMacroPlacesForCity(cityId: CityId): Promise<PlaceScore[]> {
  const dataset = await CITY_LOADERS[cityId]();
  return dataset.macroPlaces;
}
