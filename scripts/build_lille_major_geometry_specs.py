#!/usr/bin/env python3
"""Build Lille major-district geometry specs (official quartiers + commune context + IRIS fallback)."""

from __future__ import annotations

import json
import urllib.parse
import urllib.request
from collections import deque
from pathlib import Path
from typing import Any

from build_full_coverage_specs import build_neighbor_graph, load_iris, unit_key
from geometry_audit import is_connected_source_group

ROOT = Path(__file__).resolve().parents[1]
GEOMETRY_JSON = ROOT / "scripts" / "granularity_geometry.json"
INTENDED_JSON = ROOT / "scripts" / "granularity_intended.json"
VDA_CACHE = ROOT / "scripts" / "cache" / "vda_quartiers.geojson"
LILLE_WFS = "https://data.lillemetropole.fr/geoserver/wfs"
VDA_QUARTIER_LAYER = "ville_villeneuve_d_ascq:quartier"

LILLE_QUARTIER_ZONES: list[dict[str, Any]] = [
    {"code": "lille-centre", "lille_quartier": ["Lille-Centre"], "coverageRole": "primary"},
    {"code": "lille-vieux-lille", "lille_quartier": ["Vieux-Lille"], "coverageRole": "primary"},
    {"code": "lille-vauban-esquermes", "lille_quartier": ["Vauban-Esquermes"], "coverageRole": "primary"},
    {
        "code": "lille-wazemmes",
        "lille_quartier": ["Wazemmes", "Faubourg de Béthune"],
        "coverageRole": "primary",
    },
    {"code": "lille-moulins", "lille_quartier": ["Lille-Moulins"], "coverageRole": "risk_cap"},
    {"code": "lille-fives", "lille_quartier": ["Fives"], "coverageRole": "primary"},
    {"code": "lille-bois-blancs", "lille_quartier": ["Bois-Blancs"], "coverageRole": "primary"},
    {"code": "lille-sud", "lille_quartier": ["Lille-Sud"], "coverageRole": "risk_cap"},
    {
        "code": "lille-saint-maurice-pellevoisin",
        "lille_quartier": ["Saint-Maurice Pellevoisin"],
        "coverageRole": "context",
    },
    {"code": "lille-hellemmes", "lille_quartier": ["Hellemmes"], "coverageRole": "context"},
    {"code": "lille-lomme-chr", "lille_quartier": ["Lomme"], "coverageRole": "campus"},
]

COMMUNE_CONTEXT_ZONES: list[dict[str, Any]] = [
    {"code": "lille-lambersart", "iris_insee": "59328", "coverageRole": "context"},
    {"code": "lille-la-madeleine", "iris_insee": "59368", "coverageRole": "context"},
    {"code": "lille-mons-en-baroeul", "iris_insee": "59410", "coverageRole": "context"},
]

VDA_SEED_ZONES: list[dict[str, Any]] = [
    {
        "code": "lille-vda-cite-scientifique-triolo",
        "seed_quartiers": ["Cité Scientifique", "Triolo"],
        "coverageRole": "campus",
    },
    {
        "code": "lille-vda-pont-de-bois-hotel-de-ville",
        "seed_quartiers": ["Pont-de-Bois", "Hôtel-de-Ville"],
        "coverageRole": "primary",
    },
    {
        "code": "lille-vda-annappes-ascq-brigode",
        "seed_quartiers": ["Annappes", "Ascq", "Brigode"],
        "coverageRole": "context",
    },
    {
        "code": "lille-vda-cousinerie-recuel-sart",
        "seed_quartiers": ["Cousinerie", "Recueil", "Sart-Babylone", "Flers-Breucq"],
        "coverageRole": "context",
    },
    {
        "code": "lille-vda-breucq-flers-edge",
        "seed_quartiers": ["Flers-Bourg", "Les Prés"],
        "coverageRole": "context",
    },
]

