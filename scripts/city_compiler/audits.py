"""Shared geometry and parity audits."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from city_compiler.geometry import (
    bbox_area,
    components_are_contiguous,
    geometry_components,
    geometry_hash,
    geometries_touch,
    is_connected_source_group,
    polygon_parts,
)
from city_compiler.places import load_score_tuples
from city_compiler.schema import CityConfig, Zone

ROOT = Path(__file__).resolve().parents[2]
COVERAGE_SCOPES = ROOT / "scripts" / "city_coverage_scopes.json"

ALLOW_MULTIPART_ROLES = {"context", "low_relevance"}
WARN_ZONE_COUNT = 30
WARN_CONTEXT_RATIO = 0.4
WARN_SAME_SCORE_COUNT = 5
WARN_SOURCE_UNIT_COUNT = 8
WARN_OUTLINE_PARTS = 8
OVERSIZED_BBOX_AREA = 0.012
OVERSIZED_PART_COUNT = 10

LILLE_OBSOLETE_CODES = {
    "lille-croix-centre-saint-martin",
    "lille-croix-saint-pierre-mackellerie",
    "lille-croix-canal-planche-epinoy",
    "lille-croix-beaumont-barbieux-edhec",
    "lille-roubaix-centre",
    "lille-roubaix-epeule-fresnoy-mackellerie",
    "lille-roubaix-alma-gare",
    "lille-roubaix-pile-trois-ponts",
    "lille-roubaix-moulin-potennerie",
    "lille-roubaix-union-entrepont-context",
    "lille-tourcoing-blanc-seau-gambetta",
    "lille-tourcoing-brun-pain-francs",
    "lille-tourcoing-phalempins-belencontre-orions",
    "lille-tourcoing-bourgogne-pont-rompu",
    "lille-tourcoing-virolois-croix-rouge-marliere",
    "lille-tourcoing-union-edge-context",
}

LILLE_EAST_PREFIXES = ("lille-croix-", "lille-roubaix-", "lille-tourcoing-")


def dissolved_component_count(geometry: dict[str, Any]) -> int:
    parts = geometry_components(geometry)
    if len(parts) <= 1:
        return 1
    remaining = list(range(len(parts)))
    groups: list[list[int]] = []
    while remaining:
        seed = remaining.pop(0)
        group = [seed]
        stack = [seed]
        while stack:
            current = stack.pop()
            for candidate in list(remaining):
                if geometries_touch(parts[current], parts[candidate]):
                    remaining.remove(candidate)
                    group.append(candidate)
                    stack.append(candidate)
        groups.append(group)
    return len(groups)


def audit_build_output(
    config: CityConfig,
    features: list[dict[str, Any]],
    score_codes: set[str],
    layers: dict[str, Any],
) -> None:
    _audit_parity(features, score_codes)
    _audit_duplicates(features)
    _audit_lon_lat(features)
    _audit_source_assignment(config, layers)
    _audit_zone_contiguity(config, features)
    _audit_allow_multipart(config, features)
    _audit_warnings(config, features, score_codes)
    _audit_city_specific(config, features, score_codes)


def _audit_parity(features: list[dict[str, Any]], score_codes: set[str]) -> None:
    feature_codes = {feature["properties"]["code"] for feature in features}
    missing = sorted(score_codes - feature_codes)
    extra = sorted(feature_codes - score_codes)
    if missing:
        raise SystemExit(f"PlaceScore code without geometry: {missing}")
    if extra:
        raise SystemExit(f"geometry without PlaceScore code: {extra}")


def _audit_duplicates(features: list[dict[str, Any]]) -> None:
    codes = [feature["properties"]["code"] for feature in features]
    duplicates = sorted({code for code in codes if codes.count(code) > 1})
    if duplicates:
        raise SystemExit(f"duplicate feature code: {duplicates}")
    hash_map: dict[str, list[str]] = {}
    for feature in features:
        code = feature["properties"]["code"]
        geometry = feature["geometry"]
        if geometry.get("type") not in {"Polygon", "MultiPolygon"} or not polygon_parts(geometry):
            raise SystemExit(f"Invalid or empty geometry for {code}")
        digest = geometry_hash(geometry)
        hash_map.setdefault(digest, []).append(code)
    duplicate_hashes = {digest: values for digest, values in hash_map.items() if len(values) > 1}
    if duplicate_hashes:
        for digest, values in duplicate_hashes.items():
            print(f"Identical geometry hash {digest}: {values}")
        raise SystemExit("duplicate geometry hash across scored features")


def _audit_lon_lat(features: list[dict[str, Any]]) -> None:
    for feature in features:
        code = feature["properties"]["code"]
        for polygon in polygon_parts(feature["geometry"]):
            for ring in polygon:
                for lon, lat in ring:
                    if lon < -180 or lon > 180 or lat < -90 or lat > 90:
                        raise SystemExit(f"invalid lon/lat for {code}: {(lon, lat)}")


def _audit_source_assignment(config: CityConfig, layers: dict[str, Any]) -> None:
    assigned: dict[tuple[str, str], str] = {}
    for zone in config.zones:
        for unit in zone.source_units:
            if unit.source == "geo_api_commune":
                continue
            layer = layers.get(unit.source)
            if layer is None:
                raise SystemExit(f"missing source layer {unit.source} for zone {zone.code}")
            geometry = layer.lookup(unit.name)
            if geometry is None:
                raise SystemExit(f"missing source unit {unit.source}/{unit.name} for zone {zone.code}")
            split_key = (
                unit.lat_split.get("keep"),
                unit.lat_split.get("latitude"),
            ) if unit.lat_split else None
            key = (unit.source, unit.name, split_key)
            if key in assigned and assigned[key] != zone.code:
                raise SystemExit(
                    f"source unit {unit.source}/{unit.name} assigned to both "
                    f"{assigned[key]} and {zone.code}"
                )
            assigned[key] = zone.code

    scope = config.scope
    full_coverage_sources = scope.get("fullCoverageSources", [])
    for source_id in full_coverage_sources:
        layer = layers.get(source_id)
        if layer is None or not layer.official_unit_names:
            continue
        covered = {
            name
            for (src, name, _split), _zone in assigned.items()
            if src == source_id
        }
        exempt = set(scope.get("exemptUnits", {}).get(source_id, []))
        unassigned = sorted(layer.official_unit_names - covered - exempt)
        if unassigned:
            raise SystemExit(
                f"{config.city_id}: unassigned official units in {source_id} "
                f"({len(unassigned)}): {unassigned[:8]}"
            )


def _zone_by_code(config: CityConfig) -> dict[str, Zone]:
    return {zone.code: zone for zone in config.zones}


def _audit_zone_contiguity(config: CityConfig, features: list[dict[str, Any]]) -> None:
    zones = _zone_by_code(config)
    for feature in features:
        code = feature["properties"]["code"]
        zone = zones.get(code)
        if zone is None:
            continue
        role = zone.coverage_role or "primary"
        if role in ALLOW_MULTIPART_ROLES:
            continue
        geometry = feature["geometry"]
        if geometry.get("type") == "MultiPolygon" and not zone.allow_multipart:
            parts = geometry_components(geometry)
            allowed_basis = {"official_quartier_group", "iris_fallback_major_zone"}
            basis = zone.geometry_basis or ""
            if not components_are_contiguous(parts) and basis not in allowed_basis:
                raise SystemExit(f"Disconnected MultiPolygon for {code} without allowMultipart")
        dissolved = dissolved_component_count(geometry)
        basis = zone.geometry_basis or ""
        allow_disconnected = basis in {
            "official_quartier_group",
            "iris_fallback_major_zone",
            "iris_major_zone_partition",
        }
        if (
            role in {"primary", "campus", "risk_cap"}
            and dissolved > 1
            and not zone.allow_multipart
            and not allow_disconnected
        ):
            raise SystemExit(f"disconnected {role} zone {code} ({dissolved} components)")


def _audit_allow_multipart(config: CityConfig, features: list[dict[str, Any]]) -> None:
    zones = _zone_by_code(config)
    for feature in features:
        if not feature["properties"].get("allowMultipart"):
            continue
        code = feature["properties"]["code"]
        zone = zones.get(code, Zone(code=code, source_units=[]))
        role = zone.coverage_role or "?"
        justification = zone.multipart_justification or feature["properties"].get("multipartJustification")
        if role not in ALLOW_MULTIPART_ROLES:
            raise SystemExit(
                f"{config.city_id}: allowMultipart on {role} zone {code} "
                "(only context/low_relevance permitted)"
            )
        if not justification:
            raise SystemExit(f"{config.city_id}: allowMultipart on {code} requires multipartJustification")


def _audit_warnings(config: CityConfig, features: list[dict[str, Any]], score_codes: set[str]) -> None:
    zones = config.zones
    if len(zones) > WARN_ZONE_COUNT:
        print(f"warn: {config.city_id} has {len(zones)} zones (>{WARN_ZONE_COUNT})")
    context_count = sum(1 for zone in zones if zone.coverage_role in {"context", "low_relevance"})
    if zones and context_count / len(zones) > WARN_CONTEXT_RATIO:
        print(
            f"warn: {config.city_id} context zones are {context_count}/{len(zones)} "
            f"(>{int(WARN_CONTEXT_RATIO * 100)}%)"
        )
    tuples = load_score_tuples(config.places_file, section=config.places_section)
    by_tuple: dict[tuple[float, ...], list[str]] = {}
    for code, values in tuples.items():
        by_tuple.setdefault(values, []).append(code)
    for values, codes in by_tuple.items():
        if len(codes) > WARN_SAME_SCORE_COUNT:
            print(f"warn: {config.city_id} {len(codes)} zones share score tuple {values}: {codes[:4]}...")
    zones_by_code = _zone_by_code(config)
    for feature in features:
        code = feature["properties"]["code"]
        zone = zones_by_code.get(code)
        if zone and len(zone.source_units) > WARN_SOURCE_UNIT_COUNT:
            print(f"warn: {code} has {len(zone.source_units)} source units (>{WARN_SOURCE_UNIT_COUNT})")
        geometry = feature["geometry"]
        raw_parts = len(geometry["coordinates"]) if geometry.get("type") == "MultiPolygon" else 1
        dissolved = dissolved_component_count(geometry)
        role = zone.coverage_role if zone else "?"
        if role not in ALLOW_MULTIPART_ROLES:
            area = bbox_area(geometry)
            if (
                area > OVERSIZED_BBOX_AREA
                or raw_parts > OVERSIZED_PART_COUNT
                or dissolved > 2
            ):
                print(
                    f"visualRisk: {config.city_id} {code} likely jagged outline "
                    f"(bbox={area:.5f}, rawParts={raw_parts}, dissolved={dissolved})"
                )
        if raw_parts > WARN_OUTLINE_PARTS:
            print(f"visualRisk: {code} has {raw_parts} polygon parts (selection outline may be jagged)")
        basis = zone.geometry_basis if zone else None
        if basis == "iris_fallback_major_zone" and zone and any(
            unit.source.endswith("_quartiers") or "quartier" in unit.source for unit in zone.source_units
        ):
            print(f"visualRisk: {code} mixes IRIS fallback with official quartier sources")


def _audit_city_specific(
    config: CityConfig,
    features: list[dict[str, Any]],
    score_codes: set[str],
) -> None:
    city_id = config.city_id
    feature_codes = {feature["properties"]["code"] for feature in features}
    if city_id == "lille":
        stale = sorted(feature_codes & LILLE_OBSOLETE_CODES)
        if stale:
            raise SystemExit(f"lille: obsolete codes in geojson: {stale}")
        zones = _zone_by_code(config)
        for feature in features:
            code = feature["properties"]["code"]
            zone = zones.get(code)
            if zone is None:
                continue
            dissolved = dissolved_component_count(feature["geometry"])
            role = zone.coverage_role or "?"
            source_count = len(zone.source_units)
            if code.startswith(LILLE_EAST_PREFIXES) and role not in {"context", "low_relevance"}:
                if source_count > WARN_SOURCE_UNIT_COUNT:
                    print(f"warn: {code} east major zone has {source_count} source IRIS")
            if role == "primary" and dissolved > 1:
                raise SystemExit(f"lille: disconnected primary zone {code}")
            if role == "campus" and dissolved > 1 and source_count > 6:
                raise SystemExit(f"lille: campus zone {code} spans multiple clusters")