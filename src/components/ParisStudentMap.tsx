"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { MapboxOverlay } from "@deck.gl/mapbox";
import maplibregl, { Map as MapLibreMap } from "maplibre-gl";
import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { dissolveGeometry } from "@/lib/geometryOutline";
import SettingsDrawer, { type SettingsTab } from "@/components/SettingsDrawer";
import {
  cityById,
  defaultWeights,
  getPlacesForCity,
  SCORE_KEYS,
  weightedTotal,
  type CityId,
  type PlaceScore,
  type ScoreKey,
  type Weights
} from "@/data/cities";
import {
  clampScore,
  clampWeight,
  getPlaceOverrides,
  getEffectiveScores,
  hasCustomSettings,
  loadScoreOverrides,
  loadWeights,
  metricLabel,
  saveScoreOverrides,
  saveWeights,
  type ScoreOverridesByPlace
} from "@/lib/userSettings";

type PlaceFeatureCollection = FeatureCollection<Geometry, GeoJsonProperties & { code: string; name: string; kind: string }>;

type HoverInfo = {
  x: number;
  y: number;
  place: PlaceScore;
};

type MapMode = "overall" | ScoreKey;

const BASE_LINE_COLOR: [number, number, number, number] = [255, 255, 255, 230];
const SELECTION_LINE_COLOR: [number, number, number, number] = [15, 23, 42, 255];

const CITY_OPTIONS: { id: CityId; label: string }[] = [
  { id: "paris", label: "Paris" },
  { id: "bordeaux", label: "Bordeaux" },
  { id: "lyon", label: "Lyon" }
];

function colorForScore(score: number, alpha = 185): [number, number, number, number] {
  const clamped = Math.max(0, Math.min(10, score));
  if (clamped <= 4) {
    const t = clamped / 4;
    return [Math.round(185 + 64 * t), Math.round(28 + 87 * t), Math.round(28 - 6 * t), alpha];
  }

  if (clamped <= 6.5) {
    const t = (clamped - 4) / 2.5;
    return [Math.round(249 + 1 * t), Math.round(115 + 89 * t), Math.round(22 - 1 * t), alpha];
  }

  if (clamped <= 8) {
    const t = (clamped - 6.5) / 1.5;
    return [Math.round(250 - 118 * t), Math.round(204 - 28 * t), Math.round(21 + 11 * t), alpha];
  }

  const t = (clamped - 8) / 2;
  return [Math.round(132 - 110 * t), Math.round(176 - 13 * t), Math.round(32 + 42 * t), alpha];
}

function formatScore(value: number) {
  return value.toFixed(1).replace(".0", "");
}

function scoreForMode(
  place: PlaceScore,
  mode: MapMode,
  activeWeights: Weights,
  scoreOverrides: ScoreOverridesByPlace
) {
  if (mode === "overall") {
    return weightedTotal(place, activeWeights, getPlaceOverrides(scoreOverrides, place.code));
  }

  return getEffectiveScores(place, scoreOverrides)[mode];
}

function mapModeLabel(mode: MapMode) {
  return mode === "overall" ? "risk-adjusted overall" : metricLabel(mode).toLowerCase();
}