IRIS_SEED_ZONES: list[dict[str, Any]] = [
    {
        "code": "lille-croix-barbieux-edhec",
        "iris_insee": "59163",
        "seed_iris_names": ["Beaumont 1", "Beaumont 2"],
        "coverageRole": "campus",
    },
    {
        "code": "lille-croix-context",
        "iris_insee": "59163",
        "seed_iris_names": ["Centre 1"],
        "coverageRole": "context",
    },
    {
        "code": "lille-roubaix-barbieux-edhec",
        "iris_insee": "59512",
        "seed_iris_names": ["Barbieux Sud", "Barbieux-Vauban", "Mackellerie", "Épeule Centre"],
        "coverageRole": "campus",
    },
    {
        "code": "lille-roubaix-centre-west",
        "iris_insee": "59512",
        "seed_iris_names": ["Justice", "Nouveau Roubaix", "Édouard Vaillant"],
        "coverageRole": "primary",
    },
    {
        "code": "lille-roubaix-east-north-context",
        "iris_insee": "59512",
        "seed_iris_names": ["Pile Centre", "Moulin Nord", "Nations Unies", "Hommelet Centre", "Fresnoy"],
        "coverageRole": "context",
    },
    {
        "code": "lille-tourcoing-centre-gare",
        "iris_insee": "59599",
        "seed_iris_names": ["Gare", "Point Central"],
        "coverageRole": "primary",
    },
    {
        "code": "lille-tourcoing-south-west",
        "iris_insee": "59599",
        "seed_iris_names": ["Gambetta", "Brun Pain"],
        "coverageRole": "primary",
    },
    {
        "code": "lille-tourcoing-north-east-context",
        "iris_insee": "59599",
        "seed_iris_names": ["Pont Rompu", "Marlière", "Croix Rouge", "Virolois"],
        "coverageRole": "context",
    },
]


def load_vda_quartiers() -> dict[str, dict[str, Any]]:
    VDA_CACHE.parent.mkdir(parents=True, exist_ok=True)
    if VDA_CACHE.exists():
        data = json.loads(VDA_CACHE.read_text(encoding="utf-8"))
    else:
        params = urllib.parse.urlencode(
            {
                "service": "WFS",
                "version": "2.0.0",
                "request": "GetFeature",
                "typeName": VDA_QUARTIER_LAYER,
                "outputFormat": "application/json",
                "srsName": "EPSG:4326",
                "count": 200,
            }
        )
        request = urllib.request.Request(
            f"{LILLE_WFS}?{params}",
            headers={"User-Agent": "paris-student-map/1.0"},
        )
        with urllib.request.urlopen(request, timeout=180) as response:
            data = json.load(response)
        VDA_CACHE.write_text(json.dumps(data), encoding="utf-8")
    pool: dict[str, dict[str, Any]] = {}
    for feature in data["features"]:
        name = feature["properties"]["nom"]
        key = unit_key("59009", name)
        pool[key] = {"insee": "59009", "name": name, "geometry": feature["geometry"]}
    return pool


def partition_from_seeds(
    insee: str,
    zones: list[dict[str, Any]],
    pool: dict[str, dict[str, Any]],
    *,
    seed_key: str,
) -> dict[str, list[str]]:
    keys = sorted(key for key in pool if key.startswith(f"{insee}:"))
    graph = build_neighbor_graph(keys, pool)

    seed_to_code: dict[str, str] = {}
    for zone in zones:
        code = zone["code"]
        for name in zone[seed_key]:
            key = unit_key(insee, name)
            if key not in pool:
                raise SystemExit(f"lille: missing seed {name!r} for {code} ({insee})")
            if key in seed_to_code and seed_to_code[key] != code:
                raise SystemExit(
                    f"lille: seed {name!r} claimed by both {seed_to_code[key]} and {code}"
                )
            seed_to_code[key] = code

    assignment: dict[str, str] = {}
    queue: deque[str] = deque(seed_to_code.keys())
    for seed_key_name, code in seed_to_code.items():
        assignment[seed_key_name] = code
    while queue:
        current = queue.popleft()
        code = assignment[current]
        for neighbor in graph.get(current, []):
            if neighbor not in assignment:
                assignment[neighbor] = code
                queue.append(neighbor)

    unassigned = [key for key in keys if key not in assignment]
    if unassigned:
        names = [pool[key]["name"] for key in unassigned[:8]]
        raise SystemExit(
            f"lille: unassigned units in {insee}: {names}"
            f"{'...' if len(unassigned) > 8 else ''} ({len(unassigned)} total)"
        )

    by_code: dict[str, list[str]] = {}
    for key, code in assignment.items():
        by_code.setdefault(code, []).append(pool[key]["name"])

    for zone in zones:
        code = zone["code"]
        names = sorted(by_code.get(code, []))
        if not names:
            raise SystemExit(f"lille: empty partition for {code}")
        shapes = {name: pool[unit_key(insee, name)]["geometry"] for name in names}
        role = zone.get("coverageRole", "primary")
        if role in {"primary", "campus", "risk_cap"} and not is_connected_source_group(names, shapes):
            raise SystemExit(f"lille: disconnected group for {code}: {names}")

    return {code: sorted(names) for code, names in by_code.items()}


