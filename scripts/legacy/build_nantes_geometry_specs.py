#!/usr/bin/env python3
"""Build contiguous Nantes IRIS groups for granularity_geometry.json."""

from __future__ import annotations

import json
from collections import deque
from pathlib import Path

from geometry_audit import geometries_touch, is_connected_source_group

ROOT = Path(__file__).resolve().parents[2]
IRIS_CACHE = ROOT / "scripts" / "cache" / "iris_44109.geojson"
GEOMETRY_JSON = ROOT / "scripts" / "granularity_geometry.json"

INTENDED: dict[str, list[str]] = {
    "nantes-decre-bouffay": ["Decré-Cathédrale", "Champ de Mars", "Boulevard des Poilus"],
    "nantes-commerce-graslin": ["Graslin-Commerce", "Madeleine", "Gloriette-Feydeau"],
    "nantes-talensac-viarme": ["Talensac-Pont Morand", "Viarme", "Guist'hau"],
    "nantes-hauts-paves": ["Hauts Pavés", "Canclaux", "Coudray"],
    "nantes-saint-felix-michelet": ["Saint-Félix", "Université-Michelet", "Mellinet"],
    "nantes-facultes-petit-port": ["Bourgeonnière-Petit Port", "Jonelière-Université"],
    "nantes-joneliere": ["Éraudière-Renaudière", "Beaulieu-Mangin"],
    "nantes-bout-des-landes-boissiere": ["Bout des Landes", "Boissière", "Boucardière-Mallève"],
    "nantes-chantrerie-gachet": ["Z.A. Chantrerie-Gachet", "Z.A. Hauts de Gesvre"],
    "nantes-saint-joseph-porterie": ["Saint-Joseph-Erdre", "Saint-Joseph-Bourg", "Haluchère-Perray"],
    "nantes-ile-de-nantes-west": ["Gare Maritime", "Salorges-Sainte-Anne", "Schuman"],
    "nantes-ile-de-nantes-east": ["Île Beaulieu", "Santos-Dumont", "Z.A. Cheviré-Zone Portuaire"],
    "nantes-malakoff": ["Malakoff", "Vieux Malakoff", "Caserne Mellinet"],
    "nantes-saint-donatien": ["Saint-Donatien", "Perverie", "Dervallières-Chézine"],
    "nantes-dervallieres": ["Waldeck-Sully", "Monselet", "Bouhier"],
    "nantes-zola": ["Zola", "Mendès France", "Jean Macé"],
    "nantes-chantenay-sainte-anne": ["Mairie de Chantenay", "Route de Sainte-Luce", "Pin Sec"],
    "nantes-bellevue": ["Bout des Pavés-Chêne des Anglais", "Chauvinière"],
    "nantes-breil": ["Breil-Malville", "Plessis Tison", "Toutes Aides"],
    "nantes-barberie": ["Barberie", "Beaujoire-Halvêque", "Petit Bois"],
    "nantes-doulon": ["Mairie de Doulon", "Le Vieux Doulon", "Lion d'Or-Gilarderie"],
    "nantes-bottiere": ["La Bottière", "Route de Vannes", "Jules Verne"],
}


def component_containing(seed: str, names: list[str], shapes: dict[str, dict]) -> list[str]:
    remaining = set(names)
    if seed not in remaining:
        return []
    stack = [seed]
    component = {seed}
    remaining.remove(seed)
    while stack:
        current = stack.pop()
        for name in list(remaining):
            if geometries_touch(shapes[current], shapes[name]):
                remaining.remove(name)
                component.add(name)
                stack.append(name)
    return sorted(component)


def build_specs() -> list[dict[str, object]]:
    data = json.loads(IRIS_CACHE.read_text(encoding="utf-8"))
    shapes = {feature["properties"]["nom_iris"]: feature["geometry"] for feature in data["features"]}
    neighbors = {name: [] for name in shapes}
    names = list(shapes)
    for index, left in enumerate(names):
        for right in names[index + 1 :]:
            if geometries_touch(shapes[left], shapes[right]):
                neighbors[left].append(right)
                neighbors[right].append(left)

    seeds = {code: iris_names[0] for code, iris_names in INTENDED.items()}
    assignment: dict[str, str] = {}
    for code, iris_names in INTENDED.items():
        for iris_name in iris_names:
            if iris_name not in assignment:
                assignment[iris_name] = code

    for code, iris_names in INTENDED.items():
        seed = seeds[code]
        zone_iris = [name for name, owner in assignment.items() if owner == code]
        if is_connected_source_group(zone_iris, shapes):
            continue
        keep = component_containing(seed, zone_iris, shapes)
        for name in zone_iris:
            if name not in keep:
                del assignment[name]

    queue = deque((seed, code, 0) for code, seed in seeds.items())
    for name, code in assignment.items():
        queue.append((name, code, 0))
    while queue:
        node, code, _distance = queue.popleft()
        if node in assignment and assignment[node] != code:
            continue
        assignment[node] = code
        for neighbor in neighbors[node]:
            if neighbor not in assignment:
                queue.append((neighbor, code, 0))

    specs = []
    for code in INTENDED:
        iris_names = sorted(name for name, owner in assignment.items() if owner == code)
        if not is_connected_source_group(iris_names, shapes):
            raise SystemExit(f"Disconnected final group for {code}")
        specs.append(
            {
                "code": code,
                "iris_insee": "44109",
                "iris_names": iris_names,
                "geometry_method": "iris_intended_watershed",
            }
        )
    return specs


def main() -> None:
    specs = build_specs()
    geometry = json.loads(GEOMETRY_JSON.read_text(encoding="utf-8"))
    geometry["nantes"] = specs
    GEOMETRY_JSON.write_text(json.dumps(geometry, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Updated Nantes geometry specs ({len(specs)} zones, 97 IRIS tiled)")


if __name__ == "__main__":
    main()