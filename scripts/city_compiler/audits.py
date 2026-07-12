"""Shared geometry and parity audits."""

from __future__ import annotations

from city_compiler.errors import GeometryError, ValidationError
import json
import re
from typing import Any

from city_compiler.geometry import polygon_parts
from geometry_audit import (
    bbox_area,
    components_are_contiguous,
    geometries_overlap,
    geometries_touch,
    geometry_components,
    geometry_hash,
    is_connected_source_group,
)
from city_compiler.places import load_place_caveats, load_place_meta, load_score_tuples
from city_compiler.schema import CityConfig, Zone
from city_compiler.sources import resolve_commune_geometry


ALLOW_MULTIPART_ROLES = {"low_relevance", "context", "campus", "risk_cap"}
ALLOW_LOOSE_GROUP_ROLES = {"low_relevance"}
FATAL_VISUAL_RISK_ROLES = {"primary", "campus", "risk_cap"}
OFFICIAL_MULTIPART_BASES = {
    "official_quartier",
    "official_quartier_group",
    "commune",
    "commune_context",
    "iris_fallback_major_zone",
}
WARN_ZONE_COUNT = 30
WARN_CONTEXT_RATIO = 0.4
WARN_SAME_SCORE_COUNT = 5
WARN_SOURCE_UNIT_COUNT = 6
WARN_BROAD_NAME_SOURCE_COUNT = 4
WARN_OUTLINE_PARTS = 8
OVERSIZED_BBOX_AREA = 0.012
OVERSIZED_PART_COUNT = 10

FORBIDDEN_CAVEAT_CHECKS: list[tuple[str, re.Pattern[str]]] = [
    ("IRIS", re.compile(r"\bIRIS\b", re.I)),
    ("confidence", re.compile(r"\bconfidence\b", re.I)),
    ("source", re.compile(r"\bsource\b", re.I)),
    ("boundary", re.compile(r"\bboundary\b", re.I)),
    ("official", re.compile(r"\bofficial\b", re.I)),
    (
        "polygon",
        re.compile(
            r"\b(?:adjacent|contiguous|commune|official|IRIS|geometry|neighborhood)\b[^.]{0,48}\bpolygon\b"
            r"|\bpolygon\b[^.]{0,48}\b(?:until|boundary|commune|IRIS|exist|geometry)\b",
            re.I,
        ),
    ),
]

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

MONTPELLIER_LABEL_TOKENS: list[tuple[str, tuple[str, ...]]] = [
    ("beaux-arts", ("Beaux-Arts",)),
    ("boutonnet", ("Boutonnet",)),
    ("comedie", ("Comédie",)),

    ("richter", ("Oxford", "Le Mail Nord", "Le Mail Sud", "Les Tours")),
    ("antigone", ("Nombre d'Or", "Place de l'Europe", "Rives du Lez")),
    ("port-marianne", ("Millénaire", "Odysseum", "Eureka", "Grammont")),
    ("millenaire", ("Millénaire",)),
    ("odysseum", ("Odysseum",)),
    ("triolet", ("École d'Architecture-Triolet", "Triolet")),
    ("saint-eloi", ("Saint-Éloi",)),
    ("paul-valery", ("École Normale", "Archives Départementales")),
    ("mosson", ("Le Petit Bard", "Alco", "Les Tonnelles")),
    ("paillade", ("Le Petit Bard", "Alco")),
    ("celleneuve", ("Celleneuve",)),
    ("ovalie", ("Ovalie",)),
    ("euromedecine", ("Euromédecine",)),
    ("agropolis", ("Agropolis",)),
]
MONTPELLIER_FATAL_SOURCE_UNIT_COUNT = 6
MONTPELLIER_FATAL_RAW_PART_COUNT = 6