def quartier_spec(entry: dict[str, Any]) -> dict[str, Any]:
    return {
        "code": entry["code"],
        "lille_quartier": entry["lille_quartier"],
        "geometry_method": "major_district",
        "geometryBasis": "official_quartier",
        "coverageRole": entry["coverageRole"],
    }


def vda_spec(code: str, quartiers: list[str], role: str) -> dict[str, Any]:
    return {
        "code": code,
        "vda_quartier": quartiers,
        "geometry_method": "major_district",
        "geometryBasis": "official_quartier",
        "coverageRole": role,
    }


def commune_context_spec(code: str, insee: str, role: str, iris_names: list[str]) -> dict[str, Any]:
    return {
        "code": code,
        "iris_insee": insee,
        "iris_names": iris_names,
        "geometry_method": "major_district",
        "geometryBasis": "commune_context",
        "coverageRole": role,
    }


def iris_major_zone_spec(code: str, insee: str, role: str, iris_names: list[str]) -> dict[str, Any]:
    return {
        "code": code,
        "iris_insee": insee,
        "iris_names": iris_names,
        "geometry_method": "major_district",
        "geometryBasis": "iris_fallback_major_zone",
        "coverageRole": role,
    }


def build_specs() -> list[dict[str, Any]]:
    specs: list[dict[str, Any]] = []
    specs.extend(quartier_spec(entry) for entry in LILLE_QUARTIER_ZONES)

    for entry in COMMUNE_CONTEXT_ZONES:
        pool = load_iris(entry["iris_insee"])
        names = sorted(unit["name"] for unit in pool.values())
        specs.append(
            commune_context_spec(entry["code"], entry["iris_insee"], entry["coverageRole"], names)
        )

    vda_pool = load_vda_quartiers()
    vda_partitions = partition_from_seeds(
        "59009",
        VDA_SEED_ZONES,
        vda_pool,
        seed_key="seed_quartiers",
    )
    for zone in VDA_SEED_ZONES:
        code = zone["code"]
        specs.append(vda_spec(code, vda_partitions[code], zone["coverageRole"]))

    by_insee: dict[str, list[dict[str, Any]]] = {}
    for zone in IRIS_SEED_ZONES:
        by_insee.setdefault(zone["iris_insee"], []).append(zone)

    for insee, zones in sorted(by_insee.items()):
        iris_pool = load_iris(insee)
        pool = {
            unit_key(insee, unit["name"]): unit for unit in iris_pool.values()
        }
        partitions = partition_from_seeds(insee, zones, pool, seed_key="seed_iris_names")
        for zone in zones:
            code = zone["code"]
            specs.append(
                iris_major_zone_spec(code, insee, zone["coverageRole"], partitions[code])
            )

    specs.sort(key=lambda item: item["code"])
    return specs


def main() -> None:
    specs = build_specs()
    geometry = (
        json.loads(GEOMETRY_JSON.read_text(encoding="utf-8")) if GEOMETRY_JSON.exists() else {}
    )
    intended = (
        json.loads(INTENDED_JSON.read_text(encoding="utf-8")) if INTENDED_JSON.exists() else {}
    )
    geometry["lille"] = specs
    intended["lille"] = specs
    GEOMETRY_JSON.write_text(json.dumps(geometry, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    INTENDED_JSON.write_text(json.dumps(intended, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    iris_total = sum(len(spec.get("iris_names", [])) for spec in specs)
    vda_total = sum(len(spec.get("vda_quartier", [])) for spec in specs)
    print(
        f"lille: wrote {len(specs)} major-district geometry specs "
        f"({iris_total} IRIS units, {vda_total} VDA quartiers)"
    )


if __name__ == "__main__":
    main()
