"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FeatureCollection } from "geojson";
import MapView, { boundsFromGeojson } from "@/components/MapView";
import SettingsDrawer, { type SettingsTab } from "@/components/SettingsDrawer";
import {
  cities,
  cityById,
  colorForScore,
  defaultWeights,
  formatScore,
  scoreForMode,
  SCORE_KEYS,
  UNKNOWN_FEATURE_COLOR,
  weightedTotal,
  type CityId,
  type PlaceScore,
  type ScoreKey,
  type Weights
} from "@/data/cities";
import { loadPlacesForCity } from "@/data/placeLoaders";
import { useCityGeojson } from "@/hooks/useCityGeojson";
import {
  clampScore,
  clampWeight,
  getEffectiveScores,
  getPlaceOverrides,
  hasCustomSettings,
  loadScoreOverrides,
  loadWeights,
  metricLabel,
  pruneScoreOverrides,
  saveScoreOverrides,
  saveWeights,
  type ScoreOverridesByPlace
} from "@/lib/userSettings";

type HoverInfo = {
  x: number;
  y: number;
  place: PlaceScore;
};

type MapMode = "overall" | ScoreKey;

function mapModeLabel(mode: MapMode) {
  return mode === "overall" ? "risk-adjusted overall" : metricLabel(mode).toLowerCase();
}

function overridesEqual(
  left: ScoreOverridesByPlace,
  right: ScoreOverridesByPlace
): boolean {
  const leftCodes = Object.keys(left);
  const rightCodes = Object.keys(right);
  if (leftCodes.length !== rightCodes.length) {
    return false;
  }

  for (const code of leftCodes) {
    const leftOverrides = left[code];
    const rightOverrides = right[code];
    if (!rightOverrides) {
      return false;
    }

    const leftKeys = Object.keys(leftOverrides);
    const rightKeys = Object.keys(rightOverrides);
    if (
      leftKeys.length !== rightKeys.length ||
      leftKeys.some((key) => leftOverrides[key as ScoreKey] !== rightOverrides[key as ScoreKey])
    ) {
      return false;
    }
  }

  return true;
}

