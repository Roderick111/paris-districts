#!/usr/bin/env python3
"""Build full-coverage IRIS/quartier partition specs per city."""

from __future__ import annotations

import json
import re
import unicodedata
import urllib.parse
import urllib.request
from collections import deque
from pathlib import Path
from typing import Any

from geometry_audit import geometries_touch, is_connected_source_group

ROOT = Path(__file__).resolve().parents[2]
SCRIPTS = ROOT / "scripts"
SCOPES_JSON = SCRIPTS / "city_coverage_scopes.json"
INTENDED_JSON = SCRIPTS / "granularity_intended.json"
GEOMETRY_JSON = SCRIPTS / "granularity_geometry.json"
CONTEXT_PLACES_JSON = SCRIPTS / "context_places.json"
IRIS_CACHE = SCRIPTS / "cache"
IRIS_WFS = (
    "https://data.geopf.fr/wfs/ows?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature"
    "&TYPENAME=STATISTICALUNITS.IRIS:contours_iris"
)
NICE_QUARTIER_URL = (
    "https://cartes.nicecotedazur.org/heberge/rest/services/Limites_administratives/"
    "MapServer/10/query?where=1%3D1&outFields=QUARTIER&outSR=4326&f=geojson"
)
LILLE_WFS = "https://data.lillemetropole.fr/geoserver/wfs"
LILLE_QUARTIER_LAYER = "ville_lille:limite_des_quartiers_de_lille_et_de_ses_communes_associees"
VDA_QUARTIER_LAYER = "ville_villeneuve_d_ascq:quartier"

LILLE_QUARTIER_IRIS: dict[str, list[str]] = {
    "Vieux-Lille": [f"Vieux Lille {i}" for i in range(1, 8)],
    "Fives": [
        "Entrée Lille Fives",
        "Les Sarts 1",
        "Les Sarts 2",
        "Les Sarts 3",
        "Lannoy",
        "Mont de Terre",
    ],
    "Bois-Blancs": ["Vieux Bois-Blancs", "Arbonnoise", "Aviateurs", "Grande Brasserie"],
    "Lille-Sud": [
        "Faubourg des Postes A",
        "Faubourg des Postes B",
        "Sud Marais 1",
        "Sud Marais 2",
        "Sud Marais 3",
        "Bourg Délivrance 2",
        "Bourg Délivrance 3",
        "Bourg Délivrance 4",
        "Bourg Délivrance 5",
    ],
    "Hellemmes": [
        "Mont à Camp-Marais 1",
        "Mont à Camp-Marais 2",
        "Mont à Camp-Marais 3",
        "Mont à Camp-Marais 4",
    ],
}

NICE_QUARTIER_IRIS: dict[str, list[str]] = {
    "Carabacel": ["Carabacel"],
    "Saint Maurice": ["Saint-Barthélemy", "Saint-Sylvestre"],
    "Vieille Ville": ["Vieux Nice-Sainte-Réparate", "Vieux Nice-Visitation", "Saleya-Château"],
    "Le Port": ["Port"],
    "Thiers": ["Gare Nice-Ville", "Thiers-Durante"],
    "La Gare": ["Gare Nice-Ville", "Thiers-Durante"],
    "Libération": ["Liberti-Albert 1er"],
    "Cimiez": ["Cimiez", "Cimiez-Monastère"],
    "Riquier": ["Riquier", "Riquier-Arson", "Riquier-Fontaine de la Ville"],
    "Saint Roch": ["Saint-Roch-Jean XXIII", "Saint-Roch-Ricolfi"],
    "Pasteur": ["Pasteur", "Pasteur-Saint-Pons", "Pasteur-Voie Romaine"],
    "Ariane": ["Ariane-Les Chênes", "Ariane-Monzie", "Ariane-Ripert", "Ariane-Saramito"],
    "Rue de France": ["France-Negresco", "Digue des Français"],
    "Baumettes": ["Baumettes", "Magnan", "Bellet-Magnan"],
    "Madeleine": ["Madeleine", "Madeleine Robiony", "Madeleine-Nicolaï"],
    "Arenas": ["Arenas-Cassin", "Arenas-Aéroport"],
    "Saint Augustin": ["Saint-Augustin"],
}

VDA_ZONE_SCOPE: dict[str, list[str]] = {
    "lille-vda-cite-scientifique": ["Cité Scientifique", "Université"],
    "lille-vda-pont-de-bois": ["Pont-de-Bois", "Pont de Bois"],
    "lille-vda-triolo": ["Triolo"],
    "lille-vda-annappes-hotel-de-ville": ["Annappes", "Hôtel-de-Ville", "Hotel-de-Ville"],
}


