"""Extract PlaceScore codes and names from TypeScript data files."""

from __future__ import annotations

import re
from pathlib import Path


def _extract_section(content: str, marker: str | None) -> str:
    if not marker:
        return content
    end_markers = ("export const placesByCity", "export const cityById", "export const cities")
    start = -1
    for token in (f"export const {marker}", f"const {marker}"):
        start = content.find(token)
        if start >= 0:
            break
    if start < 0:
        raise SystemExit(f"Places section {marker} not found")
    end = len(content)
    for end_marker in end_markers:
        pos = content.find(end_marker, start + 1)
        if pos >= 0:
            end = min(end, pos)
    return content[start:end]


def load_place_meta(places_file: Path, *, section: str | None = None) -> dict[str, dict[str, str]]:
    content = places_file.read_text(encoding="utf-8")
    content = _extract_section(content, section)
    codes = re.findall(r'code:\s*"([^"]+)"', content)
    names = re.findall(r'name:\s*"([^"]+)"', content)
    if len(codes) != len(names):
        raise SystemExit(f"Place name/code mismatch in {places_file}")
    return {code: {"code": code, "name": name} for code, name in zip(codes, names, strict=True)}


def load_score_codes(places_file: Path, *, section: str | None = None) -> set[str]:
    return set(load_place_meta(places_file, section=section))


def load_score_tuples(places_file: Path, *, section: str | None = None) -> dict[str, tuple[float, ...]]:
    content = places_file.read_text(encoding="utf-8")
    content = _extract_section(content, section)
    blocks = re.findall(r'code:\s*"([^"]+)"[\s\S]*?scores:\s*\{([\s\S]*?)\}', content)
    tuples: dict[str, tuple[float, ...]] = {}
    for code, body in blocks:
        values = tuple(
            float(value)
            for _key, value in re.findall(
                r"(security|affordability|transport|studentEnergy|services|campusAccess|greenCalm):\s*([0-9.]+)",
                body,
            )
        )
        if len(values) == 7:
            tuples[code] = values
    return tuples