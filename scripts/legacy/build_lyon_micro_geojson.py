#!/usr/bin/env python3
"""Build Lyon micro-area GeoJSON from official council quartiers + metro polygons."""

from __future__ import annotations

import hashlib
import json
import urllib.request
from typing import Any

LYON_OFFICIAL_URL = (
    "https://data.grandlyon.com/geoserver/ogc/features/v1/collections/"
    "ville-de-lyon:vdl_vie_citoyenne.perimetre_de_quartier/items?limit=50"
)
METRO_QUARTIER_URL = (
    "https://data.grandlyon.com/geoserver/ogc/features/v1/collections/"
    "metropole-de-lyon:adr_voie_lieu.adrquartier/items?limit=300"
)
ECULLY_URL = "https://geo.api.gouv.fr/communes/69081?format=geojson&geometry=contour"
OUTPUT = "public/data/lyon.geojson"

VILLEURBANNE_METRO_SCOPE = [
    "Quartier Buers Croix-Luizet",
    "Quartier Charpennes Tonkin",
    "Quartier Cusset Bonnevay",
    "Quartier Cyprian Les Brosses",
    "Quartier Ferrandière Maisons Neuves",
    "Quartier Gratte-Ciel Dedieu Charmettes",
    "Quartier Perralière Grandclément",
    "Quartier Saint-Jean",
]

# code -> boundary spec
MICRO_SPECS: list[dict[str, Any]] = [
    {"code": "lyon-01-terreaux", "name": "Terreaux / Saint-Vincent", "kind": "quartier",
     "lyon": ["Bas des Pentes - Presqu'île"]},
    {"code": "lyon-01-pentes", "name": "Pentes / Chartreux", "kind": "quartier",
     "lyon": ["Haut et Coeur des Pentes", "Ouest Pentes"]},
    {"code": "lyon-02-bellecour", "name": "Bellecour / Cordeliers", "kind": "quartier",
     "lyon": ["Bellecour - Cordeliers"]},
    {"code": "lyon-02-ainay", "name": "Ainay", "kind": "quartier", "lyon": ["Bellecour - Carnot"]},
    {"code": "lyon-02-perrache", "name": "Perrache / Sainte-Blandine", "kind": "quartier",
     "lyon_split": ("Perrache - Confluence", "north", 45.7385)},
    {"code": "lyon-02-confluence", "name": "Confluence", "kind": "quartier",
     "lyon_split": ("Perrache - Confluence", "south", 45.7385)},
    {"code": "lyon-03-prefecture-guillotiere-nord", "name": "Préfecture / Moncey / Guillotière Nord",
     "kind": "quartier", "lyon": ["Mutualité - Préfecture - Moncey"]},
    {"code": "lyon-03-part-dieu", "name": "Part-Dieu / Villette", "kind": "quartier",
     "lyon": ["Voltaire - Part Dieu", "Villette - Paul Bert"]},
    {"code": "lyon-03-sans-souci", "name": "Sans Souci / Dauphiné / Grange Blanche", "kind": "quartier",
     "lyon": ["Sans Souci - Dauphiné"]},
    {"code": "lyon-03-montchat", "name": "Montchat", "kind": "quartier", "lyon": ["Montchat"]},
    {"code": "lyon-04-croix-rousse-plateau", "name": "Croix-Rousse plateau / Gros Caillou", "kind": "quartier",
     "lyon": ["Croix-Rousse Centre", "Croix-Rousse Est et Rhône"]},
    {"code": "lyon-04-serin-saone", "name": "Serin / Saône", "kind": "quartier", "lyon": ["Croix-Rousse Saône"]},
    {"code": "lyon-04-croix-rousse-ouest", "name": "Croix-Rousse west / Chazière", "kind": "quartier",
     "lyon": ["Croix-Rousse Ouest"]},
    {"code": "lyon-05-vieux-lyon", "name": "Vieux Lyon", "kind": "quartier", "lyon": ["Quartiers anciens"]},
    {"code": "lyon-05-fourviere", "name": "Fourvière / Saint-Just", "kind": "quartier",
     "lyon": ["Colline des Funiculaires"]},
    {"code": "lyon-05-menival", "name": "Saint-Irénée / Point-du-Jour / Champvert-Ménival", "kind": "quartier",
     "lyon": ["Champvert - Point du Jour - Jeunet", "Ménival - Battières - La Plaine"]},
    {"code": "lyon-06-brotteaux", "name": "Brotteaux / Foch-Masséna", "kind": "quartier", "lyon": ["Brotteaux"]},
    {"code": "lyon-06-tete-dor", "name": "Tête d'Or / Cité Internationale", "kind": "quartier",
     "lyon": ["Parc - Duquesne", "Saxe - Roosevelt"]},
    {"code": "lyon-06-bellecombe", "name": "Bellecombe", "kind": "quartier", "lyon": ["Bellecombe village"]},
    {"code": "lyon-07-guillotiere-universites", "name": "Guillotière Saint-Louis / Universités",
     "kind": "quartier", "lyon": ["Guillotière"]},
    {"code": "lyon-07-jean-mace", "name": "Jean Macé / Blandan", "kind": "quartier", "lyon": ["Jean Macé"]},
    {"code": "lyon-07-gerland", "name": "Gerland / Girondins-Debourg", "kind": "quartier", "lyon": ["Gerland"]},
    {"code": "lyon-08-monplaisir", "name": "Monplaisir / Lumière", "kind": "quartier", "lyon": ["Monplaisir"]},
    {"code": "lyon-08-bachut", "name": "Bachut / Transvaal-Laënnec", "kind": "quartier",
     "lyon": ["Bachut - Transvaal"]},
    {"code": "lyon-08-mermoz", "name": "Mermoz", "kind": "quartier", "lyon": ["Laënnec - Mermoz"]},
    {"code": "lyon-08-etats-unis", "name": "États-Unis / Santy / Grand Trou", "kind": "quartier",
     "lyon": ["Etats-Unis", "La Plaine - Santy", "Grand Trou - Moulin à Vent - Petite Guille"]},
    {"code": "lyon-09-vaise", "name": "Vaise / Industrie / Valmy", "kind": "quartier",
     "lyon": ["Vaise - Industrie - Rochecardon"]},
    {"code": "lyon-09-gorge-de-loup", "name": "Gorge de Loup / Champvert-Nord", "kind": "quartier",
     "lyon": ["Champvert - Gorge de Loup"]},
    {"code": "lyon-09-duchere", "name": "La Duchère", "kind": "quartier", "lyon": ["La Duchère"]},
    {"code": "lyon-09-saint-rambert", "name": "Saint-Rambert / Rochecardon / Île Barbe", "kind": "quartier",
     "lyon": ["Saint Rambert - Ile Barbe"]},
    {"code": "villeurbanne-charpennes", "name": "Charpennes / Tonkin", "kind": "quartier",
     "metro": ["Quartier Charpennes Tonkin"]},
    {"code": "villeurbanne-la-doua", "name": "La Doua / Croix-Luizet", "kind": "quartier",
     "metro_split": ("Quartier Buers Croix-Luizet", "north", 45.7835)},
    {"code": "villeurbanne-gratte-ciel", "name": "Gratte-Ciel / République", "kind": "quartier",
     "metro": ["Quartier Gratte-Ciel Dedieu Charmettes"]},
    {"code": "villeurbanne-cusset", "name": "Cusset / Bonnevay", "kind": "quartier",
     "metro": ["Quartier Cusset Bonnevay"]},
    {"code": "villeurbanne-grandclement", "name": "Grandclément / Maisons-Neuves / Perralière",
     "kind": "quartier",
     "metro": ["Quartier Perralière Grandclément", "Quartier Ferrandière Maisons Neuves"]},
    {"code": "villeurbanne-buers", "name": "Buers / Saint-Jean / Brosses", "kind": "quartier",
     "metro": ["Quartier Cyprian Les Brosses", "Quartier Saint-Jean"],
     "metro_split": ("Quartier Buers Croix-Luizet", "south", 45.7835)},
    {"code": "69081-ecully", "name": "Écully", "kind": "commune", "ecully": True},
]


