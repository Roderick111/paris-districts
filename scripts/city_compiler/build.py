"""Build orchestration: resolve zones, merge geometry, write output."""

from __future__ import annotations

from city_compiler.errors import GeometryError
from typing import Any

from city_compiler.audits import audit_build_output
from city_compiler.geometry import (
    merge_geometries,
    round_geometry_coords,
    split_geometry_by_lat,
    validate_lon_lat,
)
from geometry_audit import is_connected_source_group
from city_compiler.outputs import write_feature_collection
from city_compiler.places import load_place_meta
from city_compiler.schema import CityConfig, Zone
from city_compiler.sources import load_all_sources, resolve_commune_geometry


def resolve_zone_geometry(
    zone: Zone,
    layers: dict[str, Any],
) -> dict[str, Any]:
    if zone.commune_insee:
        return resolve_commune_geometry(zone.commune_insee)
    shapes: dict[str, dict[str, Any]] = {}
    names: list[str] = []
    for unit in zone.source_units:
        if unit.source == "geo_api_commune":
            geometry = resolve_commune_geometry(unit.name)
            shapes[unit.name] = geometry
            names.append(unit.name)
            continue
        layer = layers[unit.source]
        geometry = layer.lookup(unit.name)
        if geometry is None:
            raise GeometryError(f"Missing source unit {unit.source}/{unit.name} for {zone.code}")
        if unit.lat_split:
            geometry = split_geometry_by_lat(
                geometry,
                float(unit.lat_split["latitude"]),
                unit.lat_split["keep"],
            )
        shapes[unit.name] = geometry
        names.append(unit.name)
    if not names:
        raise GeometryError(f"Zone {zone.code} resolved zero source units")
    role = zone.coverage_role or "primary"
    basis = zone.geometry_basis or ""
    check_contiguity = (
        not zone.allow_multipart
        and role not in {"low_relevance"}
    )
    if check_contiguity and len(names) > 1:
        if not is_connected_source_group(names, shapes):
            raise GeometryError(f"Disconnected source group for {zone.code}: {names}")
    geometries = [shapes[name] for name in names]
    geometry = merge_geometries(geometries)
    validate_lon_lat(geometry, zone.code)
    return geometry


def build_features(
    config: CityConfig,
    layers: dict[str, Any],
    meta: dict[str, dict[str, str]],
) -> list[dict[str, Any]]:
    features: list[dict[str, Any]] = []
    for zone in config.zones:
        if zone.code not in meta:
            raise GeometryError(f"Missing PlaceScore row for geometry code {zone.code}")
        geometry = round_geometry_coords(resolve_zone_geometry(zone, layers))
        properties: dict[str, Any] = {
            "code": zone.code,
            "name": meta[zone.code]["name"],
            "kind": zone.kind or "quartier",
        }
        if zone.geometry_basis:
            properties["geometryBasis"] = zone.geometry_basis
        if zone.allow_multipart:
            properties["allowMultipart"] = True
        if zone.multipart_justification:
            properties["multipartJustification"] = zone.multipart_justification
        features.append({"type": "Feature", "geometry": geometry, "properties": properties})
    return features


def build_city(config: CityConfig) -> None:
    layers = load_all_sources(config.sources)
    meta = load_place_meta(config.places_file)
    features = build_features(config, layers, meta)
    score_codes = set(meta)
    excluded = set(config.scope.get("excludedPlaceCodes", []))
    audit_build_output(config, features, score_codes - excluded, layers)
    write_feature_collection(features, config.geojson_output)
    print(f"{config.city_id}: wrote {len(features)} features to {config.geojson_output}")
