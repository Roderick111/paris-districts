#!/usr/bin/env python3
"""Build GeoJSON for Toulouse, Lille, Marseille, Nice, and Nantes micro-areas."""

from __future__ import annotations

import hashlib
import json
import re
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DATA = ROOT / "public" / "data"

# Toulouse: data.toulouse-metropole.fr quartiers-de-democratie-locale
TOULOUSE_QUARTIER_URL = (
    "https://data.toulouse-metropole.fr/api/explore/v2.1/catalog/datasets/"
    "quartiers-de-democratie-locale/exports/geojson"
)
# Nantes: data.nantesmetropole.fr administrative quartiers
NANTES_QUARTIER_URL = (
    "https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/"
    "244400404_quartiers-communes-nantes-metropole/exports/geojson"
)
# Marseille: data.ampmetropole.fr official 111 quartiers
MARSEILLE_QUARTIER_URL = (
    "https://data.ampmetropole.fr/api/explore/v2.1/catalog/datasets/"
    "a7104f3c-e487-4af3-82ad-6197cedfaeb1/exports/geojson"
)
# Nice: cartes.nicecotedazur.org official quartier layer
NICE_QUARTIER_URL = (
    "https://cartes.nicecotedazur.org/heberge/rest/services/Limites_administratives/"
    "MapServer/10/query?where=1%3D1&outFields=QUARTIER&outSR=4326&f=geojson"
)
# Lille: data.lillemetropole.fr geoserver WFS official quartiers
LILLE_QUARTIER_LAYER = "ville_lille:limite_des_quartiers_de_lille_et_de_ses_communes_associees"
VDA_QUARTIER_LAYER = "ville_villeneuve_d_ascq:quartier"
LILLE_WFS = "https://data.lillemetropole.fr/geoserver/wfs"

