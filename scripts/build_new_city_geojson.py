#!/usr/bin/env python3
"""Build GeoJSON for upgraded Toulouse, Lille, Marseille, Nice, and Nantes micro-areas."""

from __future__ import annotations

import json
import re
import sys
import unicodedata
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any

from geometry_audit import (
    audit_geometry_quality,
    audit_source_contiguity,
    geometry_hash,
    polygon_parts,
)

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DATA = ROOT / "public" / "data"
SCRIPTS = ROOT / "scripts"
GEOMETRY_JSON = SCRIPTS / "granularity_geometry.json"
MARSEILLE_GROUPS_JSON = SCRIPTS / "marseille_quartier_groups.json"
IRIS_CACHE = SCRIPTS / "cache"
IRIS_WFS = (
    "https://data.geopf.fr/wfs/ows?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature"
    "&TYPENAME=STATISTICALUNITS.IRIS:contours_iris"
)
MARSEILLE_QUARTIER_URL = (
    "https://data.ampmetropole.fr/api/explore/v2.1/catalog/datasets/"
    "a7104f3c-e487-4af3-82ad-6197cedfaeb1/exports/geojson"
)
NICE_QUARTIER_URL = (
    "https://cartes.nicecotedazur.org/heberge/rest/services/Limites_administratives/"
    "MapServer/10/query?where=1%3D1&outFields=QUARTIER&outSR=4326&f=geojson"
)
TOULOUSE_QUARTIER_URL = (
    "https://data.toulouse-metropole.fr/api/explore/v2.1/catalog/datasets/"
    "quartiers-de-democratie-locale/exports/geojson"
)
NANTES_QUARTIER_URL = (
    "https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/"
    "244400404_quartiers-communes-nantes-metropole/exports/geojson"
)
NANTES_SPLIT_PARENT_EXEMPT = {
    "Hauts-Pavés - Saint-Félix",
    "Nantes Nord",
    "Nantes Erdre",
    "Île de Nantes",
    "Malakoff - Saint-Donatien",
}
LILLE_WFS = "https://data.lillemetropole.fr/geoserver/wfs"
LILLE_QUARTIER_LAYER = "ville_lille:limite_des_quartiers_de_lille_et_de_ses_communes_associees"
VDA_QUARTIER_LAYER = "ville_villeneuve_d_ascq:quartier"

CITY_OUTPUTS = {
    "toulouse": (ROOT / "src/data/toulousePlaces.ts", PUBLIC_DATA / "toulouse.geojson"),
    "lille": (ROOT / "src/data/lillePlaces.ts", PUBLIC_DATA / "lille.geojson"),
    "marseille": (ROOT / "src/data/marseillePlaces.ts", PUBLIC_DATA / "marseille.geojson"),
    "nice": (ROOT / "src/data/nicePlaces.ts", PUBLIC_DATA / "nice.geojson"),
    "nantes": (ROOT / "src/data/nantesPlaces.ts", PUBLIC_DATA / "nantes.geojson"),
}


def fetch_json(url: str) -> dict[str, Any]:
    request = urllib.request.Request(url, headers={"User-Agent": "paris-student-map/1.0"})
    with urllib.request.urlopen(request, timeout=180) as response:
        return json.load(response)


def normalize_label(value: str) -> str:
    folded = unicodedata.normalize("NFKD", value)
    ascii_label = "".join(char for char in folded if not unicodedata.combining(char))
    return re.sub(r"[^a-z0-9]+", "", ascii_label.lower())


def merge_geometries(geometries: list[dict[str, Any]]) -> dict[str, Any]:
    polygons: list[Any] = []
    for geometry in geometries:
        polygons.extend(polygon_parts(geometry))
    if not polygons:
        raise ValueError("Cannot merge empty geometry list")
    if len(polygons) == 1:
        return {"type": "Polygon", "coordinates": polygons[0]}
    return {"type": "MultiPolygon", "coordinates": polygons}


def load_score_meta(places_file: Path) -> dict[str, dict[str, str]]:
    content = places_file.read_text(encoding="utf-8")
    codes = re.findall(r'code:\s*"([^"]+)"', content)
    names = re.findall(r'name:\s*"([^"]+)"', content)
    if len(codes) != len(names):
        raise SystemExit(f"Place name/code mismatch in {places_file}")
    return {code: {"code": code, "name": name} for code, name in zip(codes, names, strict=True)}


