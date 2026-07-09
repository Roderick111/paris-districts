#!/usr/bin/env python3
"""Generate src/data/bordeauxPlaces_new.ts from structured micro-place data."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

OUTPUT_PATHS = [
    Path("src/data/bordeauxPlaces_new.ts"),
    Path("bordeauxPlaces.ts"),
]

MEDIUM_IRIS = "Adjacent official IRIS polygons (medium confidence)."
MEDIUM_SUBQ = "Adjacent official Bordeaux Métropole sub-quartiers (medium confidence)."
GRADIGNAN_RANKINGS = (
    "Score-only row for Gradignan sub-area rankings; not mapped as a separate polygon."
)

PLACES: list[dict[str, Any]] = [
    # Bordeaux city quartiers
    {
        "code": "bdx-centre-saint-pierre",
        "name": "Saint-Pierre / Saint-Paul",
        "kind": "quartier",
        "security": 6.6,
        "affordability": 4.4,
        "transport": 9.0,
        "studentEnergy": 7.6,
        "services": 9.0,
        "campusAccess": 6.6,
        "greenCalm": 5.4,
        "confidence": "medium",
        "evidenceNote": MEDIUM_IRIS,
    },
    {
        "code": "bdx-centre-hotel-ville",
        "name": "Hôtel de Ville / Pey-Berland / Mériadeck",
        "kind": "quartier",
        "security": 7.4,
        "affordability": 4.8,
        "transport": 9.4,
        "studentEnergy": 6.8,
        "services": 9.2,
        "campusAccess": 6.4,
        "greenCalm": 5.8,
        "confidence": "medium",
        "evidenceNote": MEDIUM_IRIS,
    },
    {
        "code": "bdx-centre-quinconces",
        "name": "Quinconces / Tourny / Triangle d'Or",
        "kind": "quartier",
        "security": 8.0,
        "affordability": 3.8,
        "transport": 9.2,
        "studentEnergy": 5.8,
        "services": 9.0,
        "campusAccess": 6.0,
        "greenCalm": 6.6,
        "confidence": "medium",
        "evidenceNote": MEDIUM_IRIS,
    },
    {
        "code": "bdx-sud-victoire",
        "name": "Victoire / Sainte-Eulalie",
        "kind": "quartier",
        "security": 6.2,
        "affordability": 5.6,
        "transport": 9.0,
        "studentEnergy": 9.0,
        "services": 8.6,
        "campusAccess": 7.2,
        "greenCalm": 5.2,
        "confidence": "medium",
        "evidenceNote": MEDIUM_IRIS,
    },
    {
        "code": "bdx-sud-saint-michel-capucins",
        "name": "Saint-Michel / Capucins",
        "kind": "quartier",
        "security": 5.4,
        "affordability": 6.0,
        "transport": 8.6,
        "studentEnergy": 8.8,
        "services": 8.0,
        "campusAccess": 6.8,
        "greenCalm": 4.8,
        "confidence": "medium",
        "evidenceNote": (
            "Capucins-Victoire IRIS 5–8 grouped; Saint-Michel nightlife and market axis "
            "spans IRIS edges (medium confidence)."
        ),
    },
    {
        "code": "bdx-sud-sainte-croix",
        "name": "Sainte-Croix / Saint-Jean",
        "kind": "quartier",
        "security": 5.8,
        "affordability": 6.4,
        "transport": 8.4,
        "studentEnergy": 7.4,
        "services": 7.6,
        "campusAccess": 6.2,
        "greenCalm": 5.0,
        "confidence": "medium",
        "evidenceNote": MEDIUM_IRIS,
    },
    {
        "code": "bdx-sud-belcier",
        "name": "Belcier / Euratlantique / Paludate",
        "kind": "quartier",
        "security": 6.4,
        "affordability": 5.8,
        "transport": 8.8,
        "studentEnergy": 6.6,
        "services": 7.2,
        "campusAccess": 6.0,
        "greenCalm": 5.4,
        "confidence": "medium",
        "evidenceNote": MEDIUM_IRIS,
    },
    {
        "code": "bdx-chartrons-chartrons",
        "name": "Chartrons",
        "kind": "quartier",
        "security": 7.2,
        "affordability": 4.6,
        "transport": 8.4,
        "studentEnergy": 7.0,
        "services": 8.4,
        "campusAccess": 6.4,
        "greenCalm": 6.4,
        "confidence": "medium",
        "evidenceNote": MEDIUM_IRIS,
    },
    {
        "code": "bdx-chartrons-jardin-public",
        "name": "Jardin Public / Fondaudège",
        "kind": "quartier",
        "security": 7.8,
        "affordability": 4.2,
        "transport": 8.0,
        "studentEnergy": 6.2,
        "services": 8.2,
        "campusAccess": 6.2,
        "greenCalm": 8.0,
        "confidence": "medium",
        "evidenceNote": (
            "Saint-Seurin-Fondaudège IRIS merge; Jardin Public label wider than the "
            "official IRIS footprint (medium confidence)."
        ),
    },
    {
        "code": "bdx-chartrons-grand-parc",
        "name": "Grand Parc / Ravezies",
        "kind": "quartier",
        "security": 6.4,
        "affordability": 5.8,
        "transport": 7.8,
        "studentEnergy": 7.2,
        "services": 7.4,
        "campusAccess": 6.6,
        "greenCalm": 6.8,
        "confidence": "medium",
        "evidenceNote": (
            "Chartrons-Grand Parc IRIS 5–12 span Grand Parc and Ravezies; peri-campus "
            "student fringe relabelled (medium confidence)."
        ),
    },
    {
        "code": "bdx-maritime-bassins",
        "name": "Bassins à flot / Bacalan",
        "kind": "quartier",
        "security": 6.8,
        "affordability": 5.4,
        "transport": 7.6,
        "studentEnergy": 6.8,
        "services": 7.0,
        "campusAccess": 5.8,
        "greenCalm": 6.0,
        "confidence": "medium",
        "evidenceNote": MEDIUM_IRIS,
    },
    {
        "code": "bdx-maritime-aubiers",
        "name": "Aubiers / Le Lac",
        "kind": "quartier",
        "security": 6.6,
        "affordability": 6.2,
        "transport": 7.4,
        "studentEnergy": 6.0,
        "services": 7.0,
        "campusAccess": 6.4,
        "greenCalm": 7.2,
        "confidence": "low",
        "evidenceNote": (
            "Single Chartrons-Grand Parc 13 IRIS polygon; Aubiers/Le Lac label broader "
            "than geometry (low confidence)."
        ),
    },
    {
        "code": "bdx-maritime-ginko",
        "name": "Ginko / Bordeaux-Lac",
        "kind": "quartier",
        "security": 7.4,
        "affordability": 5.6,
        "transport": 7.2,
        "studentEnergy": 5.8,
        "services": 7.4,
        "campusAccess": 5.6,
        "greenCalm": 7.8,
        "confidence": "medium",
        "evidenceNote": MEDIUM_IRIS,
    },
    {
        "code": "bdx-bastide-stalingrad",
        "name": "Bastide-Stalingrad / Jardin Botanique",
        "kind": "quartier",
        "security": 6.6,
        "affordability": 6.0,
        "transport": 8.0,
        "studentEnergy": 6.4,
        "services": 7.2,
        "campusAccess": 5.8,
        "greenCalm": 7.0,
        "confidence": "medium",
        "evidenceNote": MEDIUM_IRIS,
    },
    {
        "code": "bdx-bastide-niel",
        "name": "Bastide-Niel / Brazza / Darwin",
        "kind": "quartier",
        "security": 6.2,
        "affordability": 5.8,
        "transport": 7.8,
        "studentEnergy": 7.6,
        "services": 7.0,
        "campusAccess": 5.6,
        "greenCalm": 6.2,
        "confidence": "low",
        "evidenceNote": (
            "Single La Bastide 3 IRIS polygon; Bastide-Niel/Brazza/Darwin micro label "
            "approximate (low confidence)."
        ),
    },
    {
        "code": "bdx-bastide-benauge",
        "name": "Benauge / Galin",
        "kind": "quartier",
        "security": 6.8,
        "affordability": 6.4,
        "transport": 7.4,
        "studentEnergy": 5.6,
        "services": 6.8,
        "campusAccess": 5.4,
        "greenCalm": 6.6,
        "confidence": "medium",
        "evidenceNote": (
            "La Bastide 4–5 IRIS merge; Benauge/Galin residential east-bank label "
            "(medium confidence)."
        ),
    },
    {
        "code": "bdx-nansouty-nansouty",
        "name": "Nansouty / Barrière de Toulouse",
        "kind": "quartier",
        "security": 7.4,
        "affordability": 5.0,
        "transport": 8.2,
        "studentEnergy": 6.6,
        "services": 7.8,
        "campusAccess": 6.8,
        "greenCalm": 6.4,
        "confidence": "medium",
        "evidenceNote": MEDIUM_IRIS,
    },
    {
        "code": "bdx-nansouty-saint-genes",
        "name": "Saint-Genès / Roustaing",
        "kind": "quartier",
        "security": 7.6,
        "affordability": 4.8,
        "transport": 7.8,
        "studentEnergy": 6.0,
        "services": 7.6,
        "campusAccess": 6.6,
        "greenCalm": 6.8,
        "confidence": "medium",
        "evidenceNote": MEDIUM_IRIS,
    },
    {
        "code": "bdx-saint-augustin-augustin",
        "name": "Saint-Augustin / Pellegrin",
        "kind": "quartier",
        "security": 7.2,
        "affordability": 5.2,
        "transport": 8.0,
        "studentEnergy": 6.4,
        "services": 7.6,
        "campusAccess": 6.4,
        "greenCalm": 6.6,
        "confidence": "medium",
        "evidenceNote": MEDIUM_IRIS,
    },
    {
        "code": "bdx-saint-augustin-tauzin",
        "name": "Tauzin / Alphonse-Dupeux",
        "kind": "quartier",
        "security": 7.6,
        "affordability": 5.0,
        "transport": 7.6,
        "studentEnergy": 5.8,
        "services": 7.4,
        "campusAccess": 6.2,
        "greenCalm": 7.0,
        "confidence": "medium",
        "evidenceNote": MEDIUM_IRIS,
    },
    {
        "code": "bdx-cauderan-centre",
        "name": "Caudéran centre / Primerose",
        "kind": "quartier",
        "security": 7.8,
        "affordability": 4.6,
        "transport": 7.6,
        "studentEnergy": 5.6,
        "services": 7.8,
        "campusAccess": 6.0,
        "greenCalm": 7.4,
        "confidence": "medium",
        "evidenceNote": (
            "Villa Primerose Parc Bordelais-Caudéran IRIS 1–3 split; Caudéran micro labels "
            "span official IRIS families (medium confidence)."
        ),
    },
    {
        "code": "bdx-cauderan-parc-bordelais",
        "name": "Parc Bordelais / Monséjour",
        "kind": "quartier",
        "security": 8.2,
        "affordability": 4.4,
        "transport": 7.4,
        "studentEnergy": 5.2,
        "services": 7.6,
        "campusAccess": 5.8,
        "greenCalm": 8.6,
        "confidence": "medium",
        "evidenceNote": (
            "Villa Primerose / Lestonnat-Monséjour IRIS merge; park-adjacent residential "
            "split from broader Caudéran labels (medium confidence)."
        ),
    },
    {
        "code": "bdx-cauderan-stehelin",
        "name": "Stéhélin / Pins-Francs",
        "kind": "quartier",
        "security": 8.0,
        "affordability": 4.8,
        "transport": 7.2,
        "studentEnergy": 5.0,
        "services": 7.2,
        "campusAccess": 5.6,
        "greenCalm": 8.2,
        "confidence": "medium",
        "evidenceNote": (
            "Lestonnat-Monséjour IRIS 5–9 grouped; western Caudéran micro label "
            "(medium confidence)."
        ),
    },
    # Commune micro-areas
    {
        "code": "talence-centre-forum-peixotto",
        "name": "Talence centre / Forum / Peixotto",
        "kind": "commune",
        "security": 7.2,
        "affordability": 6.0,
        "transport": 8.0,
        "studentEnergy": 8.2,
        "services": 7.8,
        "campusAccess": 7.6,
        "greenCalm": 6.4,
        "confidence": "medium",
        "evidenceNote": MEDIUM_SUBQ,
    },
    {
        "code": "talence-campus",
        "name": "Talence campus / Arts-et-Métiers",
        "kind": "commune",
        "security": 6.8,
        "affordability": 6.4,
        "transport": 8.6,
        "studentEnergy": 9.2,
        "services": 7.4,
        "campusAccess": 9.8,
        "greenCalm": 6.8,
        "confidence": "medium",
        "evidenceNote": MEDIUM_SUBQ,
    },
    {
        "code": "talence-medoquine-roustaing",
        "name": "Talence Médoquine / Roustaing",
        "kind": "commune",
        "security": 7.6,
        "affordability": 6.2,
        "transport": 7.4,
        "studentEnergy": 6.4,
        "services": 7.2,
        "campusAccess": 7.0,
        "greenCalm": 7.6,
        "confidence": "medium",
        "evidenceNote": MEDIUM_SUBQ,
    },
    {
        "code": "talence-haut-brion",
        "name": "Talence Haut-Brion",
        "kind": "commune",
        "security": 7.0,
        "affordability": 5.4,
        "transport": 7.6,
        "studentEnergy": 6.8,
        "services": 7.0,
        "campusAccess": 8.6,
        "greenCalm": 7.2,
        "confidence": "medium",
        "evidenceNote": MEDIUM_SUBQ,
    },
    {
        "code": "pessac-saige",
        "name": "Pessac Saige",
        "kind": "commune",
        "security": 5.2,
        "affordability": 6.6,
        "transport": 8.4,
        "studentEnergy": 8.8,
        "services": 7.2,
        "campusAccess": 9.6,
        "greenCalm": 6.2,
        "confidence": "medium",
        "evidenceNote": MEDIUM_SUBQ,
    },
    {
        "code": "pessac-campus-compostelle",
        "name": "Pessac campus / Compostelle",
        "kind": "commune",
        "security": 5.8,
        "affordability": 6.2,
        "transport": 8.8,
        "studentEnergy": 9.4,
        "services": 7.8,
        "campusAccess": 10.0,
        "greenCalm": 6.6,
        "confidence": "medium",
        "evidenceNote": MEDIUM_SUBQ,
    },
    {
        "code": "pessac-centre-camponac",
        "name": "Pessac centre / Camponac",
        "kind": "commune",
        "security": 7.0,
        "affordability": 6.4,
        "transport": 7.8,
        "studentEnergy": 7.2,
        "services": 7.6,
        "campusAccess": 7.4,
        "greenCalm": 7.0,
        "confidence": "medium",
        "evidenceNote": MEDIUM_SUBQ,
    },
    {
        "code": "pessac-magonty",
        "name": "Pessac Magonty / Toctoucau",
        "kind": "commune",
        "security": 7.2,
        "affordability": 5.6,
        "transport": 7.6,
        "studentEnergy": 6.8,
        "services": 7.4,
        "campusAccess": 7.8,
        "greenCalm": 7.4,
        "confidence": "medium",
        "evidenceNote": MEDIUM_SUBQ,
    },
    {
        "code": "pessac-alouette",
        "name": "Pessac Alouette",
        "kind": "commune",
        "security": 7.8,
        "affordability": 5.8,
        "transport": 7.2,
        "studentEnergy": 6.0,
        "services": 7.4,
        "campusAccess": 7.0,
        "greenCalm": 8.6,
        "confidence": "medium",
        "evidenceNote": MEDIUM_SUBQ,
    },
    {
        "code": "pessac-bourgailh",
        "name": "Pessac Bourgailh",
        "kind": "commune",
        "security": 8.0,
        "affordability": 5.6,
        "transport": 7.4,
        "studentEnergy": 6.2,
        "services": 7.6,
        "campusAccess": 7.2,
        "greenCalm": 8.8,
        "confidence": "medium",
        "evidenceNote": MEDIUM_SUBQ,
    },
    {
        "code": "pessac-haut-leveque",
        "name": "Pessac Haut-Lévêque",
        "kind": "commune",
        "security": 8.2,
        "affordability": 5.4,
        "transport": 7.0,
        "studentEnergy": 5.8,
        "services": 7.2,
        "campusAccess": 6.8,
        "greenCalm": 9.0,
        "confidence": "medium",
        "evidenceNote": MEDIUM_SUBQ,
    },
    {
        "code": "gradignan-commune",
        "name": "Gradignan",
        "kind": "commune",
        "security": 8.0,
        "affordability": 5.8,
        "transport": 6.8,
        "studentEnergy": 6.6,
        "services": 7.4,
        "campusAccess": 8.2,
        "greenCalm": 8.8,
        "confidence": "medium",
        "evidenceNote": "Official commune contour (medium confidence).",
    },
    {
        "code": "gradignan-centre-mandavit",
        "name": "Gradignan centre / Mandavit",
        "kind": "commune",
        "security": 7.8,
        "affordability": 6.0,
        "transport": 6.6,
        "studentEnergy": 6.2,
        "services": 7.2,
        "campusAccess": 7.8,
        "greenCalm": 8.4,
        "confidence": "medium",
        "evidenceNote": GRADIGNAN_RANKINGS,
        "mapExcluded": True,
    },
    {
        "code": "gradignan-campus-beausoleil",
        "name": "Gradignan campus / Beausoleil",
        "kind": "commune",
        "security": 7.4,
        "affordability": 6.2,
        "transport": 6.4,
        "studentEnergy": 6.8,
        "services": 7.0,
        "campusAccess": 8.4,
        "greenCalm": 8.2,
        "confidence": "medium",
        "evidenceNote": GRADIGNAN_RANKINGS,
        "mapExcluded": True,
    },
    {
        "code": "gradignan-malartic-barthez",
        "name": "Gradignan Malartic / Barthez",
        "kind": "commune",
        "security": 8.2,
        "affordability": 5.8,
        "transport": 6.8,
        "studentEnergy": 6.0,
        "services": 7.4,
        "campusAccess": 7.6,
        "greenCalm": 8.6,
        "confidence": "medium",
        "evidenceNote": GRADIGNAN_RANKINGS,
        "mapExcluded": True,
    },
]


def format_place(place: dict[str, Any]) -> str:
    lines = [
        "  {",
        f'    code: "{place["code"]}",',
        f'    name: "{place["name"]}",',
        f'    kind: "{place["kind"]}",',
        f'    security: {place["security"]},',
        f'    affordability: {place["affordability"]},',
        f'    transport: {place["transport"]},',
        f'    studentEnergy: {place["studentEnergy"]},',
        f'    services: {place["services"]},',
        f'    campusAccess: {place["campusAccess"]},',
        f'    greenCalm: {place["greenCalm"]},',
        f'    confidence: "{place["confidence"]}",',
        f'    evidenceNote: "{place["evidenceNote"]}",',
    ]
    if place.get("mapExcluded"):
        lines.append("    mapExcluded: true,")
    lines.append("  },")
    return "\n".join(lines)


def render_ts() -> str:
    body = "\n".join(format_place(place) for place in PLACES)
    return f"""export interface PlaceScores {{
  security: number;
  affordability: number;
  transport: number;
  studentEnergy: number;
  services: number;
  campusAccess: number;
  greenCalm: number;
}}

export type BordeauxMicroKind = "quartier" | "commune";
export type BordeauxConfidence = "high" | "medium" | "low";

export interface BordeauxMicroPlace extends PlaceScores {{
  code: string;
  name: string;
  kind: BordeauxMicroKind;
  confidence: BordeauxConfidence;
  evidenceNote: string;
  mapExcluded?: true;
}}

export const bordeauxMicroPlaces: BordeauxMicroPlace[] = [
{body}
];
"""


def main() -> None:
    content = render_ts()
    for path in OUTPUT_PATHS:
        path.write_text(content, encoding="utf-8")
        print(f"Wrote {len(PLACES)} places to {path} ({len(content)} bytes)")


if __name__ == "__main__":
    main()