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
from city_compiler.errors import CityCompilerError  # noqa: E402
from city_compiler.schema import list_city_ids, load_city_config  # noqa: E402
from city_compiler.validate import validate_city  # noqa: E402


def _targets(argv: list[str]) -> list[str]:
    return argv or list_city_ids()


def _run_for_targets(command: str, targets: list[str]) -> int:
    failures: list[str] = []

    for city_id in targets:
        try:
            config = load_city_config(city_id)
            if command == "build":
                build_city(config)
            else:
                validate_city(config)
        except CityCompilerError as exc:
            failures.append(f"{city_id}: {exc}")

    if failures:
        for message in failures:
            print(message, file=sys.stderr)
        return 1

    return 0


def main() -> int:
    if len(sys.argv) < 2:
        print(
            "Usage: python3 scripts/city_compiler/cli.py <build|validate|audit> [city ...]",
            file=sys.stderr,
        )
        return 1

    command = sys.argv[1]
    targets = _targets(sys.argv[2:])

    if command == "build":
        return _run_for_targets("build", targets)
    if command in {"validate", "audit"}:
        return _run_for_targets("validate", targets)

    print(f"Unknown command: {command}", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())