def load_iris(insee: str) -> dict[str, dict[str, Any]]:
    IRIS_CACHE.mkdir(parents=True, exist_ok=True)
    cache_path = IRIS_CACHE / f"iris_{insee}.geojson"
    if cache_path.exists():
        data = json.loads(cache_path.read_text(encoding="utf-8"))
    else:
        params = urllib.parse.urlencode(
            {
                "CQL_FILTER": f"code_insee='{insee}'",
                "outputFormat": "application/json",
                "srsName": "EPSG:4326",
            }
        )
        data = fetch_json(f"{IRIS_WFS}&{params}")
        cache_path.write_text(json.dumps(data), encoding="utf-8")
    shapes: dict[str, dict[str, Any]] = {}
    by_label: dict[str, dict[str, Any]] = {}
    for feature in data["features"]:
        name = feature["properties"]["nom_iris"]
        label = normalize_label(name)
        shapes[name] = feature["geometry"]
        by_label[label] = feature["geometry"]
    shapes.update(by_label)
    return shapes


def resolve_iris(shapes: dict[str, dict[str, Any]], names: list[str], code: str) -> list[dict[str, Any]]:
    geometries: list[dict[str, Any]] = []
    missing: list[str] = []
    for name in names:
        geometry = shapes.get(name) or shapes.get(normalize_label(name))
        if geometry is None:
            missing.append(name)
        else:
            geometries.append(geometry)
    if missing:
        raise SystemExit(f"Missing IRIS polygons for {code}: {missing}")
    return geometries


def load_marseille() -> tuple[dict[str, dict[str, Any]], set[str], dict[str, int]]:
    features = fetch_json(MARSEILLE_QUARTIER_URL)["features"]
    by_name: dict[str, list[dict[str, Any]]] = {}
    official_names: set[str] = set()
    quartier_arr: dict[str, int] = {}
    for feature in features:
        name = feature["properties"]["nom_qua"]
        official_names.add(name)
        quartier_arr[name] = int(feature["properties"]["depco"][-2:])
        by_name.setdefault(name, []).append(feature["geometry"])
    shapes: dict[str, dict[str, Any]] = {}
    for name, geometries in by_name.items():
        shapes[name] = merge_geometries(geometries) if len(geometries) > 1 else geometries[0]
    for name, geometry in list(shapes.items()):
        shapes.setdefault(normalize_label(name), geometry)
    return shapes, official_names, quartier_arr


def round_geometry_coords(geometry: dict[str, Any], precision: int = 6) -> dict[str, Any]:
    def round_nested(coords: Any) -> Any:
        if isinstance(coords[0], (int, float)):
            return [round(coords[0], precision), round(coords[1], precision)]
        return [round_nested(part) for part in coords]

    return {"type": geometry["type"], "coordinates": round_nested(geometry["coordinates"])}


def load_marseille_groups() -> list[dict[str, Any]]:
    payload = json.loads(MARSEILLE_GROUPS_JSON.read_text(encoding="utf-8"))
    return payload["groups"]


def marseille_groups_to_specs(groups: list[dict[str, Any]]) -> list[dict[str, Any]]:
    specs: list[dict[str, Any]] = []
    for group in groups:
        spec: dict[str, Any] = {
            "code": group["code"],
            "marseille_quartiers": list(group["marseille_quartiers"]),
            "geometry_method": "official_quartier_group",
            "coverageRole": group["coverageRole"],
            "geometryBasis": group["geometryBasis"],
            "confidence": group["confidence"],
        }
        if group.get("area"):
            spec["area"] = group["area"]
        if group.get("allowMultipart"):
            spec["allowMultipart"] = True
        if group.get("multipartJustification"):
            spec["multipartJustification"] = group["multipartJustification"]
        specs.append(spec)
    return specs


