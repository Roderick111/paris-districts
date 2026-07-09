#!/usr/bin/env python3
"""Generate district PlaceScore rows from merged micro-area scores."""

from __future__ import annotations

import re
import subprocess
from pathlib import Path
from statistics import mean

ROOT = Path(__file__).resolve().parents[1]
KEYS = (
    "security",
    "affordability",
    "transport",
    "studentEnergy",
    "services",
    "campusAccess",
    "greenCalm",
)


def parse_places(content: str) -> dict[str, dict]:
    blocks = re.findall(
        r'code:\s*"([^"]+)"[\s\S]*?scores:\s*\{([\s\S]*?)\}[\s\S]*?rentLevel:\s*"([^"]+)"[\s\S]*?studentFit:\s*"([^"]+)"[\s\S]*?summary:\s*"([^"]+)"[\s\S]*?caveat:\s*"([^"]+)"',
        content,
    )
    places: dict[str, dict] = {}
    for code, body, rent, fit, summary, caveat in blocks:
        scores = {
            key: float(value)
            for key, value in re.findall(
                r"(security|affordability|transport|studentEnergy|services|campusAccess|greenCalm):\s*([0-9.]+)",
                body,
            )
        }
        places[code] = {
            "scores": scores,
            "rentLevel": rent,
            "studentFit": fit,
            "summary": summary,
            "caveat": caveat,
        }
    return places


def load_places(path: Path) -> dict[str, dict]:
    return parse_places(path.read_text(encoding="utf-8"))


def load_legacy_places(city: str) -> dict[str, dict]:
    """Load pre-rebuild micro-area scores from git HEAD for idempotent regeneration."""
    rel = f"src/data/{city}Places.ts"
    try:
        content = subprocess.check_output(
            ["git", "show", f"HEAD:{rel}"],
            text=True,
            stderr=subprocess.DEVNULL,
        )
        places = parse_places(content)
        if places:
            return places
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass

    cache_path = ROOT / "scripts" / f"legacy_{city}_places.json"
    if cache_path.exists():
        import json

        payload = json.loads(cache_path.read_text(encoding="utf-8"))
        return payload

    current = ROOT / rel
    if current.exists():
        return load_places(current)

    raise SystemExit(f"Could not load legacy PlaceScore source for {city}")


def avg_scores(codes: list[str], places: dict[str, dict]) -> dict[str, float]:
    missing = [code for code in codes if code not in places]
    if missing:
        raise KeyError(f"Missing legacy PlaceScore rows for merge: {missing}")
    return {key: round(mean(places[code]["scores"][key] for code in codes), 1) for key in KEYS}


def context_scores(transport: float = 7.0) -> dict[str, float]:
    return {
        "security": 6.0,
        "affordability": 5.8,
        "transport": transport,
        "studentEnergy": 5.8,
        "services": 6.8,
        "campusAccess": 6.2,
        "greenCalm": 6.2,
    }


def low_relevance_scores() -> dict[str, float]:
    return {
        "security": 6.2,
        "affordability": 5.6,
        "transport": 6.5,
        "studentEnergy": 4.5,
        "services": 6.2,
        "campusAccess": 5.8,
        "greenCalm": 6.8,
    }


def write_ts(path: Path, export_name: str, city_id: str, rows: list[dict]) -> None:
    lines = ['import type { PlaceScore } from "@/data/cities";', "", f"export const {export_name}: PlaceScore[] = ["]
    for row in rows:
        scores = ", ".join(f"{key}: {row['scores'][key]}" for key in KEYS)
        lines.extend(
            [
                "  {",
                f'    id: "{row["code"]}", cityId: "{city_id}", name: "{row["name"]}", code: "{row["code"]}", kind: "quartier",',
                f'    area: "{row["area"]}", granularity: "micro", parentName: "{row["parent"]}",',
                f'    confidence: "{row["confidence"]}", coverageRole: "{row["role"]}", geometryBasis: "{row["basis"]}",',
                f'    evidenceNote: "{row["evidence"]}",',
                f"    scores: {{ {scores} }},",
                f'    rentLevel: "{row["rent"]}", studentFit: "{row["fit"]}",',
                f'    summary: "{row["summary"]}",',
                f'    caveat: "{row["caveat"]}"',
                "  },",
            ]
        )
    lines.append("];")
    lines.append("")
    path.write_text("\n".join(lines), encoding="utf-8")


