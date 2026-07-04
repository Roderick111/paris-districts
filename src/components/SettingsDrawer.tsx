"use client";

import { useEffect, useRef } from "react";
import {
  districts,
  SCORE_KEYS,
  sources,
  type DistrictScore,
  type ScoreKey,
  type Weights
} from "@/data/districtScores";
import {
  clampScore,
  clampWeight,
  hasCustomSettings,
  metricLabel,
  type ScoreOverridesByDistrict
} from "@/lib/userSettings";

export type SettingsTab = "criteria" | "rankings" | "sources";

type RankRow = {
  district: DistrictScore;
  total: number;
};

type SettingsDrawerProps = {
  open: boolean;
  tab: SettingsTab;
  activeWeights: Weights;
  scoreOverrides: ScoreOverridesByDistrict;
  selectedCode: string;
  filter: "all" | DistrictScore["area"];
  rankRows: RankRow[];
  onClose: () => void;
  onTabChange: (tab: SettingsTab) => void;
  onWeightChange: (key: ScoreKey, value: number) => void;
  onSelectedCodeChange: (code: string) => void;
  onScoreOverrideChange: (code: string, key: ScoreKey, value: number) => void;
  onFilterChange: (filter: "all" | DistrictScore["area"]) => void;
  onResetSelectedRatings: () => void;
  onResetAllRatings: () => void;
  onResetWeights: () => void;
  onResetEverything: () => void;
  formatScore: (value: number) => string;
};

export default function SettingsDrawer({
  open,
  tab,
  activeWeights,
  scoreOverrides,
  selectedCode,
  filter,
  rankRows,
  onClose,
  onTabChange,
  onWeightChange,
  onSelectedCodeChange,
  onScoreOverrideChange,
  onFilterChange,
  onResetSelectedRatings,
  onResetAllRatings,
  onResetWeights,
  onResetEverything,
  formatScore
}: SettingsDrawerProps) {
  const drawerRef = useRef<HTMLElement | null>(null);
  const selectedDistrict = districts.find((district) => district.code === selectedCode) ?? districts[0];
  const selectedOverrides = scoreOverrides[selectedCode] ?? {};
  const usingCustomSettings = hasCustomSettings(activeWeights, scoreOverrides);
  const visibleRows = rankRows.filter(({ district }) => filter === "all" || district.area === filter);

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
                          onChange={(event) => onWeightChange(key, clampWeight(Number(event.target.value)))}
                        />
                        <input
                          type="number"
                          min={0}
                          max={5}
                          step={0.1}
                          value={activeWeights[key]}
                          onChange={(event) => onWeightChange(key, clampWeight(Number(event.target.value)))}
                          aria-label={`${metricLabel(key)} weight`}
                        />
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              <section className="drawerSection">
                <h3>District ratings</h3>
                <p className="drawerHint">Override researched defaults for a specific district.</p>
                <label className="fieldLabel">
                  District
                  <select value={selectedCode} onChange={(event) => onSelectedCodeChange(event.target.value)}>
                    {districts.map((district) => (
                      <option key={district.code} value={district.code}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="controlList">
                  {SCORE_KEYS.map((key) => {
                    const defaultScore = selectedDistrict.scores[key];
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
                              onScoreOverrideChange(selectedCode, key, clampScore(Number(event.target.value)))
                            }
                          />
                          <input
                            type="number"
                            min={0}
                            max={10}
                            step={0.1}
                            value={currentScore}
                            onChange={(event) =>
                              onScoreOverrideChange(selectedCode, key, clampScore(Number(event.target.value)))
                            }
                            aria-label={`${metricLabel(key)} rating`}
                          />
                        </div>
                      </label>
                    );
                  })}
                </div>
              </section>

              <section className="drawerSection resetSection">
                <h3>Reset</h3>
                <div className="resetActions">
                  <button type="button" onClick={onResetSelectedRatings}>
                    Reset selected district
                  </button>
                  <button type="button" onClick={onResetAllRatings}>
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
                <select
                  value={filter}
                  onChange={(event) => onFilterChange(event.target.value as typeof filter)}
                  aria-label="Filter district area"
                >
                  <option value="all">All areas</option>
                  <option value="Paris">Paris</option>
                  <option value="Inner suburb">Inner suburb</option>
                  <option value="Versailles corridor">Versailles corridor</option>
                </select>
              </div>
              {usingCustomSettings ? (
                <p className="customNote">Using custom settings: weights and/or district ratings differ from defaults.</p>
              ) : null}
              <div className="tableWrap">
                <table>
                  <thead>
                    <tr>
                      <th>District</th>
                      <th>Total</th>
                      <th>Safety</th>
                      <th>Rent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRows.map(({ district, total }) => (
                      <tr
                        key={district.id}
                        className={district.code === selectedCode ? "activeRow" : ""}
                        onClick={() => onSelectedCodeChange(district.code)}
                      >
                        <td>{district.name}</td>
                        <td>{formatScore(total)}</td>
                        <td>{formatScore(getEffectiveScore(district, scoreOverrides, "security"))}</td>
                        <td>{district.rentLevel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
  district: DistrictScore,
  overrides: ScoreOverridesByDistrict,
  key: ScoreKey
) {
  return overrides[district.code]?.[key] ?? district.scores[key];
}