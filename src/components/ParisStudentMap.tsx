"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { MapboxOverlay } from "@deck.gl/mapbox";
import maplibregl, { Map as MapLibreMap } from "maplibre-gl";
import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import SettingsDrawer, { type SettingsTab } from "@/components/SettingsDrawer";
import {
  defaultWeights,
  districtByCode,
  districts,
  SCORE_KEYS,
  weightedTotal,
  type DistrictScore,
  type ScoreKey,
  type Weights
} from "@/data/districtScores";
import {
  clampScore,
  clampWeight,
  getDistrictOverrides,
  getEffectiveScores,
  hasCustomSettings,
  loadScoreOverrides,
  loadWeights,
  metricLabel,
  saveScoreOverrides,
  saveWeights,
  type ScoreOverridesByDistrict
} from "@/lib/userSettings";

type DistrictFeatureCollection = FeatureCollection<Geometry, GeoJsonProperties & { code: string; name: string; kind: string }>;

type HoverInfo = {
  x: number;
  y: number;
  district: DistrictScore;
};

type MapMode = "overall" | "security";

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
  district: DistrictScore,
  mode: MapMode,
  activeWeights: Weights,
  scoreOverrides: ScoreOverridesByDistrict
) {
  const overrides = getDistrictOverrides(scoreOverrides, district.code);
  return mode === "security"
    ? getEffectiveScores(district, scoreOverrides).security
    : weightedTotal(district, activeWeights, overrides);
}

