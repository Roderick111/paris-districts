#!/usr/bin/env python3
"""Build contiguous geometry specs (intended sources + optional bounded watershed) per city."""

from __future__ import annotations

import json
import re
import unicodedata
import urllib.parse
import urllib.request
from collections import deque
from pathlib import Path
from typing import Any

from geometry_audit import bbox_area, geometries_touch, is_connected_source_group, merge_shapes_bbox

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
INTENDED_JSON = SCRIPTS / "granularity_intended.json"
GEOMETRY_JSON = SCRIPTS / "granularity_geometry.json"
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
LILLE_WFS = "https://data.lillemetropole.fr/geoserver/wfs"
VDA_QUARTIER_LAYER = "ville_villeneuve_d_ascq:quartier"

SOURCE_KEYS = (
    "iris_names",
    "marseille_quartiers",
    "nice_quartier",
    "lille_quartier",
    "vda_quartier",
    "hellemmes_quartier",
)

LILLE_INSEE_BY_CODE: dict[str, str] = {
    "lille-centre-core": "59350",
    "lille-gares-euralille": "59350",
    "lille-vauban-catho": "59350",
    "lille-esquermes-cormontaigne": "59350",
    "lille-wazemmes-core": "59350",
    "lille-gambetta-solferino": "59350",
    "lille-moulins-campus-edge": "59350",
    "lille-lomme-chr": "59350",
    "lille-hellemmes": "hellemmes",
    "lille-madeleine-romarin": "59368",
    "lille-roubaix-edhec-barbieux": "59512",
    "lille-roubaix-centre-edge": "59512",
}

NICE_PARENT_BY_CODE: dict[str, str] = {
    "nice-jean-medecin-core": "centre",
    "nice-carabacel": "centre",
    "nice-thiers-station-edge": "centre",
    "nice-musiciens": "centre",
    "nice-vernier": "north_centre",
    "nice-liberation": "north_centre",
    "nice-borriglione-valrose": "north_centre",
    "nice-saint-maurice": "north_centre",
    "nice-cimiez": "hills",
    "nice-rimiez": "hills",
    "nice-vieux-nice": "east",
    "nice-port": "east",
    "nice-riquier": "east",
    "nice-saint-roch": "east",
    "nice-saint-jean-d-angely": "east",
    "nice-pasteur": "east",
    "nice-ariane": "east",
    "nice-rue-de-france-promenade-edge": "west",
    "nice-baumettes-magnan": "west",
    "nice-carlone-campus": "west",
    "nice-madeleine": "west",
    "nice-arenas-saint-augustin-edhec": "west",
}

NICE_IRIS_PARENT: dict[str, str] = {
    "Jean Médecin": "centre",
    "Carnot": "centre",
    "Promenade du Paillon": "centre",
    "République": "centre",
    "Gare Nice-Ville": "centre",
    "Thiers-Durante": "centre",
    "Musiciens": "centre",
    "Michelet": "centre",
    "Victor Hugo-Buffa": "centre",
    "Vernier": "north_centre",
    "Gorbella": "north_centre",
    "Liberti-Albert 1er": "north_centre",
    "Borriglione-Saint Lambert": "north_centre",
    "Cimiez-Valrose": "north_centre",
    "Parc Chambrun": "north_centre",
    "Cimiez": "hills",
    "Cimiez-Monastère": "hills",
    "Riquier": "east",
    "Riquier-Arson": "east",
    "Riquier-Fontaine de la Ville": "east",
    "Saint-Roch-Jean XXIII": "east",
    "Saint-Roch-Ricolfi": "east",
    "Saint-Jean d'Angély": "east",
    "Hôpital Saint-Roch": "east",
    "Pasteur": "east",
    "Pasteur-Saint-Pons": "east",
    "Pasteur-Voie Romaine": "east",
    "Ariane-Les Chênes": "east",
    "Ariane-Monzie": "east",
    "Ariane-Ripert": "east",
    "Ariane-Saramito": "east",
    "France-Negresco": "west",
    "Digue des Français": "west",
    "Baumettes": "west",
    "Magnan": "west",
    "Bellet-Magnan": "west",
    "Carlone": "west",
    "Faculté de Lettres": "west",
    "Parc Impérial": "west",
    "Madeleine": "west",
    "Madeleine Robiony": "west",
    "Madeleine Supérieure": "west",
    "Madeleine-Nicolaï": "west",
    "Arenas-Aéroport": "west",
    "Arenas-Cassin": "west",
    "Saint-Augustin": "west",
}


