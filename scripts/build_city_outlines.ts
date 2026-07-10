import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { FeatureCollection, Geometry } from "geojson";
import { dissolveGeometry } from "../src/lib/geometryOutline";

type OutlineFeatureCollection = FeatureCollection<
  Geometry,
  { code: string; name: string; kind: string }
>;

function outlineCitiesFromConfigs(): string[] {
  const configDir = join("scripts", "city_configs");
  return readdirSync(configDir)
    .filter((file) => file.endsWith(".json"))
    .flatMap((file) => {
      const raw = JSON.parse(readFileSync(join(configDir, file), "utf8")) as {
        outlineOutput?: string;
      };
      return raw.outlineOutput ? [file.replace(/\.json$/, "")] : [];
    })
    .sort();
}

const cities = process.argv.slice(2);
const targets = cities.length > 0 ? cities : outlineCitiesFromConfigs();
if (targets.length === 0) {
  console.error("No cities with outlineOutput configured.");
  process.exit(1);
}

for (const city of targets) {
  const inputPath = join("public/data", `${city}.geojson`);
  const outputPath = join("public/data", `${city}-outlines.geojson`);

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
      geometry: dissolveGeometry(feature.geometry)
    }))
  };

  writeFileSync(outputPath, JSON.stringify(outlines));
  const elapsed = performance.now() - started;
  console.log(`Wrote ${outputPath} (${outlines.features.length} features, ${elapsed.toFixed(1)}ms)`);
}