def build_toulouse(old: dict[str, dict]) -> list[dict]:
    def row(
        code: str,
        name: str,
        area: str,
        parent: str,
        role: str,
        basis: str,
        confidence: str,
        sources: list[str],
        *,
        scores: dict[str, float] | None = None,
        rent: str | None = None,
        fit: str | None = None,
        summary: str | None = None,
        caveat: str | None = None,
    ) -> dict:
        merged = scores or avg_scores(sources, old)
        base = old[sources[0]]
        return {
            "code": code,
            "name": name,
            "area": area,
            "parent": parent,
            "role": role,
            "basis": basis,
            "confidence": confidence,
            "scores": merged,
            "rent": rent or base["rentLevel"],
            "fit": fit or base["studentFit"],
            "summary": summary or base["summary"],
            "caveat": caveat or base["caveat"],
            "evidence": f"Official district group from toulouse-student-life.md; merged from {len(sources)} micro rows.",
        }

    return [
        row(
            "toulouse-capitole-carmes",
            "Capitole / Carmes / Esquirol",
            "Centre",
            "Centre",
            "primary",
            "iris_district_partition",
            "medium",
            ["toulouse-capitole", "toulouse-carmes-esquirol"],
            summary="Expensive historic centre with strongest services and transit.",
            caveat="Premium central rent; comfort varies block to block.",
        ),
        row(
            "toulouse-arnaud-bernard-saint-sernin",
            "Arnaud-Bernard / Saint-Sernin",
            "Centre",
            "Centre",
            "risk_cap",
            "iris_district_partition",
            "high",
            ["toulouse-arnaud-bernard", "toulouse-saint-sernin"],
            summary="Central student energy with a visible safety cap.",
            caveat="Social life is real; safety cap still applies.",
        ),
        row(
            "toulouse-amidonniers-compans",
            "Amidonniers / Compans-Caffarelli",
            "Centre north",
            "Centre north",
            "primary",
            "official_quartier",
            "medium",
            ["toulouse-amidonniers", "toulouse-compans-caffarelli"],
        ),
        row(
            "toulouse-chalets-bayard-saint-aubin",
            "Chalets / Bayard / Saint-Aubin / Dupuy",
            "Centre east",
            "Centre east",
            "primary",
            "official_quartier",
            "medium",
            ["toulouse-chalets", "toulouse-bayard-matabiau", "toulouse-saint-aubin-dupuy"],
        ),
        {
            "code": "toulouse-bonnefoy-marengo",
            "name": "Bonnefoy / Marengo / Lapujade",
            "area": "Station east",
            "parent": "Station east",
            "role": "context",
            "basis": "official_quartier",
            "confidence": "medium",
            "scores": context_scores(8.2),
            "rent": "medium",
            "fit": "mixed",
            "summary": "Practical station-east belt with tolerable value and metro access.",
            "caveat": "Useful connector, not a headline student hub.",
            "evidence": "Official Toulouse quartier; broad district context score.",
        },
        row(
            "toulouse-saint-cyprien",
            "Saint-Cyprien",
            "Rive gauche",
            "Rive gauche",
            "primary",
            "official_quartier",
            "high",
            ["toulouse-saint-cyprien"],
        ),
        {
            "code": "toulouse-croix-pierre-route-espagne",
            "name": "Croix-de-Pierre / Route d'Espagne",
            "area": "South-west",
            "parent": "South-west",
            "role": "context",
            "basis": "official_quartier",
            "confidence": "medium",
            "scores": avg_scores(["toulouse-patte-doie"], old),
            "rent": "medium",
            "fit": "good",
            "summary": "South-west value corridor with metro access.",
            "caveat": "Residential belt, less central social energy.",
            "evidence": "Official Toulouse quartier; aligned with south-west value corridor.",
        },
        {
            "code": "toulouse-arenes-bagatelle-papus",
            "name": "Arènes / Bagatelle / Papus / Fontaine-Lestang",
            "area": "South-west",
            "parent": "South-west",
            "role": "risk_cap",
            "basis": "official_quartier",
            "confidence": "high",
            "scores": {
                "security": 4.0,
                "affordability": 6.8,
                "transport": 8.0,
                "studentEnergy": 6.5,
                "services": 6.8,
                "campusAccess": 7.8,
                "greenCalm": 5.4,
            },
            "rent": "lower",
            "fit": "mixed",
            "summary": "Value belt with metro access and a visible safety cap.",
            "caveat": "Cheap rent cannot offset reputation pockets.",
            "evidence": "Official Toulouse quartier; south-west value with cap.",
        },
        {
            "code": "toulouse-casselardit-cartoucherie",
            "name": "Casselardit / Cartoucherie",
            "area": "West",
            "parent": "West",
            "role": "context",
            "basis": "official_quartier",
            "confidence": "medium",
            "scores": context_scores(7.8),
            "rent": "medium",
            "fit": "mixed",
            "summary": "Redeveloping west belt with mixed student utility.",
            "caveat": "Changing area; block choice still matters.",
            "evidence": "Official Toulouse quartier; west redevelopment context.",
        },
        row(
            "toulouse-minimes-barriere-paris",
            "Minimes / Barrière de Paris / Ponts-Jumeaux",
            "North",
            "North",
            "primary",
            "official_quartier",
            "medium",
            ["toulouse-minimes", "toulouse-barriere-paris-la-vache"],
        ),
        {
            "code": "toulouse-sept-deniers-lalande",
            "name": "Sept-Deniers / Lalande",
            "area": "North",
            "parent": "North",
            "role": "context",
            "basis": "official_quartier",
            "confidence": "low",
            "scores": context_scores(7.5),
            "rent": "medium",
            "fit": "mixed",
            "summary": "Northern residential edge with moderate tram value.",
            "caveat": "Peripheral comfort, weaker student scene.",
            "evidence": "Official Toulouse quartier; northern residential context.",
        },
        {
            "code": "toulouse-borderouge-croix-daurade",
            "name": "Borderouge / Croix-Daurade / Trois Cocus",
            "area": "North-east",
            "parent": "North-east",
            "role": "context",
            "basis": "official_quartier",
            "confidence": "medium",
            "scores": context_scores(7.8),
            "rent": "medium",
            "fit": "mixed",
            "summary": "North-east residential belt with metro access.",
            "caveat": "Family-oriented edge, not a nightlife hub.",
            "evidence": "Official Toulouse quartier; north-east context.",
        },
        {
            "code": "toulouse-jolimont-roseraie-soupetard",
            "name": "Jolimont / Roseraie / Soupetard / Gramont",
            "area": "East",
            "parent": "East",
            "role": "context",
            "basis": "official_quartier",
            "confidence": "medium",
            "scores": context_scores(8.0),
            "rent": "medium",
            "fit": "mixed",
            "summary": "East metro/value belt with practical daily life.",
            "caveat": "Useful compromise, not central lifestyle.",
            "evidence": "Official Toulouse quartier; east metro belt context.",
        },
        {
            "code": "toulouse-guilhemery-cote-pavee",
            "name": "Guilheméry / Côte Pavée / Château de l'Hers",
            "area": "East",
            "parent": "East",
            "role": "context",
            "basis": "official_quartier",
            "confidence": "medium",
            "scores": {
                "security": 6.8,
                "affordability": 4.8,
                "transport": 7.8,
                "studentEnergy": 6.0,
                "services": 7.4,
                "campusAccess": 7.0,
                "greenCalm": 7.2,
            },
            "rent": "medium",
            "fit": "mixed",
            "summary": "Calmer east-side belt with higher comfort, weaker student energy.",
            "caveat": "Residential quality over student nightlife.",
            "evidence": "Official Toulouse quartier; calmer east residential context.",
        },
        {
            "code": "toulouse-demoiselles-montaudran",
            "name": "Pont des Demoiselles / Montaudran",
            "area": "South-east",
            "parent": "South-east",
            "role": "context",
            "basis": "official_quartier",
            "confidence": "low",
            "scores": context_scores(7.6),
            "rent": "medium",
            "fit": "mixed",
            "summary": "South-east connector with aerospace/work edge character.",
            "caveat": "Useful for links, not a student social hub.",
            "evidence": "Official Toulouse quartier; south-east connector context.",
        },
        row(
            "toulouse-rangueil-sauzelong",
            "Rangueil / Sauzelong / Pech-David / Pouvourville",
            "South-east campus",
            "South-east campus",
            "campus",
            "official_quartier",
            "high",
            ["toulouse-rangueil-campus", "toulouse-sauzelong-jules-julien"],
            fit="excellent",
            summary="Main Paul-Sabatier campus axis with strong university access.",
            caveat="Best for campus-first students, not historic-centre lifestyle.",
        ),
        row(
            "toulouse-saint-michel-saint-agne",
            "Saint-Michel / Saint-Agne / Busca",
            "Centre south",
            "Centre south",
            "primary",
            "iris_district_partition",
            "medium",
            ["toulouse-saint-michel", "toulouse-saint-agne"],
        ),
        row(
            "toulouse-empalot-ramier",
            "Empalot / Ile du Ramier",
            "Centre south",
            "Centre south",
            "risk_cap",
            "iris_district_partition",
            "medium",
            ["toulouse-empalot"],
            summary="South value pocket with a visible safety cap.",
            caveat="Cheap rent cannot offset the risk profile.",
        ),
        {
            "code": "toulouse-purpan-saint-martin",
            "name": "Purpan / Saint-Martin-du-Touch",
            "area": "North-west campus",
            "parent": "North-west campus",
            "role": "campus",
            "basis": "official_quartier",
            "confidence": "high",
            "scores": {
                "security": 6.5,
                "affordability": 5.6,
                "transport": 7.8,
                "studentEnergy": 6.8,
                "services": 7.2,
                "campusAccess": 9.0,
                "greenCalm": 6.4,
            },
            "rent": "medium",
            "fit": "good",
            "summary": "Purpan and aerospace campus-work belt west of centre.",
            "caveat": "Campus access is real; social life is quieter than centre.",
            "evidence": "Official Toulouse quartier; Purpan campus belt.",
        },
        {
            "code": "toulouse-lardenne-pradettes-basso-cambo",
            "name": "Lardenne / Pradettes / Basso-Cambo",
            "area": "West",
            "parent": "West",
            "role": "context",
            "basis": "official_quartier",
            "confidence": "medium",
            "scores": context_scores(7.4),
            "rent": "medium",
            "fit": "mixed",
            "summary": "West residential belt toward metro terminus.",
            "caveat": "Peripheral west comfort, weaker student scene.",
            "evidence": "Official Toulouse quartier; west residential context.",
        },
        row(
            "toulouse-mirail-reynerie-bellefontaine",
            "Mirail-Université / Reynerie / Bellefontaine",
            "South-west campus",
            "South-west campus",
            "risk_cap",
            "official_quartier",
            "high",
            ["toulouse-mirail-universite", "toulouse-reynerie", "toulouse-bellefontaine"],
            summary="University access with a hard safety cap across the belt.",
            caveat="Campus links cannot offset the risk profile.",
        ),
        {
            "code": "toulouse-saint-simon-lafourguette-oncopole",
            "name": "Saint-Simon / Lafourguette / Oncopole",
            "area": "South-west periphery",
            "parent": "South-west periphery",
            "role": "low_relevance",
            "basis": "official_quartier",
            "confidence": "low",
            "scores": low_relevance_scores(),
            "rent": "medium",
            "fit": "weak",
            "summary": "Peripheral south-west context with weak student relevance.",
            "caveat": "Coverage filler, not a student housing target.",
            "evidence": "Official Toulouse quartier; peripheral low-relevance context.",
        },
    ]


