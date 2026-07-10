import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";
import type { FeatureCollection, Geometry } from "geojson";
import { dissolveGeometry } from "../src/lib/geometryOutline";

type OutlineFeatureCollection = FeatureCollection<
  Geometry,
  { code: string; name: string; kind: string }
>;

type CityConfigPaths = {
  cityId: string;
  geojsonOutput: string;
  outlineOutput: string;
};

function outlineCitiesFromConfigs(): CityConfigPaths[] {
  const configDir = join("scripts", "city_configs");
  return readdirSync(configDir)
    .filter((file) => file.endsWith(".json"))
    .flatMap((file) => {
      const raw = JSON.parse(readFileSync(join(configDir, file), "utf8")) as {
        cityId?: string;
        geojsonOutput?: string;
        outlineOutput?: string;
      };
      if (!raw.outlineOutput || !raw.geojsonOutput) {
        return [];
      }
      return [
        {
          cityId: raw.cityId ?? file.replace(/\.json$/, ""),
          geojsonOutput: raw.geojsonOutput,
          outlineOutput: raw.outlineOutput
        }
      ];
    })
    .sort((a, b) => a.cityId.localeCompare(b.cityId));
}

function dissolveWithFallback(geometry: Geometry): Geometry {
  try {
    return dissolveGeometry(geometry);
  } catch {
    return geometry;
  }
}

const requested = process.argv.slice(2);
const targets = requested.length > 0
  ? outlineCitiesFromConfigs().filter((entry) => requested.includes(entry.cityId))
  : outlineCitiesFromConfigs();

if (targets.length === 0) {
  console.error("No cities with outlineOutput configured.");
  process.exit(1);
}

for (const { cityId, geojsonOutput, outlineOutput } of targets) {
  const inputPath = geojsonOutput.startsWith("public/")
    ? geojsonOutput
    : join("public/data", `${cityId}.geojson`);
  const outputPath = outlineOutput.startsWith("public/")
    ? outlineOutput
    : join("public/data", `${cityId}-outlines.geojson`);

  const started = performance.now();
  const geojson = JSON.parse(readFileSync(inputPath, "utf8")) as OutlineFeatureCollection;

  const outlines: OutlineFeatureCollection = {
    type: "FeatureCollection",
    features: geojson.features.map((feature) => ({
      type: "Feature",
      properties: {
        code: feature.properties.code,
        name: feature.properties.name,
        kind: feature.properties.kind
      },
      geometry: dissolveWithFallback(feature.geometry)
    }))
  };

  writeFileSync(outputPath, JSON.stringify(outlines));
  const elapsed = performance.now() - started;
  console.log(`Wrote ${outputPath} (${outlines.features.length} features, ${elapsed.toFixed(1)}ms)`);
}