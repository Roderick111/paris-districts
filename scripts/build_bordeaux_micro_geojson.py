#!/usr/bin/env python3
"""Build Bordeaux micro-area GeoJSON from official se_quart_s + se_iri24_s polygons."""

from __future__ import annotations

import hashlib
import json
import re
import urllib.request
from pathlib import Path
from typing import Any

QUARTIER_URL = (
    "https://datahub.bordeaux-metropole.fr/api/explore/v2.1/catalog/datasets/"
    "se_quart_s/exports/geojson"
)
IRIS_URL = (
    "https://datahub.bordeaux-metropole.fr/api/explore/v2.1/catalog/datasets/"
    "se_iri24_s/exports/geojson"
)
COMMUNE_URL = "https://geo.api.gouv.fr/communes/{insee}?format=geojson&geometry=contour"
OUTPUT = "public/data/bordeaux.geojson"
PLACES_FILE = "src/data/bordeauxPlaces.ts"

TALENCE_INSEE = "33522"
PESSAC_INSEE = "33318"
GRADIGNAN_INSEE = "33192"
BORdeaux_INSEE = "33063"

MAP_EXCLUDED_SCORE_CODES = {
    "gradignan-centre-mandavit",
    "gradignan-campus-beausoleil",
    "gradignan-malartic-barthez",
}

SLIVER_MIN_AREA = 8e-6
SLIVER_MAX_ASPECT = 12.0