CITY_SPECS: dict[str, dict[str, Any]] = {
    "toulouse": {
        "places_file": ROOT / "src/data/toulousePlaces.ts",
        "output": PUBLIC_DATA / "toulouse.geojson",
        "micro_specs": [
            {"code": "toulouse-capitole-carmes-esquirol", "name": "Capitole / Carmes / Esquirol", "kind": "quartier",
             "toulouse_split": ("Capitole / Arnaud Bernard / Carmes", "west", 1.4442)},
            {"code": "toulouse-arnaud-bernard-saint-sernin", "name": "Arnaud-Bernard / Saint-Sernin", "kind": "quartier",
             "toulouse_split": ("Capitole / Arnaud Bernard / Carmes", "east", 1.4442)},
            {"code": "toulouse-compans-amidonniers", "name": "Compans / Amidonniers", "kind": "quartier",
             "toulouse": ["Amidonniers / Compans-Caffarelli / Brouardel"]},
            {"code": "toulouse-chalets-bayard-saint-aubin", "name": "Chalets / Bayard / Saint-Aubin", "kind": "quartier",
             "toulouse": ["Les Chalets / Bayard / Belfort / Saint-Aubin / Dupuy"]},
            {"code": "toulouse-saint-cyprien-patte-doie", "name": "Saint-Cyprien / Patte-d'Oie", "kind": "quartier",
             "toulouse": ["Saint-Cyprien"]},
            {"code": "toulouse-saint-michel-saint-agne", "name": "Saint-Michel / Saint-Agne", "kind": "quartier",
             "toulouse_split": ("Saint-Michel /  Saint-Agne / Empalot / Le Busca / Île du Ramier / Monplaisir", "north", 43.5885)},
            {"code": "toulouse-empalot", "name": "Empalot", "kind": "quartier",
             "toulouse_split": ("Saint-Michel /  Saint-Agne / Empalot / Le Busca / Île du Ramier / Monplaisir", "south", 43.5885)},
            {"code": "toulouse-rangueil-sauzelong", "name": "Rangueil / Sauzelong / Jules-Julien", "kind": "quartier",
             "toulouse": ["Rangueil / Sauzelong / Jules-Julien / Pech-David / Pouvourville"]},
            {"code": "toulouse-mirail-reynerie-bellefontaine", "name": "Mirail / Reynerie / Bellefontaine", "kind": "quartier",
             "toulouse": ["Mirail -Université / Reynerie / Bellefontaine"]},
            {"code": "toulouse-minimes-barriere-paris", "name": "Minimes / Barrière de Paris / La Vache", "kind": "quartier",
             "toulouse": ["Minimes / Barrière de Paris / Ponts-Jumeaux / La Vache / Raisin / Fondeyre"]},
        ],
    },
    "lille": {
        "places_file": ROOT / "src/data/lillePlaces.ts",
        "output": PUBLIC_DATA / "lille.geojson",
        "micro_specs": [
            {"code": "lille-centre-gares-euralille", "name": "Lille-Centre / Gares / Euralille", "kind": "quartier", "lille": ["Lille-Centre"]},
            {"code": "lille-vauban-esquermes", "name": "Vauban-Esquermes / Catho", "kind": "quartier", "lille": ["Vauban-Esquermes"]},
            {"code": "lille-vieux-lille", "name": "Vieux-Lille", "kind": "quartier", "lille": ["Vieux-Lille"]},
            {"code": "lille-wazemmes", "name": "Wazemmes", "kind": "quartier", "lille": ["Wazemmes"]},
            {"code": "lille-moulins", "name": "Moulins", "kind": "quartier", "lille": ["Lille-Moulins"]},
            {"code": "lille-fives", "name": "Fives", "kind": "quartier", "lille": ["Fives"]},
            {"code": "lille-bois-blancs-euratechnologies", "name": "Bois-Blancs / Euratechnologies", "kind": "quartier", "lille": ["Bois-Blancs"]},
            {"code": "lille-sud", "name": "Lille-Sud", "kind": "quartier", "lille": ["Lille-Sud"]},
            {"code": "lille-vda-cite-scientifique", "name": "Villeneuve-d'Ascq Cité Scientifique", "kind": "quartier", "vda": ["Cité Scientifique"]},
            {"code": "lille-vda-pont-de-bois", "name": "Villeneuve-d'Ascq Pont de Bois", "kind": "quartier", "vda": ["Pont-de-Bois"]},
        ],
    },
    "marseille": {
        "places_file": ROOT / "src/data/marseillePlaces.ts",
        "output": PUBLIC_DATA / "marseille.geojson",
        "micro_specs": [
            {"code": "marseille-saint-charles-belle-de-mai", "name": "Saint-Charles / Belle de Mai edge", "kind": "quartier",
             "marseille": ["SAINT CHARLES", "BELLE DE MAI", "SAINT LAZARE"]},
            {"code": "marseille-noailles-belsunce", "name": "Noailles / Belsunce", "kind": "quartier", "marseille": ["NOAILLES", "BELSUNCE"]},
            {"code": "marseille-la-plaine-cours-julien", "name": "La Plaine / Cours Julien", "kind": "quartier",
             "marseille": ["NOTRE DAME DU MONT", "PALAIS DE JUSTICE", "LODI"]},
            {"code": "marseille-baille-timone", "name": "Baille / La Timone", "kind": "quartier", "marseille": ["BAILLE", "LA TIMONE"]},
            {"code": "marseille-castellane-prefecture", "name": "Castellane / Préfecture", "kind": "quartier", "marseille": ["CASTELLANE", "PREFECTURE"]},
            {"code": "marseille-prado-perier-rouet", "name": "Prado / Périer / Rouet", "kind": "quartier",
             "marseille": ["PERIER", "LE ROUET", "SAINT GINIEZ"]},
            {"code": "marseille-vieux-port-panier", "name": "Vieux-Port / Panier", "kind": "quartier",
             "marseille": ["OPERA", "CHAPITRE", "HOTEL DE VILLE", "GRANDS CARMES"]},
            {"code": "marseille-endoume-catalans", "name": "Endoume / Catalans", "kind": "quartier", "marseille": ["ENDOUME"]},
            {"code": "marseille-luminy-redon", "name": "Luminy / Redon campus", "kind": "quartier",
             "marseille": ["LE REDON", "LE CABOT", "MAZARGUES"], "allowMultipart": True},
            {"code": "marseille-saint-jerome-chateau-gombert", "name": "Saint-Jérôme / Château-Gombert", "kind": "quartier",
             "marseille": ["SAINT JEROME", "CHATEAU-GOMBERT"]},
            {"code": "marseille-castellane-15e-north", "name": "La Castellane / 15e north", "kind": "quartier",
             "marseille": ["LA CALADE", "LA VISTE", "LES CROTTES", "LES AYGALADES", "LA CABUCELLE"]},
        ],
    },
    "nice": {
        "places_file": ROOT / "src/data/nicePlaces.ts",
        "output": PUBLIC_DATA / "nice.geojson",
        "micro_specs": [
            {"code": "nice-jean-medecin-carabacel", "name": "Jean-Médecin / Carabacel", "kind": "quartier", "nice": ["Centre Ville", "Carabacel", "Médecin"]},
            {"code": "nice-vieux-nice-port", "name": "Vieux-Nice / Port", "kind": "quartier", "nice": ["Vieille Ville", "Le Port"]},
            {"code": "nice-liberation-valrose", "name": "Libération / Borriglione / Valrose", "kind": "quartier", "nice": ["Libération", "Saint Maurice"]},
            {"code": "nice-thiers-musiciens", "name": "Thiers / Musiciens", "kind": "quartier", "nice": ["Thiers", "Gambetta"]},
            {"code": "nice-riquier-saint-roch", "name": "Riquier / Saint-Roch", "kind": "quartier", "nice": ["Riquier", "Saint Roch"]},
            {"code": "nice-carlone-madeleine", "name": "Carlone / Madeleine", "kind": "quartier", "nice": ["Madeleine", "Fabron"]},
            {"code": "nice-cimiez-rimiez", "name": "Cimiez / Rimiez", "kind": "quartier", "nice": ["Cimiez", "Rimiez"]},
            {"code": "nice-pasteur-roquebilliere", "name": "Pasteur / Roquebillière", "kind": "quartier", "nice": ["Pasteur", "Roquebillière"]},
            {"code": "nice-ariane", "name": "Ariane", "kind": "quartier", "nice": ["Ariane"]},
            {"code": "nice-arenas-saint-augustin", "name": "Arénas / Saint-Augustin / EDHEC", "kind": "quartier", "nice": ["Arenas", "Saint Augustin"]},
        ],
    },
    "nantes": {
        "places_file": ROOT / "src/data/nantesPlaces.ts",
        "output": PUBLIC_DATA / "nantes.geojson",
        "micro_specs": [
            {"code": "nantes-centre-ville-decre", "name": "Centre-ville / Decré-Commerce-Graslin", "kind": "quartier", "nantes": ["Centre-ville"]},
            {"code": "nantes-hauts-paves-saint-felix", "name": "Hauts-Pavés / Saint-Félix / Michelet", "kind": "quartier", "nantes": ["Hauts-Pavés - Saint-Félix"]},
            {"code": "nantes-nord-joneliere", "name": "Nantes Nord / Jonelière-Université", "kind": "quartier", "nantes": ["Nantes Nord"]},
            {"code": "nantes-ile-de-nantes", "name": "Île de Nantes", "kind": "quartier", "nantes": ["Île de Nantes"]},
            {"code": "nantes-malakoff-saint-donatien", "name": "Malakoff / Saint-Donatien", "kind": "quartier", "nantes": ["Malakoff - Saint-Donatien"]},
            {"code": "nantes-dervallieres-zola", "name": "Dervallières / Zola", "kind": "quartier", "nantes": ["Dervallières - Zola"]},
            {"code": "nantes-bellevue-chantenay", "name": "Bellevue / Chantenay / Sainte-Anne", "kind": "quartier", "nantes": ["Bellevue - Chantenay - Sainte-Anne"]},
            {"code": "nantes-breil-barberie", "name": "Breil / Barberie", "kind": "quartier", "nantes": ["Breil - Barberie"]},
            {"code": "nantes-erdre-chantrerie", "name": "Nantes Erdre / Chantrerie", "kind": "quartier", "nantes": ["Nantes Erdre"]},
            {"code": "nantes-doulon-bottiere", "name": "Doulon / Bottière", "kind": "quartier", "nantes": ["Doulon - Bottière"]},
        ],
    },
}