def fetch_json(url: str) -> dict[str, Any]:
    request = urllib.request.Request(url, headers={"User-Agent": "paris-student-map/1.0"})
    with urllib.request.urlopen(request, timeout=180) as response:
        return json.load(response)


def normalize_label(value: str) -> str:
    folded = unicodedata.normalize("NFKD", value)
    ascii_label = "".join(char for char in folded if not unicodedata.combining(char))
    return re.sub(r"[^a-z0-9]+", "", ascii_label.lower())


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
    for feature in data["features"]:
        name = feature["properties"]["nom_iris"]
        shapes[name] = feature["geometry"]
    return shapes


def load_marseille_quartiers() -> dict[str, dict[str, Any]]:
    features = fetch_json(MARSEILLE_QUARTIER_URL)["features"]
    shapes: dict[str, dict[str, Any]] = {}
    for feature in features:
        name = feature["properties"]["nom_qua"]
        existing = shapes.get(name)
        if existing is None or len(json.dumps(feature["geometry"])) > len(json.dumps(existing)):
            shapes[name] = feature["geometry"]
    return shapes


def load_nice_quartiers() -> dict[str, dict[str, Any]]:
    features = fetch_json(NICE_QUARTIER_URL)["features"]
    return {feature["properties"]["QUARTIER"]: feature["geometry"] for feature in features}


def load_vda_quartiers() -> dict[str, dict[str, Any]]:
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
    data = fetch_json(f"{LILLE_WFS}?{params}")
    shapes: dict[str, dict[str, Any]] = {}
    for feature in data["features"]:
        properties = feature["properties"]
        name = properties.get("quartier") or properties.get("nom")
        shapes[name] = feature["geometry"]
    return shapes


def component_containing(seed: str, names: list[str], shapes: dict[str, dict[str, Any]]) -> list[str]:
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


def build_neighbor_graph(shapes: dict[str, dict[str, Any]]) -> tuple[dict[str, list[str]], dict[str, dict[str, Any]]]:
    names = list(shapes)
    neighbors = {name: [] for name in names}
    for index, left in enumerate(names):
        for right in names[index + 1 :]:
            if geometries_touch(shapes[left], shapes[right]):
                neighbors[left].append(right)
                neighbors[right].append(left)
    return neighbors, shapes


def watershed_assign(
    intended: dict[str, list[str]],
    shapes: dict[str, dict[str, Any]],
    multipart_codes: set[str] | None = None,
    fill_unassigned: bool = True,
) -> dict[str, list[str]]:
    multipart_codes = multipart_codes or set()
    neighbors, shapes = build_neighbor_graph(shapes)
    seeds = {
        code: next((unit for unit in units if unit in shapes), units[0])
        for code, units in intended.items()
        if units
    }
    assignment: dict[str, str] = {}
    for code, units in intended.items():
        for unit in units:
            if unit in shapes and unit not in assignment:
                assignment[unit] = code

    for code, units in intended.items():
        if not units or code in multipart_codes:
            continue
        seed = seeds[code]
        zone_units = [name for name, owner in assignment.items() if owner == code and name in shapes]
        if is_connected_source_group(zone_units, shapes):
            continue
        keep = component_containing(seed, zone_units, shapes)
        for name in zone_units:
            if name not in keep:
                del assignment[name]

    if fill_unassigned:
        queue: deque[tuple[str, str, int]] = deque(
            (seeds[code], code, 0) for code in seeds if seeds[code] in shapes
        )
        for name, code in assignment.items():
            if name in shapes:
                queue.append((name, code, 0))
        while queue:
            node, code, _distance = queue.popleft()
            if node not in shapes:
                continue
            if node in assignment and assignment[node] != code:
                continue
            assignment[node] = code
            for neighbor in neighbors.get(node, []):
                if neighbor not in assignment:
                    queue.append((neighbor, code, 0))

    zones = {code: sorted(name for name, owner in assignment.items() if owner == code) for code in intended}
    for code, names in zones.items():
        if not names:
            continue
        if code not in multipart_codes and not is_connected_source_group(names, shapes):
            raise SystemExit(f"Disconnected final group for {code}: {names}")
    return zones