def audit_marseille_group_warnings(groups: list[dict[str, Any]], quartier_arr: dict[str, int]) -> None:
    cross_arrondissement_areas = {"6e/7e", "8e/9e", "5e/10e"}
    for group in groups:
        code = group["code"]
        quartiers = group["marseille_quartiers"]
        role = group["coverageRole"]
        count = len(quartiers)
        if count > 8:
            print(f"warn: {code} has {count} source quartiers (>8)")
        if role == "context" and count > 10:
            print(f"warn: {code} context zone has {count} source quartiers (>10)")
        arrs = sorted({quartier_arr[name] for name in quartiers if name in quartier_arr})
        area = group.get("area", "")
        if len(arrs) > 1 and role not in {"context", "low_relevance"} and area not in cross_arrondissement_areas:
            print(f"warn: {code} {role} zone spans arrondissements {arrs} (area={area})")


def audit_marseille_quartier_assignment(
    groups: list[dict[str, Any]],
    shapes: dict[str, dict[str, Any]],
    official_names: set[str],
) -> None:
    assigned: dict[str, str] = {}
    missing_in_source: list[str] = []
    for group in groups:
        code = group["code"]
        for quartier in group["marseille_quartiers"]:
            if quartier not in official_names:
                resolved = shapes.get(quartier) or shapes.get(normalize_label(quartier))
                if resolved is None:
                    missing_in_source.append(quartier)
                    continue
            if quartier in assigned:
                raise SystemExit(
                    f"Marseille quartier {quartier} assigned to both {assigned[quartier]} and {code}"
                )
            assigned[quartier] = code
    if missing_in_source:
        raise SystemExit(f"Marseille group quartiers missing from official source: {sorted(missing_in_source)}")
    unassigned = sorted(official_names - set(assigned))
    if unassigned:
        raise SystemExit(f"Unassigned official Marseille quartiers ({len(unassigned)}): {unassigned}")
    print(f"marseille: assigned all {len(official_names)} official quartiers across {len(groups)} groups")


def load_nice() -> dict[str, dict[str, Any]]:
    features = fetch_json(NICE_QUARTIER_URL)["features"]
    shapes: dict[str, dict[str, Any]] = {}
    for feature in features:
        name = feature["properties"]["QUARTIER"]
        shapes[name] = feature["geometry"]
        shapes.setdefault(normalize_label(name), feature["geometry"])
    return shapes


def load_toulouse() -> tuple[dict[str, dict[str, Any]], set[str]]:
    features = fetch_json(TOULOUSE_QUARTIER_URL)["features"]
    official_names: set[str] = set()
    shapes: dict[str, dict[str, Any]] = {}
    for feature in features:
        name = feature["properties"]["nom_quartier"]
        official_names.add(name)
        shapes[name] = feature["geometry"]
        shapes.setdefault(normalize_label(name), feature["geometry"])
    return shapes, official_names


def load_nantes() -> tuple[dict[str, dict[str, Any]], set[str]]:
    features = fetch_json(NANTES_QUARTIER_URL)["features"]
    official_names: set[str] = set()
    shapes: dict[str, dict[str, Any]] = {}
    for feature in features:
        if feature["properties"].get("libcom") != "Nantes":
            continue
        name = feature["properties"]["nom"]
        official_names.add(name)
        shapes[name] = feature["geometry"]
        shapes.setdefault(normalize_label(name), feature["geometry"])
    return shapes, official_names


def load_lille_layers() -> tuple[dict[str, dict[str, Any]], dict[str, dict[str, Any]]]:
    lille_shapes: dict[str, dict[str, Any]] = {}
    vda_shapes: dict[str, dict[str, Any]] = {}
    for layer, target in ((LILLE_QUARTIER_LAYER, lille_shapes), (VDA_QUARTIER_LAYER, vda_shapes)):
        params = urllib.parse.urlencode(
            {
                "service": "WFS",
                "version": "2.0.0",
                "request": "GetFeature",
                "typeName": layer,
                "outputFormat": "application/json",
                "srsName": "EPSG:4326",
                "count": 200,
            }
        )
        data = fetch_json(f"{LILLE_WFS}?{params}")
        for feature in data["features"]:
            properties = feature["properties"]
            if "quartier" in properties:
                target[properties["quartier"]] = feature["geometry"]
            elif "nom" in properties:
                target[properties["nom"]] = feature["geometry"]
    return lille_shapes, vda_shapes