def fetch_json(url: str) -> dict[str, Any]:
    request = urllib.request.Request(url, headers={"User-Agent": "paris-student-map/1.0"})
    with urllib.request.urlopen(request, timeout=180) as response:
        return json.load(response)


def normalize_label(value: str) -> str:
    folded = unicodedata.normalize("NFKD", value)
    ascii_label = "".join(char for char in folded if not unicodedata.combining(char))
    return re.sub(r"[^a-z0-9]+", "", ascii_label.lower())


def unit_key(insee: str, name: str) -> str:
    return f"{insee}:{name}"


def parse_insee_from_pool(pool: dict[str, dict[str, Any]], iris_name: str) -> str:
    for key, unit in pool.items():
        if unit["name"] == iris_name:
            return unit["insee"]
    return "59350"


def parse_unit_key(key: str) -> tuple[str, str]:
    insee, name = key.split(":", 1)
    return insee, name


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
    units: dict[str, dict[str, Any]] = {}
    for feature in data["features"]:
        name = feature["properties"]["nom_iris"]
        key = unit_key(insee, name)
        units[key] = {"insee": insee, "name": name, "geometry": feature["geometry"]}
    return units


def load_all_iris(insee_codes: list[str]) -> dict[str, dict[str, Any]]:
    pool: dict[str, dict[str, Any]] = {}
    for insee in insee_codes:
        pool.update(load_iris(insee))
    return pool


def resolve_seeds_from_intended(spec: dict[str, Any], pool: dict[str, dict[str, Any]]) -> tuple[str, list[str], list[str]]:
    insee = spec.get("iris_insee", "")
    seeds: list[str] = []
    scope: list[str] = []

    if spec.get("iris_names"):
        for name in spec["iris_names"]:
            key = unit_key(insee, name)
            if key in pool:
                seeds.append(key)
    if spec.get("fill_scope_iris_names"):
        for name in spec["fill_scope_iris_names"]:
            key = unit_key(insee, name)
            if key in pool:
                scope.append(key)

    for quartier, mapping in (
        (spec.get("lille_quartier", []), LILLE_QUARTIER_IRIS),
        (spec.get("nice_quartier", []), NICE_QUARTIER_IRIS),
    ):
        for name in quartier:
            for iris_name in mapping.get(name, []):
                key = unit_key(insee or parse_insee_from_pool(pool, iris_name), iris_name)
                if key in pool:
                    seeds.append(key)

    if spec.get("vda_quartier"):
        code = spec["code"]
        tokens = VDA_ZONE_SCOPE.get(code, spec["vda_quartier"])
        for key, unit in pool.items():
            if unit["insee"] != "59009":
                continue
            label = normalize_label(unit["name"])
            if any(normalize_label(token) in label or label in normalize_label(token) for token in tokens):
                seeds.append(key)

    if spec.get("hellemmes_quartier"):
        for iris_name in LILLE_QUARTIER_IRIS["Hellemmes"]:
            key = unit_key("59350", iris_name)
            if key in pool:
                seeds.append(key)

    seeds = sorted(set(seeds))
    scope = sorted(set(scope)) if scope else []
    return insee, seeds, scope


def build_neighbor_graph(keys: list[str], pool: dict[str, dict[str, Any]]) -> dict[str, list[str]]:
    neighbors = {key: [] for key in keys}
    shapes = {key: pool[key]["geometry"] for key in keys}
    for index, left in enumerate(keys):
        for right in keys[index + 1 :]:
            if geometries_touch(shapes[left], shapes[right]):
                neighbors[left].append(right)
                neighbors[right].append(left)
    return neighbors


def watershed_within_scope(
    code: str,
    seeds: list[str],
    scope_keys: list[str],
    pool: dict[str, dict[str, Any]],
    assignment: dict[str, str],
    multipart: bool,
) -> None:
    if not seeds:
        return
    scope_set = set(scope_keys)
    available = [key for key in scope_set if key not in assignment]
    if not available:
        return
    shapes = {key: pool[key]["geometry"] for key in available}
    valid_seeds = [seed for seed in seeds if seed in available]
    if not valid_seeds:
        valid_seeds = [seeds[0]] if seeds[0] in scope_set else [available[0]]

    intended = {code: [pool[key]["name"] for key in valid_seeds if key in shapes]}
    name_to_key = {pool[key]["name"]: key for key in available}
    local_shapes = {pool[key]["name"]: shapes[key] for key in available if key in shapes}
    multipart_codes = {code} if multipart else set()

    from build_city_geometry_specs import watershed_assign

    zones = watershed_assign(intended, local_shapes, multipart_codes, fill_unassigned=True)
    for iris_name in zones[code]:
        key = name_to_key.get(iris_name)
        if key and key not in assignment:
            assignment[key] = code