MICRO_SPECS: list[dict[str, Any]] = [
    {"code": "bdx-centre-saint-pierre", "name": "Saint-Pierre / Saint-Paul", "kind": "quartier",
     "iris": ["Saint-Bruno-Saint-Victor 1", "Saint-Bruno-Saint-Victor 2"]},
    {"code": "bdx-centre-hotel-ville", "name": "Hôtel de Ville / Pey-Berland / Mériadeck", "kind": "quartier",
     "iris": [f"Hôtel de Ville-Quinconces {index}" for index in range(1, 5)]},
    {"code": "bdx-centre-quinconces", "name": "Quinconces / Tourny / Triangle d'Or", "kind": "quartier",
     "iris": [f"Hôtel de Ville-Quinconces {index}" for index in range(5, 9)]},
    {"code": "bdx-sud-victoire", "name": "Victoire / Sainte-Eulalie", "kind": "quartier",
     "iris": [f"Capucins-Victoire {index}" for index in range(1, 5)]},
    {"code": "bdx-sud-saint-michel-capucins", "name": "Saint-Michel / Capucins", "kind": "quartier",
     "iris": [f"Capucins-Victoire {index}" for index in range(5, 9)]},
    {"code": "bdx-sud-sainte-croix", "name": "Sainte-Croix / Saint-Jean", "kind": "quartier",
     "iris": ["Gare Saint-Jean 1", "Gare Saint-Jean 2", "Gare Saint-Jean 3"]},
    {"code": "bdx-sud-belcier", "name": "Belcier / Euratlantique / Paludate", "kind": "quartier",
     "iris": ["Gare Saint-Jean 4", "Gare Saint-Jean 5"]},
    {"code": "bdx-chartrons-chartrons", "name": "Chartrons", "kind": "quartier",
     "iris": ["Chartrons-Grand Parc 2", "Chartrons-Grand Parc 9", "Chartrons-Grand Parc 11"]},
    {"code": "bdx-chartrons-jardin-public", "name": "Jardin Public / Fondaudège", "kind": "quartier",
     "iris": [f"Saint-Seurin-Fondaudège {index}" for index in range(1, 10)]},
    {"code": "bdx-chartrons-grand-parc", "name": "Grand Parc / Ravezies", "kind": "quartier",
     "iris": ["Chartrons-Grand Parc 5", "Chartrons-Grand Parc 6", "Chartrons-Grand Parc 7",
              "Chartrons-Grand Parc 8", "Chartrons-Grand Parc 10", "Chartrons-Grand Parc 12"]},
    {"code": "bdx-maritime-bassins", "name": "Bassins à flot / Bacalan", "kind": "quartier",
     "iris": [f"Bacalan {index}" for index in range(1, 5)]},
    {"code": "bdx-maritime-aubiers", "name": "Aubiers / Le Lac", "kind": "quartier",
     "iris": ["Chartrons-Grand Parc 13"]},
    {"code": "bdx-maritime-ginko", "name": "Ginko / Bordeaux-Lac", "kind": "quartier",
     "iris": ["Le Lac 1", "Le Lac 3", "Chartrons-Grand Parc 1", "Chartrons-Grand Parc 3"]},
    {"code": "bdx-bastide-stalingrad", "name": "Bastide-Stalingrad / Jardin Botanique", "kind": "quartier",
     "iris": ["La Bastide 1", "La Bastide 2"]},
    {"code": "bdx-bastide-niel", "name": "Bastide-Niel / Brazza / Darwin", "kind": "quartier",
     "iris": ["La Bastide 3"]},
    {"code": "bdx-bastide-benauge", "name": "Benauge / Galin", "kind": "quartier",
     "iris": ["La Bastide 4", "La Bastide 5"]},
    {"code": "bdx-nansouty-nansouty", "name": "Nansouty / Barrière de Toulouse", "kind": "quartier",
     "iris": [f"Nansouty {index}" for index in range(1, 6)]},
    {"code": "bdx-nansouty-saint-genes", "name": "Saint-Genès / Roustaing", "kind": "quartier",
     "iris": [f"Nansouty {index}" for index in range(6, 10)]},
    {"code": "bdx-saint-augustin-augustin", "name": "Saint-Augustin / Pellegrin", "kind": "quartier",
     "iris": [f"Saint-Augustin {index}" for index in range(1, 4)]},
    {"code": "bdx-saint-augustin-tauzin", "name": "Tauzin / Alphonse-Dupeux", "kind": "quartier",
     "iris": ["Saint-Augustin 4", "Saint-Augustin 5", "Saint-Bruno-Saint-Victor 3",
              "Saint-Bruno-Saint-Victor 4", "Saint-Bruno-Saint-Victor 5", "Saint-Bruno-Saint-Victor 6"]},
    {"code": "bdx-cauderan-centre", "name": "Caudéran centre / Primerose", "kind": "quartier",
     "iris": ["Villa Primerose Parc Bordelais-Caudéran 1", "Villa Primerose Parc Bordelais-Caudéran 2",
              "Villa Primerose Parc Bordelais-Caudéran 3"]},
    {"code": "bdx-cauderan-parc-bordelais", "name": "Parc Bordelais / Monséjour", "kind": "quartier",
     "iris": ["Villa Primerose Parc Bordelais-Caudéran 4", "Villa Primerose Parc Bordelais-Caudéran 5",
              "Villa Primerose Parc Bordelais-Caudéran 6", "Lestonnat-Monséjour 1", "Lestonnat-Monséjour 2",
              "Lestonnat-Monséjour 3", "Lestonnat-Monséjour 4"]},
    {"code": "bdx-cauderan-stehelin", "name": "Stéhélin / Pins-Francs", "kind": "quartier",
     "iris": [f"Lestonnat-Monséjour {index}" for index in range(5, 10)]},
    {"code": "talence-centre-forum-peixotto", "name": "Talence centre / Forum / Peixotto", "kind": "commune",
     "sub_quartiers": ["Poste-Mairie", "Peylanne", "Plume la Poule"]},
    {"code": "talence-campus", "name": "Talence campus / Arts-et-Métiers", "kind": "commune",
     "sub_quartiers": ["Domaine Universitaire", "Thouars", "Compostelle", "Le Bijou", "Raba", "Le Lycée"]},
    {"code": "talence-medoquine-roustaing", "name": "Talence Médoquine / Roustaing", "kind": "commune",
     "sub_quartiers": ["Médoquine", "La Taillade", "Zola", "Saint Genès", "La Fauvette", "Caudérès"]},
    {"code": "talence-haut-brion", "name": "Talence Haut-Brion", "kind": "commune",
     "sub_quartiers": ["Haut Brion"]},
    {"code": "pessac-saige", "name": "Pessac Saige", "kind": "commune",
     "sub_quartiers": ["Saige"]},
    {"code": "pessac-campus-compostelle", "name": "Pessac campus / Compostelle", "kind": "commune",
     "sub_quartiers": ["La Paillère-Compostelle"]},
    {"code": "pessac-centre-camponac", "name": "Pessac centre / Camponac", "kind": "commune",
     "sub_quartiers": ["Le Bourg", "Casino", "Sardine", "Arago-La Chataigneraie", "Chiquet-Fontaudin"]},
    {"code": "pessac-magonty", "name": "Pessac Magonty / Toctoucau", "kind": "commune",
     "sub_quartiers": ["Magonty", "Toctoucau", "Cap de Bos"]},
    {"code": "pessac-alouette", "name": "Pessac Alouette", "kind": "commune",
     "sub_quartiers": ["France Alouette"]},
    {"code": "pessac-bourgailh", "name": "Pessac Bourgailh", "kind": "commune",
     "sub_quartiers": ["3M-Bourgailh", "Le Monteil"]},
    {"code": "pessac-haut-leveque", "name": "Pessac Haut-Lévêque", "kind": "commune",
     "sub_quartiers": ["Brivazac-Candau", "Le Vallon-Les Echoppes", "Noès", "Verthamon"]},
    {"code": "gradignan-commune", "name": "Gradignan", "kind": "commune",
     "commune_full": GRADIGNAN_INSEE},
]


