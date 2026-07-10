"""Source adapters and cache handling."""

from __future__ import annotations

from city_compiler.errors import SourceError
import csv
import json
import os
import urllib.parse
import urllib.request
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from city_compiler.geometry import iter_geometry_points, merge_geometries
from city_compiler.normalize import normalize_label
from city_compiler.outputs import write_json_atomic

ROOT = Path(__file__).resolve().parents[2]
SCRIPTS = ROOT / "scripts"
CACHE_DIR = Path(os.environ.get("CITY_CACHE_DIR", SCRIPTS / "cache"))

IRIS_WFS = (
    "https://data.geopf.fr/wfs/ows?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature"
    "&TYPENAME=STATISTICALUNITS.IRIS:contours_iris"
)
LILLE_WFS = "https://data.lillemetropole.fr/geoserver/wfs"
LILLE_QUARTIER_LAYER = "ville_lille:limite_des_quartiers_de_lille_et_de_ses_communes_associees"
VDA_QUARTIER_LAYER = "ville_villeneuve_d_ascq:quartier"
MARSEILLE_QUARTIER_URL = (
    "https://data.ampmetropole.fr/api/explore/v2.1/catalog/datasets/"
    "a7104f3c-e487-4af3-82ad-6197cedfaeb1/exports/geojson"
)
NICE_QUARTIER_URL = (
    "https://cartes.nicecotedazur.org/heberge/rest/services/Limites_administratives/"
    "MapServer/10/query?where=1%3D1&outFields=QUARTIER&outSR=4326&f=geojson"
)
TOULOUSE_QUARTIER_URL = (
    "https://data.toulouse-metropole.fr/api/explore/v2.1/catalog/datasets/"
    "quartiers-de-democratie-locale/exports/geojson"
)
NANTES_QUARTIER_URL = (
    "https://data.nantesmetropole.fr/api/explore/v2.1/catalog/datasets/"
    "244400404_quartiers-communes-nantes-metropole/exports/geojson"
)
COMMUNE_GEO_API = "https://geo.api.gouv.fr/communes/{insee}?format=geojson&geometry=contour"
BORDEAUX_QUARTIER_URL = (
    "https://datahub.bordeaux-metropole.fr/api/explore/v2.1/catalog/datasets/"
    "se_quart_s/exports/geojson"
)
BORDEAUX_IRIS_URL = (
    "https://datahub.bordeaux-metropole.fr/api/explore/v2.1/catalog/datasets/"
    "se_iri24_s/exports/geojson"
)
LYON_OFFICIAL_URL = (
    "https://data.grandlyon.com/geoserver/ogc/features/v1/collections/"
    "ville-de-lyon:vdl_vie_citoyenne.perimetre_de_quartier/items?limit=50"
)
LYON_METRO_URL = (
    "https://data.grandlyon.com/geoserver/ogc/features/v1/collections/"
    "metropole-de-lyon:adr_voie_lieu.adrquartier/items?limit=300"
)
USER_AGENT = "district-quality-map/1.0"


@dataclass
class SourceLayer:
    source_id: str
    units: dict[str, dict[str, Any]] = field(default_factory=dict)
    official_unit_names: set[str] = field(default_factory=set)

    def lookup(self, name: str) -> dict[str, Any] | None:
        return self.units.get(name) or self.units.get(normalize_label(name))

    def validate_epsg4326(self) -> None:
        for name, geometry in self.units.items():
            if name != name.strip() or not name:
                continue
            for point in iter_geometry_points(geometry):
                lon, lat = point[:2]
                if lon < -180 or lon > 180 or lat < -90 or lat > 90:
                    raise SourceError(
                        f"Source {self.source_id}: invalid lon/lat for unit {name}: {(lon, lat)}"
                    )


def fetch_json(url: str) -> dict[str, Any]:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=180) as response:
        return json.load(response)


