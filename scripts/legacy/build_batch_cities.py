#!/usr/bin/env python3
"""Build GeoJSON for batch cities: Rennes, Strasbourg, Grenoble, Montpellier, Toulon."""

from __future__ import annotations

import csv
import json
import re
import sys
import unicodedata
import urllib.parse
import urllib.request
from collections import deque
from pathlib import Path
from typing import Any

from build_new_city_geojson import (
    CITY_OUTPUTS as LEGACY_OUTPUTS,
    audit_output,
    fetch_json,
    load_iris,
    load_score_meta,
    merge_geometries,
    normalize_label,
    round_geometry_coords,
)
from geometry_audit import (
    audit_source_contiguity,
    bbox_area,
    geometries_touch,
    is_connected_source_group,
)

ROOT = Path(__file__).resolve().parents[2]
PUBLIC_DATA = ROOT / "public" / "data"
SCRIPTS = ROOT / "scripts"
IRIS_CACHE = SCRIPTS / "cache"
BATCH_GROUPS_JSON = SCRIPTS / "batch_city_groups.json"
GEOMETRY_JSON = SCRIPTS / "granularity_geometry.json"
INTENDED_JSON = SCRIPTS / "granularity_intended.json"
COMMUNE_GEO_API = "https://geo.api.gouv.fr/communes/{insee}?format=geojson&geometry=contour"

BATCH_OUTPUTS = {
    "rennes": (ROOT / "src/data/rennesPlaces.ts", PUBLIC_DATA / "rennes.geojson"),
    "strasbourg": (ROOT / "src/data/strasbourgPlaces.ts", PUBLIC_DATA / "strasbourg.geojson"),
    "grenoble": (ROOT / "src/data/grenoblePlaces.ts", PUBLIC_DATA / "grenoble.geojson"),
    "montpellier": (ROOT / "src/data/montpellierPlaces.ts", PUBLIC_DATA / "montpellier.geojson"),
    "toulon": (ROOT / "src/data/toulonPlaces.ts", PUBLIC_DATA / "toulon.geojson"),
}

MONTPELLIER_ZONE_SEEDS: dict[str, list[str]] = {
    "montpellier-ecusson-core": ["Peyrou", "Saint-Martin", "Verdanson", "Ursulines"],
    "montpellier-comedie-gare": ["Comédie", "République", "Chaptal", "La Guirlande"],
    "montpellier-beaux-arts-boutonnet": ["Beaux-Arts", "Boutonnet", "Nazareth", "Rimbaud"],
    "montpellier-arceaux-gambetta-figuerolles": ["Gambetta", "Casseyrols", "Astruc", "Les Aubes"],
    "montpellier-antigone": ["Nombre d'Or", "Place de l'Europe", "Rives du Lez"],
    "montpellier-richter-jacques-coeur": ["Bassin Jacques Cœur", "Oxford", "Charpak", "Le Mail Nord"],
    "montpellier-port-marianne-millenaire-odysseum": ["Millénaire", "Odysseum", "Méditerrannée", "Occitanie"],
    "montpellier-hopitaux-facultes-triolet": [
        "Assas",
        "Fac de Pharmacie",
        "École d'Architecture-Triolet",
        "Euromédecine",
    ],
    "montpellier-paul-valery-route-de-mende": [
        "Avenue de Lodève",
        "Agropolis",
        "École Normale",
        "Archives Départementales",
    ],
    "montpellier-aiguelongue-malbosc": ["Aiguelongue", "Malbosc", "Lunaret", "La Colline"],
    "montpellier-croix-argent-ovalie": ["Croix d'Argent", "Ovalie", "Garosud"],
    "montpellier-cevennes-celleneuve": ["Celleneuve", "Les Grèzes", "La Lironde", "La Fontaine"],
    "montpellier-mosson-paillade": ["Le Petit Bard", "Alco", "Les Tonnelles", "Pas du Loup"],
    "montpellier-pres-arenes-gare-sud": ["Saint-Denis", "Estanove", "Bouisses", "Lepic"],
}

