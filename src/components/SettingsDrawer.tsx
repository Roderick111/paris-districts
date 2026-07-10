"use client";

import { useEffect, useRef } from "react";
import {
  SCORE_KEYS,
  type PlaceScore,
  type ScoreKey,
  type Source,
  type Weights
} from "@/data/cities";
import {
  hasCustomSettings,
  metricLabel,
  type ScoreOverridesByPlace
} from "@/lib/userSettings";

export type SettingsTab = "criteria" | "rankings" | "sources";

type RankRow = {
  place: PlaceScore;
  total: number;
};

type SettingsDrawerProps = {
  open: boolean;
  tab: SettingsTab;
  places: PlaceScore[];
  sources: Source[];
  areaOptions: string[];
  parentFilterOptions?: string[];
  activeWeights: Weights;
  scoreOverrides: ScoreOverridesByPlace;
  selectedCode: string;
  selectedPlace: PlaceScore | null;
  filter: "all" | string;
  parentFilter: "all" | string;
  rankRows: RankRow[];
  dataWarning?: string | null;
  onClose: () => void;
  onTabChange: (tab: SettingsTab) => void;
  onWeightChange: (key: ScoreKey, value: number) => void;
  onSelectedCodeChange: (code: string) => void;
  onScoreOverrideChange: (code: string, key: ScoreKey, value: number) => void;
  onFilterChange: (filter: "all" | string) => void;
  onParentFilterChange: (filter: "all" | string) => void;
  onResetSelectedRatings: () => void;
  onResetAllRatings: () => void;
  onResetWeights: () => void;
  onResetEverything: () => void;
  formatScore: (value: number) => string;
};

