"""City compiler exception hierarchy."""

from __future__ import annotations


class CityCompilerError(Exception):
    """Base error for city compiler failures."""


class ConfigError(CityCompilerError):
    """Invalid or missing city configuration."""


class SourceError(CityCompilerError):
    """Source fetch, cache, or adapter failure."""


class ValidationError(CityCompilerError):
    """GeoJSON validation or parity audit failure."""


class GeometryError(CityCompilerError):
    """Geometry build/merge/contiguity failure."""