"""Write GeoJSON FeatureCollection output."""

from __future__ import annotations

import json
import os
import tempfile
from pathlib import Path
from typing import Any


def write_json_atomic(path: Path, payload: Any, *, compact: bool = False) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temp_fd, temp_name = tempfile.mkstemp(
        dir=path.parent,
        prefix=f".{path.name}.",
        suffix=".tmp",
    )
    os.close(temp_fd)
    temp_path = Path(temp_name)
    try:
        with temp_path.open("w", encoding="utf-8") as handle:
            if compact:
                json.dump(payload, handle, separators=(",", ":"))
            else:
                json.dump(payload, handle)
            handle.flush()
            os.fsync(handle.fileno())
        temp_path.replace(path)
    except Exception:
        if temp_path.exists():
            temp_path.unlink()
        raise


def write_text_atomic(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temp_fd, temp_name = tempfile.mkstemp(
        dir=path.parent,
        prefix=f".{path.name}.",
        suffix=".tmp",
        text=True,
    )
    os.close(temp_fd)
    temp_path = Path(temp_name)
    try:
        with temp_path.open("w", encoding="utf-8") as handle:
            handle.write(content)
            handle.flush()
            os.fsync(handle.fileno())
        temp_path.replace(path)
    except Exception:
        if temp_path.exists():
            temp_path.unlink()
        raise


def write_feature_collection(features: list[dict[str, Any]], output: Path) -> None:
    payload = {"type": "FeatureCollection", "features": features}
    write_json_atomic(output, payload, compact=True)


def read_feature_collection(path: Path) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    return data["features"]
