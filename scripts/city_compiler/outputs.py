"""Write GeoJSON FeatureCollection output."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


def write_feature_collection(features: list[dict[str, Any]], output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    payload = {"type": "FeatureCollection", "features": features}
    with output.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, separators=(",", ":"))


def read_feature_collection(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    return data["features"]