TOULON_ZONE_SEEDS: dict[str, list[str]] = {
    "toulon-haute-ville-liberte": ["Haute Ville-Place Liberté", "Haute Ville-La Gare", "Cathédrale", "Les Lices", "Besagne"],
    "toulon-basse-ville-port": ["Le Port", "Port Marchand", "Place d'Armes-Arsenal", "Port Marchand-Port de Commerce"],
    "toulon-la-rode-mayol": ["La Rode", "Dutasta-Mayol"],
    "toulon-mourillon-core": ["Le Mourillon I", "Le Mourillon II", "Le Mourillon III", "Le Mourillon IV"],
    "toulon-la-mitre-fort-saint-louis": ["Saint-Louis", "Lamalgue"],
    "toulon-cap-brun-serinette": ["La Serinette-Le Cap Brun", "La Barre", "La Barre-Les Ameniers"],
    "toulon-saint-jean-du-var-font-pre": ["Saint-Jean du Var I", "Brunet-Font Pré", "Saint-Jean du Var II"],
    "toulon-sainte-musse-brunet": ["Sainte-Musse I", "Sainte-Musse II", "Brunet"],
    "toulon-pont-du-las-bon-rencontre": ["Pont du Las I", "Bon Rencontre-Arsenal", "Pont du Las II"],
    "toulon-nord-ouest-routes-valbertrand": ["Les Routes I", "Valbertrand", "Les Routes II"],
    "toulon-faron-claret-siblas": [
        "Faron-Fort Blanc",
        "Faron-Fort Rouge-Favières",
        "Dardennes-Ubac",
        "Les Pomets-Saint Pierre-Les Moulins",
        "Claret",
        "Siblas",
        "Siblas-La Loubière",
    ],
    "toulon-beaucaire-pont-neuf-lagoubran": ["La Beaucaire", "Pont Neuf", "Lagoubran"],
}


def load_commune_geometry(insee: str) -> dict[str, Any]:
    data = fetch_json(COMMUNE_GEO_API.format(insee=insee))
    return data["geometry"]


def load_opendatasoft_shapes(url: str, name_key: str) -> dict[str, dict[str, Any]]:
    features = fetch_json(url)["features"]
    shapes: dict[str, dict[str, Any]] = {}
    for feature in features:
        name = feature["properties"][name_key]
        shapes[name] = feature["geometry"]
        shapes.setdefault(normalize_label(name), feature["geometry"])
    return shapes


def load_grenoble_unions(url: str, name_key: str) -> dict[str, dict[str, Any]]:
    request = urllib.request.Request(url, headers={"User-Agent": "paris-student-map/1.0"})
    with urllib.request.urlopen(request, timeout=180) as response:
        text = response.read().decode("utf-8")
    shapes: dict[str, dict[str, Any]] = {}
    for row in csv.DictReader(text.splitlines()):
        name = row[name_key]
        geometry = json.loads(row["geo_shape"])
        shapes[name] = geometry
        shapes.setdefault(normalize_label(name), geometry)
    return shapes


def load_iris_canonical(insee: str) -> dict[str, dict[str, Any]]:
    cache_path = IRIS_CACHE / f"iris_{insee}.geojson"
    if not cache_path.exists():
        load_iris(insee)
    data = json.loads(cache_path.read_text(encoding="utf-8"))
    return {feature["properties"]["nom_iris"]: feature["geometry"] for feature in data["features"]}


def watershed_partition(
    seeds_by_code: dict[str, list[str]],
    pool: dict[str, dict[str, Any]],
) -> dict[str, list[str]]:
    names = list(pool)
    neighbors = {name: [] for name in names}
    for left_index, left in enumerate(names):
        for right in names[left_index + 1 :]:
            if geometries_touch(pool[left], pool[right]):
                neighbors[left].append(right)
                neighbors[right].append(left)
    assignment: dict[str, str] = {}
    for code, seeds in seeds_by_code.items():
        for seed in seeds:
            if seed in pool:
                assignment[seed] = code
    if not assignment:
        raise SystemExit(f"No valid seeds in pool for zones: {list(seeds_by_code)}")
    queue = deque((seed, code, 0) for code, seeds in seeds_by_code.items() for seed in seeds if seed in pool)
    while queue:
        node, code, _distance = queue.popleft()
        if node in assignment and assignment[node] != code:
            continue
        assignment[node] = code
        for neighbor in neighbors.get(node, []):
            if neighbor not in assignment:
                queue.append((neighbor, code, 0))
    unassigned = sorted(set(pool) - set(assignment))
    if unassigned:
        raise SystemExit(f"Unassigned source units ({len(unassigned)}): {unassigned[:12]}")
    return {code: sorted(name for name, owner in assignment.items() if owner == code) for code in seeds_by_code}


