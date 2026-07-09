#!/usr/bin/env python3
"""Append full-coverage context PlaceScore rows to city Places.ts files."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src" / "data"
CONTEXT_JSON = ROOT / "scripts" / "context_places.json"

EXPORT_NAMES = {
    "lille": "lilleMicroPlaces",
    "nice": "niceMicroPlaces",
    "toulouse": "toulouseMicroPlaces",
    "marseille": "marseilleMicroPlaces",
    "nantes": "nantesMicroPlaces",
}


def security_cap(security: float) -> float:
    if security < 3:
        return 3.4
    if security < 4:
        return 4.4
    if security < 5:
        return 5.2
    if security < 6:
        return 6.2
    if security < 7:
        return 7.0
    if security < 8:
        return 7.8
    return 10.0


def rent_level(affordability: float) -> str:
    if affordability < 3:
        return "very high"
    if affordability < 5:
        return "high"
    if affordability < 6.5:
        return "medium"
    return "lower"


def escape_ts(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"')


def render_context_place(city_id: str, place: dict[str, object]) -> str:
    scores = place["scores"]
    assert isinstance(scores, dict)
    rent = rent_level(scores["affordability"])
    role = place.get("role", "context")
    fit = "weak" if role == "low_relevance" else "mixed"
    summary = "Full-coverage context zone; useful for map continuity, not a primary student pick."
    caveat = "Broad official geometry; block-level choice still matters."
    lines = [
        "  {",
        f'    id: "{place["code"]}", cityId: "{city_id}", '
        f'name: "{escape_ts(str(place["name"]))}", '
        f'code: "{place["code"]}", kind: "quartier",',
        f'    area: "{escape_ts(str(place["area"]))}", granularity: "micro", '
        f'parentName: "{escape_ts(str(place["parent"]))}",',
        f'    confidence: "{place.get("confidence", "low")}",',
        f'    coverageRole: "{role}",',
        '    geometryBasis: "iris_partition",',
        f'    evidenceNote: "{escape_ts(str(place["evidence"]))}",',
        "    scores: {",
    ]
    for key in (
        "security",
        "affordability",
        "transport",
        "studentEnergy",
        "services",
        "campusAccess",
        "greenCalm",
    ):
        lines.append(f"      {key}: {scores[key]},")
    lines[-1] = lines[-1].rstrip(",")
    lines.extend(
        [
            "    },",
            f'    rentLevel: "{rent}", studentFit: "{fit}",',
            f'    summary: "{escape_ts(summary)}", caveat: "{escape_ts(caveat)}"',
            "  },",
        ]
    )
    return "\n".join(lines)


def strip_context_places(content: str, city_id: str) -> str:
    pattern = re.compile(
        rf"  \{{\n    id: \"{city_id}-context-[\s\S]*?\n  \}},\n",
        re.MULTILINE,
    )
    return pattern.sub("", content)


def append_city(city_id: str, context_places: list[dict[str, object]]) -> None:
    path = SRC / f"{city_id}Places.ts"
    content = strip_context_places(path.read_text(encoding="utf-8"), city_id)
    if not context_places:
        path.write_text(content, encoding="utf-8")
        print(f"{city_id}: removed context places, none to add")
        return
    insertion = "\n".join(render_context_place(city_id, place) for place in context_places)
    marker = "];\n"
    if marker not in content:
        raise SystemExit(f"Could not append to {path}")
    content = content.replace(marker, f"{insertion}\n];\n", 1)
    path.write_text(content, encoding="utf-8")
    print(f"{city_id}: wrote {len(context_places)} context places to {path}")


def main() -> None:
    import sys

    payload = json.loads(CONTEXT_JSON.read_text(encoding="utf-8"))
    cities = sys.argv[1:] or list(payload)
    for city_id in cities:
        if city_id not in payload:
            raise SystemExit(f"No context places for {city_id}")
        append_city(city_id, payload[city_id])


if __name__ == "__main__":
    main()