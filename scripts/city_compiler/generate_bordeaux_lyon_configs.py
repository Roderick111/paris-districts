#!/usr/bin/env python3
"""Generate Bordeaux and Lyon compiler configs from legacy MICRO_SPECS."""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
SCRIPTS = ROOT / "scripts"
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))

from legacy.build_bordeaux_micro_geojson import MICRO_SPECS as BORDEAUX_SPECS  # noqa: E402
from legacy.build_lyon_micro_geojson import MICRO_SPECS as LYON_SPECS  # noqa: E402

CONFIGS_DIR = SCRIPTS / "city_configs"

MAP_EXCLUDED_SCORE_CODES = [
    "gradignan-centre-mandavit",
    "gradignan-campus-beausoleil",
    "gradignan-malartic-barthez",
]


def bordeaux_zone(spec: dict[str, Any]) -> dict[str, Any]:
    zone: dict[str, Any] = {"code": spec["code"], "kind": spec.get("kind", "quartier"), "sourceUnits": []}
    if spec.get("commune_full"):
        zone["communeInsee"] = spec["commune_full"]
        zone["sourceUnits"] = [{"source": "geo_api_commune", "name": spec["commune_full"]}]
    elif spec.get("sub_quartiers"):
        zone["sourceUnits"] = [
            {"source": "bordeaux_quartiers", "name": name} for name in spec["sub_quartiers"]
        ]
    elif spec.get("iris"):
        zone["sourceUnits"] = [{"source": "bordeaux_iris", "name": name} for name in spec["iris"]]
    return zone


def lyon_zone(spec: dict[str, Any]) -> dict[str, Any]:
    zone: dict[str, Any] = {
        "code": spec["code"],
        "kind": spec.get("kind", "quartier"),
        "geometryBasis": "official_quartier_group",
        "sourceUnits": [],
    }
    if spec.get("ecully"):
        zone["communeInsee"] = "69081"
        zone["sourceUnits"] = [{"source": "geo_api_commune", "name": "69081"}]
        return zone
    if spec.get("lyon"):
        zone["sourceUnits"] = [{"source": "lyon_quartiers", "name": name} for name in spec["lyon"]]
    if spec.get("metro"):
        zone["sourceUnits"].extend(
            {"source": "lyon_metro_quartiers", "name": name} for name in spec["metro"]
        )
    if spec.get("lyon_split"):
        source, keep, latitude = spec["lyon_split"]
        zone["sourceUnits"].append(
            {
                "source": "lyon_quartiers",
                "name": source,
                "latSplit": {"keep": keep, "latitude": latitude},
            }
        )
    if spec.get("metro_split"):
        source, keep, latitude = spec["metro_split"]
        zone["sourceUnits"].append(
            {
                "source": "lyon_metro_quartiers",
                "name": source,
                "latSplit": {"keep": keep, "latitude": latitude},
            }
        )
    return zone


def main() -> None:
    CONFIGS_DIR.mkdir(parents=True, exist_ok=True)
    bordeaux = {
        "cityId": "bordeaux",
        "placesFile": "src/data/bordeauxPlaces.ts",
        "placesSection": "bordeauxMicroPlaces",
        "geojsonOutput": "public/data/bordeaux.geojson",
        "sources": [
            {"id": "bordeaux_quartiers", "type": "bordeaux_quartiers"},
            {"id": "bordeaux_iris", "type": "bordeaux_iris"},
            {"id": "geo_api_commune", "type": "geo_api_commune"},
        ],
        "scope": {"excludedPlaceCodes": MAP_EXCLUDED_SCORE_CODES},
        "zones": [bordeaux_zone(spec) for spec in BORDEAUX_SPECS],
    }
    lyon = {
        "cityId": "lyon",
        "placesFile": "src/data/lyonPlaces.ts",
        "placesSection": "lyonMicroPlaces",
        "geojsonOutput": "public/data/lyon.geojson",
        "sources": [
            {"id": "lyon_quartiers", "type": "lyon_quartiers"},
            {"id": "lyon_metro_quartiers", "type": "lyon_metro_quartiers"},
            {"id": "geo_api_commune", "type": "geo_api_commune"},
        ],
        "zones": [lyon_zone(spec) for spec in LYON_SPECS],
    }
    for city_id, config in (("bordeaux", bordeaux), ("lyon", lyon)):
        path = CONFIGS_DIR / f"{city_id}.json"
        path.write_text(json.dumps(config, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"wrote {path} ({len(config['zones'])} zones)")


if __name__ == "__main__":
    main()