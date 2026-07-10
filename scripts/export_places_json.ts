import { bordeauxMicroPlaces } from "../src/data/bordeauxPlaces";
import { grenoblePlaces } from "../src/data/grenoblePlaces";
import { lilleMicroPlaces } from "../src/data/lillePlaces";
import { lyonMicroPlaces } from "../src/data/lyonPlaces";
import { marseilleMicroPlaces } from "../src/data/marseillePlaces";
import { montpellierPlaces } from "../src/data/montpellierPlaces";
import { nantesMicroPlaces } from "../src/data/nantesPlaces";
import { niceMicroPlaces } from "../src/data/nicePlaces";
import { parisPlaces } from "../src/data/parisPlaces";
import { rennesPlaces } from "../src/data/rennesPlaces";
import { strasbourgPlaces } from "../src/data/strasbourgPlaces";
import { toulonPlaces } from "../src/data/toulonPlaces";
import { toulouseMicroPlaces } from "../src/data/toulousePlaces";
import type { CityId, PlaceScore } from "../src/data/types";

const SCORE_KEYS = [
  "security",
  "affordability",
  "transport",
  "studentEnergy",
  "services",
  "campusAccess",
  "greenCalm"
] as const;

type ExportRecord = {
  code: string;
  name: string;
  caveat: string;
  scores: Record<(typeof SCORE_KEYS)[number], number>;
};

const CITY_PLACES: Record<CityId, PlaceScore[]> = {
  paris: parisPlaces,
  bordeaux: bordeauxMicroPlaces,
  lyon: lyonMicroPlaces,
  toulouse: toulouseMicroPlaces,
  lille: lilleMicroPlaces,
  marseille: marseilleMicroPlaces,
  nice: niceMicroPlaces,
  nantes: nantesMicroPlaces,
  strasbourg: strasbourgPlaces,
  montpellier: montpellierPlaces,
  rennes: rennesPlaces,
  toulon: toulonPlaces,
  grenoble: grenoblePlaces
};

function toExportRecords(places: PlaceScore[]): ExportRecord[] {
  return places.map((place) => ({
    code: place.code,
    name: place.name,
    caveat: place.caveat,
    scores: SCORE_KEYS.reduce(
      (scores, key) => {
        scores[key] = place.scores[key];
        return scores;
      },
      {} as ExportRecord["scores"]
    )
  }));
}

function cityIdFromArgs(placesFile: string, section?: string): CityId {
  if (section) {
    const normalized = section.replace(/Places$/, "").toLowerCase();
    if (normalized in CITY_PLACES) {
      return normalized as CityId;
    }
    throw new Error(`No place export for section ${section}`);
  }

  const fileMatch = placesFile.match(/\/([a-z]+)Places\.ts$/i);
  if (fileMatch && fileMatch[1].toLowerCase() in CITY_PLACES) {
    return fileMatch[1].toLowerCase() as CityId;
  }

  if (placesFile.endsWith("cities.ts")) {
    return "paris";
  }

  throw new Error(`Could not infer city from places file ${placesFile}`);
}

const [placesFileArg, sectionArg] = process.argv.slice(2);
if (!placesFileArg) {
  console.error("Usage: bun scripts/export_places_json.ts <placesFile> [section]");
  process.exit(1);
}

const cityId = cityIdFromArgs(placesFileArg, sectionArg);
const records = toExportRecords(CITY_PLACES[cityId]);
process.stdout.write(JSON.stringify(records));