def build_nantes(old: dict[str, dict]) -> list[dict]:
    merges = {
        "nantes-centre-bouffay-commerce": (
            "Centre-ville / Bouffay / Commerce / Graslin",
            "Centre-ville",
            "primary",
            ["nantes-decre-bouffay", "nantes-commerce-graslin"],
        ),
        "nantes-talensac-viarme-hauts-paves": (
            "Talensac / Viarme / Hauts-Pavés",
            "Hauts-Pavés - Saint-Félix",
            "primary",
            ["nantes-talensac-viarme", "nantes-hauts-paves"],
        ),
        "nantes-saint-felix-michelet": (
            "Saint-Félix / Michelet",
            "Hauts-Pavés - Saint-Félix",
            "campus",
            ["nantes-saint-felix-michelet"],
        ),
        "nantes-facultes-petit-port": (
            "Facultés / Petit-Port",
            "Nantes Nord",
            "campus",
            ["nantes-facultes-petit-port", "nantes-joneliere"],
        ),
        "nantes-nord-context": (
            "Nantes Nord context",
            "Nantes Nord",
            "context",
            ["nantes-bout-des-landes-boissiere"],
        ),
        "nantes-chantrerie-gachet": (
            "Chantrerie / Gachet",
            "Nantes Erdre",
            "campus",
            ["nantes-chantrerie-gachet"],
        ),
        "nantes-erdre-context": (
            "Saint-Joseph / Nantes Erdre context",
            "Nantes Erdre",
            "context",
            ["nantes-saint-joseph-porterie"],
        ),
        "nantes-ile-west-centre": (
            "Ile de Nantes west / centre",
            "Ile de Nantes",
            "primary",
            ["nantes-ile-de-nantes-west"],
        ),
        "nantes-ile-east": (
            "Ile de Nantes east",
            "Ile de Nantes",
            "context",
            ["nantes-ile-de-nantes-east"],
        ),
        "nantes-malakoff": ("Malakoff", "Malakoff - Saint-Donatien", "risk_cap", ["nantes-malakoff"]),
        "nantes-saint-donatien": (
            "Saint-Donatien",
            "Malakoff - Saint-Donatien",
            "primary",
            ["nantes-saint-donatien"],
        ),
        "nantes-dervallieres-zola": (
            "Dervallières / Zola",
            "Dervallières - Zola",
            "risk_cap",
            ["nantes-dervallieres", "nantes-zola"],
        ),
        "nantes-bellevue-chantenay-sainte-anne": (
            "Bellevue / Chantenay / Sainte-Anne",
            "Bellevue - Chantenay - Sainte-Anne",
            "risk_cap",
            ["nantes-bellevue", "nantes-chantenay-sainte-anne"],
        ),
        "nantes-breil-barberie": (
            "Breil / Barberie",
            "Breil - Barberie",
            "context",
            ["nantes-breil", "nantes-barberie"],
        ),
        "nantes-doulon-bottiere": (
            "Doulon / Bottière",
            "Doulon - Bottière",
            "context",
            ["nantes-doulon", "nantes-bottiere"],
        ),
    }
    rows = []
    for code, (name, area, role, sources) in merges.items():
        scores = avg_scores(sources, old)
        base = old[sources[0]]
        rows.append(
            {
                "code": code,
                "name": name,
                "area": area,
                "parent": area,
                "role": role,
                "basis": "iris_district_partition",
                "confidence": "medium" if role == "context" else "high",
                "scores": scores,
                "rent": base["rentLevel"],
                "fit": base["studentFit"],
                "summary": base["summary"],
                "caveat": base["caveat"],
                "evidence": f"Nantes IRIS district from nantes-student-life.md; merged from {len(sources)} micro rows.",
            }
        )
    for row in rows:
        if row["role"] == "context" and row["code"] == "nantes-nord-context":
            row["confidence"] = "low"
    rows.append(
        {
            "code": "nantes-sud",
            "name": "Nantes Sud",
            "area": "Nantes Sud",
            "parent": "Nantes Sud",
            "role": "context",
            "basis": "iris_district_partition",
            "confidence": "low",
            "scores": context_scores(7.2),
            "rent": "medium",
            "fit": "weak",
            "summary": "South Loire context with lower student relevance.",
            "caveat": "Honest broad district score; not a campus or nightlife pick.",
            "evidence": "Nantes IRIS partition; south Loire context coverage.",
        }
    )
    return rows