def fetch_json(url: str) -> dict[str, Any]:
    request = urllib.request.Request(url, headers={"User-Agent": "paris-student-map/1.0"})
    with urllib.request.urlopen(request, timeout=180) as response:
        return json.load(response)


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


def source_names(spec: dict[str, Any]) -> list[str]:
    if "sub_quartiers" in spec:
        return list(spec["sub_quartiers"])
    if "iris" in spec:
        return list(spec["iris"])
    if "commune_full" in spec:
        return [spec["commune_full"]]
    raise ValueError(f"Spec {spec['code']} has no geometry source")


def is_connected_source_group(names: list[str], shapes: dict[str, dict[str, Any]]) -> bool:
    if len(names) <= 1:
        return True
    remaining = set(names)
    seed = remaining.pop()
    stack = [seed]
    visited = {seed}
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
    return [
        {"type": "Polygon", "coordinates": poly}
        for poly in polygon_parts(geometry)
    ]


def components_are_contiguous(components: list[dict[str, Any]]) -> bool:
    if len(components) <= 1:
        return True
    names = [str(index) for index in range(len(components))]
    shapes = {name: components[index] for index, name in enumerate(names)}
    return is_connected_source_group(names, shapes)


def merge_geometries(geometries: list[dict[str, Any]]) -> dict[str, Any]:
    polygons: list[Any] = []
    for geometry in geometries:
        polygons.extend(polygon_parts(geometry))
    if not polygons:
        raise ValueError("Cannot merge empty geometry list")
    if len(polygons) == 1:
        return {"type": "Polygon", "coordinates": polygons[0]}
    return {"type": "MultiPolygon", "coordinates": polygons}


def geometry_hash(geometry: dict[str, Any]) -> str:
    payload = json.dumps(geometry, sort_keys=True, separators=(",", ":"))
    return hashlib.md5(payload.encode()).hexdigest()[:12]


def load_score_codes() -> set[str]:
    content = Path(PLACES_FILE).read_text(encoding="utf-8")
    micro_block = content.split("export const bordeauxMicroPlaces", 1)[1]
    return set(re.findall(r'code:\s*"([^"]+)"', micro_block))


def geometry_for_spec(
    spec: dict[str, Any],
    sub_quartiers: dict[str, dict[str, Any]],
    iris_zones: dict[str, dict[str, Any]],
    communes: dict[str, dict[str, Any]],
) -> dict[str, Any]:
    if "commune_full" in spec:
        return communes[spec["commune_full"]]
    if "sub_quartiers" in spec:
        return merge_geometries([sub_quartiers[name] for name in spec["sub_quartiers"]])
    if "iris" in spec:
        return merge_geometries([iris_zones[name] for name in spec["iris"]])
    raise ValueError(f"Spec {spec['code']} has no geometry source")


def geometry_is_valid(geometry: dict[str, Any]) -> bool:
    if geometry.get("type") not in {"Polygon", "MultiPolygon"}:
        return False
    return bool(polygon_parts(geometry))


def audit_source_contiguity(
    spec: dict[str, Any],
    sub_quartiers: dict[str, dict[str, Any]],
    iris_zones: dict[str, dict[str, Any]],
) -> None:
    if "commune_full" in spec:
        return
    names = source_names(spec)
    shapes = iris_zones if "iris" in spec else sub_quartiers
    missing = [name for name in names if name not in shapes]
    if missing:
        raise SystemExit(f"Missing source polygons for {spec['code']}: {missing}")
    if not is_connected_source_group(names, shapes):
        raise SystemExit(f"Disconnected source group for {spec['code']}: {names}")


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
        if geometry["type"] == "MultiPolygon" and not feature["properties"].get("allowMultipart"):
            parts = geometry_components(geometry)
            if not components_are_contiguous(parts):
                raise SystemExit(
                    f"Disconnected MultiPolygon for {code} without allowMultipart",
                )


def audit_sub_quartier_coverage(
    consumed: set[str],
    by_insee: dict[str, set[str]],
) -> None:
    missing_by_insee: dict[str, list[str]] = {}
    for insee, expected in by_insee.items():
        missing = sorted(expected - consumed)
        if missing:
            missing_by_insee[insee] = missing
    if missing_by_insee:
        for insee, names in missing_by_insee.items():
            print(f"Unassigned official sub-quartiers for INSEE {insee}:")
            for name in names:
                print(f"  - {name}")
        raise SystemExit("Sub-quartier coverage audit failed")