export default function ParisStudentMap() {
  const mapNode = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const overlayRef = useRef<MapboxOverlay | null>(null);
  const [cityId, setCityId] = useState<CityId>("paris");
  const [geojson, setGeojson] = useState<PlaceFeatureCollection | null>(null);
  const [selectedCode, setSelectedCode] = useState("75101");
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [filter, setFilter] = useState<"all" | string>("all");
  const [parentFilter, setParentFilter] = useState<"all" | string>("all");
  const [mapMode, setMapMode] = useState<MapMode>("overall");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("criteria");
  const [activeWeights, setActiveWeights] = useState<Weights>(defaultWeights);
  const [scoreOverrides, setScoreOverrides] = useState<ScoreOverridesByPlace>({});
  const [settingsHydrated, setSettingsHydrated] = useState(false);

  const city = cityById.get(cityId)!;
  const places = useMemo(() => getPlacesForCity(cityId), [cityId]);

  const activePlaceByCode = useMemo(
    () => new Map(places.map((place) => [place.code, place])),
    [places]
  );

  const selectionOutline = useMemo<FeatureCollection | null>(() => {
    if (!geojson) {
      return null;
    }

    const match = geojson.features.find((feature) => feature.properties?.code === selectedCode);
    if (!match?.geometry) {
      return null;
    }

    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: dissolveGeometry(match.geometry),
          properties: { code: selectedCode }
        }
      ]
    };
  }, [geojson, selectedCode]);

  const selected = activePlaceByCode.get(selectedCode) ?? places[0];
  const selectedOverrides = getPlaceOverrides(scoreOverrides, selected.code);
  const selectedScores = getEffectiveScores(selected, scoreOverrides);
  const selectedTotal = weightedTotal(selected, activeWeights, selectedOverrides);
  const selectedMapScore = scoreForMode(selected, mapMode, activeWeights, scoreOverrides);
  const usingCustomSettings = hasCustomSettings(activeWeights, scoreOverrides);

  const rankRows = useMemo(() => {
    return places
      .map((place) => ({
        place,
        total: weightedTotal(place, activeWeights, getPlaceOverrides(scoreOverrides, place.code))
      }))
      .sort((a, b) => b.total - a.total);
  }, [places, activeWeights, scoreOverrides]);

  useEffect(() => {
    setActiveWeights(loadWeights());
    setScoreOverrides(loadScoreOverrides());
    setSettingsHydrated(true);
  }, []);

  useEffect(() => {
    if (!settingsHydrated) {
      return;
    }

    saveWeights(activeWeights);
  }, [activeWeights, settingsHydrated]);

  useEffect(() => {
    if (!settingsHydrated) {
      return;
    }

    saveScoreOverrides(scoreOverrides);
  }, [scoreOverrides, settingsHydrated]);

  useEffect(() => {
    let cancelled = false;
    setGeojson(null);

    fetch(city.geojsonUrl)
      .then((response) => response.json())
      .then((data: PlaceFeatureCollection) => {
        if (!cancelled) {
          setGeojson(data);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [city.geojsonUrl]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    map.flyTo({ center: city.center, zoom: city.zoom, essential: true });
    map.setMinZoom(city.minZoom);
    map.setMaxZoom(city.maxZoom);
  }, [cityId, city.center, city.zoom, city.minZoom, city.maxZoom]);

  const handleCityChange = (nextCityId: CityId) => {
    const nextCity = cityById.get(nextCityId);
    if (!nextCity) {
      return;
    }

    setCityId(nextCityId);
    setSelectedCode(nextCity.defaultSelectedCode);
    setHoverInfo(null);
    setFilter("all");
    setParentFilter("all");
  };

  useEffect(() => {
    if (!mapNode.current || mapRef.current) {
      return;
    }

    const initialCity = cityById.get("paris")!;
    const map = new maplibregl.Map({
      container: mapNode.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: initialCity.center,
      zoom: initialCity.zoom,
      minZoom: initialCity.minZoom,
      maxZoom: initialCity.maxZoom,
      attributionControl: { compact: true }
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "bottom-right");
    mapRef.current = map;

    return () => {
      overlayRef.current?.finalize();
      overlayRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !geojson) {
      return;
    }

    const onHover = (info: { object?: { properties?: { code?: string } }; x?: number; y?: number }) => {
      const code = info.object?.properties?.code;
      const place = code ? activePlaceByCode.get(code) : null;
      setHoverInfo(place && typeof info.x === "number" && typeof info.y === "number" ? { x: info.x, y: info.y, place } : null);
      if (map.getCanvas()) {
        map.getCanvas().style.cursor = place ? "pointer" : "";
      }
    };

    const onClick = (info: { object?: { properties?: { code?: string } } }) => {
      const code = info.object?.properties?.code;
      if (code && activePlaceByCode.has(code)) {
        setSelectedCode(code);
      }
    };

    const fillLayer = new GeoJsonLayer({
      id: "place-quality-fill",
      data: geojson,
      pickable: true,
      stroked: false,
      filled: true,
      getFillColor: (feature: { properties: { code: string } }) => {
        const place = activePlaceByCode.get(feature.properties.code);
        if (!place) {
          return colorForScore(0);
        }

        return colorForScore(scoreForMode(place, mapMode, activeWeights, scoreOverrides));
      },
      updateTriggers: {
        getFillColor: [mapMode, activeWeights, scoreOverrides, cityId]
      },
      onHover,
      onClick
    });

    const outlineLayer = new GeoJsonLayer({
      id: "place-quality-outline",
      data: geojson,
      pickable: false,
      stroked: true,
      filled: false,
      lineWidthMinPixels: 1,
      getLineColor: BASE_LINE_COLOR,
      getLineWidth: 1
    });

    const selectionLayer = selectionOutline
      ? new GeoJsonLayer({
          id: "place-quality-selection",
          data: selectionOutline,
          pickable: false,
          stroked: true,
          filled: false,
          lineWidthMinPixels: 3,
          getLineColor: SELECTION_LINE_COLOR,
          getLineWidth: 4,
          lineJointRounded: true,
          lineCapRounded: true,
          parameters: { depthTest: false }
        })
      : null;

    const layers = selectionLayer ? [fillLayer, outlineLayer, selectionLayer] : [fillLayer, outlineLayer];

    if (!overlayRef.current) {
      overlayRef.current = new MapboxOverlay({ interleaved: false, layers });
      map.addControl(overlayRef.current as unknown as maplibregl.IControl);
    } else {
      overlayRef.current.setProps({ layers });
    }
  }, [geojson, selectionOutline, mapMode, activeWeights, scoreOverrides, activePlaceByCode, cityId, selectedCode]);

  const handleWeightChange = (key: ScoreKey, value: number) => {
    setActiveWeights((current) => ({ ...current, [key]: clampWeight(value) }));
  };

  const handleScoreOverrideChange = (code: string, key: ScoreKey, value: number) => {
    const place = activePlaceByCode.get(code);
    if (!place) {
      return;
    }

    const clamped = clampScore(value);
    setScoreOverrides((current) => {
      const nextPlaceOverrides = { ...current[code] };

      if (clamped === place.scores[key]) {
        delete nextPlaceOverrides[key];
      } else {
        nextPlaceOverrides[key] = clamped;
      }

      const next = { ...current };
      if (Object.keys(nextPlaceOverrides).length === 0) {
        delete next[code];
      } else {
        next[code] = nextPlaceOverrides;
      }

      return next;
    });
  };

  const resetSelectedRatings = () => {
    setScoreOverrides((current) => {
      if (!current[selectedCode]) {
        return current;
      }

      const next = { ...current };
      delete next[selectedCode];
      return next;
    });
  };

  const resetAllRatings = () => {
    setScoreOverrides({});
  };

  const resetWeights = () => {
    setActiveWeights({ ...defaultWeights });
  };

  const resetEverything = () => {
    setActiveWeights({ ...defaultWeights });
    setScoreOverrides({});
  };

  return (
    <main className="shell">
      <section className="mapArea" aria-label="Student city quality map">
        <div ref={mapNode} className="map" />
        <div className="mapTopBar">
          <label className="citySelect">
            <span className="citySelectLabel">City</span>
            <select
              value={cityId}
              onChange={(event) => handleCityChange(event.target.value as CityId)}
              aria-label="Select city"
            >
              {CITY_OPTIONS.map(({ id, label }) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <button
            className="settingsButton"
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Open settings and data"
          >
            Settings / Data
          </button>
        </div>
        <div className="legend" aria-label="Score color legend">
          <div className="legendBar" />
          <div className="legendLabels">
            <span>0 poor</span>
            <span>6 medium</span>
            <span>8+ great</span>
          </div>
        </div>
        {hoverInfo ? (
          <div className="tooltip" style={{ left: hoverInfo.x + 14, top: hoverInfo.y + 14 }}>
            <strong>{hoverInfo.place.name}</strong>
            <span>
              {formatScore(scoreForMode(hoverInfo.place, mapMode, activeWeights, scoreOverrides))}/10 {mapModeLabel(mapMode)}
            </span>
          </div>
        ) : null}
      </section>

      <aside className="panel" aria-label="Place score details">
        <div className="panelHeader">
          <p className="eyebrow">Student city quality map</p>
          <h1>{city.title}</h1>
          <p>
            Composite score from safety, rent pressure, transport, student energy, services, campus access, and calm.
            Security is weighted 3x and caps unsafe areas.
          </p>
          {usingCustomSettings ? (
            <p className="customNote compactNote">Using custom weights and/or place ratings.</p>
          ) : null}
        </div>

        <div className="modeControl" aria-label="Map color mode">
          <button className={mapMode === "overall" ? "activeMode" : ""} type="button" onClick={() => setMapMode("overall")}>
            Overall
          </button>
          <button className={mapMode === "security" ? "activeMode" : ""} type="button" onClick={() => setMapMode("security")}>
            Safety
          </button>
        </div>

        <section className="selectedCard">
          <div className="selectedTopline">
            <div>
              <h2>{selected.name}</h2>
              <p>
                {selected.parentName ? `${selected.parentName} · ` : ""}
                {selected.area} · {selected.rentLevel} rent · {selected.studentFit} fit
              </p>
            </div>
            <div className="scoreBadge" style={{ backgroundColor: `rgb(${colorForScore(selectedTotal, 255).slice(0, 3).join(",")})` }}>
              {formatScore(selectedTotal)}
            </div>
          </div>
          <p className="mapScore">
            Map color: {formatScore(selectedMapScore)}/10 {mapModeLabel(mapMode)}
          </p>
          <p className="summary">{selected.summary}</p>
          <p className="caveat">{selected.caveat}</p>

          <div className="scoreGrid" aria-label="Place criteria scores">
            {SCORE_KEYS.map((key) => {
              const isOverridden = selectedOverrides?.[key] !== undefined;
              const isActive = mapMode === key;
              return (
                <button
                  key={key}
                  type="button"
                  className={`metric${isOverridden ? " metricOverridden" : ""}${isActive ? " metricActive" : ""}`}
                  aria-pressed={isActive}
                  onClick={() => setMapMode(key)}
                >
                  <span>
                    {metricLabel(key)}
                    {isOverridden ? <em className="overrideTag">custom</em> : null}
                  </span>
                  <strong>{formatScore(selectedScores[key])}</strong>
                </button>
              );
            })}
          </div>
        </section>
      </aside>

      <SettingsDrawer
        open={settingsOpen}
        tab={settingsTab}
        places={places}
        sources={city.sources}
        areaOptions={city.areaOptions}
        parentFilterOptions={city.parentFilterOptions}
        activeWeights={activeWeights}
        scoreOverrides={scoreOverrides}
        selectedCode={selectedCode}
        filter={filter}
        parentFilter={parentFilter}
        rankRows={rankRows}
        onClose={() => setSettingsOpen(false)}
        onTabChange={setSettingsTab}
        onWeightChange={handleWeightChange}
        onSelectedCodeChange={setSelectedCode}
        onScoreOverrideChange={handleScoreOverrideChange}
        onFilterChange={setFilter}
        onParentFilterChange={setParentFilter}
        onResetSelectedRatings={resetSelectedRatings}
        onResetAllRatings={resetAllRatings}
        onResetWeights={resetWeights}
        onResetEverything={resetEverything}
        formatScore={formatScore}
      />
    </main>
  );
}