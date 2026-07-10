#!/usr/bin/env python3
"""Generate scripts/city_configs/*.json from legacy geometry specs."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
SCRIPTS = ROOT / "scripts"
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))

from city_compiler.schema import default_sources_for_legacy_spec, legacy_spec_to_zone
CONFIGS_DIR = SCRIPTS / "city_configs"
GEOMETRY_JSON = SCRIPTS / "granularity_geometry.json"
MARSEILLE_GROUPS = SCRIPTS / "marseille_quartier_groups.json"
COVERAGE_SCOPES = SCRIPTS / "city_coverage_scopes.json"
BATCH_GROUPS = SCRIPTS / "batch_city_groups.json"

CITY_META: dict[str, dict[str, str]] = {
    "toulouse": {"placesFile": "src/data/toulousePlaces.ts", "geojsonOutput": "public/data/toulouse.geojson", "outlineOutput": "public/data/toulouse-outlines.geojson"},
    "lille": {"placesFile": "src/data/lillePlaces.ts", "geojsonOutput": "public/data/lille.geojson", "outlineOutput": "public/data/lille-outlines.geojson"},
    "marseille": {"placesFile": "src/data/marseillePlaces.ts", "geojsonOutput": "public/data/marseille.geojson", "outlineOutput": "public/data/marseille-outlines.geojson"},
    "nice": {"placesFile": "src/data/nicePlaces.ts", "geojsonOutput": "public/data/nice.geojson", "outlineOutput": "public/data/nice-outlines.geojson"},
    "nantes": {"placesFile": "src/data/nantesPlaces.ts", "geojsonOutput": "public/data/nantes.geojson", "outlineOutput": "public/data/nantes-outlines.geojson"},
    "strasbourg": {"placesFile": "src/data/strasbourgPlaces.ts", "geojsonOutput": "public/data/strasbourg.geojson", "outlineOutput": "public/data/strasbourg-outlines.geojson"},
    "montpellier": {"placesFile": "src/data/montpellierPlaces.ts", "geojsonOutput": "public/data/montpellier.geojson", "outlineOutput": "public/data/montpellier-outlines.geojson"},
    "rennes": {"placesFile": "src/data/rennesPlaces.ts", "geojsonOutput": "public/data/rennes.geojson", "outlineOutput": "public/data/rennes-outlines.geojson"},
    "toulon": {"placesFile": "src/data/toulonPlaces.ts", "geojsonOutput": "public/data/toulon.geojson", "outlineOutput": "public/data/toulon-outlines.geojson"},
    "grenoble": {"placesFile": "src/data/grenoblePlaces.ts", "geojsonOutput": "public/data/grenoble.geojson", "outlineOutput": "public/data/grenoble-outlines.geojson"},
    "paris": {"placesFile": "src/data/cities.ts", "geojsonOutput": "public/data/districts.geojson"},
    "bordeaux": {"placesFile": "src/data/bordeauxPlaces.ts", "geojsonOutput": "public/data/bordeaux.geojson"},
    "lyon": {"placesFile": "src/data/lyonPlaces.ts", "geojsonOutput": "public/data/lyon.geojson"},
}

DEFAULT_SOURCES: dict[str, list[dict[str, Any]]] = {
    "lille": [
        {"id": "lille_quartiers", "type": "lille_wfs_quartiers"},
        {"id": "vda_wfs_quartiers", "type": "vda_wfs_quartiers"},
        {"id": "iris_59163", "type": "iris_wfs", "insee": "59163"},
        {"id": "iris_59328", "type": "iris_wfs", "insee": "59328"},
        {"id": "iris_59368", "type": "iris_wfs", "insee": "59368"},
        {"id": "iris_59410", "type": "iris_wfs", "insee": "59410"},
        {"id": "iris_59512", "type": "iris_wfs", "insee": "59512"},
        {"id": "iris_59599", "type": "iris_wfs", "insee": "59599"},
        {"id": "geo_api_commune", "type": "geo_api_commune"},
    ],
    "marseille": [{"id": "marseille_quartiers", "type": "marseille_quartiers"}],
    "toulouse": [
        {"id": "toulouse_quartiers", "type": "toulouse_quartiers"},
        {"id": "iris_31555", "type": "iris_wfs", "insee": "31555"},
    ],
    "nice": [
        {"id": "nice_quartiers", "type": "nice_quartiers"},
        {"id": "iris_06088", "type": "iris_wfs", "insee": "06088"},
    ],
    "nantes": [
        {"id": "nantes_quartiers", "type": "nantes_quartiers"},
        {"id": "iris_44109", "type": "iris_wfs", "insee": "44109"},
    ],
    "strasbourg": [
        {
            "id": "strasbourg_quartiers",
            "type": "strasbourg_quartiers",
            "url": "https://data.strasbourg.eu/api/explore/v2.1/catalog/datasets/strasbourg_23_quartiers/exports/geojson",
            "nameKey": "nom_quartier",
            "extraUrl": "https://data.strasbourg.eu/api/explore/v2.1/catalog/datasets/strasbourg-15-quartiers/exports/geojson",
            "extraNameKey": "libelle",
        },
        {"id": "geo_api_commune", "type": "geo_api_commune"},
    ],
    "rennes": [
        {
            "id": "rennes_quartiers",
            "type": "rennes_quartiers",
            "url": "https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/perimetres-des-12-quartiers-de-la-ville-de-rennes/exports/geojson",
            "nameKey": "nom",
        },
    ],
    "grenoble": [
        {
            "id": "grenoble_quartiers",
            "type": "grenoble_quartiers",
            "url": "https://data.metropolegrenoble.fr/sites/default/files/dataset/2023/02/22/0dcfa54a-6dad-4a31-af19-d2baaef4320e/csv_gen_0dcfa54a_6dad_4a31_af19_d2baaef4320e_63f63698555a9.csv",
            "nameKey": "sdec_libel",
        },
        {"id": "geo_api_commune", "type": "geo_api_commune"},
    ],
    "montpellier": [{"id": "iris_34172", "type": "iris_wfs", "insee": "34172"}],
    "toulon": [
        {"id": "iris_83137", "type": "iris_wfs", "insee": "83137"},
        {"id": "geo_api_commune", "type": "geo_api_commune"},
    ],
}


def marseille_specs_from_groups() -> list[dict[str, Any]]:
    payload = json.loads(MARSEILLE_GROUPS.read_text(encoding="utf-8"))
    specs = []
    for group in payload["groups"]:
        spec: dict[str, Any] = {
            "code": group["code"],
            "marseille_quartiers": list(group["marseille_quartiers"]),
            "coverageRole": group["coverageRole"],
            "geometryBasis": group["geometryBasis"],
        }
        if group.get("area"):
            spec["area"] = group["area"]
        if group.get("allowMultipart"):
            spec["allowMultipart"] = True
        if group.get("multipartJustification"):
            spec["multipartJustification"] = group["multipartJustification"]
        specs.append(spec)
    return specs


def scope_for_city(city_id: str) -> dict[str, Any]:
    if not COVERAGE_SCOPES.exists():
        return {}
    scopes = json.loads(COVERAGE_SCOPES.read_text(encoding="utf-8"))
    raw = scopes.get(city_id, {})
    if not raw:
        return {}
    scope: dict[str, Any] = {
        "coverageMode": raw.get("coverageMode"),
        "preferredBase": raw.get("preferredBase"),
        "inseeCodes": raw.get("inseeCodes", []),
    }
    preferred = raw.get("preferredBase")
    if raw.get("coverageMode") == "full_partition" and preferred == "official_quartier":
        scope["fullCoverageSources"] = [f"{city_id}_quartiers" if city_id != "marseille" else "marseille_quartiers"]
    if city_id == "marseille":
        scope["fullCoverageSources"] = ["marseille_quartiers"]
    if city_id == "toulouse":
        scope["fullCoverageSources"] = ["toulouse_quartiers"]
        scope["exemptUnits"] = {
            "toulouse_quartiers": [
                "Capitole / Arnaud Bernard / Carmes",
                "Saint-Michel /  Saint-Agne / Empalot / Le Busca / Île du Ramier / Monplaisir",
            ]
        }
    if city_id == "nantes":
        scope["fullCoverageSources"] = ["nantes_quartiers"]
        scope["exemptUnits"] = {
            "nantes_quartiers": [
                "Hauts-Pavés - Saint-Félix",
                "Nantes Nord",
                "Nantes Erdre",
                "Île de Nantes",
                "Malakoff - Saint-Donatien",
            ]
        }
    if city_id == "nice":
        scope["fullCoverageSources"] = ["nice_quartiers"]
    return scope


def build_config(city_id: str, specs: list[dict[str, Any]]) -> dict[str, Any]:
    meta = CITY_META[city_id]
    known: dict[str, dict[str, Any]] = {}
    sources = list(DEFAULT_SOURCES.get(city_id, []))
    for entry in sources:
        known[entry["id"]] = entry
    for spec in specs:
        for addition in default_sources_for_legacy_spec(spec, known):
            sources.append(addition)
    zones = [legacy_spec_to_zone(spec, city_id) for spec in specs]
    config: dict[str, Any] = {
        "cityId": city_id,
        "placesFile": meta["placesFile"],
        "geojsonOutput": meta["geojsonOutput"],
        "sources": sources,
        "zones": zones,
        "scope": scope_for_city(city_id),
    }
    if meta.get("outlineOutput"):
        config["outlineOutput"] = meta["outlineOutput"]
    return config


def paris_config() -> dict[str, Any]:
    content = (ROOT / "src/data/cities.ts").read_text(encoding="utf-8")
    start = content.find("const parisPlaces")
    end = content.find("export const placesByCity")
    section = content[start:end]
    codes = re.findall(r'code:\s*"([^"]+)"', section)
    zones = [{"code": code, "sourceUnits": [{"source": "geo_api_commune", "name": code}], "communeInsee": code} for code in codes]
    return {
        "cityId": "paris",
        "placesFile": "src/data/cities.ts",
        "placesSection": "parisPlaces",
        "geojsonOutput": "public/data/districts.geojson",
        "sources": [{"id": "geo_api_commune", "type": "geo_api_commune"}],
        "zones": zones,
        "scope": {"coverageMode": "curated_subset"},
    }


def legacy_builder_config(city_id: str) -> dict[str, Any]:
    script = {
        "bordeaux": "scripts/build_bordeaux_micro_geojson.py",
        "lyon": "scripts/build_lyon_micro_geojson.py",
    }[city_id]
    return {
        "cityId": city_id,
        "placesFile": CITY_META[city_id]["placesFile"],
        "geojsonOutput": CITY_META[city_id]["geojsonOutput"],
        "sources": [],
        "zones": [],
        "scope": {},
        "buildMode": "legacy",
        "legacyScript": script,
    }


def main() -> None:
    CONFIGS_DIR.mkdir(parents=True, exist_ok=True)
    geometry = json.loads(GEOMETRY_JSON.read_text(encoding="utf-8"))
    for city_id, specs in geometry.items():
        if city_id == "marseille":
            specs = marseille_specs_from_groups()
        config = build_config(city_id, specs)
        path = CONFIGS_DIR / f"{city_id}.json"
        path.write_text(json.dumps(config, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"wrote {path} ({len(config['zones'])} zones)")
    for city_id in ("paris",):
        config = paris_config()
        path = CONFIGS_DIR / f"{city_id}.json"
        path.write_text(json.dumps(config, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"wrote {path} ({len(config['zones'])} zones)")
    print("bordeaux/lyon: use scripts/city_compiler/generate_bordeaux_lyon_configs.py")


if __name__ == "__main__":
    main()