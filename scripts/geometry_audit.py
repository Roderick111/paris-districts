#!/usr/bin/env python3
"""Shared geometry contiguity and quality audits for city GeoJSON builders."""

from __future__ import annotations

import hashlib
import json
from typing import Any

SLIVER_MIN_AREA = 8e-6
SLIVER_MAX_ASPECT = 12.0


def polygon_parts(geometry: dict[str, Any]) -> list[Any]:
    if geometry["type"] == "Polygon":
        return [geometry["coordinates"]]
    return geometry["coordinates"]


def exterior_coords(geometry: dict[str, Any]) -> list[list[float]]:
    coords: list[list[float]] = []
    for poly in polygon_parts(geometry):
        coords.extend(poly[0])
    return coords


def geometry_bbox(geometry: dict[str, Any]) -> tuple[float, float, float, float]:
    coords = exterior_coords(geometry)
    xs = [point[0] for point in coords]
    ys = [point[1] for point in coords]
    return min(xs), min(ys), max(xs), max(ys)


def bbox_area(geometry: dict[str, Any]) -> float:
    minx, miny, maxx, maxy = geometry_bbox(geometry)
    return (maxx - minx) * (maxy - miny)


def merge_shapes_bbox(geometries: list[dict[str, Any]]) -> dict[str, Any]:
    minx = miny = float("inf")
    maxx = maxy = float("-inf")
    for geometry in geometries:
        bx0, by0, bx1, by1 = geometry_bbox(geometry)
        minx = min(minx, bx0)
        miny = min(miny, by0)
        maxx = max(maxx, bx1)
        maxy = max(maxy, by1)
    return {
        "type": "Polygon",
        "coordinates": [[[minx, miny], [maxx, miny], [maxx, maxy], [minx, maxy], [minx, miny]]],
    }


def bbox_aspect_ratio(geometry: dict[str, Any]) -> float:
    minx, miny, maxx, maxy = geometry_bbox(geometry)
    width = max(maxx - minx, 1e-12)
    height = max(maxy - miny, 1e-12)
    return max(width / height, height / width)


def bbox_touch(
    box_a: tuple[float, float, float, float],
    box_b: tuple[float, float, float, float],
    epsilon: float = 1e-5,
) -> bool:
    return not (
        box_a[2] + epsilon < box_b[0]
        or box_b[2] + epsilon < box_a[0]
        or box_a[3] + epsilon < box_b[1]
        or box_b[3] + epsilon < box_a[1]
    )


def point_on_segment(
    point: list[float],
    start: list[float],
    end: list[float],
    epsilon: float = 1e-6,
) -> bool:
    px, py = point
    x1, y1 = start
    x2, y2 = end
    cross = abs((x2 - x1) * (py - y1) - (y2 - y1) * (px - x1))
    if cross > epsilon:
        return False
    dot = (px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)
    if dot < -epsilon:
        return False
    squared = (x2 - x1) ** 2 + (y2 - y1) ** 2
    return dot - squared <= epsilon


def rings_touch(ring_a: list[list[float]], ring_b: list[list[float]], epsilon: float = 1e-6) -> bool:
    for point in ring_a:
        for other in ring_b:
            if abs(point[0] - other[0]) < epsilon and abs(point[1] - other[1]) < epsilon:
                return True
    for index in range(len(ring_a)):
        start_a, end_a = ring_a[index], ring_a[(index + 1) % len(ring_a)]
        for other_index in range(len(ring_b)):
            start_b, end_b = ring_b[other_index], ring_b[(other_index + 1) % len(ring_b)]
            if (
                point_on_segment(start_a, start_b, end_b, epsilon)
                or point_on_segment(end_a, start_b, end_b, epsilon)
                or point_on_segment(start_b, start_a, end_a, epsilon)
                or point_on_segment(end_b, start_a, end_a, epsilon)
            ):
                return True
    return False


def geometries_touch(geometry_a: dict[str, Any], geometry_b: dict[str, Any]) -> bool:
    if not bbox_touch(geometry_bbox(geometry_a), geometry_bbox(geometry_b)):
        return False
    for poly_a in polygon_parts(geometry_a):
        for poly_b in polygon_parts(geometry_b):
            if rings_touch(poly_a[0], poly_b[0]):
                return True
    return False


def is_connected_source_group(names: list[str], shapes: dict[str, dict[str, Any]]) -> bool:
    if len(names) <= 1:
        return True
    stack = [names[0]]
    visited = {names[0]}
    while stack:
        current = stack.pop()
        for name in names:
            if name in visited or name == current:
                continue
            if geometries_touch(shapes[current], shapes[name]):
                visited.add(name)
                stack.append(name)
    return len(visited) == len(names)


