"""Config validation and normalized zone model."""

from __future__ import annotations

from city_compiler.errors import ConfigError
import json
import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
CONFIGS_DIR = Path(os.environ.get("CITY_CONFIGS_DIR", ROOT / "scripts" / "city_configs"))

REQUIRED_CITY_KEYS = {
    "cityId",
    "placesFile",
    "geojsonOutput",
    "sources",
    "zones",
}

REQUIRED_ZONE_KEYS = {"code", "sourceUnits"}

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
    raw: dict[str, Any] = field(default_factory=dict)

    @classmethod
    def from_json(cls, city_id: str, raw: dict[str, Any]) -> CityConfig:
        missing = REQUIRED_CITY_KEYS - set(raw)
        if missing:
            raise ConfigError(f"City config {city_id} missing keys: {sorted(missing)}")
        if raw["cityId"] != city_id:
            raise ConfigError(f"Config cityId {raw['cityId']} does not match {city_id}")
        return cls(
            city_id=city_id,
            places_file=_resolve_path(raw["placesFile"]),
            geojson_output=_resolve_path(raw["geojsonOutput"]),
            outline_output=_resolve_path(raw["outlineOutput"]) if raw.get("outlineOutput") else None,
            sources=list(raw["sources"]),
            zones=[validate_zone(zone) for zone in raw["zones"]],
            scope=dict(raw.get("scope", {})),
            raw=raw,
        )


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


def sanitize_city_id(city_id: str) -> str:
    safe = os.path.basename(city_id)
    if (
        not safe
        or safe != city_id
        or ".." in city_id
        or "/" in city_id
        or "\\" in city_id
    ):
        raise ConfigError(f"Invalid city id: {city_id!r}")
    return safe


def load_city_config(city_id: str) -> CityConfig:
    city_id = sanitize_city_id(city_id)
    config_path = (CONFIGS_DIR / f"{city_id}.json").resolve()
    configs_root = CONFIGS_DIR.resolve()
    if not config_path.is_relative_to(configs_root):
        raise ConfigError(f"Invalid city config path for {city_id}")
    if not config_path.exists():
        raise ConfigError(f"Missing city config: {config_path}")
    raw = json.loads(config_path.read_text(encoding="utf-8"))
    return CityConfig.from_json(city_id, raw)


def list_city_ids() -> list[str]:
    return sorted(path.stem for path in CONFIGS_DIR.glob("*.json"))