def source_unit_clusters(names: list[str], shapes: dict[str, dict[str, Any]]) -> list[list[str]]:
    remaining = list(names)
    clusters: list[list[str]] = []
    while remaining:
        seed = remaining.pop(0)
        cluster = [seed]
        stack = [seed]
        while stack:
            current = stack.pop()
            for candidate in list(remaining):
                if geometries_touch(shapes[current], shapes[candidate]):
                    remaining.remove(candidate)
                    cluster.append(candidate)
                    stack.append(candidate)
        clusters.append(sorted(cluster))
    return clusters


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
    _audit_zone_metadata(config)
    _audit_coverage_scope(config)
    _audit_outline_requirement(config, features)
    _audit_parity(features, score_codes)
    _audit_duplicates(features)
    _audit_lon_lat(features)
    _audit_source_assignment(config, layers)
    _audit_source_contiguity(config, layers)
    _audit_zone_contiguity(config, features)
    _audit_feature_overlap(config, features)
    _audit_visual_risk(config, features)
    _audit_allow_multipart(config, features)
    _audit_warnings(config, features, score_codes)
    _audit_city_specific(config, features, score_codes)
    _audit_user_facing_caveats(config)


def _audit_zone_metadata(config: CityConfig) -> None:
    if config.scope.get("coverageMode") == "curated_subset":
        return
    if not config.scope.get("fullCoverageSources"):
        return
    for zone in config.zones:
        if not zone.coverage_role:
            raise ValidationError(
                f"{config.city_id}: zone {zone.code} missing coverageRole "
                "(required when fullCoverageSources is set)"
            )
        if not zone.geometry_basis:
            raise ValidationError(
                f"{config.city_id}: zone {zone.code} missing geometryBasis "
                "(required when fullCoverageSources is set)"
            )


def _audit_coverage_scope(config: CityConfig) -> None:
    mode = config.scope.get("coverageMode")
    if mode != "full_partition":
        return
    insee_codes = config.scope.get("inseeCodes", [])
    if insee_codes and not config.scope.get("fullCoverageSources"):
        raise ValidationError(
            f"{config.city_id}: scope declares full_partition coverage with inseeCodes "
            "but fullCoverageSources is missing"
        )


def _audit_outline_requirement(config: CityConfig, features: list[dict[str, Any]]) -> None:
    if config.outline_output is not None:
        return
    for feature in features:
        geometry = feature["geometry"]
        raw_parts = len(geometry["coordinates"]) if geometry.get("type") == "MultiPolygon" else 1
        if raw_parts > 1:
            code = feature["properties"]["code"]
            raise ValidationError(
                f"{config.city_id}: zone {code} has {raw_parts} raw polygon parts "
                f"but outlineOutput is not configured"
            )


def _audit_parity(features: list[dict[str, Any]], score_codes: set[str]) -> None:
    feature_codes = {feature["properties"]["code"] for feature in features}
    missing = sorted(score_codes - feature_codes)
    extra = sorted(feature_codes - score_codes)
    if missing:
        raise ValidationError(f"PlaceScore code without geometry: {missing}")
    if extra:
        raise ValidationError(f"geometry without PlaceScore code: {extra}")


def _audit_duplicates(features: list[dict[str, Any]]) -> None:
    codes = [feature["properties"]["code"] for feature in features]
    duplicates = sorted({code for code in codes if codes.count(code) > 1})
    if duplicates:
        raise ValidationError(f"duplicate feature code: {duplicates}")
    hash_map: dict[str, list[str]] = {}
    for feature in features:
        code = feature["properties"]["code"]
        geometry = feature["geometry"]
        if geometry.get("type") not in {"Polygon", "MultiPolygon"} or not polygon_parts(geometry):
            raise ValidationError(f"Invalid or empty geometry for {code}")
        digest = geometry_hash(geometry)
        hash_map.setdefault(digest, []).append(code)
    duplicate_hashes = {digest: values for digest, values in hash_map.items() if len(values) > 1}
    if duplicate_hashes:
        for digest, values in duplicate_hashes.items():
            print(f"Identical geometry hash {digest}: {values}")
        raise ValidationError("duplicate geometry hash across scored features")


