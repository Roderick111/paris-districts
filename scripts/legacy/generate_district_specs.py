#!/usr/bin/env python3
"""Generate granularity_geometry.json specs for Toulouse, Nantes, Nice district rebuild."""

from __future__ import annotations

import json
from pathlib import Path

from build_new_city_geojson import load_nice
from geometry_audit import is_connected_source_group

ROOT = Path(__file__).resolve().parents[2]
GEOMETRY_JSON = ROOT / "scripts" / "granularity_geometry.json"
INTENDED_JSON = ROOT / "scripts" / "granularity_intended.json"

TOULOUSE_QUARTIER = {
    "toulouse-amidonniers-compans": "Amidonniers / Compans-Caffarelli / Brouardel",
    "toulouse-saint-cyprien": "Saint-Cyprien",
    "toulouse-chalets-bayard-saint-aubin": "Les Chalets / Bayard / Belfort / Saint-Aubin / Dupuy",
    "toulouse-bonnefoy-marengo": "Lapujade / Bonnefoy / Périole / Marengo / La Colonne",
    "toulouse-croix-pierre-route-espagne": "Croix-de-Pierre / Route d'Espagne",
    "toulouse-arenes-bagatelle-papus": "Fontaine-Lestang/Arènes/Bagatelle/Papus/Tabar/Bordelongue/Mermoz /La Faourette",
    "toulouse-casselardit-cartoucherie": "Casselardit / Fontaine-Bayonne / Cartoucherie",
    "toulouse-minimes-barriere-paris": "Minimes / Barrière de Paris / Ponts-Jumeaux / La Vache / Raisin / Fondeyre",
    "toulouse-sept-deniers-lalande": "Sept Deniers / Ginestous-Sesquières / Lalande",
    "toulouse-borderouge-croix-daurade": "Trois Cocus / Borderouge / Croix-Daurade / Paleficat / Grand Selve",
    "toulouse-jolimont-roseraie-soupetard": "Jolimont / Soupetard / Roseraie / Gloire / Gramont / Amouroux",
    "toulouse-guilhemery-cote-pavee": "Bonhoure / Guilheméry / Château de l'Hers / Limayrac / Côte Pavée",
    "toulouse-demoiselles-montaudran": "Pont des Demoiselles / Ormeau/ Montaudran / La Terrasse / Malepère",
    "toulouse-rangueil-sauzelong": "Rangueil / Sauzelong / Jules-Julien / Pech-David / Pouvourville",
    "toulouse-purpan-saint-martin": "Arènes Romaines / Ancely / Saint-Martin du Touch / Purpan",
    "toulouse-lardenne-pradettes-basso-cambo": "Lardenne / Pradettes / Basso-Cambo",
    "toulouse-mirail-reynerie-bellefontaine": "Mirail -Université / Reynerie / Bellefontaine",
    "toulouse-saint-simon-lafourguette-oncopole": "Saint-Simon / Lafourguette / Oncopole - Campus Santé du Futur",
}

TOULOUSE_SPLIT_PARENTS = {
    "Capitole / Arnaud Bernard / Carmes": {
        "toulouse-capitole-carmes": [
            "Wilson",
            "Jacobins",
            "Taur",
            "Ozenne",
            "Sébastopol",
            "Dalbade",
            "Saint-Rome",
        ],
        "toulouse-arnaud-bernard-saint-sernin": ["Chaussas", "Coquille", "Saint-Sernin"],
    },
    "Saint-Michel /  Saint-Agne / Empalot / Le Busca / Île du Ramier / Monplaisir": {
        "toulouse-saint-michel-saint-agne": [
            "Saint-Léon",
            "Jardin des Plantes",
            "Notre-Dame",
            "Branly",
            "Montplaisir",
            "Daste",
            "Poudrerie",
        ],
        "toulouse-empalot-ramier": ["Ramier"],
    },
}

