#!/usr/bin/env python3
"""Parse upgraded research markdown tables into granularity place metadata."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DOCS = ROOT / "docs" / "research"
OUT = ROOT / "scripts" / "granularity_places.json"

CODE_MAP: dict[str, dict[str, str]] = {
    "toulouse": {
        "Capitole": "toulouse-capitole",
        "Carmes / Esquirol": "toulouse-carmes-esquirol",
        "Arnaud-Bernard": "toulouse-arnaud-bernard",
        "Saint-Sernin": "toulouse-saint-sernin",
        "Compans-Caffarelli": "toulouse-compans-caffarelli",
        "Amidonniers": "toulouse-amidonniers",
        "Chalets": "toulouse-chalets",
        "Bayard / Matabiau edge": "toulouse-bayard-matabiau",
        "Saint-Aubin / Dupuy": "toulouse-saint-aubin-dupuy",
        "Saint-Cyprien": "toulouse-saint-cyprien",
        "Patte-d'Oie": "toulouse-patte-doie",
        "Saint-Michel": "toulouse-saint-michel",
        "Saint-Agne": "toulouse-saint-agne",
        "Empalot": "toulouse-empalot",
        "Rangueil campus": "toulouse-rangueil-campus",
        "Sauzelong / Jules-Julien": "toulouse-sauzelong-jules-julien",
        "Mirail Universite": "toulouse-mirail-universite",
        "Reynerie": "toulouse-reynerie",
        "Bellefontaine": "toulouse-bellefontaine",
        "Minimes": "toulouse-minimes",
        "Barriere de Paris / La Vache": "toulouse-barriere-paris-la-vache",
    },
    "lille": {
        "Lille-Centre core": "lille-centre-core",
        "Gares / Euralille": "lille-gares-euralille",
        "Vieux-Lille": "lille-vieux-lille",
        "Vauban / Catho": "lille-vauban-catho",
        "Esquermes / Cormontaigne": "lille-esquermes-cormontaigne",
        "Wazemmes core": "lille-wazemmes-core",
        "Gambetta / Solferino": "lille-gambetta-solferino",
        "Moulins campus edge": "lille-moulins-campus-edge",
        "Fives": "lille-fives",
        "Hellemmes": "lille-hellemmes",
        "Bois-Blancs / Euratechnologies": "lille-bois-blancs-euratechnologies",
        "Lille-Sud": "lille-sud",
        "Lomme / CHR": "lille-lomme-chr",
        "Cité Scientifique": "lille-vda-cite-scientifique",
        "Pont-de-Bois": "lille-vda-pont-de-bois",
        "Triolo": "lille-vda-triolo",
        "Annappes / Hotel de Ville": "lille-vda-annappes-hotel-de-ville",
        "Roubaix EDHEC / Barbieux": "lille-roubaix-edhec-barbieux",
        "Roubaix centre edge": "lille-roubaix-centre-edge",
        "La Madeleine / Romarin": "lille-madeleine-romarin",
    },
    "marseille": {
        "Saint-Charles": "marseille-saint-charles",
        "Belle de Mai": "marseille-belle-de-mai",
        "Noailles": "marseille-noailles",
        "Belsunce": "marseille-belsunce",
        "Cours Julien": "marseille-cours-julien",
        "La Plaine / Notre-Dame-du-Mont": "marseille-la-plaine-notre-dame-du-mont",
        "Lodi": "marseille-lodi",
        "Baille": "marseille-baille",
        "La Timone": "marseille-la-timone",
        "Castellane": "marseille-castellane",
        "Prefecture": "marseille-prefecture",
        "Rouet": "marseille-rouet",
        "Perier": "marseille-perier",
        "Prado / Saint-Giniez": "marseille-prado-saint-giniez",
        "Vieux-Port / Opera": "marseille-vieux-port-opera",
        "Panier / Hotel de Ville": "marseille-panier-hotel-de-ville",
        "Joliette / Euromed": "marseille-joliette-euromed",
        "Endoume / Catalans": "marseille-endoume-catalans",
        "Sainte-Anne / Mazargues": "marseille-sainte-anne-mazargues",
        "Luminy campus": "marseille-luminy-campus",
        "Saint-Jerome": "marseille-saint-jerome",
        "Chateau-Gombert": "marseille-chateau-gombert",
        "La Castellane / 15e north": "marseille-la-castellane-15e-north",
    },
    "nice": {
        "Jean-Medecin core": "nice-jean-medecin-core",
        "Carabacel": "nice-carabacel",
        "Thiers / station edge": "nice-thiers-station-edge",
        "Musiciens": "nice-musiciens",
        "Vernier": "nice-vernier",
        "Liberation": "nice-liberation",
        "Borriglione / Valrose": "nice-borriglione-valrose",
        "Saint-Maurice": "nice-saint-maurice",
        "Cimiez": "nice-cimiez",
        "Rimiez": "nice-rimiez",
        "Vieux-Nice": "nice-vieux-nice",
        "Port": "nice-port",
        "Riquier": "nice-riquier",
        "Saint-Roch": "nice-saint-roch",
        "Saint-Jean-d'Angely": "nice-saint-jean-d-angely",
        "Pasteur": "nice-pasteur",
        "Ariane": "nice-ariane",
        "Rue de France / Promenade edge": "nice-rue-de-france-promenade-edge",
        "Baumettes / Magnan": "nice-baumettes-magnan",
        "Carlone campus": "nice-carlone-campus",
        "Madeleine": "nice-madeleine",
        "Arenas / Saint-Augustin / EDHEC": "nice-arenas-saint-augustin-edhec",
    },
    "nantes": {
        "Decre / Bouffay": "nantes-decre-bouffay",
        "Commerce / Graslin": "nantes-commerce-graslin",
        "Talensac / Viarme": "nantes-talensac-viarme",
        "Hauts-Paves": "nantes-hauts-paves",
        "Saint-Felix / Michelet": "nantes-saint-felix-michelet",
        "Facultes / Petit-Port": "nantes-facultes-petit-port",
        "Joneliere": "nantes-joneliere",
        "Bout des Landes / Boissiere": "nantes-bout-des-landes-boissiere",
        "Chantrerie / Gachet": "nantes-chantrerie-gachet",
        "Saint-Joseph de Porterie": "nantes-saint-joseph-porterie",
        "Ile de Nantes west": "nantes-ile-de-nantes-west",
        "Ile de Nantes east": "nantes-ile-de-nantes-east",
        "Malakoff": "nantes-malakoff",
        "Saint-Donatien": "nantes-saint-donatien",
        "Dervallieres": "nantes-dervallieres",
        "Zola": "nantes-zola",
        "Chantenay / Sainte-Anne": "nantes-chantenay-sainte-anne",
        "Bellevue": "nantes-bellevue",
        "Breil": "nantes-breil",
        "Barberie": "nantes-barberie",
        "Doulon": "nantes-doulon",
        "Bottiere": "nantes-bottiere",
    },
}

AREA_MAP: dict[str, dict[str, str]] = {
    "toulouse": {
        "Centre": "Centre",
        "Centre north": "Centre north",
        "Centre north-east": "Centre north-east",
        "Station edge": "Station edge",
        "Centre east": "Centre east",
        "Rive gauche": "Rive gauche",
        "Centre south": "Centre south",
        "South": "South",
        "South-east campus": "South-east campus",
        "South-east": "South-east",
        "South-west campus": "South-west campus",
        "South-west": "South-west",
        "North": "North",
    },
}

ROW_RE = re.compile(
    r"^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*"
    r"([\d.]+)\s*/\s*([\d.]+)\s*/\s*([\d.]+)\s*/\s*([\d.]+)\s*/\s*([\d.]+)\s*/\s*([\d.]+)\s*/\s*([\d.]+)\s*\|",
    re.MULTILINE,
)


def is_table_row(micro: str) -> bool:
    if not micro or micro.startswith("-") or "Micro-area" in micro:
        return False
    return bool(re.search(r"[A-Za-zÀ-ÿ]", micro))


def parse_city(city_id: str, path: Path) -> list[dict[str, object]]:
    text = path.read_text(encoding="utf-8")
    rows: list[dict[str, object]] = []
    for match in ROW_RE.finditer(text):
        micro, parent, geom_target, *score_vals = match.groups()
        micro = micro.strip()
        if not is_table_row(micro):
            continue
        parent = parent.strip()
        code = CODE_MAP[city_id].get(micro)
        if not code:
            raise SystemExit(f"Missing code mapping for {city_id}: {micro}")
        scores = {
            "security": float(score_vals[0]),
            "affordability": float(score_vals[1]),
            "transport": float(score_vals[2]),
            "studentEnergy": float(score_vals[3]),
            "services": float(score_vals[4]),
            "campusAccess": float(score_vals[5]),
            "greenCalm": float(score_vals[6]),
        }
        geom_target = geom_target.strip()
        geom_lower = geom_target.lower()
        if "official quartier" in geom_lower and "iris" not in geom_lower:
            confidence = "high"
        elif "low" in geom_lower:
            confidence = "low"
        else:
            confidence = "medium"
        rows.append(
            {
                "code": code,
                "name": micro,
                "parent": parent,
                "area": parent,
                "scores": scores,
                "confidence": confidence,
                "geomTarget": geom_target,
                "evidence": (
                    f"{geom_target} geometry from {path.name} "
                    f"({confidence} confidence)."
                ),
            }
        )
    expected = len(CODE_MAP[city_id])
    if len(rows) != expected:
        raise SystemExit(f"{city_id}: parsed {len(rows)} rows, expected {expected}")
    return rows


def main() -> None:
    cities = {
        "toulouse": DOCS / "toulouse-student-life.md",
        "lille": DOCS / "lille-student-life.md",
        "marseille": DOCS / "marseille-student-life.md",
        "nice": DOCS / "nice-student-life.md",
        "nantes": DOCS / "nantes-student-life.md",
    }
    payload = {city_id: parse_city(city_id, path) for city_id, path in cities.items()}
    OUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    for city_id, rows in payload.items():
        print(f"{city_id}: {len(rows)} places -> {OUT}")


if __name__ == "__main__":
    main()