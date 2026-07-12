"""Load canonical JSON PlaceScore records."""

from __future__ import annotations

import json
import math
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from city_compiler.errors import ConfigError

SCORE_FIELD_NAMES = (
    "security",
    "affordability",
    "transport",
    "studentEnergy",
    "services",
    "campusAccess",
    "greenCalm",
)


@dataclass(frozen=True)
class PlaceScoreRecord:
    code: str
    name: str
    caveat: str
    security: float
    affordability: float
    transport: float
    student_energy: float
    services: float
    campus_access: float
    green_calm: float

    def score_tuple(self) -> tuple[float, ...]:
        return (
            self.security,
            self.affordability,
            self.transport,
            self.student_energy,
            self.services,
            self.campus_access,
            self.green_calm,
        )


@lru_cache(maxsize=None)
def _load_place_records(places_file: Path) -> dict[str, PlaceScoreRecord]:
    try:
        payload = json.loads(places_file.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ConfigError(f"Invalid place dataset {places_file}: {exc}") from exc

    if not isinstance(payload, dict) or not isinstance(payload.get("places"), list):
        raise ConfigError(f"Invalid place dataset envelope: {places_file}")

    expected_city_id = places_file.stem
    if payload.get("cityId") != expected_city_id:
        raise ConfigError(
            f"Place dataset cityId {payload.get('cityId')} does not match {expected_city_id}"
        )

    records = [_parse_record(item, expected_city_id) for item in payload["places"]]
    codes = [record.code for record in records]
    if len(codes) != len(set(codes)):
        raise ConfigError(f"Duplicate place code in {places_file}")
    return {record.code: record for record in records}


def _parse_record(raw: object, city_id: str) -> PlaceScoreRecord:
    try:
        if not isinstance(raw, dict):
            raise TypeError("place record must be an object")
        scores = raw["scores"]
        if not isinstance(scores, dict):
            raise TypeError("scores must be an object")
        if set(scores) != set(SCORE_FIELD_NAMES):
            raise ValueError("scores must contain exactly the seven score fields")
        numeric_scores = {key: float(scores[key]) for key in SCORE_FIELD_NAMES}
        if any(not math.isfinite(value) or value < 0 or value > 10 for value in numeric_scores.values()):
            raise ValueError("scores must be finite values between 0 and 10")
        code = raw["code"]
        name = raw["name"]
        if not isinstance(code, str) or not code or not isinstance(name, str) or not name:
            raise ValueError("code and name must be non-empty strings")
        return PlaceScoreRecord(
            code=code,
            name=name,
            caveat=str(raw.get("caveat", "")),
            security=numeric_scores["security"],
            affordability=numeric_scores["affordability"],
            transport=numeric_scores["transport"],
            student_energy=numeric_scores["studentEnergy"],
            services=numeric_scores["services"],
            campus_access=numeric_scores["campusAccess"],
            green_calm=numeric_scores["greenCalm"],
        )
    except (KeyError, TypeError, ValueError) as exc:
        raise ConfigError(f"Invalid place record for {city_id}: {exc}") from exc


def load_place_records(places_file: Path) -> dict[str, PlaceScoreRecord]:
    return _load_place_records(places_file)


def load_place_meta(places_file: Path) -> dict[str, dict[str, str]]:
    return {
        code: {"code": record.code, "name": record.name}
        for code, record in load_place_records(places_file).items()
    }


def load_score_codes(places_file: Path) -> set[str]:
    return set(load_place_records(places_file))


def load_place_caveats(places_file: Path) -> dict[str, str]:
    return {
        code: record.caveat
        for code, record in load_place_records(places_file).items()
    }


def load_score_tuples(places_file: Path) -> dict[str, tuple[float, ...]]:
    return {
        code: record.score_tuple()
        for code, record in load_place_records(places_file).items()
    }
