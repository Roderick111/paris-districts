#!/usr/bin/env python3
"""Generate upgraded city PlaceScore TypeScript files from granularity_places.json."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "src" / "data"
PLACES_JSON = ROOT / "scripts" / "granularity_places.json"

WEIGHTS = {
    "security": 3.0,
    "affordability": 1.6,
    "transport": 1.4,
    "studentEnergy": 1.2,
    "services": 1.0,
    "campusAccess": 1.0,
    "greenCalm": 0.8,
}

EXPORT_NAMES = {
    "toulouse": "toulouseMicroPlaces",
    "lille": "lilleMicroPlaces",
    "marseille": "marseilleMicroPlaces",
    "nice": "niceMicroPlaces",
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


def weighted_total(scores: dict[str, float]) -> float:
    max_weighted = sum(weight * 10 for weight in WEIGHTS.values())
    total = sum(scores[key] * WEIGHTS[key] for key in WEIGHTS)
    raw = (total / max_weighted) * 10 if max_weighted else 0
    return round(min(raw, security_cap(scores["security"])), 1)


def rent_level(affordability: float) -> str:
    if affordability < 3:
        return "very high"
    if affordability < 5:
        return "high"
    if affordability < 6.5:
        return "medium"
    return "lower"


def student_fit(scores: dict[str, float], total: float) -> str:
    security = scores["security"]
    campus = scores["campusAccess"]
    if total >= 7:
        return "mixed" if security < 5 else "excellent"
    if total >= 6.2:
        return "mixed" if security < 5 else "good"
    if total >= 5.2:
        return "mixed"
    return "mixed" if campus >= 8 else "weak"


def summarize(name: str, scores: dict[str, float], parent: str) -> tuple[str, str]:
    security = scores["security"]
    afford = scores["affordability"]
    campus = scores["campusAccess"]
    energy = scores["studentEnergy"]
    if security < 4:
        summary = f"{name} stays hard-capped on safety despite useful {parent.lower()} links."
        caveat = "Cheap rent and transport cannot offset the risk profile."
    elif campus >= 9.5:
        summary = f"Campus-first {parent.lower()} pick with structural university access."
        caveat = "Best for campus-first students, not for a historic-centre lifestyle."
    elif energy >= 9 and security < 6:
        summary = f"High-energy {parent.lower()} streets with strong student social life."
        caveat = "Social life is real; comfort and safety are not automatic."
    elif security >= 7 and afford < 4:
        summary = f"Safer {parent.lower()} pocket with premium rent and calmer daily life."
        caveat = "Quality-of-life pick, not a value student default."
    elif afford >= 6 and security >= 5:
        summary = f"Practical {parent.lower()} belt with tolerable value and metro access."
        caveat = "Useful compromise, not a headline comfort pick."
    else:
        summary = f"Balanced {parent.lower()} micro-area with mixed student trade-offs."
        caveat = "Block choice inside the polygon still matters."
    return summary, caveat


def escape_ts(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"')


def render_place(city_id: str, place: dict[str, object]) -> str:
    scores = place["scores"]
    assert isinstance(scores, dict)
    total = weighted_total(scores)
    rent = rent_level(scores["affordability"])
    fit = student_fit(scores, total)
    summary, caveat = summarize(str(place["name"]), scores, str(place["parent"]))
    confidence = place.get("confidence", "medium")
    lines = [
        "  {",
        f'    id: "{place["code"]}", cityId: "{city_id}", '
        f'name: "{escape_ts(str(place["name"]))}", '
        f'code: "{place["code"]}", kind: "quartier",',
        f'    area: "{escape_ts(str(place["area"]))}", granularity: "micro", '
        f'parentName: "{escape_ts(str(place["parent"]))}",',
        f'    confidence: "{confidence}",',
        f'    evidenceNote: "{escape_ts(str(place["evidence"]))}",',
        "    scores: {",
    ]
    for key in WEIGHTS:
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


def write_city_file(city_id: str, places: list[dict[str, object]]) -> None:
    export_name = EXPORT_NAMES[city_id]
    body = "\n".join(render_place(city_id, place) for place in places)
    content = (
        'import type { PlaceScore } from "@/data/cities";\n\n'
        f"export const {export_name}: PlaceScore[] = [\n{body}\n];\n"
    )
    path = SRC / f"{city_id}Places.ts"
    path.write_text(content, encoding="utf-8")
    print(f"Wrote {path} ({len(places)} places)")


def main() -> None:
    payload = json.loads(PLACES_JSON.read_text(encoding="utf-8"))
    for city_id, places in payload.items():
        write_city_file(city_id, places)


if __name__ == "__main__":
    main()