def connected_components(keys: list[str], pool: dict[str, dict[str, Any]]) -> list[list[str]]:
    remaining = set(keys)
    components: list[list[str]] = []
    shapes = {key: pool[key]["geometry"] for key in keys}
    while remaining:
        seed = sorted(remaining)[0]
        stack = [seed]
        component = {seed}
        remaining.remove(seed)
        while stack:
            current = stack.pop()
            for candidate in list(remaining):
                if geometries_touch(shapes[current], shapes[candidate]):
                    remaining.remove(candidate)
                    component.add(candidate)
                    stack.append(candidate)
        components.append(sorted(component))
    return components


def context_label(city: str, insee: str, component: list[str], pool: dict[str, dict[str, Any]], index: int) -> str:
    names = [pool[key]["name"] for key in component]
    if city == "nice":
        joined = " ".join(names).lower()
        if any(token in joined for token in ("gairaut", "rimiez", "mont")):
            return "North hills context"
        if any(token in joined for token in ("arenas", "aéroport", "caucade", "lanterne")):
            return "Airport / Var plain context"
        if any(token in joined for token in ("las planas", "saint-sylvestre", "saint-barth")):
            return "Saint-Sylvestre / Las Planas context"
        if any(token in joined for token in ("madeleine", "bellet", "lingostière")):
            return "West hills context"
        if any(token in joined for token in ("mont boron", "mont alban", "cap de croix")):
            return "East hills context"
        if any(token in joined for token in ("cimiez", "valrose", "parc chambrun")):
            return "North-centre hills context"
        return f"Peripheral context {index}"
    if city == "lille":
        commune_names = {
            "59328": "Lambersart",
            "59368": "La Madeleine",
            "59410": "Mons-en-Barœul",
            "59009": "Villeneuve-d'Ascq",
            "59512": "Roubaix",
            "59350": "Lille",
        }
        base = commune_names.get(insee, insee)
        joined = " ".join(names).lower()
        if "pellevoisin" in joined or "saint-maurice" in joined:
            return "Saint-Maurice / Pellevoisin context"
        if "hellemmes" in joined or "mont à camp" in joined:
            return "Hellemmes context"
        if "lomme" in joined or "chr" in joined or "canteleu" in joined:
            return "Lomme context"
        return f"{base} context {index}"
    return f"Context {index}"


def default_context_scores(role: str = "context") -> dict[str, float]:
    return {
        "security": 6.0,
        "affordability": 5.5,
        "transport": 7.0,
        "studentEnergy": 4.5 if role == "low_relevance" else 5.5,
        "services": 6.5,
        "campusAccess": 5.5,
        "greenCalm": 6.5,
    }


def resolve_context_seeds(
    city_id: str,
    ctx: dict[str, Any],
    pool: dict[str, dict[str, Any]],
) -> list[str]:
    insee = ctx["insee"]
    seeds: list[str] = []
    missing: list[str] = []
    for name in ctx.get("seedIrisNames", []):
        key = unit_key(insee, name)
        if key in pool:
            seeds.append(key)
        else:
            missing.append(name)
    if missing:
        raise SystemExit(
            f"{city_id}: missing seeds for {ctx['code']} (INSEE {insee}): {missing}"
        )
    if not seeds:
        raise SystemExit(f"{city_id}: context zone {ctx['code']} requires seedIrisNames")
    return sorted(set(seeds))