def resolve_named(
    shapes: dict[str, dict[str, Any]],
    names: list[str],
    code: str,
    label: str,
    *,
    normalize_lookup: bool = False,
) -> list[dict[str, Any]]:
    geometries: list[dict[str, Any]] = []
    missing: list[str] = []
    for name in names:
        geometry = shapes.get(name)
        if geometry is None and normalize_lookup:
            geometry = shapes.get(normalize_label(name))
        if geometry is None:
            missing.append(name)
        else:
            geometries.append(geometry)
    if missing:
        raise SystemExit(f"Missing {label} polygons for {code}: {missing}")
    return geometries


def source_shapes_for_spec(spec: dict[str, Any], sources: dict[str, Any]) -> tuple[list[str], dict[str, Any], str]:
    code = spec["code"]
    if "iris_insee" in spec and "iris_names" in spec:
        iris_shapes = sources["iris"][spec["iris_insee"]]
        names = list(spec["iris_names"])
        shapes: dict[str, dict[str, Any]] = {}
        for name in names:
            geometry = iris_shapes.get(name) or iris_shapes.get(normalize_label(name))
            if geometry is not None:
                shapes[name] = geometry
        return list(shapes), shapes, "IRIS"
    names = []
    shapes = {}
    label = "source"
    for key, source_label in (
        ("marseille_quartiers", "marseille"),
        ("toulouse_quartier", "toulouse"),
        ("nantes_quartier", "nantes"),
        ("nice_quartier", "nice"),
        ("lille_quartier", "lille"),
        ("vda_quartier", "vda"),
        ("hellemmes_quartier", "lille"),
    ):
        if key in spec:
            source_shapes = sources[source_label]
            for name in spec[key]:
                geometry = source_shapes.get(name) or source_shapes.get(normalize_label(name))
                if geometry is None:
                    continue
                names.append(name)
                shapes[name] = geometry
            label = source_label
    if not names:
        raise SystemExit(f"Spec {code} has no geometry source names")
    return names, shapes, label


def geometry_for_spec(spec: dict[str, Any], sources: dict[str, Any]) -> dict[str, Any]:
    names, shapes, label = source_shapes_for_spec(spec, sources)
    resolved_names = [name for name in names if name in shapes]
    if not resolved_names:
        raise SystemExit(f"Spec {spec['code']} resolved zero {label} polygons from {names}")
    if not spec.get("allowMultipart"):
        audit_source_contiguity(spec["code"], resolved_names, shapes, label)
    geometries = [shapes[name] for name in resolved_names]
    return merge_geometries(geometries)


def iter_geometry_points(geometry: dict[str, Any]) -> Any:
    for polygon in polygon_parts(geometry):
        for ring in polygon:
            for point in ring:
                yield point


def audit_output(features: list[dict[str, Any]], score_codes: set[str]) -> None:
    codes = [feature["properties"]["code"] for feature in features]
    duplicates = sorted({code for code in codes if codes.count(code) > 1})
    if duplicates:
        raise SystemExit(f"Duplicate feature codes: {duplicates}")

    hash_map: dict[str, list[str]] = {}
    for feature in features:
        code = feature["properties"]["code"]
        geometry = feature["geometry"]
        if geometry.get("type") not in {"Polygon", "MultiPolygon"} or not polygon_parts(geometry):
            raise SystemExit(f"Invalid or empty geometry for {code}")
        for point in iter_geometry_points(geometry):
            lon, lat = point[:2]
            if lon < -180 or lon > 180 or lat < -90 or lat > 90:
                raise SystemExit(f"Invalid lon/lat coordinate for {code}: {point[:2]}")
        digest = geometry_hash(geometry)
        hash_map.setdefault(digest, []).append(code)

    duplicate_hashes = {digest: values for digest, values in hash_map.items() if len(values) > 1}
    if duplicate_hashes:
        for digest, values in duplicate_hashes.items():
            print(f"Identical geometry hash {digest}: {values}")
        raise SystemExit("Geometry audit failed: duplicate geometry across scored features")

    feature_codes = set(codes)
    missing = sorted(score_codes - feature_codes)
    extra = sorted(feature_codes - score_codes)
    if missing:
        raise SystemExit(f"Score rows without GeoJSON feature: {missing}")
    if extra:
        raise SystemExit(f"GeoJSON features without score row: {extra}")

    audit_geometry_quality(features)


