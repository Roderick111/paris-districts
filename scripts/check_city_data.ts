import { readFileSync } from "fs";
import { join } from "path";
import { cities } from "../src/data/cityMetadata";
import { isMapPlace, loadPlacesForCity } from "../src/data/placeLoaders";

type GeoFeature = {
  properties?: {
    code?: string;
  };
};

type GeoCollection = {
  features: GeoFeature[];
};

const ROOT = process.cwd();

function readGeojson(publicPath: string): GeoCollection {
  const filePath = join(ROOT, "public", publicPath.replace(/^\/data\//, "data/"));
  return JSON.parse(readFileSync(filePath, "utf8")) as GeoCollection;
}

function featureCodes(geojson: GeoCollection, label: string): string[] {
  const codes = geojson.features.map((feature) => feature.properties?.code);
  const invalid = codes.filter((code) => typeof code !== "string" || code.length === 0);
  if (invalid.length > 0) {
    throw new Error(`${label}: ${invalid.length} features with missing/invalid code`);
  }

  const duplicates = new Set<string>();
  const seen = new Set<string>();
  for (const code of codes as string[]) {
    if (seen.has(code)) {
      duplicates.add(code);
    }
    seen.add(code);
  }

  if (duplicates.size > 0) {
    throw new Error(`${label}: duplicate feature codes: ${[...duplicates].sort().join(", ")}`);
  }

  if (codes.length === 0) {
    throw new Error(`${label}: empty feature collection`);
  }

  return codes as string[];
}

function compareCodeSets(cityId: string, label: string, placeCodes: Set<string>, geoCodes: Set<string>) {
  const missing = [...placeCodes].filter((code) => !geoCodes.has(code)).sort();
  const extra = [...geoCodes].filter((code) => !placeCodes.has(code)).sort();

  if (missing.length > 0 || extra.length > 0) {
    const parts = [`${cityId} ${label} mismatch`];
    if (missing.length > 0) {
      parts.push(`missing in GeoJSON: ${missing.join(", ")}`);
    }
    if (extra.length > 0) {
      parts.push(`extra in GeoJSON: ${extra.join(", ")}`);
    }
    throw new Error(parts.join("; "));
  }
}

export async function main(argv = process.argv.slice(2)): Promise<number> {
  if (argv[0] === "-h" || argv[0] === "--help") {
    console.log("Usage: bun scripts/check_city_data.ts");
    return 0;
  }

  let failed = false;
  for (const city of cities) {
    try {
      const places = (await loadPlacesForCity(city.id)).filter(isMapPlace);
    const placeCodes = new Set(places.map((place) => place.code));
    if (placeCodes.size === 0) {
      throw new Error(`${city.id}: no map place codes configured`);
    }

    const boundary = readGeojson(city.geojsonUrl);
    const boundaryCodes = new Set(featureCodes(boundary, `${city.id} boundary`));
    compareCodeSets(city.id, "boundary", placeCodes, boundaryCodes);

    if (city.outlineGeojsonUrl) {
      const outlines = readGeojson(city.outlineGeojsonUrl);
      const outlineCodes = new Set(featureCodes(outlines, `${city.id} outlines`));
      compareCodeSets(city.id, "outlines", placeCodes, outlineCodes);
    }

      console.log(`${city.id}: ok (${placeCodes.size} places, codes match GeoJSON)`);
    } catch (error) {
      failed = true;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`${city.id}: ${message}`);
    }
  }

  return failed ? 1 : 0;
}

if (import.meta.main) {
  main().then((code) => {
    process.exitCode = code;
  });
}