def fetch_json(url: str) -> dict[str, Any]:
    request = urllib.request.Request(url, headers={"User-Agent": "paris-student-map/1.0"})
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.load(response)


def polygon_parts(geometry: dict[str, Any]) -> list[Any]:
    if geometry["type"] == "Polygon":
        return [geometry["coordinates"]]
    return geometry["coordinates"]


def clip_ring_by_lat(ring: list[list[float]], lat_split: float, keep: str) -> list[list[float]]:
    """Clip a ring to the north (lat >= split) or south (lat < split) half-plane."""

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


def merge_geometries(geometries: list[dict[str, Any]]) -> dict[str, Any]:
    polygons: list[Any] = []
    for geometry in geometries:
        polygons.extend(polygon_parts(geometry))
    if len(polygons) == 1:
        return {"type": "Polygon", "coordinates": polygons[0]}
    return {"type": "MultiPolygon", "coordinates": polygons}


def sources_from_spec(spec: dict[str, Any]) -> tuple[set[str], set[str]]:
    lyon_sources: set[str] = set()
    metro_sources: set[str] = set()
    if "lyon" in spec:
        lyon_sources.update(spec["lyon"])
    if "metro" in spec:
        metro_sources.update(spec["metro"])
    if "lyon_split" in spec:
        lyon_sources.add(spec["lyon_split"][0])
    if "metro_split" in spec:
        metro_sources.add(spec["metro_split"][0])
    return lyon_sources, metro_sources


