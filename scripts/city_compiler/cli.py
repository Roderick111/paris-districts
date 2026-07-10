#!/usr/bin/env python3
"""City geometry compiler CLI."""

from __future__ import annotations

import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parents[1]
ROOT = SCRIPTS.parent
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))

from city_compiler.build import build_city  # noqa: E402
from city_compiler.schema import list_city_ids, load_city_config  # noqa: E402
from city_compiler.validate import validate_city  # noqa: E402


def _targets(argv: list[str]) -> list[str]:
    return argv or list_city_ids()


def cmd_build(targets: list[str]) -> int:
    for city_id in targets:
        config = load_city_config(city_id)
        build_city(config)
    return 0


def cmd_validate(targets: list[str]) -> int:
    for city_id in targets:
        config = load_city_config(city_id)
        validate_city(config)
    return 0


def cmd_audit(targets: list[str]) -> int:
    return cmd_validate(targets)


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/city_compiler/cli.py <build|validate|audit> [city ...]")
        return 1
    command = sys.argv[1]
    targets = _targets(sys.argv[2:])
    if command == "build":
        return cmd_build(targets)
    if command == "validate":
        return cmd_validate(targets)
    if command == "audit":
        return cmd_audit(targets)
    print(f"Unknown command: {command}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())