def _index_shapes(features: list[dict[str, Any]], name_key: str) -> SourceLayer:
    layer = SourceLayer(source_id=name_key)
    for feature in features:
        name = feature["properties"][name_key]
        geometry = feature["geometry"]
        layer.official_unit_names.add(name)
        layer.units[name] = geometry
        layer.units.setdefault(normalize_label(name), geometry)
    return layer


def load_iris_wfs(insee: str) -> SourceLayer:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cache_path = CACHE_DIR / f"iris_{insee}.geojson"
    if cache_path.exists():
        data = json.loads(cache_path.read_text(encoding="utf-8"))
    else:
        params = urllib.parse.urlencode(
            {
                "CQL_FILTER": f"code_insee='{insee}'",
                "outputFormat": "application/json",
                "srsName": "EPSG:4326",
            }
        )
        data = fetch_json(f"{IRIS_WFS}&{params}")
        write_json_atomic(cache_path, data, compact=True)
    layer = SourceLayer(source_id=f"iris_{insee}")
    for feature in data["features"]:
        name = feature["properties"]["nom_iris"]
        geometry = feature["geometry"]
        layer.official_unit_names.add(name)
        layer.units[name] = geometry
        layer.units[normalize_label(name)] = geometry
    layer.validate_epsg4326()
    return layer


def load_geo_api_commune() -> SourceLayer:
    return SourceLayer(source_id="geo_api_commune")


def resolve_commune_geometry(insee: str) -> dict[str, Any]:
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cache_path = CACHE_DIR / f"commune_{insee}.geojson"
    if cache_path.exists():
        data = json.loads(cache_path.read_text(encoding="utf-8"))
    else:
        data = fetch_json(COMMUNE_GEO_API.format(insee=insee))
        write_json_atomic(cache_path, data, compact=True)
    geometry = data["geometry"]
    for point in iter_geometry_points(geometry):
        lon, lat = point[:2]
        if lon < -180 or lon > 180 or lat < -90 or lat > 90:
            raise SourceError(f"geo_api_commune: invalid lon/lat for {insee}: {(lon, lat)}")
    return geometry


def load_lille_wfs_quartiers() -> SourceLayer:
    layer = SourceLayer(source_id="lille_quartiers")
    params = urllib.parse.urlencode(
        {
            "service": "WFS",
            "version": "2.0.0",
            "request": "GetFeature",
            "typeName": LILLE_QUARTIER_LAYER,
            "outputFormat": "application/json",
            "srsName": "EPSG:4326",
            "count": 200,
        }
    )
    data = fetch_json(f"{LILLE_WFS}?{params}")
    for feature in data["features"]:
        properties = feature["properties"]
        name = properties.get("quartier") or properties.get("nom")
        if not name:
            continue
        layer.official_unit_names.add(name)
        layer.units[name] = feature["geometry"]
        layer.units[normalize_label(name)] = feature["geometry"]
    layer.validate_epsg4326()
    return layer


def load_vda_wfs_quartiers() -> SourceLayer:
    layer = SourceLayer(source_id="vda_wfs_quartiers")
    params = urllib.parse.urlencode(
        {
            "service": "WFS",
            "version": "2.0.0",
            "request": "GetFeature",
            "typeName": VDA_QUARTIER_LAYER,
            "outputFormat": "application/json",
            "srsName": "EPSG:4326",
            "count": 200,
        }
    )
    data = fetch_json(f"{LILLE_WFS}?{params}")
    for feature in data["features"]:
        name = feature["properties"].get("quartier") or feature["properties"].get("nom")
        if not name:
            continue
        layer.official_unit_names.add(name)
        layer.units[name] = feature["geometry"]
        layer.units[normalize_label(name)] = feature["geometry"]
    layer.validate_epsg4326()
    return layer


def load_marseille_quartiers() -> SourceLayer:
    features = fetch_json(MARSEILLE_QUARTIER_URL)["features"]
    by_name: dict[str, list[dict[str, Any]]] = {}
    layer = SourceLayer(source_id="marseille_quartiers")
    for feature in features:
        name = feature["properties"]["nom_qua"]
        layer.official_unit_names.add(name)
        by_name.setdefault(name, []).append(feature["geometry"])
    for name, geometries in by_name.items():
        geometry = merge_geometries(geometries) if len(geometries) > 1 else geometries[0]
        layer.units[name] = geometry
        layer.units[normalize_label(name)] = geometry
    layer.validate_epsg4326()
    return layer


