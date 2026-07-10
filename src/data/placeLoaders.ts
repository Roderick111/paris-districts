import type { CityId, PlaceScore } from "@/data/types";

export function isMapPlace(place: PlaceScore) {
  return place.granularity !== "macro";
}

type PlaceModule = {
  places: PlaceScore[];
  macroPlaces?: PlaceScore[];
};

const CITY_LOADERS: Record<CityId, () => Promise<PlaceModule>> = {
  paris: async () => {
    const { parisPlaces } = await import("@/data/parisPlaces");
    return { places: parisPlaces };
  },
  bordeaux: async () => {
    const { bordeauxMicroPlaces, bordeauxMacroPlaces } = await import("@/data/bordeauxPlaces");
    return { places: bordeauxMicroPlaces, macroPlaces: bordeauxMacroPlaces };
  },
  lyon: async () => {
    const { lyonMicroPlaces, lyonMacroPlaces } = await import("@/data/lyonPlaces");
    return { places: lyonMicroPlaces, macroPlaces: lyonMacroPlaces };
  },
  toulouse: async () => {
    const { toulouseMicroPlaces } = await import("@/data/toulousePlaces");
    return { places: toulouseMicroPlaces };
  },
  lille: async () => {
    const { lilleMicroPlaces } = await import("@/data/lillePlaces");
    return { places: lilleMicroPlaces };
  },
  marseille: async () => {
    const { marseilleMicroPlaces } = await import("@/data/marseillePlaces");
    return { places: marseilleMicroPlaces };
  },
  nice: async () => {
    const { niceMicroPlaces } = await import("@/data/nicePlaces");
    return { places: niceMicroPlaces };
  },
  nantes: async () => {
    const { nantesMicroPlaces } = await import("@/data/nantesPlaces");
    return { places: nantesMicroPlaces };
  },
  strasbourg: async () => {
    const { strasbourgPlaces } = await import("@/data/strasbourgPlaces");
    return { places: strasbourgPlaces };
  },
  montpellier: async () => {
    const { montpellierPlaces } = await import("@/data/montpellierPlaces");
    return { places: montpellierPlaces };
  },
  rennes: async () => {
    const { rennesPlaces } = await import("@/data/rennesPlaces");
    return { places: rennesPlaces };
  },
  toulon: async () => {
    const { toulonPlaces } = await import("@/data/toulonPlaces");
    return { places: toulonPlaces };
  },
  grenoble: async () => {
    const { grenoblePlaces } = await import("@/data/grenoblePlaces");
    return { places: grenoblePlaces };
  }
};

export async function loadPlacesForCity(cityId: CityId): Promise<PlaceScore[]> {
  const mod = await CITY_LOADERS[cityId]();
  return mod.places.filter(isMapPlace);
}

export async function loadMacroPlacesForCity(cityId: CityId): Promise<PlaceScore[]> {
  const mod = await CITY_LOADERS[cityId]();
  return mod.macroPlaces ?? [];
}