def assign_context_for_commune(
    insee: str,
    context_defs: list[dict[str, Any]],
    unassigned: set[str],
    ctx_assignment: dict[str, str],
    pool: dict[str, dict[str, Any]],
    city_id: str,
) -> None:
    commune_defs = [ctx for ctx in context_defs if ctx["insee"] == insee]
    if not commune_defs:
        return
    available = sorted(
        key
        for key in unassigned
        if parse_unit_key(key)[0] == insee and key not in ctx_assignment
    )
    if not available:
        return
    seeds: list[tuple[str, str]] = []
    for ctx in commune_defs:
        code = ctx["code"]
        for key in resolve_context_seeds(city_id, ctx, pool):
            if key in available:
                seeds.append((key, code))
    if not seeds:
        return
    neighbors = build_neighbor_graph(available, pool)
    distance: dict[str, int] = {}
    owner: dict[str, str] = {}
    queue: deque[str] = deque()
    for key, code in seeds:
        if key not in distance:
            distance[key] = 0
            owner[key] = code
            queue.append(key)
    while queue:
        node = queue.popleft()
        for neighbor in neighbors.get(node, []):
            next_distance = distance[node] + 1
            if neighbor not in distance or next_distance < distance[neighbor]:
                distance[neighbor] = next_distance
                owner[neighbor] = owner[node]
                queue.append(neighbor)
    for key, code in owner.items():
        ctx_assignment[key] = code


def heal_disconnected_context(
    ctx_assignment: dict[str, str],
    context_defs: list[dict[str, Any]],
    pool: dict[str, dict[str, Any]],
    city_id: str,
) -> None:
    defs_by_insee: dict[str, list[dict[str, Any]]] = {}
    for ctx in context_defs:
        defs_by_insee.setdefault(ctx["insee"], []).append(ctx)

    for _pass in range(32):
        changed = False
        for code in sorted({value for value in ctx_assignment.values()}):
            keys = sorted(key for key, owner in ctx_assignment.items() if owner == code)
            components = connected_components(keys, pool)
            if len(components) <= 1:
                continue
            components.sort(key=len, reverse=True)
            insee = parse_unit_key(components[0][0])[0]
            candidates = [ctx["code"] for ctx in defs_by_insee.get(insee, []) if ctx["code"] != code]
            if not candidates:
                raise SystemExit(f"{city_id}: cannot heal disconnected context zone {code}")
            for orphan in components[1:]:
                shapes = {key: pool[key]["geometry"] for key in orphan}
                best_code = None
                best_touch = -1
                for candidate in candidates:
                    candidate_keys = [
                        key for key, owner in ctx_assignment.items() if owner == candidate
                    ]
                    touch = sum(
                        1
                        for left in orphan
                        for right in candidate_keys
                        if geometries_touch(shapes[left], pool[right]["geometry"])
                    )
                    if touch > best_touch:
                        best_touch = touch
                        best_code = candidate
                if best_code is None:
                    best_code = candidates[0]
                for key in orphan:
                    ctx_assignment[key] = best_code
                    changed = True
        if not changed:
            break


def assign_remaining_by_component(
    remaining: list[str],
    context_defs: list[dict[str, Any]],
    ctx_assignment: dict[str, str],
    pool: dict[str, dict[str, Any]],
    city_id: str,
) -> None:
    if not remaining:
        return
    by_insee: dict[str, list[dict[str, Any]]] = {}
    for ctx in context_defs:
        by_insee.setdefault(ctx["insee"], []).append(ctx)
    for component in connected_components(remaining, pool):
        insee = parse_unit_key(component[0])[0]
        candidates = by_insee.get(insee, [])
        if not candidates:
            raise SystemExit(f"{city_id}: no context zone for INSEE {insee}")
        best_code = None
        best_touch = -1
        shapes = {key: pool[key]["geometry"] for key in component}
        for ctx in candidates:
            code = ctx["code"]
            assigned_keys = [key for key, owner in ctx_assignment.items() if owner == code]
            if not assigned_keys:
                continue
            touch = sum(
                1
                for key in component
                for assigned in assigned_keys
                if geometries_touch(shapes[key], pool[assigned]["geometry"])
            )
            if touch > best_touch:
                best_touch = touch
                best_code = code
        if best_code is None:
            best_code = candidates[0]["code"]
        for key in component:
            ctx_assignment[key] = best_code