def geometry_for_names(
    code: str,
    names: list[str],
    shapes: dict[str, dict[str, Any]],
    *,
    label: str,
    check_contiguity: bool = True,
) -> dict[str, Any]:
    resolved: list[str] = []
    for name in names:
        geometry = shapes.get(name) or shapes.get(normalize_label(name))
        if geometry is None:
            raise SystemExit(f"Missing {label} polygon for {code}: {name}")
        resolved.append(name)
    subset = {name: shapes[name] if name in shapes else shapes[normalize_label(name)] for name in resolved}
    if check_contiguity and not is_connected_source_group(resolved, subset):
        print(f"warn: {code} disconnected {label} group ({len(resolved)} parts)")
    if check_contiguity:
        audit_source_contiguity(code, resolved, subset, label)
    return merge_geometries([subset[name] for name in resolved])


def rennes_shape_names(config: dict[str, Any], shapes: dict[str, dict[str, Any]]) -> list[str]:
    configured = {
        name
        for parent_names in config["parentZones"].values()
        for name in parent_names
    }
    return sorted(name for name in shapes if name in configured)


def resolve_rennes_partition(
    config: dict[str, Any],
    shapes: dict[str, dict[str, Any]],
) -> dict[str, list[str]]:
    """Assign all 27 official sub-perimeters to 12 zones with connected source groups."""
    polygon_names = rennes_shape_names(config, shapes)
    official: dict[str, str] = {}
    for group in config["groups"]:
        for parent_id in group["parentIds"]:
            for name in config["parentZones"][str(parent_id)]:
                official[name] = group["code"]

    primaries: dict[str, str] = {}
    for group in config["groups"]:
        parent_names: list[str] = []
        for parent_id in group["parentIds"]:
            parent_names.extend(config["parentZones"][str(parent_id)])
        primaries[group["code"]] = max(parent_names, key=lambda name: bbox_area(shapes[name]))

    zone_polys = {group["code"]: [primaries[group["code"]]] for group in config["groups"]}
    satellites = [name for name in polygon_names if name not in primaries.values()]

    for satellite in sorted(satellites, key=lambda name: -bbox_area(shapes[name])):
        touching = [
            code for code, primary in primaries.items() if geometries_touch(shapes[satellite], shapes[primary])
        ]
        candidates: list[str] = []
        official_zone = official[satellite]
        if official_zone in touching:
            candidates.append(official_zone)
        candidates.extend(code for code in touching if code not in candidates)
        candidates.extend(code for code in zone_polys if code not in candidates)

        placed = False
        for zone in candidates:
            trial = zone_polys[zone] + [satellite]
            if is_connected_source_group(trial, shapes):
                zone_polys[zone] = trial
                placed = True
                break
        if not placed:
            zone_polys[official_zone] = zone_polys[official_zone] + [satellite]

    missing = sorted(set(polygon_names) - {name for names in zone_polys.values() for name in names})
    if missing:
        raise SystemExit(f"rennes: unassigned sub-perimeters ({len(missing)}): {missing}")
    return zone_polys


def build_rennes_specs(config: dict[str, Any]) -> list[dict[str, Any]]:
    shapes = load_opendatasoft_shapes(config["sourceUrl"], config["nameKey"])
    partition = resolve_rennes_partition(config, shapes)
    specs: list[dict[str, Any]] = []
    for group in config["groups"]:
        spec: dict[str, Any] = {
            "code": group["code"],
            "rennes_quartier": sorted(partition[group["code"]]),
            "geometry_method": "official_quartier_group",
            **{k: group[k] for k in ("coverageRole", "geometryBasis", "confidence") if k in group},
        }
        specs.append(spec)
    return specs


