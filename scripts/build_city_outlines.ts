import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { FeatureCollection, Geometry } from "geojson";
import { dissolveGeometry } from "../src/lib/geometryOutline";

type OutlineFeatureCollection = FeatureCollection<
  Geometry,
  { code: string; name: string; kind: string }
>;

const cities = process.argv.slice(2);
if (cities.length === 0) {
  console.error("Usage: bun scripts/build_city_outlines.ts <city> [city...]");
  process.exit(1);
}

for (const city of cities) {
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