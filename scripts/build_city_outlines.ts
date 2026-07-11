import { randomUUID } from "crypto";
import { mkdirSync, readFileSync, readdirSync, renameSync, unlinkSync, writeFileSync } from "fs";
import { dirname, join } from "path";
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

function writeJsonAtomic(path: string, value: unknown) {
  mkdirSync(dirname(path), { recursive: true });
  const tempPath = `${path}.${randomUUID()}.tmp`;
  try {
    writeFileSync(tempPath, JSON.stringify(value));
    renameSync(tempPath, path);
  } catch (error) {
    try {
      unlinkSync(tempPath);
    } catch {
      // Preserve the original write error.
    }
    throw error;
  }
}

export function main(argv = process.argv.slice(2)): number {
  if (argv[0] === "-h" || argv[0] === "--help") {
    console.log("Usage: bun scripts/build_city_outlines.ts [city ...]");
    return 0;
  }

  const requested = argv;
  const targets = requested.length > 0
    ? outlineCitiesFromConfigs().filter((entry) => requested.includes(entry.cityId))
    : outlineCitiesFromConfigs();

  if (targets.length === 0) {
    console.error("No cities with outlineOutput configured.");
    return 1;
  }

  try {
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

      writeJsonAtomic(outputPath, outlines);
      const elapsed = performance.now() - started;
      console.log(`Wrote ${outputPath} (${outlines.features.length} features, ${elapsed.toFixed(1)}ms)`);
    }
    return 0;
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
}

if (import.meta.main) {
  process.exitCode = main();
}
