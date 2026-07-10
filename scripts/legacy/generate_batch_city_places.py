#!/usr/bin/env python3
"""Generate batch city PlaceScore TypeScript files from research score tables."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
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


def student_fit(scores: dict[str, float], total: float, role: str) -> str:
    security = scores["security"]
    campus = scores["campusAccess"]
    if role == "campus" and campus >= 9:
        return "excellent" if security >= 5 else "good"
    if total >= 7:
        return "mixed" if security < 5 else "excellent"
    if total >= 6.2:
        return "mixed" if security < 5 else "good"
    if total >= 5.2:
        return "mixed"
    return "mixed" if campus >= 8 else "weak"


def render_place(city_id: str, place: dict[str, object]) -> str:
    scores = place["scores"]  # type: ignore[assignment]
    role = place["coverageRole"]
    total = weighted_total(scores)  # type: ignore[arg-type]
    rent = rent_level(scores["affordability"])  # type: ignore[index]
    fit = student_fit(scores, total, str(role))  # type: ignore[arg-type]
    lines = [
        "  {",
        f'    id: "{place["code"]}", cityId: "{city_id}", name: "{place["name"]}", '
        f'code: "{place["code"]}", kind: "{place.get("kind", "quartier")}",',
        f'    area: "{place["area"]}", granularity: "micro", parentName: "{place["parent"]}",',
        f'    confidence: "{place["confidence"]}", coverageRole: "{role}", '
        f'geometryBasis: "{place["geometryBasis"]}",',
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


def write_city(city_id: str, export_name: str, places: list[dict[str, object]]) -> None:
    body = "\n".join(render_place(city_id, place) for place in places)
    content = (
        'import type { PlaceScore } from "@/data/cities";\n\n'
        f"export const {export_name}: PlaceScore[] = [\n{body}\n];\n"
    )
    path = SRC / f"{city_id}Places.ts"
    path.write_text(content, encoding="utf-8")
    print(f"Wrote {path} ({len(places)} places)")


def p(
    code: str,
    name: str,
    parent: str,
    area: str,
    scores: tuple[float, float, float, float, float, float, float],
    summary: str,
    caveat: str,
    evidence: str,
    *,
    role: str = "primary",
    basis: str = "official_quartier",
    confidence: str = "high",
    kind: str = "quartier",
) -> dict[str, object]:
    return {
        "code": code,
        "name": name,
        "parent": parent,
        "area": area,
        "scores": {
            "security": scores[0],
            "affordability": scores[1],
            "transport": scores[2],
            "studentEnergy": scores[3],
            "services": scores[4],
            "campusAccess": scores[5],
            "greenCalm": scores[6],
        },
        "summary": summary,
        "caveat": caveat,
        "evidence": evidence,
        "coverageRole": role,
        "geometryBasis": basis,
        "confidence": confidence,
        "kind": kind,
    }


RENES_PLACES = [
    p("rennes-centre", "Centre", "Centre", "Centre", (6.4, 3.4, 9.8, 9.2, 9.2, 8.8, 4.4), "High-energy centre with strong services and tram access.", "Rent and nightlife friction are real; not a calm pick.", "Official Rennes administrative quartier polygon.", role="primary"),
    p("rennes-thabor-saint-helier-alphonse-guerin", "Thabor / Saint-Helier / Alphonse Guerin", "East centre", "East centre", (7.8, 3.2, 9.0, 7.8, 8.8, 8.6, 8.0), "Premium east-centre belt with park calm and strong services.", "Leads Rennes on balanced quality; still not cheap.", "Official Rennes administrative quartier polygon.", role="primary"),
    p("rennes-bourg-levesque-la-touche-moulin-du-comte", "Bourg-l'Evesque / La Touche / Moulin du Comte", "West centre", "West centre", (6.4, 4.2, 8.8, 7.6, 8.2, 8.4, 6.0), "Balanced west-centre residential pick with good campus links.", "Less social than Centre or Thabor.", "Official Rennes administrative quartier polygon.", role="primary"),
    p("rennes-nord-saint-martin", "Nord / Saint-Martin", "North", "North", (6.2, 4.8, 8.6, 6.8, 7.8, 7.8, 6.6), "Practical northern belt with metro access and tolerable value.", "Commuter-value zone, not a headline student scene.", "Official Rennes administrative quartier polygon.", role="primary"),
    p("rennes-maurepas-patton", "Maurepas / Patton", "North cap", "North cap", (4.8, 6.8, 8.2, 6.0, 7.0, 6.8, 6.0), "Affordable north belt capped by safety profile.", "Value trade, not a comfort default.", "Official Rennes administrative quartier polygon.", role="risk_cap"),
    p("rennes-jeanne-darc-longs-champs-beaulieu", "Jeanne d'Arc / Longs-Champs / Beaulieu", "North-east campus", "North-east campus", (7.2, 4.8, 8.6, 7.4, 7.8, 9.4, 7.6), "Campus-first north-east belt with structural university access.", "Best for campus-first students, not centre lifestyle.", "Official Rennes administrative quartier polygon.", role="campus"),
    p("rennes-la-pommeraie", "La Pommeraie", "East-south", "East-south", (7.2, 4.2, 7.4, 6.2, 7.4, 7.2, 7.6), "Calmer east-south residential belt with green edges.", "Less student-social than Thabor or Beaulieu.", "Official Rennes administrative quartier polygon.", role="primary"),
    p("rennes-sud-gare", "Sud-Gare", "South centre", "South centre", (6.0, 5.0, 9.2, 7.6, 8.2, 8.0, 5.8), "Station-adjacent south-centre belt with strong transit.", "Useful hub access; block choice still matters.", "Official Rennes administrative quartier polygon.", role="primary"),
    p("rennes-cleunay-arsenal-redon", "Cleunay / Arsenal-Redon", "West inner", "West inner", (6.2, 5.2, 8.6, 7.2, 7.8, 7.4, 6.4), "Inner-west belt with reasonable value and tram access.", "Mixed comfort; not a premium student default.", "Official Rennes administrative quartier polygon.", role="primary"),
    p("rennes-villejean-beauregard", "Villejean / Beauregard", "West campus", "West campus", (5.8, 6.2, 9.0, 8.2, 7.6, 10.0, 6.0), "West campus pole with structural university access and metro.", "Campus utility over centre social life.", "Official Rennes administrative quartier polygon.", role="campus"),
    p("rennes-le-blosne", "Le Blosne", "South cap", "South cap", (4.2, 7.0, 8.8, 6.0, 6.8, 6.8, 5.6), "Affordable south belt with a hard safety cap.", "Cheap rent cannot offset the risk profile.", "Official Rennes administrative quartier polygon.", role="risk_cap"),
    p("rennes-brequigny", "Brequigny", "South-west", "South-west", (5.0, 6.4, 8.4, 6.4, 7.2, 7.0, 5.8), "Outer south-west context with moderate value.", "Honest peripheral belt; limited student scene.", "Official Rennes administrative quartier polygon.", role="context"),
]

STRASBOURG_PLACES = [
    p("strasbourg-bourse-esplanade-krutenau", "Bourse / Esplanade / Krutenau", "Centre-east", "Centre-east", (6.2, 4.0, 9.4, 9.2, 8.8, 9.6, 5.0), "Main east-centre student belt with campus gravity.", "Leads Strasbourg on student energy; rent is not low.", "Official Strasbourg functional quartier group.", basis="official_quartier_group"),
    p("strasbourg-centre-ville-petite-france", "Centre-ville / Petite France", "Centre", "Centre", (6.0, 3.0, 9.6, 8.4, 9.0, 8.6, 4.8), "Historic core with strong services and tram access.", "Prestige rents and tourist exposure limit value.", "Official Strasbourg functional quartier group.", basis="official_quartier_group"),
    p("strasbourg-gare-tribunal", "Gare / Tribunal", "Station core", "Station core", (4.8, 5.0, 9.8, 7.8, 8.2, 8.0, 3.8), "Hyper-connected station belt with mixed comfort.", "Safety cap dominates despite transit utility.", "Official Strasbourg functional quartier group.", basis="official_quartier_group", role="risk_cap"),
    p("strasbourg-orangerie-conseil-xv", "Orangerie / Conseil des XV", "North-east premium", "North-east premium", (7.8, 3.0, 8.5, 6.4, 8.4, 8.0, 8.8), "Premium north-east belt with park calm.", "Quality-of-life pick, not a budget student default.", "Official Strasbourg functional quartier group.", basis="official_quartier_group"),
    p("strasbourg-robertsau-wacken", "Robertsau / Wacken", "North-east", "North-east", (8.0, 3.6, 7.4, 5.8, 7.8, 7.0, 9.0), "Green north-east belt with low student density.", "Calm and safe, but weak student social scene.", "Official Strasbourg functional quartier group.", basis="official_quartier_group"),
    p("strasbourg-cronenbourg-campus", "Cronenbourg campus", "West campus", "West campus", (5.6, 6.0, 7.8, 7.2, 7.4, 9.0, 6.0), "West campus belt with structural university access.", "Less central student life than Krutenau.", "Official Strasbourg functional quartier group.", basis="official_quartier_group", role="campus"),
    p("strasbourg-hautepierre-poteries", "Hautepierre / Poteries", "West cap", "West cap", (4.0, 7.2, 8.0, 5.8, 6.8, 6.6, 5.2), "Affordable west belt capped by safety and distance.", "Value pick with visible cap constraints.", "Official Strasbourg functional quartier group.", basis="official_quartier_group", role="risk_cap"),
    p("strasbourg-koenigshoffen", "Koenigshoffen", "West-south", "West-south", (5.0, 6.6, 7.8, 6.2, 6.8, 6.6, 5.8), "Outer west belt with moderate value.", "Honest cap-zone profile; limited student scene.", "Official Strasbourg functional quartier polygon.", role="risk_cap"),
    p("strasbourg-montagne-verte", "Montagne Verte", "South-west", "South-west", (5.6, 6.0, 7.6, 6.2, 6.8, 6.6, 6.4), "South-west context with tolerable daily life.", "Peripheral belt, not a student destination.", "Official Strasbourg functional quartier polygon.", role="context"),
    p("strasbourg-elsau", "Elsau", "South-west cap", "South-west cap", (4.8, 6.8, 7.4, 5.8, 6.6, 6.0, 5.4), "South-west cap with value but weak comfort.", "Safety cap stays visible despite affordability.", "Official Strasbourg functional quartier polygon.", role="risk_cap"),
    p("strasbourg-meinau", "Meinau", "South", "South", (5.4, 6.2, 8.0, 6.6, 7.0, 7.0, 5.8), "Southern belt with metro access and mixed profile.", "Useful value belt, not a premium pick.", "Official Strasbourg functional quartier polygon.", role="context"),
    p("strasbourg-neudorf-musau", "Neudorf / Musau", "South-east", "South-east", (6.8, 5.0, 8.8, 7.4, 8.0, 8.0, 6.4), "South-east belt with improving services and tram.", "Strong practical pick outside the historic core.", "Official Strasbourg functional quartier polygon."),
    p("strasbourg-port-du-rhin", "Port du Rhin", "East edge", "East edge", (5.0, 6.4, 7.8, 6.2, 6.8, 7.0, 5.2), "Eastern edge context with industrial-port character.", "Honest peripheral coverage zone.", "Official Strasbourg functional quartier polygon.", role="context"),
    p("strasbourg-neuhof-1", "Neuhof 1", "South cap", "South cap", (3.8, 7.4, 7.2, 5.0, 6.2, 5.6, 5.6), "Southern cap zone with hard safety constraints.", "Affordability cannot rescue the risk profile.", "Official Strasbourg functional quartier polygon.", role="risk_cap"),
    p("strasbourg-neuhof-2-stockfeld-ganzau", "Neuhof 2 / Stockfeld / Ganzau", "South cap", "South cap", (4.2, 7.2, 7.0, 5.2, 6.2, 5.8, 6.0), "Outer south cap with value and weak student energy.", "Visible cap zone; not a comfort default.", "Official Strasbourg functional quartier group.", basis="official_quartier_group", role="risk_cap"),
    p("strasbourg-illkirch-campus", "Illkirch campus", "Campus suburb", "Campus suburb", (7.6, 5.8, 8.2, 7.6, 7.6, 10.0, 8.4), "Commuter campus edge with structural university access.", "Tram commute required; not a centre lifestyle.", "Illkirch-Graffenstaden commune campus edge.", basis="commune", role="campus", confidence="medium", kind="commune"),
]

GRENoble_PLACES = [
    p("grenoble-hyper-centre", "Hyper-centre", "Centre", "Centre", (5.8, 3.2, 9.7, 9.0, 9.2, 8.8, 4.2), "Dense centre with strong services and student energy.", "Rent pressure and nightlife friction are real.", "Official Grenoble union de quartier group.", basis="official_quartier_group"),
    p("grenoble-notre-dame-mutualite", "Notre-Dame / Mutualite", "Centre-east", "Centre-east", (6.0, 3.4, 9.4, 8.8, 9.0, 8.8, 4.8), "Centre-east belt with strong services and tram.", "Still expensive compared with outer belts.", "Official Grenoble union de quartier group.", basis="official_quartier_group"),
    p("grenoble-championnet-aigle", "Championnet / Aigle", "Centre-west", "Centre-west", (6.8, 4.0, 9.0, 8.6, 8.8, 8.6, 5.6), "Balanced centre-west pick with good transit.", "Less campus-default than Europole or Gières.", "Official Grenoble union de quartier group.", basis="official_quartier_group"),
    p("grenoble-europole-presquile", "Europole / Presqu'ile", "North-west campus", "North-west campus", (6.4, 4.8, 9.0, 7.4, 8.2, 9.6, 5.8), "Campus-adjacent north-west belt with tram utility.", "Strong campus access; less social than hyper-centre.", "Official Grenoble union de quartier group.", basis="official_quartier_group", role="campus"),
    p("grenoble-chorier-berriat-saint-bruno", "Chorier-Berriat / Saint-Bruno", "West inner", "West inner", (5.2, 5.8, 9.2, 8.4, 8.0, 8.2, 4.4), "Inner-west student belt with good tram links.", "Mixed comfort; block choice matters.", "Official Grenoble union de quartier group.", basis="official_quartier_group"),
    p("grenoble-saint-laurent-ile-verte", "Saint-Laurent / Ile Verte", "East river", "East river", (7.4, 4.2, 8.8, 7.4, 8.4, 9.4, 8.4), "East-river campus belt with green calm.", "Leads Grenoble on balanced campus-centre mix.", "Official Grenoble union de quartier group.", basis="official_quartier_group", role="campus"),
    p("grenoble-mistral-eaux-claires", "Mistral / Eaux-Claires", "West cap", "West cap", (4.0, 6.8, 8.4, 6.0, 6.8, 6.6, 5.4), "West belt capped by safety and mixed reputation.", "Affordability does not fully compensate.", "Official Grenoble union de quartier group.", basis="official_quartier_group", role="risk_cap"),
    p("grenoble-capuche-allies-alpins", "Capuche / Allies-Alpins", "East inner", "East inner", (5.8, 5.6, 8.2, 6.8, 7.4, 8.0, 6.0), "East-inner belt with moderate student relevance.", "Useful but not a headline pick.", "Official Grenoble union de quartier group.", basis="official_quartier_group", role="context"),
    p("grenoble-beauvert-cite-abbaye", "Beauvert / Cite de l'Abbaye", "East", "East", (6.2, 5.4, 8.0, 6.8, 7.4, 8.0, 6.4), "Eastern residential belt with tolerable value.", "Context belt with limited student nightlife.", "Official Grenoble union de quartier group.", basis="official_quartier_group", role="context", confidence="medium"),
    p("grenoble-jouhaux-exposition-bajatiere", "Jouhaux / Exposition-Bajatiere", "South-east", "South-east", (5.4, 6.0, 8.2, 6.4, 7.2, 7.4, 5.8), "South-east context with tram access.", "Honest peripheral belt coverage.", "Official Grenoble union de quartier group.", basis="official_quartier_group", role="context"),
    p("grenoble-teisseire-malherbe", "Teisseire / Malherbe", "South-east cap", "South-east cap", (4.8, 6.6, 8.0, 6.0, 6.8, 7.0, 5.6), "South-east cap with value and mixed comfort.", "Safety cap stays visible.", "Official Grenoble union de quartier group.", basis="official_quartier_group", role="risk_cap"),
    p("grenoble-arlequin-village-olympique-vigny-musset", "Arlequin / Village Olympique / Vigny Musset", "South cap", "South cap", (4.0, 7.4, 8.0, 6.0, 6.8, 7.0, 5.6), "Southern cap belt with affordability and weak security.", "Hard cap zone despite rent advantage.", "Official Grenoble union de quartier group.", basis="official_quartier_group", role="risk_cap"),
    p("grenoble-saint-martin-dheres-campus-core", "Saint-Martin-d'Heres campus core", "Campus suburb", "Campus suburb", (6.8, 6.0, 9.2, 9.2, 7.8, 10.0, 8.4), "Major campus commune with structural university access.", "Suburban commute trade-off for campus life.", "Saint-Martin-d'Hères commune campus edge.", basis="commune", role="campus", confidence="medium", kind="commune"),
    p("grenoble-gieres-campus", "Gieres campus", "Campus suburb", "Campus suburb", (7.6, 5.8, 8.6, 8.0, 7.4, 9.6, 8.6), "Gières campus edge with strong university access.", "Leads Grenoble metro area on campus score.", "Gières commune campus edge.", basis="commune", role="campus", confidence="medium", kind="commune"),
]

MONTPELLIER_PLACES = [
    p("montpellier-ecusson-core", "Ecusson core", "Montpellier Centre", "Montpellier Centre", (5.4, 2.8, 9.6, 9.2, 9.2, 8.8, 3.6), "Historic core with strong student energy and services.", "Rent-hostile; comfort not automatic.", "IRIS-grouped major district approximation.", basis="iris_fallback_major_zone", confidence="medium"),
    p("montpellier-comedie-gare", "Comedie / Gare", "Montpellier Centre", "Montpellier Centre", (5.2, 3.2, 9.8, 8.8, 9.0, 8.6, 3.8), "Station-core belt with huge transit utility.", "Connected but not calm or cheap.", "IRIS-grouped major district approximation.", basis="iris_fallback_major_zone", confidence="medium"),
    p("montpellier-beaux-arts-boutonnet", "Beaux-Arts / Boutonnet", "North centre", "North centre", (7.0, 4.2, 8.8, 9.0, 8.4, 9.2, 6.4), "Best north-centre student pick with campus adjacency.", "Leads Montpellier on balanced student quality.", "IRIS-grouped major district approximation.", basis="iris_fallback_major_zone"),
    p("montpellier-arceaux-gambetta-figuerolles", "Arceaux / Gambetta / Figuerolles", "West centre", "West centre", (5.3, 5.2, 8.8, 8.4, 8.2, 8.0, 4.0), "Lively west-centre belt with value and energy.", "Mixed comfort; not a premium-safe default.", "IRIS-grouped major district approximation.", basis="iris_fallback_major_zone", confidence="medium"),
    p("montpellier-antigone", "Antigone", "East centre", "East centre", (6.0, 3.6, 9.4, 7.8, 9.0, 8.6, 4.8), "Planned east-centre belt with tram and services.", "Less social than Ecusson or Boutonnet.", "IRIS-grouped major district approximation.", basis="iris_fallback_major_zone", confidence="medium"),
    p("montpellier-richter-jacques-coeur", "Richter / Jacques-Coeur", "East campus", "East campus", (7.0, 4.2, 9.0, 7.8, 8.2, 9.4, 6.6), "East-campus belt with strong university access.", "Campus-first pick with less historic-centre charm.", "IRIS-grouped major district approximation.", basis="iris_fallback_major_zone", role="campus"),
    p("montpellier-port-marianne-millenaire-odysseum", "Port Marianne / Millenaire / Odysseum", "East", "East", (7.0, 4.0, 8.8, 7.0, 8.4, 8.8, 6.6), "Modern east belt with tram and services.", "Different bet from historic centre.", "IRIS-grouped major district approximation.", basis="iris_fallback_major_zone", confidence="medium"),
    p("montpellier-hopitaux-facultes-triolet", "Hopitaux-Facultes / Triolet", "North campus", "North campus", (6.8, 5.0, 8.8, 8.8, 8.0, 10.0, 7.0), "Main north-campus belt with structural university access.", "Campus utility over nightlife.", "IRIS-grouped major district approximation.", basis="iris_fallback_major_zone", role="campus"),
    p("montpellier-paul-valery-route-de-mende", "Paul-Valery / Route de Mende", "North campus", "North campus", (6.6, 5.2, 8.6, 8.4, 7.8, 10.0, 7.0), "Paul-Valery campus corridor with strong access.", "Best for campus-first students.", "IRIS-grouped major district approximation.", basis="iris_fallback_major_zone", role="campus"),
    p("montpellier-aiguelongue-malbosc", "Aiguelongue / Malbosc", "North-east", "North-east", (7.4, 4.4, 7.8, 6.4, 7.4, 8.4, 8.4), "Green north-east belt with calmer daily life.", "Less student-social than Boutonnet.", "IRIS-grouped major district approximation.", basis="iris_fallback_major_zone", confidence="medium"),
    p("montpellier-croix-argent-ovalie", "Croix d'Argent / Ovalie", "South-west", "South-west", (5.4, 6.0, 8.0, 6.4, 7.4, 7.4, 5.4), "South-west context with tolerable value.", "Honest peripheral belt.", "IRIS-grouped major district approximation.", basis="iris_fallback_major_zone", role="context", confidence="medium"),
    p("montpellier-cevennes-celleneuve", "Les Cevennes / Celleneuve", "West", "West", (5.2, 6.6, 8.0, 6.2, 7.0, 6.8, 6.0), "Western context belt with moderate value.", "Coverage continuity zone, not a headline pick.", "IRIS-grouped major district approximation.", basis="iris_fallback_major_zone", role="context", confidence="medium"),
    p("montpellier-mosson-paillade", "Mosson / Paillade", "North-west cap", "North-west cap", (3.6, 7.6, 8.2, 5.8, 6.6, 6.4, 5.4), "North-west cap with hard safety constraints.", "Affordability cannot rescue the risk profile.", "IRIS-grouped major district approximation.", basis="iris_fallback_major_zone", role="risk_cap"),
    p("montpellier-pres-arenes-gare-sud", "Pres d'Arenes / Gare Sud", "South", "South", (5.0, 6.2, 8.4, 6.4, 7.2, 7.2, 5.0), "Southern station belt with mixed student relevance.", "Useful value belt with cap constraints.", "IRIS-grouped major district approximation.", basis="iris_fallback_major_zone", role="context", confidence="medium"),
]

TOULON_PLACES = [
    p("toulon-haute-ville-liberte", "Haute Ville / Liberte", "Centre", "Centre", (4.8, 5.2, 8.6, 7.4, 8.4, 7.8, 3.8), "Upper centre with services but mixed comfort.", "Safety cap dominates despite central access.", "IRIS-grouped grand quartier approximation.", basis="iris_fallback_major_zone", confidence="medium", role="risk_cap"),
    p("toulon-basse-ville-port", "Basse Ville / Port", "Centre", "Centre", (4.6, 5.6, 8.4, 7.2, 8.0, 7.4, 3.6), "Port-centre belt with transit and mixed profile.", "Hard-capped centre zone, not a comfort default.", "IRIS-grouped grand quartier approximation.", basis="iris_fallback_major_zone", confidence="medium", role="risk_cap"),
    p("toulon-la-rode-mayol", "La Rode / Mayol", "East centre", "East centre", (6.2, 4.4, 8.2, 6.8, 8.4, 7.2, 6.4), "Useful east-centre belt with sea access.", "Best in-city compromise outside campus communes.", "IRIS-grouped grand quartier approximation.", basis="iris_fallback_major_zone", confidence="medium"),
    p("toulon-mourillon-core", "Mourillon core", "East coast", "East coast", (7.4, 3.2, 7.4, 7.0, 8.2, 6.8, 8.8), "Coastal east belt with village feel and calm.", "Quality-of-life pick with moderate student energy.", "IRIS-grouped grand quartier approximation.", basis="iris_fallback_major_zone", confidence="medium"),
    p("toulon-la-mitre-fort-saint-louis", "La Mitre / Fort Saint-Louis", "East coast", "East coast", (7.6, 3.0, 7.0, 6.4, 7.8, 6.4, 9.0), "Premium east-coast belt with green calm.", "Low student density despite coastal appeal.", "IRIS-grouped grand quartier approximation.", basis="iris_fallback_major_zone", confidence="medium"),
    p("toulon-saint-jean-du-var-font-pre", "Saint-Jean-du-Var / Font-Pre", "East inner", "East inner", (5.2, 6.0, 8.0, 6.2, 7.2, 7.0, 5.2), "East-inner belt with moderate value.", "Honest context zone with mixed comfort.", "IRIS-grouped grand quartier approximation.", basis="iris_fallback_major_zone", confidence="medium", role="context"),
    p("toulon-sainte-musse-brunet", "Sainte-Musse / Brunet", "East", "East", (5.6, 6.2, 7.8, 5.8, 7.2, 7.2, 5.6), "Eastern belt with tolerable value and transit.", "Useful but not a headline student pick.", "IRIS-grouped grand quartier approximation.", basis="iris_fallback_major_zone", confidence="medium", role="context"),
    p("toulon-pont-du-las-bon-rencontre", "Pont-du-Las / Bon Rencontre", "West", "West", (4.8, 6.8, 7.6, 6.4, 7.2, 6.4, 4.8), "Western belt capped by safety and distance.", "Value trade with visible cap constraints.", "IRIS-grouped grand quartier approximation.", basis="iris_fallback_major_zone", confidence="medium", role="risk_cap"),
    p("toulon-nord-ouest-routes-valbertrand", "Nord-Ouest / Routes / Valbertrand", "North-west", "North-west", (5.8, 5.8, 6.8, 5.4, 6.8, 5.8, 7.0), "North-west context with green edges.", "Peripheral belt with limited student scene.", "IRIS-grouped grand quartier approximation.", basis="iris_fallback_major_zone", confidence="medium", role="context"),
    p("toulon-beaucaire-pont-neuf-lagoubran", "Beaucaire / Pont-Neuf / Lagoubran", "West edge", "West edge", (4.6, 6.6, 6.8, 5.8, 6.8, 6.2, 5.2), "West-edge cap with affordability and weak comfort.", "Safety cap stays visible.", "IRIS-grouped grand quartier approximation.", basis="iris_fallback_major_zone", confidence="medium", role="risk_cap"),
    p("toulon-la-garde-campus", "La Garde campus", "Campus suburb", "Campus suburb", (6.8, 5.8, 7.4, 7.8, 7.2, 10.0, 7.6), "Main university campus commune with structural access.", "Commuter campus, not a city-centre lifestyle.", "La Garde commune campus edge.", basis="commune", role="campus", confidence="medium", kind="commune"),
    p("toulon-la-valette-avenue-83-la-seyne-edge", "La Valette / Avenue 83 edge", "Commute edge", "Commute edge", (6.2, 5.8, 7.0, 6.2, 7.2, 8.4, 6.6), "Commute edge for Avenue 83 and eastern access.", "Honest peripheral campus commute node.", "La Valette-du-Var commune context edge.", basis="commune_context", role="campus", confidence="low", kind="commune"),
]


def main() -> None:
    write_city("rennes", "rennesPlaces", RENES_PLACES)
    write_city("strasbourg", "strasbourgPlaces", STRASBOURG_PLACES)
    write_city("grenoble", "grenoblePlaces", GRENoble_PLACES)
    write_city("montpellier", "montpellierPlaces", MONTPELLIER_PLACES)
    write_city("toulon", "toulonPlaces", TOULON_PLACES)


if __name__ == "__main__":
    main()