def load_nice_quartiers() -> SourceLayer:
    features = fetch_json(NICE_QUARTIER_URL)["features"]
    layer = SourceLayer(source_id="nice_quartiers")
    for feature in features:
        name = feature["properties"]["QUARTIER"]
        layer.official_unit_names.add(name)
        layer.units[name] = feature["geometry"]
        layer.units[normalize_label(name)] = feature["geometry"]
    layer.validate_epsg4326()
    return layer


def load_toulouse_quartiers() -> SourceLayer:
    features = fetch_json(TOULOUSE_QUARTIER_URL)["features"]
    layer = SourceLayer(source_id="toulouse_quartiers")
    for feature in features:
        name = feature["properties"]["nom_quartier"]
        layer.official_unit_names.add(name)
        layer.units[name] = feature["geometry"]
        layer.units[normalize_label(name)] = feature["geometry"]
    layer.validate_epsg4326()
    return layer


def load_nantes_quartiers() -> SourceLayer:
    features = fetch_json(NANTES_QUARTIER_URL)["features"]
    layer = SourceLayer(source_id="nantes_quartiers")
    for feature in features:
        if feature["properties"].get("libcom") != "Nantes":
            continue
        name = feature["properties"]["nom"]
        layer.official_unit_names.add(name)
        layer.units[name] = feature["geometry"]
        layer.units[normalize_label(name)] = feature["geometry"]
    layer.validate_epsg4326()
    return layer


def load_opendatasoft(url: str, name_key: str, source_id: str) -> SourceLayer:
    features = fetch_json(url)["features"]
    layer = _index_shapes(features, name_key)
    layer.source_id = source_id
    layer.validate_epsg4326()
    return layer


def load_bordeaux_quartiers() -> SourceLayer:
    features = fetch_json(BORDEAUX_QUARTIER_URL)["features"]
    layer = SourceLayer(source_id="bordeaux_quartiers")
    for feature in features:
        name = feature["properties"]["nom"]
        geometry = feature["geometry"]
        existing = layer.units.get(name)
        if existing is None or len(json.dumps(geometry)) > len(json.dumps(existing)):
            layer.official_unit_names.add(name)
            layer.units[name] = geometry
            layer.units[normalize_label(name)] = geometry
    layer.validate_epsg4326()
    return layer


def load_bordeaux_iris() -> SourceLayer:
    features = fetch_json(BORDEAUX_IRIS_URL)["features"]
    layer = SourceLayer(source_id="bordeaux_iris")
    for feature in features:
        if feature["properties"]["insee"] != "33063":
            continue
        name = feature["properties"]["nom_iris"]
        layer.official_unit_names.add(name)
        layer.units[name] = feature["geometry"]
        layer.units[normalize_label(name)] = feature["geometry"]
    layer.validate_epsg4326()
    return layer


def load_lyon_quartiers() -> SourceLayer:
    features = fetch_json(LYON_OFFICIAL_URL)["features"]
    layer = SourceLayer(source_id="lyon_quartiers")
    for feature in features:
        name = feature["properties"]["nom"]
        layer.official_unit_names.add(name)
        layer.units[name] = feature["geometry"]
        layer.units[normalize_label(name)] = feature["geometry"]
    layer.validate_epsg4326()
    return layer


def load_lyon_metro_quartiers() -> SourceLayer:
    features = fetch_json(LYON_METRO_URL)["features"]
    layer = SourceLayer(source_id="lyon_metro_quartiers")
    for feature in features:
        name = feature["properties"]["nom"]
        layer.official_unit_names.add(name)
        layer.units[name] = feature["geometry"]
        layer.units[normalize_label(name)] = feature["geometry"]
    layer.validate_epsg4326()
    return layer