def geometry_for_spec(
    spec: dict[str, Any],
    lyon_features: dict[str, dict[str, Any]],
    metro_features: dict[str, dict[str, Any]],
    ecully_geom: dict[str, Any],
) -> dict[str, Any]:
    if spec.get("ecully"):
        return ecully_geom
    if "lyon_split" in spec:
        source, keep, lat_split = spec["lyon_split"]
        return split_geometry_by_lat(lyon_features[source], lat_split, keep)
    if "metro_split" in spec:
        source, keep, lat_split = spec["metro_split"]
        return split_geometry_by_lat(metro_features[source], lat_split, keep)
    if "lyon" in spec:
        return merge_geometries([lyon_features[name] for name in spec["lyon"]])
    if "metro" in spec:
        return merge_geometries([metro_features[name] for name in spec["metro"]])
    raise ValueError(f"Spec {spec['code']} has no geometry source")


def geometry_hash(geometry: dict[str, Any]) -> str:
    payload = json.dumps(geometry, sort_keys=True, separators=(",", ":"))
    return hashlib.md5(payload.encode()).hexdigest()[:12]


def audit_source_coverage(
    consumed_lyon: set[str],
    consumed_metro: set[str],
    lyon_features: dict[str, dict[str, Any]],
    metro_features: dict[str, dict[str, Any]],
) -> None:
    missing_lyon = sorted(set(lyon_features) - consumed_lyon)
    missing_metro = sorted(set(VILLEURBANNE_METRO_SCOPE) - consumed_metro)
    if missing_lyon:
        print("Unassigned Lyon source quartiers:")
        for name in missing_lyon:
            print(f"  - {name}")
    if missing_metro:
        print("Unassigned Villeurbanne metro quartiers:")
        for name in missing_metro:
            print(f"  - {name}")
    if missing_lyon or missing_metro:
        raise SystemExit("Source coverage audit failed: unassigned quartiers in scope")


def audit_output_features(features: list[dict[str, Any]]) -> None:
    codes = [feature["properties"]["code"] for feature in features]
    duplicate_codes = sorted({code for code in codes if codes.count(code) > 1})
    if duplicate_codes:
        raise SystemExit(f"Duplicate feature codes: {duplicate_codes}")

    hash_to_codes: dict[str, list[str]] = {}
    for feature in features:
        code = feature["properties"]["code"]
        digest = geometry_hash(feature["geometry"])
        hash_to_codes.setdefault(digest, []).append(code)

    duplicate_hashes = {
        digest: codes_for_hash
        for digest, codes_for_hash in hash_to_codes.items()
        if len(codes_for_hash) > 1
    }
    if duplicate_hashes:
        print("Identical geometry hashes across features:")
        for digest, codes_for_hash in duplicate_hashes.items():
            print(f"  {digest}: {codes_for_hash}")
        raise SystemExit("Geometry audit failed: duplicate geometry across scored features")


def main() -> None:
    lyon_features = {
        feature["properties"]["nom"]: feature["geometry"]
        for feature in fetch_json(LYON_OFFICIAL_URL)["features"]
    }
    metro_features = {
        feature["properties"]["nom"]: feature["geometry"]
        for feature in fetch_json(METRO_QUARTIER_URL)["features"]
    }
    try:
        ecully_geom = fetch_json(ECULLY_URL)["geometry"]
    except Exception:
        with open(OUTPUT, encoding="utf-8") as handle:
            prior = json.load(handle)
        ecully_geom = next(
            feature["geometry"]
            for feature in prior["features"]
            if feature["properties"]["code"] == "69081-ecully"
        )

    consumed_lyon: set[str] = set()
    consumed_metro: set[str] = set()
    output_features = []
    for spec in MICRO_SPECS:
        lyon_sources, metro_sources = sources_from_spec(spec)
        consumed_lyon.update(lyon_sources)
        consumed_metro.update(metro_sources)
        geometry = geometry_for_spec(spec, lyon_features, metro_features, ecully_geom)
        output_features.append({
            "type": "Feature",
            "geometry": geometry,
            "properties": {
                "code": spec["code"],
                "name": spec["name"],
                "kind": spec["kind"],
            },
        })

    audit_source_coverage(consumed_lyon, consumed_metro, lyon_features, metro_features)
    audit_output_features(output_features)

    with open(OUTPUT, "w", encoding="utf-8") as handle:
        json.dump({"type": "FeatureCollection", "features": output_features}, handle, separators=(",", ":"))

    print(f"Wrote {len(output_features)} features to {OUTPUT}")
    print(f"Consumed {len(consumed_lyon)}/{len(lyon_features)} Lyon quartiers")
    print(f"Consumed {len(consumed_metro)}/{len(VILLEURBANNE_METRO_SCOPE)} Villeurbanne metro quartiers")


if __name__ == "__main__":
    main()