def fetch_json(url: str) -> dict[str, Any]:
    request = urllib.request.Request(url, headers={"User-Agent": "paris-student-map/1.0"})
    with urllib.request.urlopen(request, timeout=180) as response:
        return json.load(response)


def polygon_parts(geometry: dict[str, Any]) -> list[Any]:
    if geometry["type"] == "Polygon":
        return [geometry["coordinates"]]
    return geometry["coordinates"]


def clip_ring_by_coord(
    ring: list[list[float]],
    split_value: float,
    axis_index: int,
    keep: str,
) -> list[list[float]]:
    def inside(value: float) -> bool:
        if axis_index == 0:
            return value < split_value if keep == "west" else value >= split_value
        return value >= split_value if keep == "north" else value < split_value

    def intersect(previous: list[float], current: list[float]) -> list[float]:
        x1, y1 = previous
        x2, y2 = current
        if axis_index == 0:
            if abs(x2 - x1) < 1e-12:
                return [split_value, y1]
            ratio = (split_value - x1) / (x2 - x1)
            return [split_value, y1 + ratio * (y2 - y1)]
        if abs(y2 - y1) < 1e-12:
            return [x1, split_value]
        ratio = (split_value - y1) / (y2 - y1)
        return [x1 + ratio * (x2 - x1), split_value]

    output: list[list[float]] = []
    if not ring:
        return output
    previous = ring[-1]
    for current in ring:
        previous_inside = inside(previous[axis_index])
        current_inside = inside(current[axis_index])
        if current_inside:
            if not previous_inside:
                output.append(intersect(previous, current))
            output.append(current)
        elif previous_inside:
            output.append(intersect(previous, current))
        previous = current
    return output


