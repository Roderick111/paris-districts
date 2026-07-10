#!/usr/bin/env python3
"""Validate upgraded city GeoJSON files against PlaceScore rows."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from geometry_audit import (
    audit_geometry_quality,
    bbox_area,
    geometry_hash,
    polygon_parts,
    geometries_touch,
    components_are_contiguous,
    geometry_components,
)

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DATA = ROOT / "public" / "data"
CONFIGS_DIR = ROOT / "scripts" / "city_configs"
GEOMETRY_JSON = ROOT / "scripts" / "granularity_geometry.json"
COVERAGE_SCOPES = ROOT / "scripts" / "city_coverage_scopes.json"


def _resolve_repo_path(value: str) -> Path:
    path = Path(value)
    return path if path.is_absolute() else ROOT / path


def load_city_files() -> dict[str, tuple[Path, Path]]:
    city_files: dict[str, tuple[Path, Path]] = {}
    for config_path in sorted(CONFIGS_DIR.glob("*.json")):
        raw = json.loads(config_path.read_text(encoding="utf-8"))
        city_id = raw["cityId"]
        city_files[city_id] = (
            _resolve_repo_path(raw["placesFile"]),
            _resolve_repo_path(raw["geojsonOutput"]),
        )
    return city_files

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

TOULOUSE_OBSOLETE_CODES = {
    "toulouse-capitole",
    "toulouse-carmes-esquirol",
    "toulouse-arnaud-bernard",
    "toulouse-saint-sernin",
    "toulouse-compans-caffarelli",
    "toulouse-amidonniers",
    "toulouse-chalets",
    "toulouse-bayard-matabiau",
    "toulouse-saint-aubin-dupuy",
    "toulouse-patte-doie",
    "toulouse-saint-michel",
    "toulouse-saint-agne",
    "toulouse-empalot",
    "toulouse-rangueil-campus",
    "toulouse-sauzelong-jules-julien",
    "toulouse-mirail-universite",
    "toulouse-reynerie",
    "toulouse-bellefontaine",
    "toulouse-minimes",
    "toulouse-barriere-paris-la-vache",
}

NANTES_OBSOLETE_CODES = {
    "nantes-decre-bouffay",
    "nantes-commerce-graslin",
    "nantes-talensac-viarme",
    "nantes-hauts-paves",
    "nantes-joneliere",
    "nantes-bout-des-landes-boissiere",
    "nantes-saint-joseph-porterie",
    "nantes-ile-de-nantes-west",
    "nantes-ile-de-nantes-east",
    "nantes-dervallieres",
    "nantes-zola",
    "nantes-chantenay-sainte-anne",
    "nantes-bellevue",
    "nantes-breil",
    "nantes-barberie",
    "nantes-doulon",
    "nantes-bottiere",
}

NICE_OBSOLETE_CODES = {
    "nice-jean-medecin-core",
    "nice-carabacel",
    "nice-thiers-station-edge",
    "nice-musiciens",

    "nice-liberation",
    "nice-borriglione-valrose",
    "nice-saint-maurice",
    "nice-rimiez",
    "nice-vieux-nice",
    "nice-port",
    "nice-riquier",
    "nice-saint-roch",
    "nice-saint-jean-d-angely",
    "nice-rue-de-france-promenade-edge",
    "nice-carlone-campus",
    "nice-arenas-saint-augustin-edhec",
    "nice-context-north-west-hills",
    "nice-context-saint-sylvestre-las-planas",
    "nice-context-rimiez-gairaut-east",
    "nice-context-east-hills",
    "nice-context-west-hills",
    "nice-context-airport-var",
    "nice-context-north-centre-fill",
    "nice-context-peripheral",
    "nice-vernier-saint-maurice",
    "nice-carre-or-rue-france",
    "nice-carlone",
    "nice-madeleine",
    "nice-fabron-lanterne",
    "nice-arenas-saint-augustin",
    "nice-moulins-caucade",
    "nice-saint-isidore-cremat",
    "nice-mont-boron-mont-alban",
}

ALLOW_MULTIPART_ROLES = {"context", "low_relevance"}
OVERSIZED_BBOX_AREA = 0.012
OVERSIZED_PART_COUNT = 10

MARSEILLE_OBSOLETE_CODES = {
    "marseille-saint-charles",
    "marseille-noailles",
    "marseille-belsunce",
    "marseille-cours-julien",
    "marseille-la-plaine-notre-dame-du-mont",
    "marseille-lodi",
    "marseille-baille",
    "marseille-la-timone",
    "marseille-castellane",
    "marseille-prefecture",
    "marseille-rouet",
    "marseille-perier",
    "marseille-joliette-euromed",
    "marseille-endoume-catalans",
    "marseille-sainte-anne-mazargues",
    "marseille-luminy-campus",
    "marseille-saint-jerome",
    "marseille-chateau-gombert",
    "marseille-la-castellane-15e-north",
    "marseille-joliette-arenc-euromed",
    "marseille-belle-de-mai-saint-mauront",
    "marseille-cinq-avenues-blancarde",
    "marseille-cours-julien-plaine-lodi",
    "marseille-castellane-prefecture-vauban",
    "marseille-rouet-perier-prado",
    "marseille-endoume-pharo-roucas",
    "marseille-south-coast",
    "marseille-luminy-calanques",
    "marseille-east-ring-context",
    "marseille-saint-jerome-chateau-gombert",
    "marseille-north-risk-belt",
    "marseille-estaque-16e-context",
    "marseille-endoume-catalans-pharo",
    "marseille-calanques-hills-context",
}


def validate_obsolete_codes(
    city_id: str,
    feature_codes: set[str],
    score_codes: set[str],
    obsolete: set[str],
) -> None:
    stale_geojson = sorted(feature_codes & obsolete)
    stale_scores = sorted(score_codes & obsolete)
    if stale_geojson or stale_scores:
        raise SystemExit(
            f"{city_id}: obsolete micro-area codes remain "
            f"geojson={stale_geojson} scores={stale_scores}"
        )


def validate_marseille_obsolete_codes(city_id: str, feature_codes: set[str], score_codes: set[str]) -> None:
    if city_id != "marseille":
        return
    stale_geojson = sorted(feature_codes & MARSEILLE_OBSOLETE_CODES)
    stale_scores = sorted(score_codes & MARSEILLE_OBSOLETE_CODES)
    if stale_geojson or stale_scores:
        raise SystemExit(
            f"marseille: obsolete micro-area codes remain "
            f"geojson={stale_geojson} scores={stale_scores}"
        )


def load_score_codes(places_file: Path) -> set[str]:
    content = places_file.read_text(encoding="utf-8")
    return set(re.findall(r'code:\s*"([^"]+)"', content))


def load_score_tuples(places_file: Path) -> dict[str, tuple[float, ...]]:
    content = places_file.read_text(encoding="utf-8")
    blocks = re.findall(r'code:\s*"([^"]+)"[\s\S]*?scores:\s*\{([\s\S]*?)\}', content)
    tuples: dict[str, tuple[float, ...]] = {}
    for code, body in blocks:
        values = tuple(
            float(value)
            for _key, value in re.findall(
                r"(security|affordability|transport|studentEnergy|services|campusAccess|greenCalm):\s*([0-9.]+)",
                body,
            )
        )
        if len(values) == 7:
            tuples[code] = values
    return tuples




def dissolved_component_count(geometry: dict) -> int:
    """Count visual components after merging touching MultiPolygon parts."""
    from geometry_audit import components_are_contiguous, geometry_components

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
                shapes = {
                    str(current): parts[current],
                    str(candidate): parts[candidate],
                }
                if components_are_contiguous([parts[current], parts[candidate]]) or (
                    __import__("geometry_audit").geometries_touch(parts[current], parts[candidate])
                ):
                    remaining.remove(candidate)
                    group.append(candidate)
                    stack.append(candidate)
        groups.append(group)
    return len(groups)


def validate_lille_obsolete_codes(city_id: str, feature_codes: set[str], score_codes: set[str]) -> None:
    if city_id != "lille":
        return
    stale_geojson = sorted(feature_codes & LILLE_OBSOLETE_CODES)
    stale_scores = sorted(score_codes & LILLE_OBSOLETE_CODES)
    if stale_geojson or stale_scores:
        raise SystemExit(
            f"lille: obsolete east-zone codes remain "
            f"geojson={stale_geojson} scores={stale_scores}"
        )


def validate_lille_geometry_audits(
    city_id: str,
    features: list[dict],
    geometry_specs: list[dict],
) -> None:
    if city_id != "lille":
        return
    spec_by_code = {spec["code"]: spec for spec in geometry_specs}
    print(f"{city_id} geometry audit:")
    for feature in sorted(features, key=lambda item: item["properties"]["code"]):
        code = feature["properties"]["code"]
        geometry = feature["geometry"]
        spec = spec_by_code.get(code, {})
        basis = spec.get("geometryBasis", "?")
        role = spec.get("coverageRole", "?")
        source_count = len(
            spec.get("iris_names")
            or spec.get("vda_quartier")
            or spec.get("lille_quartier")
            or []
        )
        parts = geometry.get("coordinates", []) if geometry.get("type") == "MultiPolygon" else [geometry.get("coordinates", [])]
        raw_components = len(parts) if geometry.get("type") == "MultiPolygon" else 1
        dissolved_components = dissolved_component_count(geometry)
        print(
            f"  {code}: basis={basis} role={role} "
            f"sources={source_count} rawParts={raw_components} dissolved={dissolved_components}"
        )
        if code.startswith(LILLE_EAST_PREFIXES) and role not in {"context", "low_relevance"}:
            if source_count > 8:
                print(
                    f"  warn: {code} east major zone has {source_count} source IRIS "
                    f"(>{8}) without context role"
                )
        if role == "primary" and dissolved_components > 1:
            raise SystemExit(f"lille: disconnected primary zone {code} ({dissolved_components} components)")
        if role == "campus" and dissolved_components > 1 and source_count > 6:
            raise SystemExit(
                f"lille: campus zone {code} spans multiple commune-wide clusters "
                f"({dissolved_components} components, {source_count} sources)"
            )
        if role not in {"context", "low_relevance"} and geometry.get("type") == "MultiPolygon":
            if dissolved_components > 1 and not feature["properties"].get("allowMultipart"):
                print(
                    f"  warn: {code} non-context MultiPolygon has {dissolved_components} "
                    "disconnected visual components after dissolve"
                )

def validate_score_tuples(city_id: str, places_file: Path) -> None:
    if city_id not in {"lille", "toulouse", "nantes", "nice"}:
        return
    tuples = load_score_tuples(places_file)
    if not tuples:
        raise SystemExit(f"{city_id}: could not parse score tuples from {places_file}")
    by_tuple: dict[tuple[float, ...], list[str]] = {}
    for code, values in tuples.items():
        by_tuple.setdefault(values, []).append(code)
    duplicates = {values: codes for values, codes in by_tuple.items() if len(codes) > 3}
    if duplicates:
        sample = next(iter(duplicates.items()))
        raise SystemExit(
            f"{city_id}: more than 3 rows share identical score tuple {sample[0]}: {sample[1]}"
        )


def validate_allow_multipart_policy(
    city_id: str,
    features: list[dict],
    geometry_specs: list[dict],
) -> None:
    spec_by_code = {spec["code"]: spec for spec in geometry_specs}
    for feature in features:
        code = feature["properties"]["code"]
        if not feature["properties"].get("allowMultipart"):
            continue
        spec = spec_by_code.get(code, {})
        role = spec.get("coverageRole", "?")
        justification = spec.get("multipartJustification") or feature["properties"].get(
            "multipartJustification"
        )
        if role not in ALLOW_MULTIPART_ROLES:
            raise SystemExit(
                f"{city_id}: allowMultipart on {role} zone {code} "
                "(only context/low_relevance permitted)"
            )
        if not justification:
            raise SystemExit(
                f"{city_id}: allowMultipart on {code} requires multipartJustification"
            )


def validate_mixed_geometry_bases(
    city_id: str,
    geometry_specs: list[dict],
) -> None:
    iris_specs = [spec for spec in geometry_specs if spec.get("iris_names")]
    official_specs = [
        spec
        for spec in geometry_specs
        if any(key in spec for key in ("toulouse_quartier", "nantes_quartier", "nice_quartier"))
    ]
    if not iris_specs or not official_specs:
        return

    split_parents: dict[str, list[dict]] = {}
    for spec in iris_specs:
        parent = spec.get("split_parent")
        if parent:
            split_parents.setdefault(parent, []).append(spec)

    for parent, specs in split_parents.items():
        assigned: dict[str, str] = {}
        for spec in specs:
            for iris_name in spec.get("iris_names", []):
                if iris_name in assigned and assigned[iris_name] != spec["code"]:
                    raise SystemExit(
                        f"{city_id}: IRIS {iris_name} in split parent {parent} "
                        f"assigned to both {assigned[iris_name]} and {spec['code']}"
                    )
                assigned[iris_name] = spec["code"]
        expected = {name for spec in specs for name in spec.get("iris_names", [])}
        if assigned and len(assigned) != len(expected):
            raise SystemExit(
                f"{city_id}: split parent {parent} has duplicate IRIS source units"
            )


def validate_oversized_zone_warnings(
    city_id: str,
    features: list[dict],
    geometry_specs: list[dict],
) -> None:
    spec_by_code = {spec["code"]: spec for spec in geometry_specs}
    for feature in features:
        code = feature["properties"]["code"]
        geometry = feature["geometry"]
        spec = spec_by_code.get(code, {})
        role = spec.get("coverageRole", "?")
        if role in ALLOW_MULTIPART_ROLES:
            continue
        raw_parts = (
            len(geometry["coordinates"])
            if geometry.get("type") == "MultiPolygon"
            else 1
        )
        dissolved_components = dissolved_component_count(geometry)
        area = bbox_area(geometry)
        if (
            area > OVERSIZED_BBOX_AREA
            or raw_parts > OVERSIZED_PART_COUNT
            or dissolved_components > 2
        ):
            print(
                f"  warn: {city_id} {code} oversized selection "
                f"(bbox={area:.5f}, rawParts={raw_parts}, dissolved={dissolved_components})"
            )


def validate_district_geometry_audits(
    city_id: str,
    features: list[dict],
    geometry_specs: list[dict],
) -> None:
    if city_id not in {"toulouse", "nantes", "nice", "marseille"}:
        return
    spec_by_code = {spec["code"]: spec for spec in geometry_specs}
    for feature in sorted(features, key=lambda item: item["properties"]["code"]):
        code = feature["properties"]["code"]
        geometry = feature["geometry"]
        spec = spec_by_code.get(code, {})
        role = spec.get("coverageRole", "?")
        dissolved_components = dissolved_component_count(geometry)
        if role in {"primary", "campus", "risk_cap"} and dissolved_components > 1:
            raise SystemExit(
                f"{city_id}: disconnected {role} zone {code} ({dissolved_components} components)"
            )


def validate_city(city_id: str, places_file: Path, geojson_file: Path, expected_count: int | None) -> None:
    score_codes = load_score_codes(places_file)
    data = json.loads(geojson_file.read_text(encoding="utf-8"))
    features = data["features"]
    if expected_count is not None and len(features) != expected_count:
        raise SystemExit(f"{city_id}: expected {expected_count} features, got {len(features)}")
    if len(features) < 1:
        raise SystemExit(f"{city_id}: no features")

    codes = [feature["properties"]["code"] for feature in features]
    if len(set(codes)) != len(codes):
        raise SystemExit(f"{city_id}: duplicate feature codes")

    hashes: dict[str, str] = {}
    for feature in features:
        code = feature["properties"]["code"]
        geometry = feature["geometry"]
        if geometry.get("type") not in {"Polygon", "MultiPolygon"} or not polygon_parts(geometry):
            raise SystemExit(f"{city_id}: empty geometry for {code}")
        for polygon in polygon_parts(geometry):
            for ring in polygon:
                for lon, lat in ring:
                    if lon < -180 or lon > 180 or lat < -90 or lat > 90:
                        raise SystemExit(f"{city_id}: invalid lon/lat for {code}: {(lon, lat)}")
        digest = geometry_hash(geometry)
        if digest in hashes:
            raise SystemExit(f"{city_id}: duplicate geometry for {code} and {hashes[digest]}")
        hashes[digest] = code

    feature_codes = set(codes)
    if feature_codes != score_codes:
        missing = sorted(score_codes - feature_codes)
        extra = sorted(feature_codes - score_codes)
        raise SystemExit(f"{city_id}: score/geojson mismatch missing={missing} extra={extra}")

    validate_lille_obsolete_codes(city_id, feature_codes, score_codes)
    validate_marseille_obsolete_codes(city_id, feature_codes, score_codes)
    if city_id == "toulouse":
        validate_obsolete_codes(city_id, feature_codes, score_codes, TOULOUSE_OBSOLETE_CODES)
    if city_id == "nantes":
        validate_obsolete_codes(city_id, feature_codes, score_codes, NANTES_OBSOLETE_CODES)
    if city_id == "nice":
        validate_obsolete_codes(city_id, feature_codes, score_codes, NICE_OBSOLETE_CODES)
    audit_geometry_quality(features)
    validate_score_tuples(city_id, places_file)
    specs = []
    if GEOMETRY_JSON.exists():
        specs = json.loads(GEOMETRY_JSON.read_text(encoding="utf-8")).get(city_id, [])
    validate_lille_geometry_audits(city_id, features, specs)
    validate_allow_multipart_policy(city_id, features, specs)
    validate_mixed_geometry_bases(city_id, specs)
    validate_district_geometry_audits(city_id, features, specs)
    validate_oversized_zone_warnings(city_id, features, specs)

    partition_total = 0
    if GEOMETRY_JSON.exists():
        specs = json.loads(GEOMETRY_JSON.read_text(encoding="utf-8")).get(city_id, [])
        partition_total = sum(len(spec.get("iris_names", [])) for spec in specs)
    coverage = {}
    if COVERAGE_SCOPES.exists():
        coverage = json.loads(COVERAGE_SCOPES.read_text(encoding="utf-8")).get(city_id)
    partition_note = f", {partition_total} IRIS units" if partition_total else ""
    mode = coverage.get("coverageMode") if coverage else None
    coverage_note = f", {mode}" if mode else ""
    print(f"{city_id}: ok ({len(features)} features, lon/lat valid, contiguous{partition_note}{coverage_note})")


def main() -> None:
    expected_counts: dict[str, int | None] = {}
    if GEOMETRY_JSON.exists():
        expected_counts = {
            city_id: len(specs) for city_id, specs in json.loads(GEOMETRY_JSON.read_text(encoding="utf-8")).items()
        }
    city_files = load_city_files()
    targets = sys.argv[1:] or list(city_files)
    for city_id in targets:
        if city_id not in city_files:
            known = ", ".join(sorted(city_files))
            raise SystemExit(f"Unknown city {city_id}. Known cities: {known}")
        places_file, geojson_file = city_files[city_id]
        validate_city(city_id, places_file, geojson_file, expected_counts.get(city_id))


if __name__ == "__main__":
    main()