def _audit_lon_lat(features: list[dict[str, Any]]) -> None:
    for feature in features:
        code = feature["properties"]["code"]
        for polygon in polygon_parts(feature["geometry"]):
            for ring in polygon:
                for lon, lat in ring:
                    if lon < -180 or lon > 180 or lat < -90 or lat > 90:
                        raise ValidationError(f"invalid lon/lat for {code}: {(lon, lat)}")


def _audit_source_assignment(config: CityConfig, layers: dict[str, Any]) -> None:
    assigned: dict[tuple[str, str], str] = {}
    for zone in config.zones:
        for unit in zone.source_units:
            if unit.source == "geo_api_commune":
                continue
            layer = layers.get(unit.source)
            if layer is None:
                raise ValidationError(f"missing source layer {unit.source} for zone {zone.code}")
            geometry = layer.lookup(unit.name)
            if geometry is None:
                raise ValidationError(f"missing source unit {unit.source}/{unit.name} for zone {zone.code}")
            split_key = (
                unit.lat_split.get("keep"),
                unit.lat_split.get("latitude"),
            ) if unit.lat_split else None
            key = (unit.source, unit.name, split_key)
            if key in assigned and assigned[key] != zone.code:
                raise ValidationError(
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
            raise ValidationError(
                f"{config.city_id}: unassigned official units in {source_id} "
                f"({len(unassigned)}): {unassigned[:8]}"
            )


def _zone_by_code(config: CityConfig) -> dict[str, Zone]:
    return {zone.code: zone for zone in config.zones}


def _is_unavoidable_official_multipart(zone: Zone) -> bool:
    basis = zone.geometry_basis or ""
    return basis in OFFICIAL_MULTIPART_BASES and len(zone.source_units) == 1


def _audit_source_contiguity(config: CityConfig, layers: dict[str, Any]) -> None:
    for zone in config.zones:
        role = zone.coverage_role or "primary"
        if role in ALLOW_LOOSE_GROUP_ROLES or zone.allow_multipart:
            continue
        shapes: dict[str, dict[str, Any]] = {}
        names: list[str] = []
        for unit in zone.source_units:
            if unit.source == "geo_api_commune":
                shapes[unit.name] = resolve_commune_geometry(unit.name)
                names.append(unit.name)
                continue
            layer = layers.get(unit.source)
            if layer is None:
                continue
            geometry = layer.lookup(unit.name)
            if geometry is None:
                continue
            shapes[unit.name] = geometry
            names.append(unit.name)
        if len(names) <= 1:
            continue
        if not is_connected_source_group(names, shapes):
            clusters = source_unit_clusters(names, shapes)
            print(f"{config.city_id}: disconnected source group {zone.code} ({len(clusters)} clusters):")
            for index, cluster in enumerate(clusters, start=1):
                print(f"  cluster {index}: {cluster}")
            raise ValidationError(f"Disconnected source group for {zone.code}: {names}")


def _audit_feature_overlap(config: CityConfig, features: list[dict[str, Any]]) -> None:
    exempt_pairs = {
        tuple(sorted(pair))
        for pair in config.scope.get("overlapExemptions", [])
    }
    for left_index, left in enumerate(features):
        left_code = left["properties"]["code"]
        for right in features[left_index + 1 :]:
            right_code = right["properties"]["code"]
            pair = tuple(sorted((left_code, right_code)))
            if pair in exempt_pairs:
                continue
            if geometries_overlap(left["geometry"], right["geometry"]):
                raise ValidationError(
                    f"{config.city_id}: displayed zones overlap: {left_code} vs {right_code}"
                )


def _audit_visual_risk(config: CityConfig, features: list[dict[str, Any]]) -> None:
    zones = _zone_by_code(config)
    for feature in features:
        code = feature["properties"]["code"]
        zone = zones.get(code)
        if zone is None:
            continue
        role = zone.coverage_role or "primary"
        if role not in FATAL_VISUAL_RISK_ROLES:
            continue
        geometry = feature["geometry"]
        raw_parts = len(geometry["coordinates"]) if geometry.get("type") == "MultiPolygon" else 1
        dissolved = dissolved_component_count(geometry)
        area = bbox_area(geometry)
        multipart_ok = zone.allow_multipart and (
            role in ALLOW_MULTIPART_ROLES or _is_unavoidable_official_multipart(zone)
        )
        if dissolved > 1 and not multipart_ok:
            raise ValidationError(
                f"visualRisk: {config.city_id} {code} has {dissolved} disconnected components"
            )
        if raw_parts > OVERSIZED_PART_COUNT and not multipart_ok:
            raise ValidationError(
                f"visualRisk: {config.city_id} {code} has {raw_parts} raw polygon parts"
            )
        if area > OVERSIZED_BBOX_AREA:
            raise ValidationError(
                f"visualRisk: {config.city_id} {code} bbox area {area:.5f} exceeds "
                f"{OVERSIZED_BBOX_AREA}"
            )


def _audit_zone_contiguity(config: CityConfig, features: list[dict[str, Any]]) -> None:
    zones = _zone_by_code(config)
    for feature in features:
        code = feature["properties"]["code"]
        zone = zones.get(code)
        if zone is None:
            continue
        role = zone.coverage_role or "primary"
        geometry = feature["geometry"]
        multipart_ok = zone.allow_multipart and (
            role in ALLOW_MULTIPART_ROLES or _is_unavoidable_official_multipart(zone)
        )
        if geometry.get("type") == "MultiPolygon" and not multipart_ok:
            parts = geometry_components(geometry)
            if not components_are_contiguous(parts):
                raise ValidationError(f"Disconnected MultiPolygon for {code} without allowMultipart")
        if role == "low_relevance":
            continue
        dissolved = dissolved_component_count(geometry)
        if dissolved > 1 and not multipart_ok:
            raise ValidationError(f"disconnected {role} zone {code} ({dissolved} components)")


def _audit_allow_multipart(config: CityConfig, features: list[dict[str, Any]]) -> None:
    zones = _zone_by_code(config)
    for feature in features:
        if not feature["properties"].get("allowMultipart"):
            continue
        code = feature["properties"]["code"]
        zone = zones.get(code, Zone(code=code, source_units=[]))
        role = zone.coverage_role or "?"
        justification = zone.multipart_justification or feature["properties"].get("multipartJustification")
        if role not in ALLOW_MULTIPART_ROLES and not _is_unavoidable_official_multipart(zone):
            raise ValidationError(
                f"{config.city_id}: allowMultipart on {role} zone {code} "
                "(only low_relevance or unavoidable official geography permitted)"
            )
        if not justification:
            raise ValidationError(f"{config.city_id}: allowMultipart on {code} requires multipartJustification")


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
    tuples = load_score_tuples(config.places_file)
    by_tuple: dict[tuple[float, ...], list[str]] = {}
    for code, values in tuples.items():
        by_tuple.setdefault(values, []).append(code)
    for values, codes in by_tuple.items():
        if len(codes) > WARN_SAME_SCORE_COUNT:
            print(f"warn: {config.city_id} {len(codes)} zones share score tuple {values}: {codes[:4]}...")
    place_meta = load_place_meta(config.places_file)
    zones_by_code = _zone_by_code(config)
    for feature in features:
        code = feature["properties"]["code"]
        zone = zones_by_code.get(code)
        if zone:
            role = zone.coverage_role or "primary"
            source_count = len(zone.source_units)
            if role != "low_relevance" and source_count > WARN_SOURCE_UNIT_COUNT:
                print(f"warn: {code} has {source_count} source units (>{WARN_SOURCE_UNIT_COUNT})")
            display_name = place_meta.get(code, {}).get("name", "")
            if "/" in display_name and source_count > WARN_BROAD_NAME_SOURCE_COUNT:
                print(
                    f"warn: {code} name {display_name!r} spans {source_count} source units "
                    f"(>{WARN_BROAD_NAME_SOURCE_COUNT}); zone may be over-broad"
                )
        geometry = feature["geometry"]
        raw_parts = len(geometry["coordinates"]) if geometry.get("type") == "MultiPolygon" else 1
        dissolved = dissolved_component_count(geometry)
        if raw_parts > WARN_OUTLINE_PARTS:
            print(f"visualRisk: {code} has {raw_parts} polygon parts (selection outline may be jagged)")
        basis = zone.geometry_basis if zone else None
        if basis == "iris_fallback_major_zone" and zone and any(
            unit.source.endswith("_quartiers") or "quartier" in unit.source for unit in zone.source_units
        ):
            print(f"visualRisk: {code} mixes IRIS fallback with official quartier sources")


def _audit_user_facing_caveats(config: CityConfig) -> None:
    caveats = load_place_caveats(config.places_file)
    for code, caveat in caveats.items():
        for term, pattern in FORBIDDEN_CAVEAT_CHECKS:
            if pattern.search(caveat):
                raise ValidationError(
                    f"{config.city_id}: user-facing caveat for {code} contains "
                    f'internal provenance term "{term}"'
                )


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
            raise ValidationError(f"lille: obsolete codes in geojson: {stale}")
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
                raise ValidationError(f"lille: disconnected primary zone {code}")
            if role == "campus" and dissolved > 1 and source_count > 6:
                raise ValidationError(f"lille: campus zone {code} spans multiple clusters")
    if city_id == "montpellier":
        _audit_montpellier(config, features)


def _audit_montpellier(config: CityConfig, features: list[dict[str, Any]]) -> None:
    zones = _zone_by_code(config)
    place_meta = load_place_meta(config.places_file)
    fatal_roles = FATAL_VISUAL_RISK_ROLES

    for feature in features:
        code = feature["properties"]["code"]
        zone = zones.get(code)
        if zone is None:
            continue
        role = zone.coverage_role or "primary"
        source_names = [unit.name for unit in zone.source_units]
        geometry = feature["geometry"]
        raw_parts = len(geometry["coordinates"]) if geometry.get("type") == "MultiPolygon" else 1
        dissolved = dissolved_component_count(geometry)

        if role in fatal_roles:
            if len(source_names) > MONTPELLIER_FATAL_SOURCE_UNIT_COUNT:
                raise ValidationError(
                    f"montpellier: {code} has {len(source_names)} source units "
                    f"(>{MONTPELLIER_FATAL_SOURCE_UNIT_COUNT})"
                )
            if raw_parts > MONTPELLIER_FATAL_RAW_PART_COUNT:
                raise ValidationError(
                    f"montpellier: {code} has {raw_parts} raw polygon parts "
                    f"(>{MONTPELLIER_FATAL_RAW_PART_COUNT})"
                )
            if dissolved > 1:
                raise ValidationError(
                    f"montpellier: {code} has {dissolved} disconnected dissolved components"
                )

        haystack = f"{code} {place_meta.get(code, {}).get('name', '')}".lower()
        for token, expected_names in MONTPELLIER_LABEL_TOKENS:
            if token not in haystack:
                continue
            if not any(name in source_names for name in expected_names):
                raise ValidationError(
                    f"montpellier: zone {code} label contains {token!r} "
                    f"but no matching source unit ({expected_names})"
                )

    for feature in features:
        code = feature["properties"]["code"]
        zone = zones.get(code)
        if zone is None:
            continue
        source_names = [unit.name for unit in zone.source_units]
        if code == "montpellier-comedie-gare":
            if not any(name in source_names for name in ("Comédie", "Saint-Denis", "Pont de Sète")):
                raise ValidationError(
                    "montpellier: comedie-gare must include a Comédie or Gare source unit"
                )
            if "Beaux-Arts" in source_names:
                raise ValidationError(
                    "montpellier: Beaux-Arts must not be assigned to montpellier-comedie-gare"
                )
        if code == "montpellier-richter-jacques-coeur":
            zone = zones[code]
            west_units = {"Blayac", "Bologne"}
            if west_units.intersection(unit.name for unit in zone.source_units):
                raise ValidationError(
                    "montpellier: richter-jacques-coeur must not use west/northwest IRIS units"
                )