export default function ParisStudentMap() {
  const mapNode = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const overlayRef = useRef<MapboxOverlay | null>(null);
  const [geojson, setGeojson] = useState<DistrictFeatureCollection | null>(null);
  const [selectedCode, setSelectedCode] = useState("75114");
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [filter, setFilter] = useState<"all" | DistrictScore["area"]>("all");
  const [mapMode, setMapMode] = useState<MapMode>("overall");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("criteria");
  const [activeWeights, setActiveWeights] = useState<Weights>(defaultWeights);
  const [scoreOverrides, setScoreOverrides] = useState<ScoreOverridesByDistrict>({});
  const [settingsHydrated, setSettingsHydrated] = useState(false);

  const selected = districtByCode.get(selectedCode) ?? districts[0];
  const selectedOverrides = getDistrictOverrides(scoreOverrides, selected.code);
  const selectedScores = getEffectiveScores(selected, scoreOverrides);
  const selectedTotal = weightedTotal(selected, activeWeights, selectedOverrides);
  const selectedMapScore = scoreForMode(selected, mapMode, activeWeights, scoreOverrides);
  const usingCustomSettings = hasCustomSettings(activeWeights, scoreOverrides);

  const rankRows = useMemo(() => {
    return districts
      .map((district) => ({
        district,
        total: weightedTotal(district, activeWeights, getDistrictOverrides(scoreOverrides, district.code))
      }))
      .sort((a, b) => b.total - a.total);
  }, [activeWeights, scoreOverrides]);

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
    fetch("/data/districts.geojson")
      .then((response) => response.json())
      .then((data: DistrictFeatureCollection) => {
        if (!cancelled) {
          setGeojson(data);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!mapNode.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: mapNode.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [2.29, 48.84],
      zoom: 10.5,
      minZoom: 9.3,
      maxZoom: 15,
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

    const layer = new GeoJsonLayer({
      id: "district-quality",
      data: geojson,
      pickable: true,
      stroked: true,
      filled: true,
      lineWidthMinPixels: 1,
      getLineColor: (feature: { properties: { code: string } }) => {
        return feature.properties.code === selectedCode ? [15, 23, 42, 255] : [255, 255, 255, 230];
      },
      getLineWidth: (feature: { properties: { code: string } }) => {
        return feature.properties.code === selectedCode ? 3 : 1;
      },
      getFillColor: (feature: { properties: { code: string } }) => {
        const district = districtByCode.get(feature.properties.code);
        if (!district) {
          return colorForScore(0);
        }

        return colorForScore(scoreForMode(district, mapMode, activeWeights, scoreOverrides));
      },
      updateTriggers: {
        getFillColor: [mapMode, activeWeights, scoreOverrides],
        getLineColor: [selectedCode],
        getLineWidth: [selectedCode]
      },
      onHover: (info) => {
        const code = info.object?.properties?.code;
        const district = code ? districtByCode.get(code) : null;
        setHoverInfo(district && typeof info.x === "number" && typeof info.y === "number" ? { x: info.x, y: info.y, district } : null);
        if (map.getCanvas()) {
          map.getCanvas().style.cursor = district ? "pointer" : "";
        }
      },
      onClick: (info) => {
        const code = info.object?.properties?.code;
        if (code && districtByCode.has(code)) {
          setSelectedCode(code);
        }
      }
    });

    if (!overlayRef.current) {
      overlayRef.current = new MapboxOverlay({ interleaved: false, layers: [layer] });
      map.addControl(overlayRef.current as unknown as maplibregl.IControl);
    } else {
      overlayRef.current.setProps({ layers: [layer] });
    }
  }, [geojson, selectedCode, mapMode, activeWeights, scoreOverrides]);

  const handleWeightChange = (key: ScoreKey, value: number) => {
    setActiveWeights((current) => ({ ...current, [key]: clampWeight(value) }));
  };

  const handleScoreOverrideChange = (code: string, key: ScoreKey, value: number) => {
    const district = districtByCode.get(code);
    if (!district) {
      return;
    }

    const clamped = clampScore(value);
    setScoreOverrides((current) => {
      const nextDistrictOverrides = { ...current[code] };

      if (clamped === district.scores[key]) {
        delete nextDistrictOverrides[key];
      } else {
        nextDistrictOverrides[key] = clamped;
      }

      const next = { ...current };
      if (Object.keys(nextDistrictOverrides).length === 0) {
        delete next[code];
      } else {
        next[code] = nextDistrictOverrides;
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
      <section className="mapArea" aria-label="Paris student life quality map">
        <div ref={mapNode} className="map" />
        <button
          className="settingsButton"
          type="button"
          onClick={() => setSettingsOpen(true)}
          aria-label="Open settings and data"
        >
          Settings / Data
        </button>
        <div className="legend" aria-label="Score color legend">
          <div className="legendBar" />
          <div className="legendLabels">
            <span>0 poor</span>
            <span>6 compromised</span>
            <span>8+ earned</span>
          </div>
        </div>
        {hoverInfo ? (
          <div className="tooltip" style={{ left: hoverInfo.x + 14, top: hoverInfo.y + 14 }}>
            <strong>{hoverInfo.district.name}</strong>
            <span>
              {formatScore(scoreForMode(hoverInfo.district, mapMode, activeWeights, scoreOverrides))}/10 {mapMode}
            </span>
          </div>
        ) : null}
      </section>

      <aside className="panel" aria-label="District score details">
        <div className="panelHeader">
          <p className="eyebrow">Student life quality</p>
          <h1>Paris districts + western suburbs</h1>
          <p>
            Composite score from safety, rent pressure, transport, student energy, services, campus access, and calm.
            Security is weighted 3x and caps unsafe areas.
          </p>
          {usingCustomSettings ? (
            <p className="customNote compactNote">Using custom weights and/or district ratings.</p>
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
              <p>{selected.area} · {selected.rentLevel} rent · {selected.studentFit} fit</p>
            </div>
            <div className="scoreBadge" style={{ backgroundColor: `rgb(${colorForScore(selectedTotal, 255).slice(0, 3).join(",")})` }}>
              {formatScore(selectedTotal)}
            </div>
          </div>
          <p className="mapScore">
            Map color: {formatScore(selectedMapScore)}/10 {mapMode === "security" ? "safety" : "risk-adjusted overall"}
          </p>
          <p className="summary">{selected.summary}</p>
          <p className="caveat">{selected.caveat}</p>

          <div className="scoreGrid">
            {SCORE_KEYS.map((key) => {
              const isOverridden = selectedOverrides?.[key] !== undefined;
              return (
                <div key={key} className={`metric${isOverridden ? " metricOverridden" : ""}`}>
                  <span>
                    {metricLabel(key)}
                    {isOverridden ? <em className="overrideTag">custom</em> : null}
                  </span>
                  <strong>{formatScore(selectedScores[key])}</strong>
                </div>
              );
            })}
          </div>
        </section>
      </aside>

      <SettingsDrawer
        open={settingsOpen}
        tab={settingsTab}
        activeWeights={activeWeights}
        scoreOverrides={scoreOverrides}
        selectedCode={selectedCode}
        filter={filter}
        rankRows={rankRows}
        onClose={() => setSettingsOpen(false)}
        onTabChange={setSettingsTab}
        onWeightChange={handleWeightChange}
        onSelectedCodeChange={setSelectedCode}
        onScoreOverrideChange={handleScoreOverrideChange}
        onFilterChange={setFilter}
        onResetSelectedRatings={resetSelectedRatings}
        onResetAllRatings={resetAllRatings}
        onResetWeights={resetWeights}
        onResetEverything={resetEverything}
        formatScore={formatScore}
      />
    </main>
  );
}