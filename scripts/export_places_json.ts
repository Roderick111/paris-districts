import { isMapPlace, loadPlacesForCity } from "../src/data/placeLoaders";
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

const CITY_ALIASES: Record<string, CityId> = {
  paris: "paris",
  bordeaux: "bordeaux",
  bordeauxmicro: "bordeaux",
  lyon: "lyon",
  lyonmicro: "lyon",
  toulouse: "toulouse",
  toulousemicro: "toulouse",
  lille: "lille",
  lillemicro: "lille",
  marseille: "marseille",
  marseillemicro: "marseille",
  nice: "nice",
  nicemicro: "nice",
  nantes: "nantes",
  nantesmicro: "nantes",
  strasbourg: "strasbourg",
  montpellier: "montpellier",
  rennes: "rennes",
  toulon: "toulon",
  grenoble: "grenoble"
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
    if (CITY_ALIASES[normalized]) {
      return CITY_ALIASES[normalized];
    }
    throw new Error(`No place export for section ${section}`);
  }

  const fileMatch = placesFile.match(/\/([a-z]+)Places\.ts$/i);
  if (fileMatch && CITY_ALIASES[fileMatch[1].toLowerCase()]) {
    return CITY_ALIASES[fileMatch[1].toLowerCase()];
  }

  if (placesFile.endsWith("cities.ts")) {
    return "paris";
  }

  throw new Error(`Could not infer city from places file ${placesFile}`);
}

export async function main(argv = process.argv.slice(2)): Promise<number> {
  if (argv.includes("-h") || argv.includes("--help")) {
    console.log("Usage: bun scripts/export_places_json.ts <placesFile> [section]");
    return 0;
  }

  const [placesFileArg, sectionArg] = argv;
  if (!placesFileArg) {
    console.error("Usage: bun scripts/export_places_json.ts <placesFile> [section]");
    return 1;
  }

  try {
    const cityId = cityIdFromArgs(placesFileArg, sectionArg);
    const records = toExportRecords((await loadPlacesForCity(cityId)).filter(isMapPlace));
    process.stdout.write(`${JSON.stringify(records)}\n`);
    return 0;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
}

if (import.meta.main) {
  main().then((code) => {
    process.exitCode = code;
  });
}