def build_nice(old: dict[str, dict]) -> list[dict]:
    merges = {
        "nice-vieux-nice-port": ("Vieux-Nice / Port / Garibaldi", "Historic centre", "primary", ["nice-vieux-nice", "nice-port"]),
        "nice-jean-medecin-massena": ("Jean-Médecin / Masséna", "Centre", "primary", ["nice-jean-medecin-core", "nice-carabacel"]),
        "nice-thiers-musiciens": ("Thiers / Musiciens", "Centre west", "primary", ["nice-thiers-station-edge", "nice-musiciens"]),
        "nice-liberation-valrose": ("Libération / Borriglione / Valrose", "North centre campus", "campus", ["nice-liberation", "nice-borriglione-valrose"]),
        "nice-vernier-saint-maurice": ("Vernier / Saint-Maurice", "North centre", "primary", ["nice-vernier", "nice-saint-maurice"]),
        "nice-cimiez": ("Cimiez", "North-east hills", "context", ["nice-cimiez"]),
        "nice-rimiez-gairaut": ("Rimiez / Gairaut", "North-east hills", "low_relevance", ["nice-rimiez"]),
        "nice-riquier-saint-roch": ("Riquier / Saint-Roch", "East inner city", "context", ["nice-riquier", "nice-saint-roch"]),
        "nice-saint-jean-angely": ("Saint-Jean-d'Angély", "East campus", "campus", ["nice-saint-jean-d-angely"]),
        "nice-pasteur": ("Pasteur", "East", "risk_cap", ["nice-pasteur"]),
        "nice-ariane": ("Ariane", "North-east edge", "risk_cap", ["nice-ariane"]),
        "nice-carre-or-rue-france": ("Carré d'Or / Rue de France / Promenade", "Centre west coast", "primary", ["nice-rue-de-france-promenade-edge"]),
        "nice-baumettes-magnan": ("Baumettes / Magnan", "West coast", "primary", ["nice-baumettes-magnan"]),
        "nice-carlone": ("Carlone / Fac de Lettres", "West campus", "campus", ["nice-carlone-campus"]),
        "nice-madeleine": ("Madeleine", "West valley", "context", ["nice-madeleine"]),
        "nice-arenas-saint-augustin": ("Arenas / Saint-Augustin / EDHEC", "West airport", "campus", ["nice-arenas-saint-augustin-edhec"]),
    }
    rows = []
    for code, (name, area, role, sources) in merges.items():
        scores = avg_scores(sources, old)
        base = old[sources[0]]
        rows.append(
            {
                "code": code,
                "name": name,
                "area": area,
                "parent": area,
                "role": role,
                "basis": "iris_district_partition",
                "confidence": "medium" if role in {"primary", "context"} else "high",
                "scores": scores,
                "rent": base["rentLevel"],
                "fit": base["studentFit"],
                "summary": base["summary"],
                "caveat": base["caveat"],
                "evidence": f"Nice IRIS district from nice-student-life.md; merged from {len(sources)} micro rows.",
            }
        )
    rows.extend(
        [
            {
                "code": "nice-fabron-lanterne",
                "name": "Fabron / Lanterne",
                "area": "West hills",
                "parent": "West hills",
                "role": "context",
                "basis": "iris_district_partition",
                "confidence": "low",
                "scores": context_scores(7.0),
                "rent": "medium",
                "fit": "mixed",
                "summary": "West residential hill/coast context.",
                "caveat": "Coverage context, not a primary student pick.",
                "evidence": "Nice IRIS partition; west residential context.",
            },
            {
                "code": "nice-moulins-caucade",
                "name": "Moulins / Caucade",
                "area": "West",
                "parent": "West",
                "role": "risk_cap",
                "basis": "iris_district_partition",
                "confidence": "high",
                "scores": {
                    "security": 4.2,
                    "affordability": 6.8,
                    "transport": 7.2,
                    "studentEnergy": 5.5,
                    "services": 6.8,
                    "campusAccess": 6.5,
                    "greenCalm": 5.8,
                },
                "rent": "lower",
                "fit": "mixed",
                "summary": "West value belt with visible safety cap.",
                "caveat": "Do not merge away cap pockets.",
                "evidence": "Nice IRIS partition; west value/cap belt.",
            },
            {
                "code": "nice-saint-isidore-cremat",
                "name": "Saint-Isidore / Crémat",
                "area": "Far west",
                "parent": "Far west",
                "role": "low_relevance",
                "basis": "iris_district_partition",
                "confidence": "low",
                "scores": low_relevance_scores(),
                "rent": "medium",
                "fit": "weak",
                "summary": "Far-west context with weak student utility.",
                "caveat": "Car-oriented periphery, not a student default.",
                "evidence": "Nice IRIS partition; peripheral low relevance.",
            },
            {
                "code": "nice-mont-boron-mont-alban",
                "name": "Mont Boron / Mont Alban",
                "area": "East hills",
                "parent": "East hills",
                "role": "context",
                "basis": "iris_district_partition",
                "confidence": "medium",
                "scores": {
                    "security": 7.8,
                    "affordability": 3.2,
                    "transport": 6.5,
                    "studentEnergy": 4.8,
                    "services": 7.2,
                    "campusAccess": 6.2,
                    "greenCalm": 8.6,
                },
                "rent": "very high",
                "fit": "good",
                "summary": "Premium east hill/littoral comfort with weak value.",
                "caveat": "Quality-of-life context, not student value.",
                "evidence": "Nice IRIS partition; premium east hill context.",
            },
        ]
    )
    return rows


def main() -> None:
    toulouse_old = load_legacy_places("toulouse")
    nantes_old = load_legacy_places("nantes")
    nice_old = load_legacy_places("nice")

    write_ts(ROOT / "src/data/toulousePlaces.ts", "toulouseMicroPlaces", "toulouse", build_toulouse(toulouse_old))
    write_ts(ROOT / "src/data/nantesPlaces.ts", "nantesMicroPlaces", "nantes", build_nantes(nantes_old))
    print("Wrote toulouse, nantes PlaceScore files (nice: official-quartier rows live in src/data/nicePlaces.ts)")


if __name__ == "__main__":
    main()