export default function DistrictQualityMap() {
  const [cityId, setCityId] = useState<CityId>("paris");
  const lastHoverRef = useRef<{ code: string; x: number; y: number } | null>(null);
  const unknownCodesWarnedRef = useRef(false);
  const [selectedCode, setSelectedCode] = useState("75101");
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [filter, setFilter] = useState<"all" | string>("all");
  const [parentFilter, setParentFilter] = useState<"all" | string>("all");
  const [mapMode, setMapMode] = useState<MapMode>("overall");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("criteria");
  const [activeWeights, setActiveWeights] = useState<Weights>(() => loadWeights());
  const [scoreOverrides, setScoreOverrides] = useState<ScoreOverridesByPlace>(() => loadScoreOverrides());
  const [placesResult, setPlacesResult] = useState<{
    cityId: CityId;
    places: PlaceScore[];
    error: string | null;
  }>({ cityId: "paris", places: [], error: null });

  const city = cityById.get(cityId)!;
  const {
    data: geojson,
    loading: geojsonLoading,
    error: geojsonError,
    retry: retryGeojson
  } = useCityGeojson(city.geojsonUrl);
  const {
    data: outlineGeojson,
    loading: outlineLoading,
    error: outlineError,
    retry: retryOutline
  } = useCityGeojson(city.outlineGeojsonUrl);

  useEffect(() => {
    let cancelled = false;

    loadPlacesForCity(cityId)
      .then((loaded) => {
        if (!cancelled) {
          setPlacesResult({ cityId, places: loaded, error: null });
          const validCodes = new Set(loaded.map((place) => place.code));
          setScoreOverrides((current) => {
            const pruned = pruneScoreOverrides(current, validCodes);
            return overridesEqual(current, pruned) ? current : pruned;
          });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setPlacesResult({
            cityId,
            places: [],
            error: error instanceof Error ? error.message : "Failed to load place data"
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [cityId]);

  const placesSettled = placesResult.cityId === cityId;
  const places = useMemo(
    () => (placesSettled ? placesResult.places : []),
    [placesResult.places, placesSettled]
  );
  const placesLoading = !placesSettled;
  const placesError = placesSettled ? placesResult.error : null;

  useEffect(() => {
    unknownCodesWarnedRef.current = false;
  }, [cityId, geojson]);

  const activePlaceByCode = useMemo(
    () => new Map(places.map((place) => [place.code, place])),
    [places]
  );

  const displayOutlineGeojson = useMemo(
    () => outlineGeojson ?? geojson,
    [outlineGeojson, geojson]
  );

  const selectionOutline = useMemo<FeatureCollection | null>(() => {
    if (!geojson || !selectedCode) {
      return null;
    }

    const precomputed = outlineGeojson?.features.find((feature) => feature.properties?.code === selectedCode);
    const raw = geojson.features.find((feature) => feature.properties?.code === selectedCode);
    const match = precomputed ?? raw;
    if (!match?.geometry) {
      return null;
    }

    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: match.geometry,
          properties: { code: selectedCode }
        }
      ]
    };
  }, [geojson, outlineGeojson, selectedCode]);

  const dataMismatch = useMemo(() => {
    if (!geojson || !placesSettled || placesLoading || placesError) {
      return { unknownCodes: [] as string[], missingCodes: [] as string[] };
    }

    const featureCodes = geojson.features
      .map((feature) => feature.properties?.code)
      .filter((code): code is string => typeof code === "string" && code.length > 0);
    const placeCodes = new Set(places.map((place) => place.code));
    const featureCodeSet = new Set(featureCodes);

    const unknownCodes = [...new Set(featureCodes.filter((code) => !placeCodes.has(code)))];
    const missingCodes = places.map((place) => place.code).filter((code) => !featureCodeSet.has(code));

    return { unknownCodes, missingCodes };
  }, [geojson, places, placesError, placesLoading, placesSettled]);

  useEffect(() => {
    if (dataMismatch.unknownCodes.length > 0 && !unknownCodesWarnedRef.current) {
      unknownCodesWarnedRef.current = true;
      console.warn(
        `[${cityId}] GeoJSON features with unknown place codes:`,
        dataMismatch.unknownCodes.join(", ")
      );
    }
  }, [cityId, dataMismatch.unknownCodes]);

  const selected = activePlaceByCode.get(selectedCode) ?? places[0] ?? null;
  const selectedOverrides = selected ? getPlaceOverrides(scoreOverrides, selected.code) : undefined;
  const selectedScores = selected ? getEffectiveScores(selected, scoreOverrides) : null;
  const selectedTotal = selected ? weightedTotal(selected, activeWeights, selectedOverrides) : null;
  const selectedMapScore =
    selected && selectedScores && selectedTotal !== null
      ? scoreForMode(selected, mapMode, activeWeights, selectedScores, selectedTotal)
      : null;
  const usingCustomSettings = hasCustomSettings(activeWeights, scoreOverrides);

  const rankRows = useMemo(() => {
    return places
      .map((place) => ({
        place,
        total: weightedTotal(place, activeWeights, getPlaceOverrides(scoreOverrides, place.code))
      }))
      .sort((a, b) => b.total - a.total);
  }, [places, activeWeights, scoreOverrides]);

  const fitBounds = useMemo(() => {
    if (!geojson?.features.length) {
      return null;
    }

    return boundsFromGeojson(geojson);
  }, [geojson]);

  useEffect(() => {
    saveWeights(activeWeights);
  }, [activeWeights]);

  useEffect(() => {
    saveScoreOverrides(scoreOverrides);
  }, [scoreOverrides]);

  const handleCityChange = (nextCityId: CityId) => {
    const nextCity = cityById.get(nextCityId);
    if (!nextCity) {
      return;
    }

    setCityId(nextCityId);
    setSelectedCode(nextCity.defaultSelectedCode);
    setHoverInfo(null);
    lastHoverRef.current = null;
    setFilter("all");
    setParentFilter("all");
  };

  const handleHoverPlace = useCallback(
    (info: { code: string; x: number; y: number } | null) => {
      if (!info) {
        if (lastHoverRef.current !== null) {
          lastHoverRef.current = null;
          setHoverInfo(null);
        }
        return;
      }

      const place = activePlaceByCode.get(info.code);
      if (!place) {
        return;
      }

      const roundedX = Math.round(info.x);
      const roundedY = Math.round(info.y);
      const last = lastHoverRef.current;
      if (!last || last.code !== info.code || last.x !== roundedX || last.y !== roundedY) {
        lastHoverRef.current = { code: info.code, x: roundedX, y: roundedY };
        setHoverInfo({ x: info.x, y: info.y, place });
      }
    },
    [activePlaceByCode]
  );

  const getFillColor = useCallback(
    (feature: { properties: { code: string } }) => {
      const place = activePlaceByCode.get(feature.properties.code);
      if (!place) {
        return UNKNOWN_FEATURE_COLOR;
      }

      const overrides = getPlaceOverrides(scoreOverrides, place.code);
      const effectiveScores = getEffectiveScores(place, scoreOverrides);
      const overall = weightedTotal(place, activeWeights, overrides);
      return colorForScore(scoreForMode(place, mapMode, activeWeights, effectiveScores, overall));
    },
    [activePlaceByCode, activeWeights, mapMode, scoreOverrides]
  );

  const canSelectCode = useCallback(
    (code: string) => activePlaceByCode.has(code),
    [activePlaceByCode]
  );

  const handleWeightChange = (key: ScoreKey, value: number) => {
    setActiveWeights((current) => ({ ...current, [key]: clampWeight(value, current[key]) }));
  };

  const handleScoreOverrideChange = (code: string, key: ScoreKey, value: number) => {
    const place = activePlaceByCode.get(code);
    if (!place) {
      return;
    }

    const clamped = clampScore(value, place.scores[key]);
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

  const mapFetchError = geojsonError ?? outlineError;
  const mapLoading =
    geojsonLoading || (city.outlineGeojsonUrl ? outlineLoading : false) || placesLoading;

  const retryMapData = () => {
    retryGeojson();
    if (city.outlineGeojsonUrl) {
      retryOutline();
    }
  };

  return (
    <main className="shell">
      <section className="mapArea" aria-label="District quality map">
        {mapFetchError ? (
          <div className="map mapError" role="alert">
            <p>Could not load map boundaries for {city.name}.</p>
            <p className="mapErrorDetail">{mapFetchError}</p>
            <button type="button" onClick={retryMapData}>
              Retry
            </button>
          </div>
        ) : mapLoading || !geojson ? (
          <div className="map mapLoading" aria-busy="true">
            Loading map…
          </div>
        ) : (
          <MapView
            center={city.center}
            zoom={city.zoom}
            minZoom={city.minZoom}
            maxZoom={city.maxZoom}
            geojson={geojson}
            displayOutlineGeojson={displayOutlineGeojson}
            selectionOutline={selectionOutline}
            getFillColor={getFillColor}
            fillUpdateTriggers={[mapMode, activeWeights, scoreOverrides, cityId, dataMismatch.unknownCodes.length]}
            onHoverPlace={handleHoverPlace}
            onSelectCode={setSelectedCode}
            canSelectCode={canSelectCode}
            fitBounds={fitBounds}
          />
        )}
        <div className="mapTopBar">
          <label className="citySelect">
            <span className="citySelectLabel">City</span>
            <select
              value={cityId}
              onChange={(event) => handleCityChange(event.target.value as CityId)}
              aria-label="Select city"
            >
              {cities.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.name}
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
              {formatScore(
                scoreForMode(
                  hoverInfo.place,
                  mapMode,
                  activeWeights,
                  getEffectiveScores(hoverInfo.place, scoreOverrides),
                  weightedTotal(
                    hoverInfo.place,
                    activeWeights,
                    getPlaceOverrides(scoreOverrides, hoverInfo.place.code)
                  )
                )
              )}
              /10 {mapModeLabel(mapMode)}
            </span>
          </div>
        ) : null}
      </section>

      <aside className="panel" aria-label="Place score details">
        <div className="panelHeader">
          <p className="eyebrow">District Quality Map</p>
          <h1>{city.title}</h1>
          <p>
            Composite score from safety, rent pressure, transport, student energy, services, campus access, and calm.
            Security is weighted 3x and caps unsafe areas.
          </p>
          {usingCustomSettings ? (
            <p className="customNote compactNote">Using custom weights and/or place ratings.</p>
          ) : null}
          {dataMismatch.missingCodes.length > 0 ? (
            <p className="customNote compactNote" role="status">
              Data warning: {dataMismatch.missingCodes.length} place
              {dataMismatch.missingCodes.length === 1 ? "" : "s"} missing map geometry.
            </p>
          ) : null}
        </div>

        {placesLoading ? (
          <section className="selectedCard" aria-busy="true">
            <p>Loading place data…</p>
          </section>
        ) : placesError ? (
          <section className="selectedCard" role="alert">
            <p>Could not load place data for {city.name}.</p>
            <p className="caveat">{placesError}</p>
          </section>
        ) : places.length === 0 ? (
          <section className="selectedCard emptyState">
            <h2>No places configured</h2>
            <p>This city has no scored districts yet. Choose another city or check the data pipeline.</p>
          </section>
        ) : (
          <>
            <div className="modeControl" aria-label="Map color mode">
              <button className={mapMode === "overall" ? "activeMode" : ""} type="button" onClick={() => setMapMode("overall")}>
                Overall
              </button>
              <button className={mapMode === "security" ? "activeMode" : ""} type="button" onClick={() => setMapMode("security")}>
                Safety
              </button>
            </div>

            {selected ? (
              <section className="selectedCard">
                <div className="selectedTopline">
                  <div>
                    <h2>{selected.name}</h2>
                    <p>
                      {selected.parentName ? `${selected.parentName} · ` : ""}
                      {selected.area} · {selected.rentLevel} rent · {selected.studentFit} fit
                    </p>
                  </div>
                  <div
                    className="scoreBadge"
                    style={{
                      backgroundColor: `rgb(${colorForScore(selectedTotal ?? 0, 255).slice(0, 3).join(",")})`
                    }}
                  >
                    {formatScore(selectedTotal ?? 0)}
                  </div>
                </div>
                <p className="mapScore">
                  Map color: {formatScore(selectedMapScore ?? 0)}/10 {mapModeLabel(mapMode)}
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
                        <strong>{formatScore(selectedScores?.[key] ?? 0)}</strong>
                      </button>
                    );
                  })}
                </div>
              </section>
            ) : null}
          </>
        )}

        <section className="relocationCta" aria-label="Relocation help">
          <p>Need help with relocation?</p>
          <p>
            Write me on{" "}
            <a href="https://t.me/daniel_mathias" target="_blank" rel="noreferrer">
              Telegram @daniel_mathias
            </a>{" "}
            or{" "}
            <a href="mailto:nex.mod.daniel@gmail.com">
              nex.mod.daniel@gmail.com
            </a>
          </p>
        </section>
      </aside>

      <SettingsDrawer
        drawerState={{ open: settingsOpen, tab: settingsTab }}
        filters={{
          filter,
          parentFilter,
          areaOptions: city.areaOptions,
          parentFilterOptions: city.parentFilterOptions
        }}
        settings={{
          activeWeights,
          scoreOverrides,
          selectedCode,
          selectedPlace: selected,
          dataWarning:
            dataMismatch.missingCodes.length > 0
              ? `${dataMismatch.missingCodes.length} places missing map geometry`
              : null
        }}
        ranking={{ places, rankRows, formatScore }}
        sources={city.sources}
        actions={{
          onClose: () => setSettingsOpen(false),
          onTabChange: setSettingsTab,
          onWeightChange: handleWeightChange,
          onSelectedCodeChange: setSelectedCode,
          onScoreOverrideChange: handleScoreOverrideChange,
          onFilterChange: setFilter,
          onParentFilterChange: setParentFilter,
          onResetSelectedRatings: resetSelectedRatings,
          onResetAllRatings: resetAllRatings,
          onResetWeights: resetWeights,
          onResetEverything: resetEverything
        }}
      />
    </main>
  );
}