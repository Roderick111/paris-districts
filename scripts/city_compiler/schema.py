"""Config validation and normalized zone model."""

from __future__ import annotations

from city_compiler.errors import ConfigError
import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
CONFIGS_DIR = ROOT / "scripts" / "city_configs"

REQUIRED_CITY_KEYS = {
    "cityId",
    "placesFile",
    "geojsonOutput",
    "sources",
    "zones",
}

REQUIRED_ZONE_KEYS = {"code", "sourceUnits"}

LEGACY_SOURCE_KEY_MAP = {
    "lille_quartier": "lille_quartiers",
    "hellemmes_quartier": "lille_quartiers",
    "vda_quartier": "vda_wfs_quartiers",
    "marseille_quartiers": "marseille_quartiers",
    "toulouse_quartier": "toulouse_quartiers",
    "nantes_quartier": "nantes_quartiers",
    "nice_quartier": "nice_quartiers",
    "rennes_quartier": "rennes_quartiers",
    "strasbourg_quartier": "strasbourg_quartiers",
    "grenoble_quartier": "grenoble_quartiers",
}


@dataclass
class SourceUnit:
    source: str
    name: str
    lat_split: dict[str, Any] | None = None


@dataclass
class Zone:
    code: str
    source_units: list[SourceUnit]
    name: str | None = None
    coverage_role: str | None = None
    geometry_basis: str | None = None
    allow_multipart: bool = False
    multipart_justification: str | None = None
    area: str | None = None
    commune_insee: str | None = None
    kind: str | None = None


@dataclass
class CityConfig:
    city_id: str
    places_file: Path
    geojson_output: Path
    outline_output: Path | None
    sources: list[dict[str, Any]]
    zones: list[Zone]
    scope: dict[str, Any] = field(default_factory=dict)
    build_mode: str = "compiler"
    legacy_script: str | None = None
    places_section: str | None = None
    raw: dict[str, Any] = field(default_factory=dict)


def _resolve_path(value: str) -> Path:
    path = Path(value)
    return path if path.is_absolute() else ROOT / path


def validate_zone(raw: dict[str, Any]) -> Zone:
    missing = REQUIRED_ZONE_KEYS - set(raw)
    if missing:
        raise ConfigError(f"Zone {raw.get('code', '?')} missing keys: {sorted(missing)}")
    units = [
        SourceUnit(
            source=item["source"],
            name=item["name"],
            lat_split=item.get("latSplit"),
        )
        for item in raw["sourceUnits"]
    ]
    if raw.get("communeInsee") and not units:
        units = [SourceUnit(source="geo_api_commune", name=raw["communeInsee"])]
    return Zone(
        code=raw["code"],
        name=raw.get("name"),
        coverage_role=raw.get("coverageRole"),
        geometry_basis=raw.get("geometryBasis"),
        allow_multipart=bool(raw.get("allowMultipart")),
        multipart_justification=raw.get("multipartJustification"),
        area=raw.get("area"),
        commune_insee=raw.get("communeInsee"),
        kind=raw.get("kind"),
        source_units=units,
    )


def load_city_config(city_id: str) -> CityConfig:
    config_path = CONFIGS_DIR / f"{city_id}.json"
    if not config_path.exists():
        raise ConfigError(f"Missing city config: {config_path}")
    raw = json.loads(config_path.read_text(encoding="utf-8"))
    missing = REQUIRED_CITY_KEYS - set(raw)
    if missing:
        raise ConfigError(f"City config {city_id} missing keys: {sorted(missing)}")
    if raw["cityId"] != city_id:
        raise ConfigError(f"Config cityId {raw['cityId']} does not match {city_id}")
    return CityConfig(
        city_id=city_id,
        places_file=_resolve_path(raw["placesFile"]),
        geojson_output=_resolve_path(raw["geojsonOutput"]),
        outline_output=_resolve_path(raw["outlineOutput"]) if raw.get("outlineOutput") else None,
        sources=list(raw["sources"]),
        zones=[validate_zone(zone) for zone in raw["zones"]],
        scope=dict(raw.get("scope", {})),
        build_mode=raw.get("buildMode", "compiler"),
        legacy_script=raw.get("legacyScript"),
        places_section=raw.get("placesSection"),
        raw=raw,
    )


def list_city_ids() -> list[str]:
    return sorted(path.stem for path in CONFIGS_DIR.glob("*.json"))


def legacy_spec_to_zone(spec: dict[str, Any], city_id: str) -> dict[str, Any]:
    """Convert granularity_geometry.json spec to compiler zone dict."""
    zone: dict[str, Any] = {
        "code": spec["code"],
        "sourceUnits": [],
    }
    for key in (
        "name",
        "coverageRole",
        "geometryBasis",
        "allowMultipart",
        "multipartJustification",
        "area",
    ):
        if key in spec:
            zone[key] = spec[key]
    if spec.get("commune_insee"):
        zone["communeInsee"] = spec["commune_insee"]
        zone["sourceUnits"] = [
            {"source": "geo_api_commune", "name": spec["commune_insee"]},
        ]
        return zone
    if spec.get("iris_names"):
        insee = spec["iris_insee"]
        source_id = f"iris_{insee}"
        zone["sourceUnits"] = [
            {"source": source_id, "name": name} for name in spec["iris_names"]
        ]
        return zone
    for legacy_key, source_type in LEGACY_SOURCE_KEY_MAP.items():
        if legacy_key in spec:
            source_id = source_type
            if legacy_key == "iris_names":
                continue
            zone["sourceUnits"] = [
                {"source": source_id, "name": name} for name in spec[legacy_key]
            ]
            break
    if not zone["sourceUnits"]:
        raise ConfigError(f"Cannot convert legacy spec for {city_id}/{spec['code']}")
    return zone


def default_sources_for_legacy_spec(spec: dict[str, Any], known: dict[str, dict[str, Any]]) -> list[dict[str, Any]]:
    additions: list[dict[str, Any]] = []
    if spec.get("iris_insee"):
        insee = spec["iris_insee"]
        source_id = f"iris_{insee}"
        if source_id not in known:
            additions.append({"id": source_id, "type": "iris_wfs", "insee": insee})
            known[source_id] = additions[-1]
    for legacy_key, source_type in LEGACY_SOURCE_KEY_MAP.items():
        if legacy_key in spec and source_type not in known:
            entry = {"id": source_type, "type": source_type}
            known[source_type] = entry
            additions.append(entry)
    if spec.get("commune_insee") and "geo_api_commune" not in known:
        entry = {"id": "geo_api_commune", "type": "geo_api_commune"}
        known["geo_api_commune"] = entry
        additions.append(entry)
    return additions