def audit_iris_coverage(consumed: set[str], expected: set[str]) -> None:
    missing = sorted(expected - consumed)
    extra = sorted(consumed - expected)
    if missing:
        raise SystemExit(f"Unassigned Bordeaux IRIS zones: {missing}")
    if extra:
        raise SystemExit(f"Unknown Bordeaux IRIS zones referenced: {extra}")


def audit_output_features(features: list[dict[str, Any]], score_codes: set[str]) -> None:
    feature_codes = [feature["properties"]["code"] for feature in features]
    duplicate_codes = sorted({code for code in feature_codes if feature_codes.count(code) > 1})
    if duplicate_codes:
        raise SystemExit(f"Duplicate feature codes: {duplicate_codes}")

    hash_to_codes: dict[str, list[str]] = {}
    for feature in features:
        code = feature["properties"]["code"]
        if not geometry_is_valid(feature["geometry"]):
            raise SystemExit(f"Invalid or empty geometry for feature {code}")
        digest = geometry_hash(feature["geometry"])
        hash_to_codes.setdefault(digest, []).append(code)

    duplicate_hashes = {
        digest: codes
        for digest, codes in hash_to_codes.items()
        if len(codes) > 1
    }
    if duplicate_hashes:
        print("Identical geometry hashes across features:")
        for digest, codes in duplicate_hashes.items():
            print(f"  {digest}: {codes}")
        raise SystemExit("Geometry audit failed: duplicate geometry across scored features")

    feature_code_set = set(feature_codes)
    expected_map_codes = score_codes - MAP_EXCLUDED_SCORE_CODES
    missing_features = sorted(expected_map_codes - feature_code_set)
    extra_features = sorted(feature_code_set - score_codes)
    if missing_features:
        raise SystemExit(f"Score rows without GeoJSON feature: {missing_features}")
    if extra_features:
        raise SystemExit(f"GeoJSON features without score row: {extra_features}")


def main() -> None:
    raw_quartiers = fetch_json(QUARTIER_URL)
    raw_iris = fetch_json(IRIS_URL)

    sub_quartiers: dict[str, dict[str, Any]] = {}
    iris_zones: dict[str, dict[str, Any]] = {}
    by_insee: dict[str, set[str]] = {
        TALENCE_INSEE: set(),
        PESSAC_INSEE: set(),
    }

    for feature in raw_quartiers["features"]:
        name = feature["properties"]["nom"]
        insee = feature["properties"]["insee"]
        geometry = feature["geometry"]
        existing = sub_quartiers.get(name)
        if existing is None or len(json.dumps(geometry)) > len(json.dumps(existing)):
            sub_quartiers[name] = geometry
        if insee in by_insee:
            by_insee[insee].add(name)

    for feature in raw_iris["features"]:
        if feature["properties"]["insee"] != BORdeaux_INSEE:
            continue
        iris_zones[feature["properties"]["nom_iris"]] = feature["geometry"]

    communes = {
        GRADIGNAN_INSEE: fetch_json(COMMUNE_URL.format(insee=GRADIGNAN_INSEE))["geometry"],
    }

    consumed_sub: set[str] = set()
    consumed_iris: set[str] = set()
    output_features = []
    for spec in MICRO_SPECS:
        audit_source_contiguity(spec, sub_quartiers, iris_zones)
        geometry = geometry_for_spec(spec, sub_quartiers, iris_zones, communes)
        if "sub_quartiers" in spec:
            consumed_sub.update(spec["sub_quartiers"])
        if "iris" in spec:
            consumed_iris.update(spec["iris"])
        output_features.append({
            "type": "Feature",
            "geometry": geometry,
            "properties": {
                "code": spec["code"],
                "name": spec["name"],
                "kind": spec["kind"],
            },
        })

    score_codes = load_score_codes()
    audit_sub_quartier_coverage(consumed_sub, by_insee)
    audit_iris_coverage(consumed_iris, set(iris_zones))
    audit_geometry_quality(output_features)
    audit_output_features(output_features, score_codes)

    with open(OUTPUT, "w", encoding="utf-8") as handle:
        json.dump({"type": "FeatureCollection", "features": output_features}, handle, separators=(",", ":"))

    print(f"Wrote {len(output_features)} features to {OUTPUT}")
    print(
        f"Consumed {len(consumed_sub)}/{sum(len(values) for values in by_insee.values())} "
        "Talence+Pessac sub-quartiers",
    )
    print(f"Consumed {len(consumed_iris)}/{len(iris_zones)} Bordeaux IRIS zones")
    if MAP_EXCLUDED_SCORE_CODES:
        print(f"Map-excluded score codes: {sorted(MAP_EXCLUDED_SCORE_CODES)}")


if __name__ == "__main__":
    main()