"""Load PlaceScore records via Bun JSON bridge."""

from __future__ import annotations

import json
import subprocess
from dataclasses import dataclass
from pathlib import Path

from city_compiler.errors import ConfigError

ROOT = Path(__file__).resolve().parents[2]
EXPORT_SCRIPT = ROOT / "scripts" / "export_places_json.ts"
BUN = Path.home() / ".bun/bin/bun"

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


def _run_places_bridge(places_file: Path, section: str | None = None) -> list[dict[str, object]]:
    if not BUN.exists():
        raise ConfigError(f"Bun runtime not found at {BUN}")
    if not EXPORT_SCRIPT.exists():
        raise ConfigError(f"Missing places bridge script: {EXPORT_SCRIPT}")

    command = [str(BUN), str(EXPORT_SCRIPT), str(places_file)]
    if section:
        command.append(section)

    result = subprocess.run(
        command,
        capture_output=True,
        text=True,
        check=False,
        cwd=ROOT,
    )
    if result.returncode != 0:
        detail = result.stderr.strip() or result.stdout.strip() or "places JSON bridge failed"
        raise ConfigError(detail)

    try:
        payload = json.loads(result.stdout)
    except json.JSONDecodeError as exc:
        raise ConfigError(f"Invalid JSON from places bridge: {exc}") from exc

    if not isinstance(payload, list):
        raise ConfigError("Places bridge must return a JSON array")

    return payload


def _parse_record(raw: dict[str, object]) -> PlaceScoreRecord:
    try:
        scores = raw["scores"]
        if not isinstance(scores, dict):
            raise TypeError("scores must be an object")
        return PlaceScoreRecord(
            code=str(raw["code"]),
            name=str(raw["name"]),
            caveat=str(raw.get("caveat", "")),
            security=float(scores["security"]),
            affordability=float(scores["affordability"]),
            transport=float(scores["transport"]),
            student_energy=float(scores["studentEnergy"]),
            services=float(scores["services"]),
            campus_access=float(scores["campusAccess"]),
            green_calm=float(scores["greenCalm"]),
        )
    except (KeyError, TypeError, ValueError) as exc:
        raise ConfigError(f"Invalid place record: {exc}") from exc


def load_place_records(places_file: Path, *, section: str | None = None) -> dict[str, PlaceScoreRecord]:
    records = [_parse_record(item) for item in _run_places_bridge(places_file, section)]
    return {record.code: record for record in records}


def load_place_meta(places_file: Path, *, section: str | None = None) -> dict[str, dict[str, str]]:
    return {
        code: {"code": record.code, "name": record.name}
        for code, record in load_place_records(places_file, section=section).items()
    }


def load_score_codes(places_file: Path, *, section: str | None = None) -> set[str]:
    return set(load_place_records(places_file, section=section))


def load_place_caveats(places_file: Path, *, section: str | None = None) -> dict[str, str]:
    return {
        code: record.caveat
        for code, record in load_place_records(places_file, section=section).items()
    }


def load_score_tuples(places_file: Path, *, section: str | None = None) -> dict[str, tuple[float, ...]]:
    return {
        code: record.score_tuple()
        for code, record in load_place_records(places_file, section=section).items()
    }