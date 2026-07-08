import { featureCollection, polygon } from "@turf/helpers";
import union from "@turf/union";
import type { Feature, Geometry, MultiPolygon, Polygon } from "geojson";

/** Dissolve touching parts so selection draws one outer ring, not internal MultiPolygon seams. */
export function dissolveGeometry(geometry: Geometry): Geometry {
  if (geometry.type === "Polygon") {
    return geometry;
  }

  if (geometry.type !== "MultiPolygon" || geometry.coordinates.length === 0) {
    return geometry;
  }

  let merged: Feature<Polygon | MultiPolygon> = polygon(geometry.coordinates[0]);

  for (let index = 1; index < geometry.coordinates.length; index += 1) {
    const next = polygon(geometry.coordinates[index]);
    const result = union(featureCollection([merged, next]));
    if (result) {
      merged = result;
    }
  }

  return merged.geometry;
}