def geometry_components(geometry: dict[str, Any]) -> list[dict[str, Any]]:
    return [{"type": "Polygon", "coordinates": poly} for poly in polygon_parts(geometry)]


def components_are_contiguous(components: list[dict[str, Any]]) -> bool:
    if len(components) <= 1:
        return True
    names = [str(index) for index in range(len(components))]
    shapes = {name: components[index] for index, name in enumerate(names)}
    return is_connected_source_group(names, shapes)


def point_in_polygon(point: list[float], ring: list[list[float]]) -> bool:
    x, y = point
    inside = False
    count = len(ring)
    j = count - 1
    for i in range(count):
        xi, yi = ring[i][0], ring[i][1]
        xj, yj = ring[j][0], ring[j][1]
        if ((yi > y) != (yj > y)) and (
            x < (xj - xi) * (y - yi) / (yj - yi + 1e-15) + xi
        ):
            inside = not inside
        j = i
    return inside


def geometry_contains_point(geometry: dict[str, Any], point: list[float]) -> bool:
    return any(point_in_polygon(point, poly[0]) for poly in polygon_parts(geometry))


def geometries_overlap(
    geometry_a: dict[str, Any],
    geometry_b: dict[str, Any],
    *,
    steps: int = 36,
    min_overlap_samples: int = 12,
) -> bool:
    box_a = geometry_bbox(geometry_a)
    box_b = geometry_bbox(geometry_b)
    if not bbox_touch(box_a, box_b):
        return False
    ix0 = max(box_a[0], box_b[0])
    iy0 = max(box_a[1], box_b[1])
    ix1 = min(box_a[2], box_b[2])
    iy1 = min(box_a[3], box_b[3])
    if ix1 <= ix0 or iy1 <= iy0:
        return False
    overlap_samples = 0
    for row in range(steps):
        for col in range(steps):
            x = ix0 + (col + 0.5) * (ix1 - ix0) / steps
            y = iy0 + (row + 0.5) * (iy1 - iy0) / steps
            if geometry_contains_point(geometry_a, [x, y]) and geometry_contains_point(
                geometry_b, [x, y]
            ):
                overlap_samples += 1
                if overlap_samples >= min_overlap_samples:
                    return True
    return False


def geometry_hash(geometry: dict[str, Any]) -> str:
    payload = json.dumps(geometry, sort_keys=True, separators=(",", ":"))
    return hashlib.md5(payload.encode()).hexdigest()[:12]


def audit_source_contiguity(
    code: str,
    names: list[str],
    shapes: dict[str, dict[str, Any]],
    label: str,
) -> None:
    missing = [name for name in names if name not in shapes]
    if missing:
        raise SystemExit(f"Missing {label} polygons for {code}: {missing}")
    if not is_connected_source_group(names, shapes):
        raise SystemExit(f"Disconnected source group for {code}: {names}")


def audit_full_partition(
    assignment: dict[str, str],
    source_units: set[str],
    *,
    city_id: str,
) -> None:
    assigned_units = set(assignment)
    if assigned_units != source_units:
        missing = sorted(source_units - assigned_units)
        extra = sorted(assigned_units - source_units)
        raise SystemExit(
            f"{city_id}: partition mismatch missing={len(missing)} extra={len(extra)} "
            f"(e.g. missing {missing[:3]})"
        )
    by_zone: dict[str, list[str]] = {}
    for unit, zone in assignment.items():
        by_zone.setdefault(zone, []).append(unit)
    seen: dict[str, str] = {}
    for unit, zone in assignment.items():
        if unit in seen and seen[unit] != zone:
            raise SystemExit(f"{city_id}: unit {unit} assigned to multiple zones")
        seen[unit] = zone


def audit_geometry_quality(features: list[dict[str, Any]]) -> None:
    for feature in features:
        code = feature["properties"]["code"]
        geometry = feature["geometry"]
        area = bbox_area(geometry)
        aspect = bbox_aspect_ratio(geometry)
        if area < SLIVER_MIN_AREA and aspect >= SLIVER_MAX_ASPECT:
            raise SystemExit(
                f"Sliver geometry for {code}: area={area:.8f}, aspect={aspect:.2f}",
            )
        geometry_basis = feature["properties"].get("geometryBasis")
        if geometry["type"] == "MultiPolygon" and not feature["properties"].get("allowMultipart"):
            parts = geometry_components(geometry)
            allowed_basis = {"official_quartier_group", "iris_fallback_major_zone"}
            if not components_are_contiguous(parts) and geometry_basis not in allowed_basis:
                raise SystemExit(
                    f"Disconnected MultiPolygon for {code} without allowMultipart",
                )