def emit_context_specs(
    city_id: str,
    context_defs: list[dict[str, Any]],
    ctx_assignment: dict[str, str],
    pool: dict[str, dict[str, Any]],
    primary_codes: set[str],
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    context_places: list[dict[str, Any]] = []
    context_specs: list[dict[str, Any]] = []
    defs_by_code = {ctx["code"]: ctx for ctx in context_defs}
    codes = sorted({code for code in ctx_assignment.values()})
    for code in codes:
        keys = sorted(key for key, owner in ctx_assignment.items() if owner == code)
        if not keys:
            continue
        ctx = defs_by_code[code]
        role = ctx.get("role", "context")
        allow_multipart = bool(ctx.get("allowMultipart"))
        components = connected_components(keys, pool)
        if len(components) > 1 and not allow_multipart:
            for index, component in enumerate(components, start=1):
                part_code = f"{code}-part{index}"
                if part_code in primary_codes or any(item["code"] == part_code for item in context_specs):
                    raise SystemExit(f"{city_id}: duplicate split code {part_code}")
                label = f"{ctx['label']} ({index})"
                context_specs.append(
                    spec_from_assignment(
                        part_code,
                        component,
                        pool,
                        role=role,
                        allow_multipart=allow_multipart,
                    )
                )
                context_places.append(context_place_entry(part_code, label, ctx, role))
            continue
        context_specs.append(
            spec_from_assignment(code, keys, pool, role=role, allow_multipart=allow_multipart)
        )
        context_places.append(context_place_entry(code, ctx["label"], ctx, role))
    return context_specs, context_places


def context_place_entry(
    code: str,
    label: str,
    ctx: dict[str, Any],
    role: str,
) -> dict[str, Any]:
    return {
        "code": code,
        "name": label,
        "parent": label,
        "area": label,
        "role": role,
        "confidence": "low",
        "evidence": (
            f"Full-coverage district context from official IRIS partition ({ctx['insee']}); "
            "map continuity, not a primary student pick."
        ),
        "scores": default_context_scores(role),
    }


def validate_lille_specs(
    city_id: str,
    specs: list[dict[str, Any]],
    pool: dict[str, dict[str, Any]],
) -> None:
    if city_id != "lille":
        return
    allowlist = {spec["code"] for spec in specs if spec.get("allowMultipart")}
    for spec in specs:
        code = spec["code"]
        names = spec.get("iris_names", [])
        shapes = {}
        for name in names:
            key = unit_key(spec["iris_insee"], name)
            if key not in pool:
                raise SystemExit(f"lille: missing IRIS {name} for {code}")
            shapes[name] = pool[key]["geometry"]
        if code not in allowlist and not is_connected_source_group(names, shapes):
            raise SystemExit(f"lille: disconnected zone {code} without allowMultipart")
        if len(names) > 1:
            insee_codes = {parse_unit_key(unit_key(spec["iris_insee"], name))[0] for name in names}
            if len(insee_codes) > 1:
                raise SystemExit(f"lille: cross-commune zone {code}")


def spec_from_assignment(
    code: str,
    keys: list[str],
    pool: dict[str, dict[str, Any]],
    *,
    role: str,
    allow_multipart: bool = False,
    nice_quartier: list[str] | None = None,
) -> dict[str, Any]:
    if not keys:
        raise SystemExit(f"Empty assignment for {code}")
    insee = parse_unit_key(keys[0])[0]
    names = sorted({pool[key]["name"] for key in keys})
    shapes = {pool[key]["name"]: pool[key]["geometry"] for key in keys}
    if not allow_multipart and not is_connected_source_group(names, shapes):
        raise SystemExit(f"Disconnected assignment for {code}: {names}")

    spec: dict[str, Any] = {
        "code": code,
        "iris_insee": insee,
        "iris_names": names,
        "geometry_method": "iris_full_partition",
        "coverageRole": role,
        "geometryBasis": "iris_partition",
    }
    if allow_multipart:
        spec["allowMultipart"] = True
    if nice_quartier:
        spec["nice_quartier"] = nice_quartier
    return spec


def build_city(city_id: str, config: dict[str, Any], intended_specs: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    insee_codes: list[str] = config["inseeCodes"]
    pool = load_all_iris(insee_codes)
    assignment: dict[str, str] = {}
    primary_codes = {spec["code"] for spec in intended_specs}

    for spec in intended_specs:
        code = spec["code"]
        insee, seeds, scope = resolve_seeds_from_intended(spec, pool)
        for key in seeds:
            if key in pool and key not in assignment:
                assignment[key] = code
        if scope:
            scope_keys = [key for key in scope if key in pool]
            watershed_within_scope(
                code,
                seeds,
                scope_keys,
                pool,
                assignment,
                bool(spec.get("allowMultipart")),
            )

    unassigned = sorted(key for key in pool if key not in assignment)
    context_places: list[dict[str, Any]] = []
    context_specs: list[dict[str, Any]] = []
    context_defs: list[dict[str, Any]] = config.get("contextZones", [])

    if context_defs:
        unassigned_set = set(unassigned)
        ctx_assignment: dict[str, str] = {}
        for insee in insee_codes:
            assign_context_for_commune(insee, context_defs, unassigned_set, ctx_assignment, pool, city_id)
        remaining = sorted(key for key in unassigned_set if key not in ctx_assignment)
        assign_remaining_by_component(remaining, context_defs, ctx_assignment, pool, city_id)
        heal_disconnected_context(ctx_assignment, context_defs, pool, city_id)

        for key, code in ctx_assignment.items():
            assignment[key] = code

        context_specs, context_places = emit_context_specs(
            city_id,
            context_defs,
            ctx_assignment,
            pool,
            primary_codes,
        )
    else:
        by_insee: dict[str, list[str]] = {}
        for key in unassigned:
            by_insee.setdefault(parse_unit_key(key)[0], []).append(key)
        context_index = 1
        for insee in insee_codes:
            keys = by_insee.get(insee, [])
            if not keys:
                continue
            for component in connected_components(keys, pool):
                label = context_label(city_id, insee, component, pool, context_index)
                slug = normalize_label(label)[:40] or f"context-{context_index}"
                code = f"{city_id}-context-{slug}"
                while code in primary_codes or any(item["code"] == code for item in context_specs):
                    context_index += 1
                    code = f"{city_id}-context-{insee}-{context_index}"
                for key in component:
                    assignment[key] = code
                role = "low_relevance" if "peripheral" in label.lower() else "context"
                context_specs.append(
                    spec_from_assignment(code, component, pool, role=role, allow_multipart=False)
                )
                context_places.append(
                    {
                        "code": code,
                        "name": label,
                        "parent": label,
                        "area": label,
                        "role": role,
                        "confidence": "low",
                        "evidence": (
                            f"Full-coverage context zone from official IRIS partition ({insee}); "
                            "map continuity, not a primary student pick."
                        ),
                        "scores": default_context_scores(role),
                    }
                )
                context_index += 1

    if len(assignment) != len(pool):
        missing = sorted(set(pool) - set(assignment))
        raise SystemExit(f"{city_id}: unassigned IRIS after partition: {missing[:5]}... ({len(missing)} total)")

    duplicates: dict[str, list[str]] = {}
    for key, code in assignment.items():
        duplicates.setdefault(code, []).append(key)
    geometry_specs: list[dict[str, Any]] = []
    for spec in intended_specs:
        code = spec["code"]
        keys = [key for key, owner in assignment.items() if owner == code]
        if not keys:
            continue
        insee, _, _ = resolve_seeds_from_intended(spec, pool)
        geometry_specs.append(
            spec_from_assignment(
                code,
                keys,
                pool,
                role="primary",
                allow_multipart=bool(spec.get("allowMultipart")),
                nice_quartier=spec.get("nice_quartier"),
            )
        )

    geometry_specs.extend(context_specs)
    geometry_specs.sort(key=lambda item: item["code"])
    validate_lille_specs(city_id, geometry_specs, pool)
    return geometry_specs, context_places


def load_city_config(city_id: str) -> dict[str, Any]:
    scopes = json.loads(SCOPES_JSON.read_text(encoding="utf-8"))
    if city_id not in scopes:
        raise SystemExit(f"Missing coverage scope for {city_id} in {SCOPES_JSON}")
    return scopes[city_id]


def main() -> None:
    import sys

    cities = sys.argv[1:] or ["lille", "nice"]
    intended_all = json.loads(INTENDED_JSON.read_text(encoding="utf-8"))
    geometry = json.loads(GEOMETRY_JSON.read_text(encoding="utf-8")) if GEOMETRY_JSON.exists() else {}
    context_all: dict[str, list[dict[str, Any]]] = {}
    if CONTEXT_PLACES_JSON.exists():
        context_all = json.loads(CONTEXT_PLACES_JSON.read_text(encoding="utf-8"))

    for city_id in cities:
        config = load_city_config(city_id)
        intended_specs = intended_all[city_id]
        specs, context_places = build_city(city_id, config, intended_specs)
        geometry[city_id] = specs
        context_all[city_id] = context_places
        assigned = sum(len(spec.get("iris_names", [])) for spec in specs)
        print(
            f"{city_id}: {len(specs)} zones ({len(intended_specs)} primary + "
            f"{len(context_places)} context, {assigned} IRIS units)"
        )

    GEOMETRY_JSON.write_text(json.dumps(geometry, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    CONTEXT_PLACES_JSON.write_text(json.dumps(context_all, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Updated {GEOMETRY_JSON} and {CONTEXT_PLACES_JSON}")


if __name__ == "__main__":
    main()