def audit_official_quartier_assignment(
    city_id: str,
    specs: list[dict[str, Any]],
    key: str,
    official_names: set[str],
    *,
    require_full: bool = True,
    exempt: set[str] | None = None,
) -> None:
    assigned: dict[str, str] = {}
    for spec in specs:
        code = spec["code"]
        for quartier in spec.get(key, []):
            if quartier in assigned:
                raise SystemExit(
                    f"{city_id}: official quartier {quartier} assigned to both "
                    f"{assigned[quartier]} and {code}"
                )
            assigned[quartier] = code
    if not official_names:
        return
    if require_full:
        missing = sorted((official_names - (exempt or set())) - set(assigned))
        if missing:
            raise SystemExit(f"{city_id}: unassigned official quartiers ({len(missing)}): {missing}")
        print(f"{city_id}: assigned all {len(official_names)} official quartiers across specs")
    elif assigned:
        print(f"{city_id}: assigned {len(assigned)} official quartier polygons")


def audit_nice_quartier_assignment(specs: list[dict[str, Any]], shapes: dict[str, dict[str, Any]]) -> None:
    assigned: dict[str, str] = {}
    missing: list[str] = []
    for spec in specs:
        code = spec["code"]
        for quartier in spec.get("nice_quartier", []):
            if shapes.get(quartier) is None and shapes.get(normalize_label(quartier)) is None:
                missing.append(quartier)
            if quartier in assigned:
                raise SystemExit(f"nice: quartier {quartier} assigned to both {assigned[quartier]} and {code}")
            assigned[quartier] = code
    if missing:
        raise SystemExit(f"nice: quartier names missing from official source: {sorted(set(missing))}")
    source_names = {name for name in shapes if name == name.strip() and name[0].isupper()}
    unassigned = sorted(name for name in source_names if name not in assigned)
    if unassigned:
        print(f"warn: nice unassigned official quartiers ({len(unassigned)}): {unassigned[:8]}...")


def audit_iris_partition(city_id: str, specs: list[dict[str, Any]]) -> None:
    assigned: dict[str, str] = {}
    for spec in specs:
        if "iris_names" not in spec:
            continue
        code = spec["code"]
        for iris_name in spec["iris_names"]:
            if iris_name in assigned:
                raise SystemExit(
                    f"{city_id}: IRIS {iris_name} assigned to both {assigned[iris_name]} and {code}"
                )
            assigned[iris_name] = code
    iris_specs = [spec for spec in specs if spec.get("iris_names")]
    if not iris_specs:
        return
    insee = iris_specs[0]["iris_insee"]
    cache_path = IRIS_CACHE / f"iris_{insee}.geojson"
    if cache_path.exists():
        iris_data = json.loads(cache_path.read_text(encoding="utf-8"))
        all_iris = {feature["properties"]["nom_iris"] for feature in iris_data["features"]}
    else:
        all_iris = {
            name
            for name in load_iris(insee)
            if name and name[0].isupper() and " " in name
        }
    unassigned = sorted(all_iris - set(assigned))
    if unassigned:
        official_only = [spec for spec in specs if f"{city_id}_quartier" in spec or "nantes_quartier" in spec]
        if official_only:
            print(
                f"warn: {city_id} IRIS partition leaves {len(unassigned)} units "
                "(covered by official quartier zones)"
            )
        else:
            raise SystemExit(f"{city_id}: unassigned IRIS ({len(unassigned)}): {unassigned[:12]}")