NANTES_OFFICIAL_QUARTIER = {
    "nantes-centre-bouffay-commerce": "Centre-ville",
    "nantes-dervallieres-zola": "Dervallières - Zola",
    "nantes-bellevue-chantenay-sainte-anne": "Bellevue - Chantenay - Sainte-Anne",
    "nantes-breil-barberie": "Breil - Barberie",
    "nantes-doulon-bottiere": "Doulon - Bottière",
    "nantes-sud": "Nantes Sud",
}

NANTES_SPLIT_PARENTS: dict[str, dict[str, list[str]]] = {
    "Hauts-Pavés - Saint-Félix": {
        "nantes-talensac-viarme-hauts-paves": [
            "Talensac-Pont Morand",
            "Viarme",
            "Guist'hau",
            "Hauts Pavés",
            "Canclaux",
            "Coudray",
        ],
        "nantes-saint-felix-michelet": ["Saint-Félix", "Université-Michelet", "Mellinet"],
    },
    "Nantes Nord": {
        "nantes-facultes-petit-port": ["Bourgeonnière-Petit Port", "Jonelière-Université"],
        "nantes-nord-context": ["Bout des Landes", "Z.A. Hauts de Gesvre"],
    },
    "Nantes Erdre": {
        "nantes-chantrerie-gachet": ["Z.A. Chantrerie-Gachet", "Z.A. Hauts de Gesvre"],
        "nantes-erdre-context": [
            "Saint-Joseph-Erdre",
            "Saint-Joseph-Bourg",
            "Haluchère-Perray",
        ],
    },
    "Île de Nantes": {
        "nantes-ile-west-centre": ["République-Les Ponts", "Z.A. Sainte-Anne-Zone Portuaire"],
        "nantes-ile-east": ["Île Beaulieu", "Beaulieu-Mangin"],
    },
    "Malakoff - Saint-Donatien": {
        "nantes-malakoff": ["Malakoff", "Vieux Malakoff", "Caserne Mellinet"],
        "nantes-saint-donatien": ["Saint-Donatien", "Pervérie", "Dervallières-Chézine"],
    },
}

NANTES_ROLES = {
    "nantes-centre-bouffay-commerce": ("primary", "official_quartier", "medium"),
    "nantes-talensac-viarme-hauts-paves": ("primary", "iris_district_partition", "high"),
    "nantes-saint-felix-michelet": ("campus", "iris_district_partition", "high"),
    "nantes-facultes-petit-port": ("campus", "iris_district_partition", "high"),
    "nantes-nord-context": ("context", "iris_district_partition", "medium"),
    "nantes-chantrerie-gachet": ("campus", "iris_district_partition", "high"),
    "nantes-erdre-context": ("context", "iris_district_partition", "low"),
    "nantes-ile-west-centre": ("primary", "iris_district_partition", "medium"),
    "nantes-ile-east": ("context", "iris_district_partition", "medium"),
    "nantes-malakoff": ("risk_cap", "iris_district_partition", "high"),
    "nantes-saint-donatien": ("primary", "iris_district_partition", "medium"),
    "nantes-dervallieres-zola": ("risk_cap", "official_quartier", "high"),
    "nantes-bellevue-chantenay-sainte-anne": ("risk_cap", "official_quartier", "high"),
    "nantes-breil-barberie": ("context", "official_quartier", "medium"),
    "nantes-doulon-bottiere": ("context", "official_quartier", "medium"),
    "nantes-sud": ("context", "official_quartier", "low"),
}