def split_geometry(geometry: dict[str, Any], axis_index: int, split_value: float, keep: str) -> dict[str, Any]:
    kept: list[Any] = []
    for poly in polygon_parts(geometry):
        outer = clip_ring_by_coord(poly[0], split_value, axis_index, keep)
        if len(outer) >= 4:
            kept.append([outer, *poly[1:]])
    if not kept:
        raise ValueError(f"No geometry kept for {keep} split at {split_value}")
    if len(kept) == 1:
        return {"type": "Polygon", "coordinates": kept[0]}
    return {"type": "MultiPolygon", "coordinates": kept}


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


def load_score_codes(places_file: Path) -> set[str]:
    content = places_file.read_text(encoding="utf-8")
    return set(re.findall(r'code:\s*"([^"]+)"', content))


def load_toulouse() -> dict[str, dict[str, Any]]:
    features = fetch_json(TOULOUSE_QUARTIER_URL)["features"]
    return {feature["properties"]["nom_quartier"]: feature["geometry"] for feature in features}


def load_nantes() -> dict[str, dict[str, Any]]:
    features = fetch_json(NANTES_QUARTIER_URL)["features"]
    shapes: dict[str, dict[str, Any]] = {}
    for feature in features:
        if feature["properties"].get("libcom") != "Nantes":
            continue
        shapes[feature["properties"]["nom"]] = feature["geometry"]
    return shapes


def load_marseille() -> dict[str, dict[str, Any]]:
    features = fetch_json(MARSEILLE_QUARTIER_URL)["features"]
    shapes: dict[str, dict[str, Any]] = {}
    for feature in features:
        name = feature["properties"]["nom_qua"]
        existing = shapes.get(name)
        if existing is None or len(json.dumps(feature["geometry"])) > len(json.dumps(existing)):
            shapes[name] = feature["geometry"]
    return shapes


def load_nice() -> dict[str, dict[str, Any]]:
    features = fetch_json(NICE_QUARTIER_URL)["features"]
    return {feature["properties"]["QUARTIER"]: feature["geometry"] for feature in features}


def load_lille() -> tuple[dict[str, dict[str, Any]], dict[str, dict[str, Any]]]:
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
                "count": 100,
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


def geometry_for_spec(
    spec: dict[str, Any],
    sources: dict[str, dict[str, dict[str, Any]]],
) -> dict[str, Any]:
    if "toulouse_split" in spec:
        source, keep, split_value = spec["toulouse_split"]
        axis_index = 0 if keep in {"west", "east"} else 1
        keep_side = keep if keep in {"west", "north"} else ("east" if keep == "east" else "south")
        return split_geometry(sources["toulouse"][source], axis_index, split_value, keep_side)
    for key in ("toulouse", "nantes", "marseille", "nice", "lille", "vda"):
        if key in spec:
            missing = [name for name in spec[key] if name not in sources[key]]
            if missing:
                raise SystemExit(f"Missing {key} polygons for {spec['code']}: {missing}")
            return merge_geometries([sources[key][name] for name in spec[key]])
    raise ValueError(f"Spec {spec['code']} has no geometry source")


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


def build_city(city_id: str, config: dict[str, Any]) -> None:
    if city_id == "toulouse":
        sources = {"toulouse": load_toulouse()}
    elif city_id == "nantes":
        sources = {"nantes": load_nantes()}
    elif city_id == "marseille":
        sources = {"marseille": load_marseille()}
    elif city_id == "nice":
        sources = {"nice": load_nice()}
    elif city_id == "lille":
        lille_shapes, vda_shapes = load_lille()
        sources = {"lille": lille_shapes, "vda": vda_shapes}
    else:
        raise ValueError(f"Unknown city {city_id}")

    features = []
    for spec in config["micro_specs"]:
        geometry = geometry_for_spec(spec, sources)
        properties = {"code": spec["code"], "name": spec["name"], "kind": spec["kind"]}
        if spec.get("allowMultipart"):
            properties["allowMultipart"] = True
        features.append({"type": "Feature", "geometry": geometry, "properties": properties})

    score_codes = load_score_codes(config["places_file"])
    audit_output(features, score_codes)
    output = config["output"]
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("w", encoding="utf-8") as handle:
        json.dump({"type": "FeatureCollection", "features": features}, handle, separators=(",", ":"))
    print(f"{city_id}: wrote {len(features)} features to {output}")


def main() -> None:
    for city_id, config in CITY_SPECS.items():
        build_city(city_id, config)


if __name__ == "__main__":
    main()
