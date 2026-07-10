"""Validate existing GeoJSON against city config and PlaceScore rows."""

from __future__ import annotations

import json

from city_compiler.audits import audit_build_output
from city_compiler.outputs import read_feature_collection
from city_compiler.places import load_score_codes
from city_compiler.schema import CityConfig
from city_compiler.sources import load_all_sources


def validate_city(config: CityConfig) -> None:
    if not config.geojson_output.exists():
        raise SystemExit(f"Missing GeoJSON: {config.geojson_output}")
    features = read_feature_collection(config.geojson_output)
    score_codes = load_score_codes(config.places_file, section=config.places_section)
    excluded = set(config.scope.get("excludedPlaceCodes", []))
    layers = load_all_sources(config.sources)
    audit_build_output(config, features, score_codes - excluded, layers)
    print(
        f"{config.city_id}: ok ({len(features)} features, lon/lat valid, audits passed)"
    )