def build_quartier_group_specs(config: dict[str, Any], key: str) -> list[dict[str, Any]]:
    specs: list[dict[str, Any]] = []
    shapes = load_opendatasoft_shapes(config["sourceUrl"], config["nameKey"])
    for group in config["groups"]:
        if group.get("communeInsee"):
            spec = {
                "code": group["code"],
                "commune_insee": group["communeInsee"],
                "geometry_method": "commune",
                **{k: group[k] for k in ("coverageRole", "geometryBasis", "confidence") if k in group},
            }
            specs.append(spec)
            continue
        quartiers = list(group.get("quartiers", []))
        if group.get("extraSourceUrl"):
            extra_shapes = load_opendatasoft_shapes(group["extraSourceUrl"], "libelle")
            shapes.update(extra_shapes)
            for extra in group.get("extraQuartiers", []):
                if extra not in extra_shapes and normalize_label(extra) not in extra_shapes:
                    raise SystemExit(f"Missing extra quartier {extra} for {group['code']}")
                quartiers.append(extra)
        missing = [name for name in quartiers if name not in shapes and normalize_label(name) not in shapes]
        if missing:
            raise SystemExit(f"{key}: missing quartiers for {group['code']}: {missing}")
        spec = {
            "code": group["code"],
            f"{key}_quartier": quartiers,
            "geometry_method": "official_quartier_group",
            **{k: group[k] for k in ("coverageRole", "geometryBasis", "confidence") if k in group},
        }
        specs.append(spec)
    return specs


def build_grenoble_specs(config: dict[str, Any]) -> list[dict[str, Any]]:
    specs: list[dict[str, Any]] = []
    shapes = load_grenoble_unions(config["sourceUrl"], config["nameKey"])
    for group in config["groups"]:
        if group.get("communeInsee"):
            specs.append(
                {
                    "code": group["code"],
                    "commune_insee": group["communeInsee"],
                    "geometry_method": "commune",
                    **{k: group[k] for k in ("coverageRole", "geometryBasis", "confidence") if k in group},
                }
            )
            continue
        quartiers = group["quartiers"]
        missing = [name for name in quartiers if name not in shapes]
        if missing:
            raise SystemExit(f"grenoble: missing unions for {group['code']}: {missing}")
        specs.append(
            {
                "code": group["code"],
                "grenoble_quartier": quartiers,
                "geometry_method": "official_quartier_group",
                **{k: group[k] for k in ("coverageRole", "geometryBasis", "confidence") if k in group},
            }
        )
    assigned = {q for spec in specs for q in spec.get("grenoble_quartier", [])}
    unassigned = sorted(set(shapes) - assigned - {normalize_label(n) for n in shapes})
    official = {n for n in shapes if n == n.strip() and n[0].isupper()}
    extra = sorted(official - assigned)
    if extra:
        raise SystemExit(f"grenoble: unassigned official unions ({len(extra)}): {extra}")
    return specs


def build_iris_specs(city_id: str, insee: str, seeds: dict[str, list[str]], groups: list[dict[str, Any]]) -> list[dict[str, Any]]:
    pool = load_iris_canonical(insee)
    partition = watershed_partition(seeds, pool)
    specs: list[dict[str, Any]] = []
    group_by_code = {group["code"]: group for group in groups}
    for code, iris_names in partition.items():
        group = group_by_code[code]
        specs.append(
            {
                "code": code,
                "iris_insee": insee,
                "iris_names": iris_names,
                "geometry_method": "iris_major_zone_partition",
                **{k: group[k] for k in ("coverageRole", "geometryBasis", "confidence") if k in group},
            }
        )
    return specs


def geometry_for_spec(spec: dict[str, Any], sources: dict[str, Any]) -> dict[str, Any]:
    code = spec["code"]
    if spec.get("commune_insee"):
        return load_commune_geometry(spec["commune_insee"])
    if "iris_names" in spec:
        iris_shapes = sources["iris"][spec["iris_insee"]]
        names = spec["iris_names"]
        subset = {name: iris_shapes[name] for name in names if name in iris_shapes}
        check_contiguity = (
            spec.get("coverageRole") not in {"context", "low_relevance"}
            and spec.get("geometry_method") != "iris_major_zone_partition"
        )
        return geometry_for_names(code, names, iris_shapes, label="IRIS", check_contiguity=check_contiguity)
    for key in ("rennes_quartier", "strasbourg_quartier", "grenoble_quartier"):
        if key in spec:
            label = key.replace("_quartier", "")
            shapes = sources[label]
            check_contiguity = spec.get("geometry_method") != "official_quartier_group"
            return geometry_for_names(
                code,
                spec[key],
                shapes,
                label=label,
                check_contiguity=check_contiguity,
            )
    raise SystemExit(f"No geometry source for {code}")