TOULOUSE_ROLES = {
    "toulouse-capitole-carmes": ("primary", "iris_district_partition", "medium"),
    "toulouse-arnaud-bernard-saint-sernin": ("risk_cap", "iris_district_partition", "high"),
    "toulouse-amidonniers-compans": ("primary", "official_quartier", "medium"),
    "toulouse-chalets-bayard-saint-aubin": ("primary", "official_quartier", "medium"),
    "toulouse-bonnefoy-marengo": ("context", "official_quartier", "medium"),
    "toulouse-saint-cyprien": ("primary", "official_quartier", "high"),
    "toulouse-croix-pierre-route-espagne": ("context", "official_quartier", "medium"),
    "toulouse-arenes-bagatelle-papus": ("risk_cap", "official_quartier", "high"),
    "toulouse-casselardit-cartoucherie": ("context", "official_quartier", "medium"),
    "toulouse-minimes-barriere-paris": ("primary", "official_quartier", "medium"),
    "toulouse-sept-deniers-lalande": ("context", "official_quartier", "low"),
    "toulouse-borderouge-croix-daurade": ("context", "official_quartier", "medium"),
    "toulouse-jolimont-roseraie-soupetard": ("context", "official_quartier", "medium"),
    "toulouse-guilhemery-cote-pavee": ("context", "official_quartier", "medium"),
    "toulouse-demoiselles-montaudran": ("context", "official_quartier", "low"),
    "toulouse-rangueil-sauzelong": ("campus", "official_quartier", "high"),
    "toulouse-saint-michel-saint-agne": ("primary", "iris_district_partition", "medium"),
    "toulouse-empalot-ramier": ("risk_cap", "iris_district_partition", "medium"),
    "toulouse-purpan-saint-martin": ("campus", "official_quartier", "high"),
    "toulouse-lardenne-pradettes-basso-cambo": ("context", "official_quartier", "medium"),
    "toulouse-mirail-reynerie-bellefontaine": ("risk_cap", "official_quartier", "high"),
    "toulouse-saint-simon-lafourguette-oncopole": ("low_relevance", "official_quartier", "low"),
}

NICE_QUARTIER_GROUPS: dict[str, list[str]] = {
    "nice-vieux-nice-port": ["Vieille Ville", "Le Port"],
    "nice-carabacel-garibaldi": ["Carabacel"],
    "nice-jean-medecin-massena": ["Centre Ville"],
    "nice-thiers-musiciens": ["Thiers"],
    "nice-gambetta-rue-france": ["Gambetta", "Rue de France"],
    "nice-liberation-valrose": ["Libération"],
    "nice-gare-tzanck-valrose": [
        "La Gare",
        "Jaquons - Ravet",
        "Tzanck - Galinières - Sauvaigo",
        "Point du Jour - Porte de France",
    ],
    "nice-vernier": ["Vernier"],
    "nice-mantega-piol": ["Mantega", "Le Piol"],
    "nice-saint-maurice-ray": ["Saint Maurice", "Le Ray"],
    "nice-saint-sylvestre": ["Saint Sylvestre"],
    "nice-cimiez": ["Cimiez"],
    "nice-rimiez-gairaut": ["Rimiez", "Gairaut"],
    "nice-pessicart-saint-pancrace": ["Pessicart", "Saint Pancrace"],
    "nice-madeleine-saint-pierre": ["Madeleine", "Saint Pierre de Féric"],
    "nice-baumettes-magnan": ["Baumettes"],
    "nice-carlone-medecin": ["Médecin"],
    "nice-saint-philippe": ["Saint Philippe"],
    "nice-fabron-saint-antoine": ["Fabron", "Saint Antoine"],
    "nice-caucade": ["Caucade"],
    "nice-saint-augustin-moulins": ["Saint Augustin"],
    "nice-arenas-sainte-marguerite": ["Arenas", "Sainte Marguerite"],
    "nice-saint-isidore-lingostiere": ["Saint Isidore", "Lingostière", "Iscles - Ste Pétronille"],
    "nice-cremat-bellet": ["Cremat", "Saint Roman", "Ventabrun"],
    "nice-riquier-saint-roch": ["Riquier", "Saint Roch", "Roquebillière"],
    "nice-pasteur": ["Pasteur"],
    "nice-ariane": ["Ariane"],
    "nice-mont-boron-vinaigrier": ["Mont Boron", "Vinaigrier"],
    "nice-vespins-littoral": ["Vespins - Littoral"],
    "nice-corniche-promenade": [
        "Les Pugets",
        "Montaleigne - Corniche Sud",
        "Plateaux Fleuris - Corniche Sud",
        "Rascas - Rives d'or",
    ],
}

