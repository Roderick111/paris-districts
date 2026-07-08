#!/usr/bin/env python3
"""Generate five city PlaceScore TypeScript files from research score tables."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src" / "data"

WEIGHTS = {
    "security": 3.0,
    "affordability": 1.6,
    "transport": 1.4,
    "studentEnergy": 1.2,
    "services": 1.0,
    "campusAccess": 1.0,
    "greenCalm": 0.8,
}


def security_cap(security: float) -> float:
    if security < 3:
        return 3.4
    if security < 4:
        return 4.4
    if security < 5:
        return 5.2
    if security < 6:
        return 6.2
    if security < 7:
        return 7.0
    if security < 8:
        return 7.8
    return 10.0


def weighted_total(scores: dict[str, float]) -> float:
    max_weighted = sum(weight * 10 for weight in WEIGHTS.values())
    total = sum(scores[key] * WEIGHTS[key] for key in WEIGHTS)
    raw = (total / max_weighted) * 10 if max_weighted else 0
    return round(min(raw, security_cap(scores["security"])), 1)


def rent_level(affordability: float) -> str:
    if affordability < 3:
        return "very high"
    if affordability < 5:
        return "high"
    if affordability < 6.5:
        return "medium"
    return "lower"


def student_fit(scores: dict[str, float], total: float) -> str:
    security = scores["security"]
    campus = scores["campusAccess"]
    if total >= 7:
        return "mixed" if security < 5 else "excellent"
    if total >= 6.2:
        return "mixed" if security < 5 else "good"
    if total >= 5.2:
        return "mixed"
    return "mixed" if campus >= 8 else "weak"


def render_place(city_id: str, place: dict[str, object]) -> str:
    scores = place["scores"]
    total = weighted_total(scores)  # type: ignore[arg-type]
    rent = rent_level(scores["affordability"])  # type: ignore[index]
    fit = student_fit(scores, total)  # type: ignore[arg-type]
    confidence = place.get("confidence", "medium")
    lines = [
        "  {",
        f'    id: "{place["code"]}", cityId: "{city_id}", name: "{place["name"]}", '
        f'code: "{place["code"]}", kind: "quartier",',
        f'    area: "{place["area"]}", granularity: "micro", parentName: "{place["parent"]}",',
        f'    confidence: "{confidence}",',
        f'    evidenceNote: "{place["evidence"]}",',
        "    scores: {",
    ]
    for key in WEIGHTS:
        lines.append(f'      {key}: {scores[key]},')  # type: ignore[index]
    lines[-1] = lines[-1].rstrip(",")
    lines.extend(
        [
            "    },",
            f'    rentLevel: "{rent}", studentFit: "{fit}",',
            f'    summary: "{place["summary"]}", caveat: "{place["caveat"]}"',
            "  },",
        ]
    )
    return "\n".join(lines)


def _place(
    code: str,
    name: str,
    parent: str,
    area: str,
    scores: dict[str, float],
    summary: str,
    caveat: str,
    evidence: str,
    confidence: str = "medium",
) -> dict[str, object]:
    return {
        "code": code,
        "name": name,
        "parent": parent,
        "area": area,
        "scores": scores,
        "summary": summary,
        "caveat": caveat,
        "evidence": evidence,
        "confidence": confidence,
    }


def write_city_file(city_id: str, export_name: str, places: list[dict[str, object]]) -> None:
    body = "\n".join(render_place(city_id, place) for place in places)
    content = (
        'import type { PlaceScore } from "@/data/cities";\n\n'
        f"export const {export_name}: PlaceScore[] = [\n{body}\n];\n"
    )
    path = SRC / f"{city_id}Places.ts"
    path.write_text(content, encoding="utf-8")
    print(f"Wrote {path} ({len(places)} places)")


CITY_PLACES: dict[str, tuple[str, list[dict[str, object]]]] = {
    "toulouse": (
        "toulouseMicroPlaces",
        [
            {
                "code": "toulouse-capitole-carmes-esquirol",
                "name": "Capitole / Carmes / Esquirol",
                "parent": "Centre",
                "area": "Centre",
                "scores": {
                    "security": 5.8,
                    "affordability": 2.4,
                    "transport": 9.6,
                    "studentEnergy": 8.8,
                    "services": 9.3,
                    "campusAccess": 8.8,
                    "greenCalm": 4.2,
                },
                "summary": "Useful and beautiful centre with strong services, but rent and tourist exposure hold it down.",
                "caveat": "Do not pay prestige rents for a rough old studio near the party core.",
                "evidence": "Split from official Capitole / Arnaud Bernard / Carmes quartier (medium confidence).",
                "confidence": "medium",
            },
            {
                "code": "toulouse-arnaud-bernard-saint-sernin",
                "name": "Arnaud-Bernard / Saint-Sernin",
                "parent": "Centre",
                "area": "Centre",
                "scores": {
                    "security": 4.9,
                    "affordability": 4.2,
                    "transport": 9.0,
                    "studentEnergy": 9.4,
                    "services": 8.4,
                    "campusAccess": 9.0,
                    "greenCalm": 3.8,
                },
                "summary": "High-energy student streets near Saint-Sernin, but disorder and late-night friction are real.",
                "caveat": "Energy is real; comfort is not — stay a high-friction pick, not a generic centre score.",
                "evidence": "Split from official Capitole / Arnaud Bernard / Carmes quartier (low confidence).",
                "confidence": "low",
            },
            {
                "code": "toulouse-compans-amidonniers",
                "name": "Compans / Amidonniers",
                "parent": "Centre",
                "area": "Centre",
                "scores": {
                    "security": 6.8,
                    "affordability": 3.8,
                    "transport": 8.8,
                    "studentEnergy": 7.2,
                    "services": 8.4,
                    "campusAccess": 8.0,
                    "greenCalm": 7.0,
                },
                "summary": "Calmer central compromise with better green calm than the party districts.",
                "caveat": "Good if you want centre access without Arnaud-Bernard chaos.",
                "evidence": "Official Toulouse quartier polygon (medium confidence).",
            },
            {
                "code": "toulouse-chalets-bayard-saint-aubin",
                "name": "Chalets / Bayard / Saint-Aubin",
                "parent": "Centre",
                "area": "Centre",
                "scores": {
                    "security": 6.2,
                    "affordability": 3.6,
                    "transport": 9.0,
                    "studentEnergy": 8.4,
                    "services": 8.4,
                    "campusAccess": 8.2,
                    "greenCalm": 4.8,
                },
                "summary": "Lively east-centre belt with strong services and metro access.",
                "caveat": "Still expensive and not especially calm.",
                "evidence": "Official Toulouse quartier polygon (medium confidence).",
            },
            {
                "code": "toulouse-saint-cyprien-patte-doie",
                "name": "Saint-Cyprien / Patte-d'Oie",
                "parent": "Rive gauche",
                "area": "Rive gauche",
                "scores": {
                    "security": 6.7,
                    "affordability": 4.8,
                    "transport": 8.8,
                    "studentEnergy": 8.5,
                    "services": 8.2,
                    "campusAccess": 8.0,
                    "greenCalm": 6.0,
                },
                "summary": "Best centre-adjacent compromise on the left bank with relative value and student life.",
                "caveat": "Strong first-pass pick, but not a campus-default like Rangueil.",
                "evidence": "Official Toulouse quartier polygon (medium confidence).",
            },
            {
                "code": "toulouse-saint-michel-saint-agne",
                "name": "Saint-Michel / Saint-Agne",
                "parent": "Centre south",
                "area": "Centre south",
                "scores": {
                    "security": 5.4,
                    "affordability": 5.4,
                    "transport": 8.8,
                    "studentEnergy": 8.4,
                    "services": 8.0,
                    "campusAccess": 8.8,
                    "greenCalm": 4.5,
                },
                "summary": "Useful south-centre student belt with metro and campus links.",
                "caveat": "Split from a large official quartier; block choice still matters.",
                "evidence": "Split from Saint-Michel / Empalot official quartier (medium confidence).",
            },
            {
                "code": "toulouse-empalot",
                "name": "Empalot",
                "parent": "Centre south",
                "area": "Centre south",
                "scores": {
                    "security": 4.4,
                    "affordability": 7.0,
                    "transport": 8.0,
                    "studentEnergy": 6.0,
                    "services": 6.8,
                    "campusAccess": 8.0,
                    "greenCalm": 5.0,
                },
                "summary": "Affordable southern pocket with campus utility, but safety cap dominates.",
                "caveat": "Do not let metro access or rent rescue a hard safety penalty.",
                "evidence": "Split from Saint-Michel / Empalot official quartier (low confidence).",
                "confidence": "low",
            },
            {
                "code": "toulouse-rangueil-sauzelong",
                "name": "Rangueil / Sauzelong / Jules-Julien",
                "parent": "South-east campus",
                "area": "South-east campus",
                "scores": {
                    "security": 7.0,
                    "affordability": 5.6,
                    "transport": 8.6,
                    "studentEnergy": 8.8,
                    "services": 7.8,
                    "campusAccess": 10.0,
                    "greenCalm": 7.0,
                },
                "summary": "Top student score because campus access is structural, not vibes-driven.",
                "caveat": "Best for campus-first students, not for a historic-centre lifestyle.",
                "evidence": "Official Toulouse campus quartier polygon (medium confidence).",
            },
            {
                "code": "toulouse-mirail-reynerie-bellefontaine",
                "name": "Mirail / Reynerie / Bellefontaine",
                "parent": "South-west campus",
                "area": "South-west campus",
                "scores": {
                    "security": 3.8,
                    "affordability": 7.4,
                    "transport": 8.0,
                    "studentEnergy": 6.8,
                    "services": 6.8,
                    "campusAccess": 8.8,
                    "greenCalm": 5.6,
                },
                "summary": "Cheap campus-linked belt that stays hard-capped on safety.",
                "caveat": "Affordability and metro access do not redeem the risk profile.",
                "evidence": "Official Toulouse quartier polygon (medium confidence).",
            },
            {
                "code": "toulouse-minimes-barriere-paris",
                "name": "Minimes / Barrière de Paris / La Vache",
                "parent": "North",
                "area": "North",
                "scores": {
                    "security": 5.8,
                    "affordability": 5.8,
                    "transport": 8.6,
                    "studentEnergy": 7.0,
                    "services": 7.6,
                    "campusAccess": 7.2,
                    "greenCalm": 5.8,
                },
                "summary": "Practical northern sector with metro access and tolerable value.",
                "caveat": "Practical, not premium-safe or especially student-social.",
                "evidence": "Official Toulouse quartier polygon (medium confidence).",
            },
        ],
    ),
    "lille": (
        "lilleMicroPlaces",
        [
            _place("lille-centre-gares-euralille", "Lille-Centre / Gares / Euralille", "Lille Centre", "Lille Centre",
                   dict(security=5.4, affordability=2.8, transport=9.8, studentEnergy=8.0, services=9.2, campusAccess=8.2, greenCalm=3.8),
                   "Connected hub with huge transport and services utility.", "Central and useful, but not calm and not cheap.", "Official Lille quartier polygon (medium confidence)."),
            _place("lille-vauban-esquermes", "Vauban-Esquermes / Catho", "Vauban-Esquermes", "Vauban-Esquermes",
                   dict(security=7.2, affordability=4.0, transport=8.0, studentEnergy=9.0, services=8.0, campusAccess=9.3, greenCalm=7.2),
                   "Cleanest student-life pick with campus, services, and tolerable risk.", "Leads Lille on balanced student quality.", "Official Lille quartier polygon (medium confidence)."),
            _place("lille-vieux-lille", "Vieux-Lille", "Vieux-Lille", "Vieux-Lille",
                   dict(security=7.0, affordability=2.0, transport=8.2, studentEnergy=7.2, services=8.8, campusAccess=7.2, greenCalm=5.4),
                   "Pleasant historic core with premium feel.", "Comfort and prestige, not best student value.", "Official Lille quartier polygon (medium confidence)."),
            _place("lille-wazemmes", "Wazemmes", "Wazemmes", "Wazemmes",
                   dict(security=5.0, affordability=6.0, transport=8.8, studentEnergy=9.2, services=8.0, campusAccess=8.4, greenCalm=4.0),
                   "Street-smart student pick with strong energy and value.", "Cannot be treated as comfort-safe despite the social life.", "Official Lille quartier polygon (medium confidence)."),
            _place("lille-moulins", "Moulins", "Moulins", "Moulins",
                   dict(security=4.6, affordability=6.6, transport=8.6, studentEnergy=8.0, services=7.4, campusAccess=9.0, greenCalm=4.2),
                   "Strong campus access and value with real student density.", "Safety caps the total despite campus utility.", "Official Lille quartier polygon (medium confidence)."),
            _place("lille-fives", "Fives", "Fives", "Fives",
                   dict(security=5.2, affordability=6.4, transport=8.6, studentEnergy=7.0, services=7.2, campusAccess=7.0, greenCalm=4.8),
                   "Affordable inner-east belt with metro access.", "Value pick, not a comfort default.", "Official Lille quartier polygon (medium confidence)."),
            _place("lille-bois-blancs-euratechnologies", "Bois-Blancs / Euratechnologies", "Bois-Blancs", "Bois-Blancs",
                   dict(security=6.4, affordability=5.2, transport=7.8, studentEnergy=6.8, services=7.2, campusAccess=6.4, greenCalm=6.6),
                   "Calmer west-side pocket with improving tech-campus adjacency.", "Less student-social than Vauban or Wazemmes.", "Official Lille quartier polygon (medium confidence)."),
            _place("lille-sud", "Lille-Sud", "Lille-Sud", "Lille-Sud",
                   dict(security=4.2, affordability=7.0, transport=7.6, studentEnergy=5.8, services=6.8, campusAccess=7.2, greenCalm=5.2),
                   "Cheap southern belt that stays a cap zone.", "Cheap rent is not enough to offset the safety profile.", "Official Lille quartier polygon (medium confidence)."),
            _place("lille-vda-cite-scientifique", "Villeneuve-d'Ascq Cité Scientifique", "Villeneuve-d'Ascq", "Villeneuve-d'Ascq",
                   dict(security=6.8, affordability=5.8, transport=8.8, studentEnergy=8.6, services=7.6, campusAccess=10.0, greenCalm=7.8),
                   "Campus-first green option with structural university access.", "Suburban comfort trade-off for calmer campus life.", "Official Villeneuve-d'Ascq quartier polygon (medium confidence)."),
            _place("lille-vda-pont-de-bois", "Villeneuve-d'Ascq Pont de Bois", "Villeneuve-d'Ascq", "Villeneuve-d'Ascq",
                   dict(security=5.8, affordability=6.2, transport=8.8, studentEnergy=8.8, services=7.4, campusAccess=9.8, greenCalm=6.8),
                   "Lively campus suburb with strong metro links and student energy.", "More mixed comfort than Cité Scientifique.", "Official Villeneuve-d'Ascq quartier polygon (medium confidence)."),
        ],
    ),
    "marseille": (
        "marseilleMicroPlaces",
        [
            _place("marseille-saint-charles-belle-de-mai", "Saint-Charles / Belle de Mai edge", "Marseille 1/3", "Marseille 1/3",
                   dict(security=4.0, affordability=6.2, transport=9.0, studentEnergy=8.2, services=7.4, campusAccess=9.0, greenCalm=3.5),
                   "Huge campus and transport utility beside the main station.", "Bad edge effects keep the safety cap dominant.", "Grouped official Marseille quartiers (medium confidence)."),
            _place("marseille-noailles-belsunce", "Noailles / Belsunce", "Marseille 1", "Marseille 1",
                   dict(security=3.6, affordability=6.6, transport=9.4, studentEnergy=8.8, services=8.0, campusAccess=8.5, greenCalm=2.8),
                   "Central and alive, but the safety cap must dominate.", "Do not outrank safer campus zones just because it is connected.", "Grouped official Marseille quartiers (medium confidence)."),
            _place("marseille-la-plaine-cours-julien", "La Plaine / Cours Julien", "Marseille 5/6", "Marseille 5/6",
                   dict(security=5.0, affordability=5.6, transport=8.8, studentEnergy=9.8, services=8.4, campusAccess=8.2, greenCalm=3.8),
                   "Student/social pick with the strongest nightlife energy in town.", "The social pick, not the safe pick.", "Grouped official Marseille quartiers (medium confidence)."),
            _place("marseille-baille-timone", "Baille / La Timone", "Marseille 5", "Marseille 5",
                   dict(security=6.2, affordability=5.2, transport=9.0, studentEnergy=8.2, services=8.2, campusAccess=10.0, greenCalm=5.0),
                   "Best balanced in-city student zone with hospital-university gravity.", "Strong first-pass pick for campus-first students.", "Grouped official Marseille quartiers (medium confidence)."),
            _place("marseille-castellane-prefecture", "Castellane / Préfecture", "Marseille 6", "Marseille 6",
                   dict(security=6.6, affordability=3.8, transport=9.2, studentEnergy=7.6, services=8.8, campusAccess=8.4, greenCalm=4.8),
                   "Safer east-centre belt with strong services and metro.", "Safer but expensive compared with Baille.", "Grouped official Marseille quartiers (medium confidence)."),
            _place("marseille-prado-perier-rouet", "Prado / Périer / Rouet", "Marseille 8", "Marseille 8",
                   dict(security=7.4, affordability=2.8, transport=8.8, studentEnergy=6.4, services=8.8, campusAccess=7.2, greenCalm=6.4),
                   "Safer south-east residential belt with sea access.", "Safer but expensive with modest student energy.", "Grouped official Marseille quartiers (medium confidence)."),
            _place("marseille-vieux-port-panier", "Vieux-Port / Panier", "Marseille 1/2", "Marseille 1/2",
                   dict(security=5.0, affordability=3.4, transport=9.2, studentEnergy=8.2, services=9.0, campusAccess=7.6, greenCalm=4.0),
                   "Iconic waterfront core with services and tourist energy.", "Postcard access with rent and exposure limits.", "Grouped official Marseille quartiers (low confidence).", confidence="low"),
            _place("marseille-endoume-catalans", "Endoume / Catalans", "Marseille 7", "Marseille 7",
                   dict(security=7.2, affordability=2.6, transport=7.6, studentEnergy=6.8, services=8.0, campusAccess=6.8, greenCalm=7.8),
                   "Calmer sea-facing south-west pocket with village feel.", "Quality of life pick, not a student-default.", "Grouped official Marseille quartiers (medium confidence)."),
            _place("marseille-luminy-redon", "Luminy / Redon campus", "Marseille 9", "Marseille 9",
                   dict(security=7.8, affordability=4.4, transport=6.4, studentEnergy=7.6, services=6.6, campusAccess=10.0, greenCalm=10.0),
                   "Green campus enclave with top campus access and calm.", "Transport friction is the main daily-life limiter.", "Grouped official Marseille quartiers (medium confidence)."),
            _place("marseille-saint-jerome-chateau-gombert", "Saint-Jérôme / Château-Gombert", "Marseille 13", "Marseille 13",
                   dict(security=5.8, affordability=6.6, transport=7.2, studentEnergy=7.6, services=7.2, campusAccess=9.4, greenCalm=6.4),
                   "Northern campus belt with strong university access and value.", "Less central student life than Baille or Luminy.", "Grouped official Marseille quartiers (medium confidence)."),
            _place("marseille-castellane-15e-north", "La Castellane / 15e north", "Marseille 15", "Marseille 15",
                   dict(security=2.6, affordability=7.6, transport=6.6, studentEnergy=4.8, services=6.2, campusAccess=5.6, greenCalm=4.8),
                   "Northern districts that need brutal caps despite cheap rent.", "Avoid averaging rough northern pockets into a soft score.", "Grouped official Marseille quartiers (medium confidence)."),
        ],
    ),
    "nice": (
        "niceMicroPlaces",
        [
            _place("nice-jean-medecin-carabacel", "Jean-Médecin / Carabacel", "Centre", "Centre",
                   dict(security=5.8, affordability=2.4, transport=9.4, studentEnergy=7.8, services=9.2, campusAccess=8.0, greenCalm=3.8),
                   "Hyper-connected retail core with strong services.", "Useful but rent-hostile and not calm.", "Official Nice quartier polygons (medium confidence)."),
            _place("nice-vieux-nice-port", "Vieux-Nice / Port", "Centre east", "Centre east",
                   dict(security=5.6, affordability=2.8, transport=8.8, studentEnergy=8.8, services=9.0, campusAccess=7.6, greenCalm=4.6),
                   "Energetic old town and port with tourist exposure.", "No postcard inflation: tourism and rent matter.", "Official Nice quartier polygons (medium confidence)."),
            _place("nice-liberation-valrose", "Libération / Borriglione / Valrose", "North centre", "North centre",
                   dict(security=6.6, affordability=4.6, transport=8.8, studentEnergy=8.2, services=8.4, campusAccess=9.4, greenCalm=5.8),
                   "Most credible first student pick with Valrose campus access.", "Leads Nice on practical student quality.", "Official Nice quartier polygons (medium confidence)."),
            _place("nice-thiers-musiciens", "Thiers / Musiciens", "Centre west", "Centre west",
                   dict(security=5.4, affordability=3.4, transport=9.0, studentEnergy=7.0, services=8.6, campusAccess=8.0, greenCalm=4.4),
                   "Central west belt with good services and tram access.", "Rent-limited and less student-dense than Valrose.", "Official Nice quartier polygons (medium confidence)."),
            _place("nice-riquier-saint-roch", "Riquier / Saint-Roch", "East inner city", "East inner city",
                   dict(security=5.8, affordability=5.4, transport=8.4, studentEnergy=7.0, services=8.0, campusAccess=7.6, greenCalm=5.0),
                   "More affordable inner-east option with improving access.", "Different risk profile from Pasteur or Ariane.", "Official Nice quartier polygons (medium confidence)."),
            _place("nice-carlone-madeleine", "Carlone / Madeleine", "West campus", "West campus",
                   dict(security=6.4, affordability=4.8, transport=7.6, studentEnergy=7.2, services=7.4, campusAccess=9.0, greenCalm=6.2),
                   "Underrated west-side campus belt with real university access.", "Practical campus option with less brutal rent than the core.", "Official Nice quartier polygons (medium confidence)."),
            _place("nice-cimiez-rimiez", "Cimiez / Rimiez", "North-east hills", "North-east hills",
                   dict(security=8.2, affordability=2.6, transport=6.8, studentEnergy=4.6, services=7.8, campusAccess=7.2, greenCalm=8.4),
                   "Safe and green hillside belt with low student energy.", "Not a normal student default despite the safety.", "Official Nice quartier polygons (medium confidence)."),
            _place("nice-pasteur-roquebilliere", "Pasteur / Roquebillière", "East", "East",
                   dict(security=4.4, affordability=6.8, transport=7.6, studentEnergy=5.8, services=7.0, campusAccess=8.0, greenCalm=5.0),
                   "Campus-linked east side with value, but hard safety caps.", "Do not combine with Riquier into one soft eastern score.", "Official Nice quartier polygons (medium confidence)."),
            _place("nice-ariane", "Ariane", "North-east edge", "North-east edge",
                   dict(security=3.2, affordability=7.4, transport=6.8, studentEnergy=4.8, services=6.2, campusAccess=5.6, greenCalm=5.6),
                   "Affordable north-east edge that stays hard-capped on safety.", "Cheap rent cannot rescue the risk profile.", "Official Nice quartier polygon (medium confidence)."),
            _place("nice-arenas-saint-augustin", "Arénas / Saint-Augustin / EDHEC", "West airport", "West airport",
                   dict(security=5.0, affordability=5.4, transport=8.4, studentEnergy=6.2, services=7.4, campusAccess=8.2, greenCalm=5.2),
                   "Airport-business belt with EDHEC utility and tram access.", "Useful for specific schools, not broad student life.", "Official Nice quartier polygons (medium confidence)."),
        ],
    ),
    "nantes": (
        "nantesMicroPlaces",
        [
            _place("nantes-centre-ville-decre", "Centre-ville / Decré-Commerce-Graslin", "Centre-ville", "Centre-ville",
                   dict(security=6.2, affordability=3.0, transport=9.6, studentEnergy=9.0, services=9.2, campusAccess=8.4, greenCalm=4.2),
                   "Lively core with strong services and tram access.", "High student energy, but rent and nightlife friction drag.", "Official Nantes administrative quartier (medium confidence)."),
            _place("nantes-hauts-paves-saint-felix", "Hauts-Pavés / Saint-Félix / Michelet", "Hauts-Pavés - Saint-Félix", "Hauts-Pavés - Saint-Félix",
                   dict(security=7.2, affordability=4.4, transport=8.6, studentEnergy=8.6, services=8.2, campusAccess=9.6, greenCalm=7.0),
                   "Cleanest student pick with Michelet campus gravity.", "Leads Nantes on balanced student quality.", "Official Nantes administrative quartier (medium confidence)."),
            _place("nantes-nord-joneliere", "Nantes Nord / Jonelière-Université", "Nantes Nord", "Nantes Nord",
                   dict(security=6.0, affordability=6.0, transport=8.4, studentEnergy=8.8, services=7.6, campusAccess=10.0, greenCalm=7.6),
                   "Northern university belt with structural campus access and value.", "Strong access, but mixed comfort outside campus streets.", "Official Nantes administrative quartier (medium confidence)."),
            _place("nantes-ile-de-nantes", "Île de Nantes", "Île de Nantes", "Île de Nantes",
                   dict(security=6.6, affordability=4.2, transport=8.6, studentEnergy=7.8, services=8.0, campusAccess=8.0, greenCalm=6.6),
                   "Improving creative belt with tram links and services.", "Good but not yet a top student default.", "Official Nantes administrative quartier (medium confidence)."),
            _place("nantes-malakoff-saint-donatien", "Malakoff / Saint-Donatien", "Malakoff - Saint-Donatien", "Malakoff - Saint-Donatien",
                   dict(security=5.2, affordability=6.0, transport=8.8, studentEnergy=7.2, services=7.8, campusAccess=8.0, greenCalm=5.8),
                   "Inner-east belt with metro-tram access and tolerable value.", "Needs safety/comfort caps despite affordability.", "Official Nantes administrative quartier (medium confidence)."),
            _place("nantes-dervallieres-zola", "Dervallières / Zola", "Dervallières - Zola", "Dervallières - Zola",
                   dict(security=5.4, affordability=5.8, transport=8.0, studentEnergy=6.8, services=7.8, campusAccess=7.0, greenCalm=6.4),
                   "Western residential belt with reasonable value.", "Mixed comfort; not a premium student default.", "Official Nantes administrative quartier (medium confidence)."),
            _place("nantes-bellevue-chantenay", "Bellevue / Chantenay / Sainte-Anne", "Bellevue - Chantenay - Sainte-Anne", "Bellevue - Chantenay - Sainte-Anne",
                   dict(security=4.6, affordability=6.8, transport=8.2, studentEnergy=6.8, services=7.4, campusAccess=7.2, greenCalm=6.2),
                   "Affordable western belt that needs safety caps.", "Value trade, not a comfort pick.", "Official Nantes administrative quartier (medium confidence)."),
            _place("nantes-breil-barberie", "Breil / Barberie", "Breil - Barberie", "Breil - Barberie",
                   dict(security=5.0, affordability=6.2, transport=7.6, studentEnergy=5.8, services=7.0, campusAccess=6.6, greenCalm=6.8),
                   "Northern residential belt with moderate value.", "Requires honest safety and comfort caps.", "Official Nantes administrative quartier (medium confidence)."),
            _place("nantes-erdre-chantrerie", "Nantes Erdre / Chantrerie", "Nantes Erdre", "Nantes Erdre",
                   dict(security=7.0, affordability=5.4, transport=7.4, studentEnergy=7.2, services=7.4, campusAccess=9.4, greenCalm=8.4),
                   "Campus-specific green option on the Erdre corridor.", "Strong for specific campuses, weaker for central student life.", "Official Nantes administrative quartier (medium confidence)."),
            _place("nantes-doulon-bottiere", "Doulon / Bottière", "Doulon - Bottière", "Doulon - Bottière",
                   dict(security=5.8, affordability=6.2, transport=8.2, studentEnergy=6.4, services=7.4, campusAccess=7.0, greenCalm=6.6),
                   "Eastern residential belt with tram access and moderate value.", "Practical but not a headline student pick.", "Official Nantes administrative quartier (medium confidence)."),
        ],
    ),
}


def main() -> None:
    for city_id, (export_name, places) in CITY_PLACES.items():
        write_city_file(city_id, export_name, places)


if __name__ == "__main__":
    main()