def load_sources(city_id: str, specs: list[dict[str, Any]]) -> dict[str, Any]:
    sources: dict[str, Any] = {"iris": {}}
    insee_codes = sorted({spec["iris_insee"] for spec in specs if "iris_insee" in spec})
    for insee in insee_codes:
        sources["iris"][insee] = load_iris_canonical(insee)
    config = json.loads(BATCH_GROUPS_JSON.read_text(encoding="utf-8"))[city_id]
    if city_id == "rennes":
        sources["rennes"] = load_opendatasoft_shapes(config["sourceUrl"], config["nameKey"])
    if city_id == "strasbourg":
        shapes = load_opendatasoft_shapes(config["sourceUrl"], config["nameKey"])
        for group in config["groups"]:
            if group.get("extraSourceUrl"):
                shapes.update(load_opendatasoft_shapes(group["extraSourceUrl"], "libelle"))
        sources["strasbourg"] = shapes
    if city_id == "grenoble":
        sources["grenoble"] = load_grenoble_unions(config["sourceUrl"], config["nameKey"])
    return sources


def specs_for_city(city_id: str) -> list[dict[str, Any]]:
    config = json.loads(BATCH_GROUPS_JSON.read_text(encoding="utf-8"))[city_id]
    if city_id == "rennes":
        return build_rennes_specs(config)
    if city_id == "strasbourg":
        return build_quartier_group_specs(config, "strasbourg")
    if city_id == "grenoble":
        return build_grenoble_specs(config)
    if city_id == "montpellier":
        return build_iris_specs(city_id, "34172", MONTPELLIER_ZONE_SEEDS, config["groups"])
    if city_id == "toulon":
        iris_groups = [group for group in config["groups"] if not group.get("communeInsee")]
        commune_groups = [group for group in config["groups"] if group.get("communeInsee")]
        specs = build_iris_specs(city_id, "83137", TOULON_ZONE_SEEDS, iris_groups)
        for group in commune_groups:
            specs.append(
                {
                    "code": group["code"],
                    "commune_insee": group["communeInsee"],
                    "geometry_method": "commune",
                    **{k: group[k] for k in ("coverageRole", "geometryBasis", "confidence") if k in group},
                }
            )
        return specs
    raise SystemExit(f"Unknown batch city {city_id}")


def to_intended(specs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    intended: list[dict[str, Any]] = []
    for spec in specs:
        entry: dict[str, Any] = {"code": spec["code"]}
        for key in (
            "iris_insee",
            "iris_names",
            "rennes_quartier",
            "strasbourg_quartier",
            "grenoble_quartier",
            "commune_insee",
            "coverageRole",
            "geometryBasis",
            "confidence",
            "geometry_method",
        ):
            if key in spec:
                entry[key] = spec[key]
        intended.append(entry)
    return intended


def build_city(city_id: str) -> None:
    places_file, output = BATCH_OUTPUTS[city_id]
    specs = specs_for_city(city_id)
    sources = load_sources(city_id, specs)
    meta = load_score_meta(places_file)
    features = []
    for spec in specs:
        code = spec["code"]
        if code not in meta:
            raise SystemExit(f"Missing PlaceScore row for {code}")
        geometry = round_geometry_coords(geometry_for_spec(spec, sources))
        properties: dict[str, Any] = {
            "code": code,
            "name": meta[code]["name"],
            "kind": meta[code].get("kind", "quartier"),
        }
        if spec.get("geometryBasis"):
            properties["geometryBasis"] = spec["geometryBasis"]
        features.append({"type": "Feature", "geometry": geometry, "properties": properties})
    audit_output(features, set(meta))
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("w", encoding="utf-8") as handle:
        json.dump({"type": "FeatureCollection", "features": features}, handle, separators=(",", ":"))
    print(f"{city_id}: wrote {len(features)} features to {output}")

    geometry_data = json.loads(GEOMETRY_JSON.read_text(encoding="utf-8")) if GEOMETRY_JSON.exists() else {}
    intended_data = json.loads(INTENDED_JSON.read_text(encoding="utf-8")) if INTENDED_JSON.exists() else {}
    geometry_data[city_id] = specs
    intended_data[city_id] = to_intended(specs)
    GEOMETRY_JSON.write_text(json.dumps(geometry_data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    INTENDED_JSON.write_text(json.dumps(intended_data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def main() -> None:
    targets = sys.argv[1:] or list(BATCH_OUTPUTS)
    for city_id in targets:
        if city_id not in BATCH_OUTPUTS:
            raise SystemExit(f"Unknown batch city {city_id}")
        build_city(city_id)


if __name__ == "__main__":
    main()