export default function SettingsDrawer({
  open,
  tab,
  places,
  sources,
  areaOptions,
  parentFilterOptions,
  activeWeights,
  scoreOverrides,
  selectedCode,
  selectedPlace,
  filter,
  parentFilter,
  rankRows,
  dataWarning,
  onClose,
  onTabChange,
  onWeightChange,
  onSelectedCodeChange,
  onScoreOverrideChange,
  onFilterChange,
  onParentFilterChange,
  onResetSelectedRatings,
  onResetAllRatings,
  onResetWeights,
  onResetEverything,
  formatScore
}: SettingsDrawerProps) {
  const drawerRef = useRef<HTMLElement | null>(null);
  const selectedOverrides = selectedPlace ? (scoreOverrides[selectedPlace.code] ?? {}) : {};
  const usingCustomSettings = hasCustomSettings(activeWeights, scoreOverrides);
  const hasPlaces = places.length > 0;
  const visibleRows = rankRows.filter(({ place }) => {
    if (filter !== "all" && place.area !== filter) {
      return false;
    }

    if (parentFilter !== "all" && place.parentName !== parentFilter) {
      return false;
    }

    return true;
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    drawerRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="drawerOverlay" onClick={onClose}>
      <aside
        ref={drawerRef}
        className="settingsDrawer"
        role="dialog"
        aria-modal="true"
        aria-label="Settings and data"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="drawerHeader">
          <div>
            <p className="eyebrow">Settings</p>
            <h2>Criteria, rankings, sources</h2>
          </div>
          <button className="drawerClose" type="button" onClick={onClose} aria-label="Close settings">
            Close
          </button>
        </header>

        <div className="drawerTabs" role="tablist" aria-label="Settings sections">
          {(
            [
              ["criteria", "Criteria"],
              ["rankings", "Rankings"],
              ["sources", "Sources"]
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              className={tab === id ? "activeTab" : ""}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => onTabChange(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="drawerBody">
          {dataWarning ? <p className="customNote drawerHint">{dataWarning}</p> : null}

          {tab === "criteria" ? (
            <>
              <section className="drawerSection">
                <h3>Weights</h3>
                <p className="drawerHint">Adjust how much each criterion affects the overall score (0x to 5x).</p>
                <div className="controlList">
                  {SCORE_KEYS.map((key) => (
                    <label key={key} className="controlRow">
                      <span>{metricLabel(key)}</span>
                      <div className="controlInputs">
                        <input
                          type="range"
                          min={0}
                          max={5}
                          step={0.1}
                          value={activeWeights[key]}
                          onChange={(event) => onWeightChange(key, Number(event.target.value))}
                        />
                        <input
                          type="number"
                          min={0}
                          max={5}
                          step={0.1}
                          value={activeWeights[key]}
                          onChange={(event) => onWeightChange(key, Number(event.target.value))}
                          aria-label={`${metricLabel(key)} weight`}
                        />
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              <section className="drawerSection">
                <h3>Place ratings</h3>
                <p className="drawerHint">Override researched defaults for a specific place.</p>
                {hasPlaces ? (
                  <>
                    <label className="fieldLabel">
                      Place
                      <select value={selectedCode} onChange={(event) => onSelectedCodeChange(event.target.value)}>
                        {places.map((place) => (
                          <option key={place.code} value={place.code}>
                            {place.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    {selectedPlace ? (
                      <div className="controlList">
                        {SCORE_KEYS.map((key) => {
                          const defaultScore = selectedPlace.scores[key];
                          const currentScore = selectedOverrides[key] ?? defaultScore;
                          const isOverridden = selectedOverrides[key] !== undefined;

                          return (
                            <label key={key} className="controlRow">
                              <span>
                                {metricLabel(key)}
                                {isOverridden ? <em className="overrideTag">custom</em> : null}
                              </span>
                              <div className="controlInputs">
                                <input
                                  type="range"
                                  min={0}
                                  max={10}
                                  step={0.1}
                                  value={currentScore}
                                  onChange={(event) =>
                                    onScoreOverrideChange(selectedPlace.code, key, Number(event.target.value))
                                  }
                                />
                                <input
                                  type="number"
                                  min={0}
                                  max={10}
                                  step={0.1}
                                  value={currentScore}
                                  onChange={(event) =>
                                    onScoreOverrideChange(selectedPlace.code, key, Number(event.target.value))
                                  }
                                  aria-label={`${metricLabel(key)} rating`}
                                />
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    ) : null}
                  </>
                ) : (
                  <p className="drawerHint">No places available for this city.</p>
                )}
              </section>

              <section className="drawerSection resetSection">
                <h3>Reset</h3>
                <div className="resetActions">
                  <button type="button" onClick={onResetSelectedRatings} disabled={!hasPlaces}>
                    Reset selected place
                  </button>
                  <button type="button" onClick={onResetAllRatings} disabled={!hasPlaces}>
                    Reset all ratings
                  </button>
                  <button type="button" onClick={onResetWeights}>
                    Reset weights
                  </button>
                  <button type="button" className="dangerAction" onClick={onResetEverything}>
                    Reset everything
                  </button>
                </div>
              </section>
            </>
          ) : null}

          {tab === "rankings" ? (
            <section className="drawerSection rankingsSection">
              <div className="rankHeader">
                <h3>Ranked table</h3>
                <div className="rankFilters">
                  <select
                    value={filter}
                    onChange={(event) => onFilterChange(event.target.value)}
                    aria-label="Filter place area"
                  >
                    <option value="all">All areas</option>
                    {areaOptions.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                  {parentFilterOptions?.length ? (
                    <select
                      value={parentFilter}
                      onChange={(event) => onParentFilterChange(event.target.value)}
                      aria-label="Filter parent district"
                    >
                      <option value="all">All parents</option>
                      {parentFilterOptions.map((parent) => (
                        <option key={parent} value={parent}>
                          {parent}
                        </option>
                      ))}
                    </select>
                  ) : null}
                </div>
              </div>
              {usingCustomSettings ? (
                <p className="customNote">Using custom settings: weights and/or place ratings differ from defaults.</p>
              ) : null}
              {hasPlaces ? (
                <div className="tableWrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Place</th>
                        <th>Total</th>
                        <th>Safety</th>
                        <th>Rent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleRows.map(({ place, total }) => (
                        <tr
                          key={place.id}
                          className={place.code === selectedCode ? "activeRow" : ""}
                          onClick={() => onSelectedCodeChange(place.code)}
                        >
                          <td>{place.name}</td>
                          <td>{formatScore(total)}</td>
                          <td>{formatScore(getEffectiveScore(place, scoreOverrides, "security"))}</td>
                          <td>{place.rentLevel}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="drawerHint">No ranked places for this city.</p>
              )}
            </section>
          ) : null}

          {tab === "sources" ? (
            <section className="drawerSection sourcesSection">
              <h3>Sources</h3>
              <div className="sourcesList">
                {sources.map((source) => (
                  <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                    {source.label}
                  </a>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

function getEffectiveScore(
  place: PlaceScore,
  overrides: ScoreOverridesByPlace,
  key: ScoreKey
) {
  return overrides[place.code]?.[key] ?? place.scores[key];
}