def load_grenoble_csv(url: str, name_key: str) -> SourceLayer:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=180) as response:
        text = response.read().decode("utf-8")
    layer = SourceLayer(source_id="grenoble_quartiers")
    for row in csv.DictReader(text.splitlines()):
        name = row[name_key]
        geometry = json.loads(row["geo_shape"])
        layer.official_unit_names.add(name)
        layer.units[name] = geometry
        layer.units[normalize_label(name)] = geometry
    layer.validate_epsg4326()
    return layer


def load_local_geojson(path: Path, name_key: str, source_id: str) -> SourceLayer:
    data = json.loads(path.read_text(encoding="utf-8"))
    layer = SourceLayer(source_id=source_id)
    for feature in data["features"]:
        name = feature["properties"].get(name_key) or feature["properties"].get("code")
        if not name:
            continue
        layer.official_unit_names.add(str(name))
        layer.units[str(name)] = feature["geometry"]
        layer.units[normalize_label(str(name))] = feature["geometry"]
    layer.validate_epsg4326()
    return layer


ADAPTER_BY_TYPE = {
    "iris_wfs": lambda cfg: load_iris_wfs(cfg["insee"]),
    "geo_api_commune": lambda _cfg: load_geo_api_commune(),
    "lille_wfs_quartiers": lambda _cfg: load_lille_wfs_quartiers(),
    "vda_wfs_quartiers": lambda _cfg: load_vda_wfs_quartiers(),
    "marseille_quartiers": lambda _cfg: load_marseille_quartiers(),
    "nice_quartiers": lambda _cfg: load_nice_quartiers(),
    "toulouse_quartiers": lambda _cfg: load_toulouse_quartiers(),
    "nantes_quartiers": lambda _cfg: load_nantes_quartiers(),
    "rennes_quartiers": lambda cfg: load_opendatasoft(cfg["url"], cfg["nameKey"], "rennes_quartiers"),
    "strasbourg_quartiers": lambda cfg: _load_strasbourg(cfg),
    "grenoble_quartiers": lambda cfg: load_grenoble_csv(cfg["url"], cfg["nameKey"]),
    "local_geojson": lambda cfg: load_local_geojson(
        ROOT / cfg["path"], cfg.get("nameKey", "code"), cfg["id"]
    ),
    "bordeaux_quartiers": lambda _cfg: load_bordeaux_quartiers(),
    "bordeaux_iris": lambda _cfg: load_bordeaux_iris(),
    "lyon_quartiers": lambda _cfg: load_lyon_quartiers(),
    "lyon_metro_quartiers": lambda _cfg: load_lyon_metro_quartiers(),
}


def _load_strasbourg(cfg: dict[str, Any]) -> SourceLayer:
    layer = load_opendatasoft(cfg["url"], cfg["nameKey"], "strasbourg_quartiers")
    if cfg.get("extraUrl"):
        extra = load_opendatasoft(cfg["extraUrl"], cfg.get("extraNameKey", "libelle"), "strasbourg_quartiers")
        layer.units.update(extra.units)
        layer.official_unit_names.update(extra.official_unit_names)
    return layer


def load_source(config: dict[str, Any]) -> SourceLayer:
    source_id = config["id"]
    source_type = config["type"]
    print(f"[sources] Fetching {source_id} ({source_type})...", flush=True)
    adapter = ADAPTER_BY_TYPE.get(source_type)
    if adapter is None:
        raise SourceError(f"Unknown source type: {source_type}")
    layer = adapter(config)
    layer.source_id = source_id
    print(f"[sources] Loaded {source_id} ({len(layer.units)} units)", flush=True)
    return layer


def load_all_sources(source_configs: list[dict[str, Any]]) -> dict[str, SourceLayer]:
    layers: dict[str, SourceLayer] = {}
    for config in source_configs:
        source_id = config["id"]
        if source_id in layers:
            continue
        layers[source_id] = load_source(config)
    return layers