def load_sources(city_id: str, specs: list[dict[str, Any]]) -> dict[str, Any]:
    sources: dict[str, Any] = {"iris": {}}
    insee_codes = sorted({spec["iris_insee"] for spec in specs if "iris_insee" in spec})
    for insee in insee_codes:
        sources["iris"][insee] = load_iris(insee)
    if city_id == "marseille" or any("marseille_quartiers" in spec for spec in specs):
        shapes, official_names, _quartier_arr = load_marseille()
        sources["marseille"] = shapes
        sources["marseille_official_names"] = official_names
    if city_id == "toulouse" or any("toulouse_quartier" in spec for spec in specs):
        shapes, official_names = load_toulouse()
        sources["toulouse"] = shapes
        sources["toulouse_official_names"] = official_names
    if city_id == "nantes" or any("nantes_quartier" in spec for spec in specs):
        shapes, official_names = load_nantes()
        sources["nantes"] = shapes
        sources["nantes_official_names"] = official_names
    if city_id == "nice" or any("nice_quartier" in spec for spec in specs):
        sources["nice"] = load_nice()
    if city_id == "lille" or any(
        key in spec for spec in specs for key in ("lille_quartier", "vda_quartier", "hellemmes_quartier")
    ):
        lille_shapes, vda_shapes = load_lille_layers()
        sources["lille"] = lille_shapes
        sources["vda"] = vda_shapes
    return sources


def build_city(city_id: str, specs: list[dict[str, Any]], places_file: Path, output: Path) -> None:
    if city_id == "marseille" and MARSEILLE_GROUPS_JSON.exists():
        groups = load_marseille_groups()
        shapes, official_names, quartier_arr = load_marseille()
        audit_marseille_quartier_assignment(groups, shapes, official_names)
        audit_marseille_group_warnings(groups, quartier_arr)
        specs = marseille_groups_to_specs(groups)
    if city_id == "toulouse":
        shapes, official_names = load_toulouse()
        audit_official_quartier_assignment(
            city_id,
            specs,
            "toulouse_quartier",
            official_names,
            exempt={
                "Capitole / Arnaud Bernard / Carmes",
                "Saint-Michel /  Saint-Agne / Empalot / Le Busca / Île du Ramier / Monplaisir",
            },
        )
    if city_id == "nantes":
        shapes, official_names = load_nantes()
        audit_official_quartier_assignment(
            city_id,
            specs,
            "nantes_quartier",
            official_names,
            exempt=set(NANTES_SPLIT_PARENT_EXEMPT),
        )
        audit_iris_partition(city_id, specs)
    if city_id == "nice":
        shapes = load_nice()
        audit_nice_quartier_assignment(specs, shapes)
        official = {name for name in shapes if name and name[0].isupper()}
        assigned = {q for spec in specs for q in spec.get("nice_quartier", [])}
        unassigned = sorted(official - assigned)
        if unassigned:
            raise SystemExit(f"nice: unassigned official quartiers ({len(unassigned)}): {unassigned}")
    sources = load_sources(city_id, specs)
    meta = load_score_meta(places_file)
    features = []
    for spec in specs:
        code = spec["code"]
        geometry = round_geometry_coords(geometry_for_spec(spec, sources))
        place_meta = meta.get(code)
        if place_meta is None:
            raise SystemExit(f"Missing PlaceScore row for geometry code {code}")
        properties = {"code": code, "name": place_meta["name"], "kind": "quartier"}
        if spec.get("allowMultipart"):
            properties["allowMultipart"] = True
        if spec.get("multipartJustification"):
            properties["multipartJustification"] = spec["multipartJustification"]
        features.append({"type": "Feature", "geometry": geometry, "properties": properties})

    score_codes = set(meta)
    audit_output(features, score_codes)
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("w", encoding="utf-8") as handle:
        json.dump({"type": "FeatureCollection", "features": features}, handle, separators=(",", ":"))
    print(f"{city_id}: wrote {len(features)} features to {output}")


def main() -> None:
    from legacy.build_batch_cities import BATCH_OUTPUTS, build_city as build_batch_city

    geometry_specs = json.loads(GEOMETRY_JSON.read_text(encoding="utf-8"))
    all_outputs = {**CITY_OUTPUTS, **BATCH_OUTPUTS}
    targets = sys.argv[1:] or list(CITY_OUTPUTS)
    for city_id in targets:
        if city_id not in all_outputs:
            raise SystemExit(f"Unknown city {city_id}")
        if city_id in BATCH_OUTPUTS:
            build_batch_city(city_id)
            continue
        places_file, output = CITY_OUTPUTS[city_id]
        build_city(city_id, geometry_specs[city_id], places_file, output)


if __name__ == "__main__":
    main()