NICE_ROLES: dict[str, tuple[str, str, str]] = {
    "nice-vieux-nice-port": ("primary", "official_quartier_group", "medium"),
    "nice-carabacel-garibaldi": ("primary", "official_quartier_group", "medium"),
    "nice-jean-medecin-massena": ("primary", "official_quartier_group", "medium"),
    "nice-thiers-musiciens": ("primary", "official_quartier_group", "medium"),
    "nice-gambetta-rue-france": ("primary", "official_quartier_group", "medium"),
    "nice-liberation-valrose": ("campus", "official_quartier_group", "high"),
    "nice-gare-tzanck-valrose": ("campus", "official_quartier_group", "high"),
    "nice-vernier": ("primary", "official_quartier_group", "medium"),
    "nice-mantega-piol": ("primary", "official_quartier_group", "medium"),
    "nice-saint-maurice-ray": ("primary", "official_quartier_group", "medium"),
    "nice-saint-sylvestre": ("context", "official_quartier_group", "medium"),
    "nice-cimiez": ("context", "official_quartier_group", "medium"),
    "nice-rimiez-gairaut": ("low_relevance", "official_quartier_group", "low"),
    "nice-pessicart-saint-pancrace": ("primary", "official_quartier_group", "medium"),
    "nice-madeleine-saint-pierre": ("context", "official_quartier_group", "medium"),
    "nice-baumettes-magnan": ("primary", "official_quartier_group", "medium"),
    "nice-carlone-medecin": ("campus", "official_quartier_group", "high"),
    "nice-saint-philippe": ("primary", "official_quartier_group", "medium"),
    "nice-fabron-saint-antoine": ("context", "official_quartier_group", "medium"),
    "nice-caucade": ("risk_cap", "official_quartier_group", "high"),
    "nice-saint-augustin-moulins": ("campus", "official_quartier_group", "high"),
    "nice-arenas-sainte-marguerite": ("campus", "official_quartier_group", "high"),
    "nice-saint-isidore-lingostiere": ("low_relevance", "official_quartier_group", "low"),
    "nice-cremat-bellet": ("low_relevance", "official_quartier_group", "low"),
    "nice-riquier-saint-roch": ("context", "official_quartier_group", "medium"),
    "nice-pasteur": ("risk_cap", "official_quartier_group", "high"),
    "nice-ariane": ("risk_cap", "official_quartier_group", "high"),
    "nice-mont-boron-vinaigrier": ("context", "official_quartier_group", "medium"),
    "nice-vespins-littoral": ("context", "official_quartier_group", "low"),
    "nice-corniche-promenade": ("primary", "official_quartier_group", "medium"),
}


