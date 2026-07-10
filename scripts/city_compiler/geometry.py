"""Polygon merge, coordinate rounding, and bbox helpers."""

from __future__ import annotations

from city_compiler.errors import GeometryError
import sys
from pathlib import Path
from typing import Any

SCRIPTS = Path(__file__).resolve().parents[1]
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))

from geometry_audit import (  # noqa: E402
    bbox_area,
    bbox_aspect_ratio,
    bbox_touch,
    components_are_contiguous,
    geometries_overlap,
    geometries_touch,
    geometry_bbox,
    geometry_components,
    geometry_hash,
    is_connected_source_group,
    polygon_parts,
)


def merge_geometries(geometries: list[dict[str, Any]]) -> dict[str, Any]:
    polygons: list[Any] = []
    for geometry in geometries:
        polygons.extend(polygon_parts(geometry))
    if not polygons:
        raise ValueError("Cannot merge empty geometry list")
    if len(polygons) == 1:
        return {"type": "Polygon", "coordinates": polygons[0]}
    return {"type": "MultiPolygon", "coordinates": polygons}


def round_geometry_coords(geometry: dict[str, Any], precision: int = 6) -> dict[str, Any]:
    def round_nested(coords: Any) -> Any:
        if isinstance(coords[0], (int, float)):
            return [round(coords[0], precision), round(coords[1], precision)]
        return [round_nested(part) for part in coords]

    return {"type": geometry["type"], "coordinates": round_nested(geometry["coordinates"])}


def iter_geometry_points(geometry: dict[str, Any]):
    for polygon in polygon_parts(geometry):
        for ring in polygon:
            for point in ring:
                yield point


def clip_ring_by_lat(ring: list[list[float]], lat_split: float, keep: str) -> list[list[float]]:
    def inside(lat: float) -> bool:
        return lat >= lat_split if keep == "north" else lat < lat_split

    def intersect(p1: list[float], p2: list[float]) -> list[float]:
        x1, y1 = p1
        x2, y2 = p2
        if abs(y2 - y1) < 1e-12:
            return [x1, lat_split]
        ratio = (lat_split - y1) / (y2 - y1)
        return [x1 + ratio * (x2 - x1), lat_split]

    output: list[list[float]] = []
    if not ring:
        return output
    previous = ring[-1]
    for current in ring:
        previous_inside = inside(previous[1])
        current_inside = inside(current[1])
        if current_inside:
            if not previous_inside:
                output.append(intersect(previous, current))
            output.append(current)
        elif previous_inside:
            output.append(intersect(previous, current))
        previous = current
    return output


def split_geometry_by_lat(geometry: dict[str, Any], lat_split: float, keep: str) -> dict[str, Any]:
    kept: list[Any] = []
    for poly in polygon_parts(geometry):
        outer = clip_ring_by_lat(poly[0], lat_split, keep)
        if len(outer) >= 4:
            kept.append([outer, *poly[1:]])
    if not kept:
        raise ValueError(f"No geometry kept for {keep} split at latitude {lat_split}")
    if len(kept) == 1:
        return {"type": "Polygon", "coordinates": kept[0]}
    return {"type": "MultiPolygon", "coordinates": kept}


def validate_lon_lat(geometry: dict[str, Any], code: str) -> None:
    for point in iter_geometry_points(geometry):
        lon, lat = point[:2]
        if lon < -180 or lon > 180 or lat < -90 or lat > 90:
            raise GeometryError(f"Invalid lon/lat coordinate for {code}: {point[:2]}")