def shapes_bbox_area(shapes: dict[str, dict[str, Any]]) -> float:
    if not shapes:
        return 0.0
    return bbox_area(merge_shapes_bbox(list(shapes.values())))


def audit_zone_expansion(
    code: str,
    intended: list[str],
    assigned: list[str],
    shapes: dict[str, dict[str, Any]],
    *,
    allow_multipart: bool = False,
) -> None:
    if allow_multipart or not intended or not assigned:
        return
    intended_shapes = {name: shapes[name] for name in intended if name in shapes}
    assigned_shapes = {name: shapes[name] for name in assigned if name in shapes}
    if not intended_shapes or not assigned_shapes:
        return
    seed_area = shapes_bbox_area(intended_shapes)
    assigned_area = shapes_bbox_area(assigned_shapes)
    if seed_area > 0 and assigned_area > seed_area * 3:
        raise SystemExit(
            f"Zone {code} expanded beyond 3x intended bbox area "
            f"({assigned_area:.6f} vs seed {seed_area:.6f})"
        )


def audit_nice_parent_scope(code: str, assigned: list[str], spec: dict[str, Any]) -> None:
    if spec.get("allowMultipart") or spec.get("allow_parent_span"):
        return
    expected = NICE_PARENT_BY_CODE.get(code)
    if not expected:
        return
    parents = {NICE_IRIS_PARENT.get(name, expected) for name in assigned}
    if len(parents) > 1:
        raise SystemExit(f"Nice zone {code} spans parent groups {sorted(parents)}")


def assign_iris_zone(
    spec: dict[str, Any],
    full_shapes: dict[str, dict[str, Any]],
    *,
    default_fill: bool = False,
) -> list[str]:
    code = spec["code"]
    intended = [name for name in spec.get("iris_names", []) if name in full_shapes]
    if not intended:
        return []

    scope_names = spec.get("fill_scope_iris_names")
    multipart = bool(spec.get("allowMultipart"))
    multipart_set = {code} if multipart else set()

    if scope_names:
        pool = {name: full_shapes[name] for name in scope_names if name in full_shapes}
        fill = True
        method = "intended_bounded_watershed"
    else:
        pool = {name: full_shapes[name] for name in intended}
        fill = default_fill
        method = "intended_bounded_watershed" if fill else "intended_only"

    zones = watershed_assign({code: intended}, pool, multipart_set, fill_unassigned=fill)
    assigned = zones[code]
    audit_zone_expansion(code, intended, assigned, full_shapes, allow_multipart=multipart)
    spec["_geometry_method"] = method
    return assigned


def spec_from_assignment(
    original: dict[str, Any],
    assigned_names: list[str],
    source_key: str,
) -> dict[str, Any]:
    spec: dict[str, Any] = {"code": original["code"]}
    if "iris_insee" in original:
        spec["iris_insee"] = original["iris_insee"]
    spec[source_key] = assigned_names
    spec["geometry_method"] = original.get("_geometry_method", "intended_watershed")
    for key in (
        "coverageRole",
        "geometryBasis",
        "confidence",
        "allowMultipart",
        "multipartJustification",
        "split_parent",
        "area",
    ):
        if key in original:
            spec[key] = original[key]
    if original.get("nice_quartier") and source_key == "iris_names":
        spec["nice_quartier"] = original["nice_quartier"]
    return spec