def compute_toulouse_split_iris() -> dict[str, list[str]]:
    import urllib.request
    from collections import deque

    from geometry_audit import geometries_touch

    def fetch(url: str) -> dict:
        return json.loads(
            urllib.request.urlopen(
                urllib.request.Request(url, headers={"User-Agent": "paris-student-map/1.0"}),
                timeout=120,
            ).read()
        )

    def centroid(geom: dict) -> tuple[float, float]:
        coords: list[list[float]] = []

        def walk(value: object) -> None:
            if isinstance(value, list) and value and isinstance(value[0], (int, float)):
                coords.append(value)  # type: ignore[arg-type]
            elif isinstance(value, list):
                for part in value:
                    walk(part)

        walk(geom["coordinates"])
        return sum(point[0] for point in coords) / len(coords), sum(point[1] for point in coords) / len(coords)

    def point_in_ring(x: float, y: float, ring: list[list[float]]) -> bool:
        inside = False
        j = len(ring) - 1
        for i in range(len(ring)):
            xi, yi = ring[i]
            xj, yj = ring[j]
            if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi + 1e-15) + xi:
                inside = not inside
            j = i
        return inside

    def point_in_geom(x: float, y: float, geom: dict) -> bool:
        if geom["type"] == "Polygon":
            return point_in_ring(x, y, geom["coordinates"][0])
        return any(point_in_ring(x, y, poly[0]) for poly in geom["coordinates"])

    iris_path = ROOT / "scripts/cache/iris_31555.geojson"
    iris_shapes = {
        feature["properties"]["nom_iris"]: feature["geometry"]
        for feature in json.loads(iris_path.read_text(encoding="utf-8"))["features"]
    }
    quartier_shapes = {
        feature["properties"]["nom_quartier"]: feature["geometry"]
        for feature in fetch(
            "https://data.toulouse-metropole.fr/api/explore/v2.1/catalog/datasets/"
            "quartiers-de-democratie-locale/exports/geojson"
        )["features"]
    }

    split_iris: dict[str, list[str]] = {}
    for parent, zone_seeds in TOULOUSE_SPLIT_PARENTS.items():
        parent_iris = [
            name
            for name, geometry in iris_shapes.items()
            if point_in_geom(*centroid(geometry), quartier_shapes[parent])
        ]
        neighbors = {name: [] for name in parent_iris}
        for left_index, left in enumerate(parent_iris):
            for right in parent_iris[left_index + 1 :]:
                if geometries_touch(iris_shapes[left], iris_shapes[right]):
                    neighbors[left].append(right)
                    neighbors[right].append(left)
        assignment: dict[str, str] = {}
        for code, seeds in zone_seeds.items():
            for seed in seeds:
                if seed in parent_iris:
                    assignment[seed] = code
        queue = deque(
            (seed, code, 0)
            for code, seeds in zone_seeds.items()
            for seed in seeds
            if seed in parent_iris
        )
        while queue:
            node, code, _distance = queue.popleft()
            if node in assignment and assignment[node] != code:
                continue
            assignment[node] = code
            for neighbor in neighbors.get(node, []):
                if neighbor not in assignment:
                    queue.append((neighbor, code, 0))
        for code in zone_seeds:
            split_iris[code] = sorted(name for name, owner in assignment.items() if owner == code)
    return split_iris


def build_toulouse_specs() -> list[dict]:
    split_iris = compute_toulouse_split_iris()
    specs: list[dict] = []
    for code, iris_names in split_iris.items():
        role, basis, confidence = TOULOUSE_ROLES[code]
        parent = next(
            parent
            for parent, zones in TOULOUSE_SPLIT_PARENTS.items()
            if code in zones
        )
        spec: dict = {
            "code": code,
            "iris_insee": "31555",
            "iris_names": iris_names,
            "geometry_method": "iris_district_partition",
            "geometryBasis": basis,
            "coverageRole": role,
            "confidence": confidence,
            "split_parent": parent,
        }
        specs.append(spec)
    for code, quartier in TOULOUSE_QUARTIER.items():
        role, basis, confidence = TOULOUSE_ROLES[code]
        spec: dict = {
            "code": code,
            "toulouse_quartier": [quartier],
            "geometry_method": "official_quartier_group" if basis == "official_quartier" else "major_district",
            "geometryBasis": basis,
            "coverageRole": role,
            "confidence": confidence,
        }
        specs.append(spec)
    order = [
        "toulouse-capitole-carmes",
        "toulouse-arnaud-bernard-saint-sernin",
        "toulouse-saint-michel-saint-agne",
        "toulouse-empalot-ramier",
        *TOULOUSE_QUARTIER.keys(),
    ]
    return sorted(specs, key=lambda item: order.index(item["code"]))


def compute_nantes_split_iris() -> dict[str, list[str]]:
    import urllib.request
    from collections import deque

    from geometry_audit import geometries_touch

    def fetch(url: str) -> dict:
        return json.loads(
            urllib.request.urlopen(
                urllib.request.Request(url, headers={"User-Agent": "paris-student-map/1.0"}),
                timeout=120,
            ).read()
        )

    def centroid(geom: dict) -> tuple[float, float]:
        coords: list[list[float]] = []

        def walk(value: object) -> None:
            if isinstance(value, list) and value and isinstance(value[0], (int, float)):
                coords.append(value)  # type: ignore[arg-type]
            elif isinstance(value, list):
                for part in value:
                    walk(part)

        walk(geom["coordinates"])
        return sum(point[0] for point in coords) / len(coords), sum(point[1] for point in coords) / len(coords)

    def point_in_ring(x: float, y: float, ring: list[list[float]]) -> bool:
        inside = False
        j = len(ring) - 1
        for i in range(len(ring)):
            xi, yi = ring[i]
            xj, yj = ring[j]
            if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi + 1e-15) + xi:
                inside = not inside
            j = i
        return inside

    def point_in_geom(x: float, y: float, geom: dict) -> bool:
        if geom["type"] == "Polygon":
            return point_in_ring(x, y, geom["coordinates"][0])
        return any(point_in_ring(x, y, poly[0]) for poly in geom["coordinates"])

    iris_path = ROOT / "scripts/cache/iris_44109.geojson"
    iris_shapes = {
        feature["properties"]["nom_iris"]: feature["geometry"]
        for feature in json.loads(iris_path.read_text(encoding="utf-8"))["features"]
    }
    quartier_shapes = {
        feature["properties"]["nom"]: feature["geometry"]
        for feature in fetch(
            "https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/"
            "244400404_quartiers-communes-nantes-metropole/exports/geojson"
        )["features"]
        if feature["properties"].get("libcom") == "Nantes"
    }

    official_shapes = {
        quartier: quartier_shapes[quartier] for quartier in NANTES_OFFICIAL_QUARTIER.values()
    }

    def iris_in_official_quartier(iris_name: str) -> bool:
        center = centroid(iris_shapes[iris_name])
        return any(point_in_geom(*center, geometry) for geometry in official_shapes.values())

    split_iris: dict[str, list[str]] = {}
    for parent, zone_seeds in NANTES_SPLIT_PARENTS.items():
        parent_geom = quartier_shapes[parent]
        parent_iris = [
            name
            for name, geometry in iris_shapes.items()
            if point_in_geom(*centroid(geometry), parent_geom)
            and not iris_in_official_quartier(name)
        ]
        neighbors = {name: [] for name in parent_iris}
        for left_index, left in enumerate(parent_iris):
            for right in parent_iris[left_index + 1 :]:
                if geometries_touch(iris_shapes[left], iris_shapes[right]):
                    neighbors[left].append(right)
                    neighbors[right].append(left)
        assignment: dict[str, str] = {}
        for code, seeds in zone_seeds.items():
            for seed in seeds:
                if seed in parent_iris:
                    assignment[seed] = code
        queue = deque(
            (seed, code, 0)
            for code, seeds in zone_seeds.items()
            for seed in seeds
            if seed in parent_iris
        )
        while queue:
            node, code, _distance = queue.popleft()
            if node in assignment and assignment[node] != code:
                continue
            assignment[node] = code
            for neighbor in neighbors.get(node, []):
                if neighbor not in assignment:
                    queue.append((neighbor, code, 0))
        for code in zone_seeds:
            split_iris[code] = sorted(name for name, owner in assignment.items() if owner == code)
    return split_iris


def build_nantes_specs(_old_specs: list[dict]) -> list[dict]:
    split_iris = compute_nantes_split_iris()
    specs: list[dict] = []
    for code, iris_names in split_iris.items():
        role, basis, confidence = NANTES_ROLES[code]
        parent = next(
            parent
            for parent, zones in NANTES_SPLIT_PARENTS.items()
            if code in zones
        )
        specs.append(
            {
                "code": code,
                "iris_insee": "44109",
                "iris_names": iris_names,
                "geometry_method": "iris_district_partition",
                "geometryBasis": basis,
                "coverageRole": role,
                "confidence": confidence,
                "split_parent": parent,
            }
        )
    for code, quartier in NANTES_OFFICIAL_QUARTIER.items():
        role, basis, confidence = NANTES_ROLES[code]
        specs.append(
            {
                "code": code,
                "nantes_quartier": [quartier],
                "geometry_method": "official_quartier",
                "geometryBasis": basis,
                "coverageRole": role,
                "confidence": confidence,
            }
        )
    order = [
        "nantes-centre-bouffay-commerce",
        "nantes-talensac-viarme-hauts-paves",
        "nantes-saint-felix-michelet",
        "nantes-facultes-petit-port",
        "nantes-nord-context",
        "nantes-chantrerie-gachet",
        "nantes-erdre-context",
        "nantes-ile-west-centre",
        "nantes-ile-east",
        "nantes-malakoff",
        "nantes-saint-donatien",
        "nantes-dervallieres-zola",
        "nantes-bellevue-chantenay-sainte-anne",
        "nantes-breil-barberie",
        "nantes-doulon-bottiere",
        "nantes-sud",
    ]
    return sorted(specs, key=lambda item: order.index(item["code"]))