def rebuild_toulouse(specs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    shapes = load_iris("31555")
    intended = {spec["code"]: spec.get("iris_names", []) for spec in specs}
    zones = watershed_assign(intended, shapes)
    return [spec_from_assignment(spec, zones[spec["code"]], "iris_names") for spec in specs]


def rebuild_lille(specs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    output: list[dict[str, Any]] = []
    iris_cache: dict[str, dict[str, dict[str, Any]]] = {}
    vda_specs: list[dict[str, Any]] = []

    for spec in specs:
        if "vda_quartier" in spec:
            vda_specs.append(spec)
            continue
        if "iris_insee" not in spec:
            fixed = {"code": spec["code"], "geometry_method": "official_quartier"}
            for key in ("lille_quartier", "hellemmes_quartier"):
                if key in spec:
                    fixed[key] = spec[key]
            if spec.get("allowMultipart"):
                fixed["allowMultipart"] = True
            output.append(fixed)
            continue

        insee = spec["iris_insee"]
        if insee not in iris_cache:
            iris_cache[insee] = load_iris(insee)
        assigned = assign_iris_zone(spec, iris_cache[insee], default_fill=False)
        if not assigned:
            raise SystemExit(f"No IRIS assigned for {spec['code']}")
        output.append(spec_from_assignment(spec, assigned, "iris_names"))

    if vda_specs:
        pool = load_vda_quartiers()
        intended = {spec["code"]: spec.get("vda_quartier", []) for spec in vda_specs}
        multipart = {spec["code"] for spec in vda_specs if spec.get("allowMultipart")}
        zones = watershed_assign(intended, pool, multipart, fill_unassigned=False)
        for spec in vda_specs:
            entry = {
                "code": spec["code"],
                "vda_quartier": zones[spec["code"]],
                "geometry_method": "intended_only",
            }
            if spec["code"] in multipart:
                entry["allowMultipart"] = True
            output.append(entry)

    return sorted(output, key=lambda item: item["code"])


def rebuild_marseille(specs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    pool = load_marseille_quartiers()
    intended = {spec["code"]: spec.get("marseille_quartiers", []) for spec in specs}
    multipart = {spec["code"] for spec in specs if spec.get("allowMultipart")}
    for code, names in intended.items():
        if len(names) > 1 and not is_connected_source_group(names, {n: pool[n] for n in names}):
            multipart.add(code)
    zones = watershed_assign(intended, pool, multipart, fill_unassigned=False)
    output: list[dict[str, Any]] = []
    for spec in specs:
        entry = spec_from_assignment(spec, zones[spec["code"]], "marseille_quartiers")
        if spec["code"] in multipart:
            entry["allowMultipart"] = True
        output.append(entry)
    return output


def rebuild_nice(specs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    iris_shapes = load_iris("06088")
    iris_pool = {k: v for k, v in iris_shapes.items() if not re.fullmatch(r"[a-z0-9]+", k)}
    quartier_shapes = load_nice_quartiers()

    output: list[dict[str, Any]] = []
    for spec in specs:
        if spec.get("iris_names"):
            assigned = assign_iris_zone(spec, iris_pool, default_fill=False)
            if not assigned:
                raise SystemExit(f"No IRIS assigned for {spec['code']}")
            audit_nice_parent_scope(spec["code"], assigned, spec)
            output.append(spec_from_assignment(spec, assigned, "iris_names"))
            continue
        if spec.get("nice_quartier"):
            names = spec["nice_quartier"]
            shapes = {name: quartier_shapes[name] for name in names}
            if not spec.get("allowMultipart") and not is_connected_source_group(names, shapes):
                raise SystemExit(f"Disconnected nice quartier group for {spec['code']}")
            entry: dict[str, Any] = {
                "code": spec["code"],
                "nice_quartier": names,
                "geometry_method": "official_quartier",
            }
            if spec.get("allowMultipart"):
                entry["allowMultipart"] = True
            output.append(entry)

    return sorted(output, key=lambda item: item["code"])


REBUILDERS = {
    "toulouse": rebuild_toulouse,
    "lille": rebuild_lille,
    "marseille": rebuild_marseille,
    "nice": rebuild_nice,
    "nantes": None,
}


def main() -> None:
    import sys

    cities = sys.argv[1:] or ["toulouse", "lille", "marseille", "nice"]
    intended = json.loads(INTENDED_JSON.read_text(encoding="utf-8"))
    geometry = (
        json.loads(GEOMETRY_JSON.read_text(encoding="utf-8"))
        if GEOMETRY_JSON.exists()
        else {}
    )
    for city_id in cities:
        if city_id == "nantes":
            raise SystemExit("Use scripts/build_nantes_geometry_specs.py for Nantes")
        rebuilder = REBUILDERS.get(city_id)
        if rebuilder is None:
            raise SystemExit(f"Unknown city {city_id}")
        if city_id not in intended:
            raise SystemExit(f"Missing intended specs for {city_id} in {INTENDED_JSON}")
        original_specs = intended[city_id]
        updated = rebuilder(original_specs)
        geometry[city_id] = updated
        assigned = sum(
            len(spec.get("iris_names", spec.get("marseille_quartiers", spec.get("nice_quartier", spec.get("vda_quartier", [])))))
            for spec in updated
        )
        print(f"{city_id}: {len(updated)} zones ({assigned} source units assigned)")

    GEOMETRY_JSON.write_text(json.dumps(geometry, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Updated {GEOMETRY_JSON}")


if __name__ == "__main__":
    main()