def build_nice_specs() -> list[dict]:
    shapes = load_nice()
    official = {name for name in shapes if name and name[0].isupper()}
    specs: list[dict] = []
    assigned: set[str] = set()
    for code, quartiers in NICE_QUARTIER_GROUPS.items():
        missing = [name for name in quartiers if name not in shapes]
        if missing:
            raise SystemExit(f"Missing official Nice quartiers for {code}: {missing}")
        subset = {name: shapes[name] for name in quartiers}
        if not is_connected_source_group(quartiers, subset):
            raise SystemExit(f"Disconnected official quartier group for {code}: {quartiers}")
        role, basis, confidence = NICE_ROLES[code]
        specs.append(
            {
                "code": code,
                "nice_quartier": quartiers,
                "geometry_method": "official_quartier_group",
                "geometryBasis": basis,
                "coverageRole": role,
                "confidence": confidence,
            }
        )
        overlap = assigned.intersection(quartiers)
        if overlap:
            raise SystemExit(f"Nice quartier {sorted(overlap)} assigned to multiple zones")
        assigned.update(quartiers)
    unassigned = sorted(official - assigned)
    if unassigned:
        raise SystemExit(f"Unassigned official Nice quartiers ({len(unassigned)}): {unassigned}")
    order = list(NICE_QUARTIER_GROUPS)
    return sorted(specs, key=lambda item: order.index(item["code"]))


def to_intended(specs: list[dict]) -> list[dict]:
    intended: list[dict] = []
    for spec in specs:
        entry: dict = {"code": spec["code"]}
        for key in (
            "iris_insee",
            "iris_names",
            "toulouse_quartier",
            "nantes_quartier",
            "nice_quartier",
            "coverageRole",
            "geometryBasis",
            "confidence",
            "allowMultipart",
            "multipartJustification",
            "split_parent",
        ):
            if key in spec:
                entry[key] = spec[key]
        intended.append(entry)
    return intended


def main() -> None:
    geometry = json.loads(GEOMETRY_JSON.read_text(encoding="utf-8"))
    old_nantes = geometry.get("nantes", [])

    toulouse = build_toulouse_specs()
    nantes = build_nantes_specs(old_nantes)
    nice = build_nice_specs()

    geometry["toulouse"] = toulouse
    geometry["nantes"] = nantes
    geometry["nice"] = nice
    GEOMETRY_JSON.write_text(json.dumps(geometry, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    intended = json.loads(INTENDED_JSON.read_text(encoding="utf-8"))
    intended["toulouse"] = to_intended(toulouse)
    intended["nantes"] = to_intended(nantes)
    intended["nice"] = to_intended(nice)
    INTENDED_JSON.write_text(json.dumps(intended, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"toulouse: {len(toulouse)} specs")
    iris_count = sum(len(s.get("iris_names", [])) for s in nantes)
    official_count = sum(len(s.get("nantes_quartier", [])) for s in nantes)
    print(f"nantes: {len(nantes)} specs, {official_count} official quartiers, {iris_count} IRIS in splits")
    print(f"nice: {len(nice)} specs, {sum(len(s['nice_quartier']) for s in nice)} official quartiers")


if __name__ == "__main__":
    main()