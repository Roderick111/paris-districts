import { bordeauxMacroPlaces, bordeauxMicroPlaces } from "@/data/bordeauxPlaces";
import { lilleMicroPlaces } from "@/data/lillePlaces";
import { lyonMacroPlaces, lyonMicroPlaces } from "@/data/lyonPlaces";
import { marseilleMicroPlaces } from "@/data/marseillePlaces";
import { nantesMicroPlaces } from "@/data/nantesPlaces";
import { niceMicroPlaces } from "@/data/nicePlaces";
import { toulouseMicroPlaces } from "@/data/toulousePlaces";

export type CityId =
  | "paris"
  | "bordeaux"
  | "lyon"
  | "toulouse"
  | "lille"
  | "marseille"
  | "nice"
  | "nantes";
export type PlaceKind = "arrondissement" | "quartier" | "commune";
export type RentLevel = "lower" | "medium" | "high" | "very high";
export type StudentFit = "excellent" | "good" | "mixed" | "weak";

export type Source = {
  label: string;
  url: string;
};

export type PlaceGranularity = "micro" | "macro";
export type PlaceConfidence = "high" | "medium" | "low";

export type CityConfig = {
  id: CityId;
  name: string;
  title: string;
  geojsonUrl: string;
  center: [number, number];
  zoom: number;
  minZoom: number;
  maxZoom: number;
  defaultSelectedCode: string;
  areaOptions: string[];
  parentFilterOptions?: string[];
  sources: Source[];
};

export type PlaceScore = {
  id: string;
  cityId: CityId;
  name: string;
  code: string;
  kind: PlaceKind;
  area: string;
  scores: Record<ScoreKey, number>;
  rentLevel: RentLevel;
  studentFit: StudentFit;
  summary: string;
  caveat: string;
  parentCode?: string;
  parentName?: string;
  granularity?: PlaceGranularity;
  confidence?: PlaceConfidence;
  evidenceNote?: string;
};

export type ScoreKey =
  | "security"
  | "affordability"
  | "transport"
  | "studentEnergy"
  | "services"
  | "campusAccess"
  | "greenCalm";

export type Weights = Record<ScoreKey, number>;
export type PlaceScoreOverrides = Partial<Record<ScoreKey, number>>;

export const SCORE_KEYS: ScoreKey[] = [
  "security",
  "affordability",
  "transport",
  "studentEnergy",
  "services",
  "campusAccess",
  "greenCalm"
];

export const weights: Weights = {
  security: 3,
  affordability: 1.6,
  transport: 1.4,
  studentEnergy: 1.2,
  services: 1,
  campusAccess: 1,
  greenCalm: 0.8
};

export const defaultWeights: Weights = { ...weights };

export function mergeScores(
  place: PlaceScore,
  scoreOverrides?: PlaceScoreOverrides
): PlaceScore["scores"] {
  return scoreOverrides ? { ...place.scores, ...scoreOverrides } : place.scores;
}

export function weightedTotal(
  place: PlaceScore,
  activeWeights: Weights,
  scoreOverrides?: PlaceScoreOverrides
) {
  const scores = mergeScores(place, scoreOverrides);
  const maxWeightedScore = Object.values(activeWeights).reduce((sum, weight) => sum + weight * 10, 0);
  const total = SCORE_KEYS.reduce((sum, key) => sum + scores[key] * activeWeights[key], 0);
  const rawScore = maxWeightedScore > 0 ? (total / maxWeightedScore) * 10 : 0;
  return Number(Math.min(rawScore, securityCap(scores.security)).toFixed(1));
}

function securityCap(security: number) {
  if (security < 3) {
    return 3.4;
  }
  if (security < 4) {
    return 4.4;
  }
  if (security < 5) {
    return 5.2;
  }
  if (security < 6) {
    return 6.2;
  }
  if (security < 7) {
    return 7.0;
  }
  if (security < 8) {
    return 7.8;
  }
  return 10;
}

const parisSources: Source[] = [
  {
    label: "SSMSI / data.gouv.fr crime indicators, 2025 geography",
    url: "https://www.data.gouv.fr/fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales/"
  },
  {
    label: "Paris Open Data arrondissement boundaries",
    url: "https://opendata.paris.fr/explore/dataset/arrondissements/"
  },
  {
    label: "geo.api.gouv.fr commune contours",
    url: "https://geo.api.gouv.fr/decoupage-administratif/communes"
  },
  {
    label: "Cite internationale universitaire de Paris location and student housing role",
    url: "https://www.ciup.fr/"
  },
  {
    label: "APUR / Paris rent-control evaluation context",
    url: "https://www.apur.org/"
  },
  {
    label: "Ile-de-France Mobilites transport network context",
    url: "https://www.iledefrance-mobilites.fr/"
  },
  {
    label: "Quartiers de reconquete republicaine: La Chapelle, Saint-Denis north, Saint-Ouen targeted areas",
    url: "https://fr.wikipedia.org/wiki/Quartier_de_reconqu%C3%AAte_r%C3%A9publicaine"
  },
  {
    label: "Le Monde: persistent street-drug problem in north-east Paris after the Olympics",
    url: "https://www.lemonde.fr/societe/article/2024/11/19/drogues-a-paris-les-usagers-de-crack-n-ont-pas-disparu-avec-les-jeux-olympiques_6401995_3224.html"
  },
  {
    label: "Le Monde: 2026 Stalingrad encampment reporting",
    url: "https://www.lemonde.fr/en/international/article/2026/06/12/the-endless-wandering-of-exiles-at-paris-s-stalingrad-metro-station_6754409_4.html"
  }
];

const bordeauxSources: Source[] = [
  {
    label: "SSMSI / data.gouv.fr crime indicators, 2025 geography",
    url: "https://www.data.gouv.fr/fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales/"
  },
  {
    label: "Bordeaux Metropole quartier boundaries (se_quart_s)",
    url: "https://datahub.bordeaux-metropole.fr/explore/dataset/se_quart_s/"
  },
  {
    label: "geo.api.gouv.fr commune contours",
    url: "https://geo.api.gouv.fr/decoupage-administratif/communes"
  },
  {
    label: "Wikipedia: Quartiers de Bordeaux",
    url: "https://fr.wikipedia.org/wiki/Quartiers_de_Bordeaux"
  },
  {
    label: "Wikipedia: Ligne B du tramway de Bordeaux",
    url: "https://fr.wikipedia.org/wiki/Ligne_B_du_tramway_de_Bordeaux"
  },
  {
    label: "Wikipedia: Saint-Michel (Bordeaux)",
    url: "https://fr.wikipedia.org/wiki/Saint-Michel_%28Bordeaux%29"
  },
  {
    label: "Wikipedia: Saint-Jean Belcier",
    url: "https://fr.wikipedia.org/wiki/Saint-Jean_Belcier"
  },
  {
    label: "Wikipedia: Les Aubiers",
    url: "https://fr.wikipedia.org/wiki/Les_Aubiers"
  },
  {
    label: "Wikipedia: Grand Parc",
    url: "https://fr.wikipedia.org/wiki/Grand_Parc"
  },
  {
    label: "Wikipedia: La Benauge",
    url: "https://fr.wikipedia.org/wiki/La_Benauge"
  },
  {
    label: "Wikipedia: La Bastide (Bordeaux)",
    url: "https://fr.wikipedia.org/wiki/La_Bastide_%28Bordeaux%29"
  },
  {
    label: "Wikipedia: Domaine universitaire de Talence Pessac Gradignan",
    url: "https://fr.wikipedia.org/wiki/Domaine_universitaire_de_Talence_Pessac_Gradignan"
  }
];

const toulouseSources: Source[] = [
  {
    label: "SSMSI / data.gouv.fr crime indicators, 2025 geography",
    url: "https://www.data.gouv.fr/fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales/"
  },
  {
    label: "Toulouse Metropole quartiers de democratie locale",
    url: "https://data.toulouse-metropole.fr/explore/dataset/quartiers-de-democratie-locale/"
  },
  {
    label: "geo.api.gouv.fr commune contours",
    url: "https://geo.api.gouv.fr/decoupage-administratif/communes"
  },
  {
    label: "Wikipedia: Quartiers de Toulouse",
    url: "https://fr.wikipedia.org/wiki/Quartiers_de_Toulouse"
  },
  {
    label: "Wikipedia: University of Toulouse",
    url: "https://en.wikipedia.org/wiki/University_of_Toulouse"
  },
  {
    label: "Tisseo transport network",
    url: "https://www.tisseo.fr/en"
  }
];

const lilleSources: Source[] = [
  {
    label: "SSMSI / data.gouv.fr crime indicators, 2025 geography",
    url: "https://www.data.gouv.fr/fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales/"
  },
  {
    label: "Lille city geoserver quartier limits",
    url: "https://data.lillemetropole.fr/geoserver/wfs?service=WFS&request=GetCapabilities"
  },
  {
    label: "geo.api.gouv.fr commune contours",
    url: "https://geo.api.gouv.fr/decoupage-administratif/communes"
  },
  {
    label: "Wikipedia: Quartiers de Lille",
    url: "https://fr.wikipedia.org/wiki/Quartiers_de_Lille"
  },
  {
    label: "Wikipedia: University of Lille",
    url: "https://en.wikipedia.org/wiki/University_of_Lille"
  },
  {
    label: "Wikipedia: Ilévia transport network",
    url: "https://en.wikipedia.org/wiki/Il%C3%A9via"
  }
];

const marseilleSources: Source[] = [
  {
    label: "SSMSI / data.gouv.fr crime indicators, 2025 geography",
    url: "https://www.data.gouv.fr/fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales/"
  },
  {
    label: "Aix-Marseille Metropole official quartiers",
    url: "https://data.ampmetropole.fr/explore/dataset/a7104f3c-e487-4af3-82ad-6197cedfaeb1/"
  },
  {
    label: "geo.api.gouv.fr commune contours",
    url: "https://geo.api.gouv.fr/decoupage-administratif/communes"
  },
  {
    label: "Wikipedia: Quartiers de Marseille",
    url: "https://fr.wikipedia.org/wiki/Quartiers_de_Marseille"
  },
  {
    label: "Wikipedia: Aix-Marseille University",
    url: "https://en.wikipedia.org/wiki/Aix-Marseille_University"
  },
  {
    label: "Wikipedia: Luminy campus",
    url: "https://fr.wikipedia.org/wiki/Luminy"
  }
];

const niceSources: Source[] = [
  {
    label: "SSMSI / data.gouv.fr crime indicators, 2025 geography",
    url: "https://www.data.gouv.fr/fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales/"
  },
  {
    label: "Nice Cote d'Azur official quartier limits (ArcGIS)",
    url: "https://cartes.nicecotedazur.org/heberge/rest/services/Limites_administratives/MapServer/10"
  },
  {
    label: "geo.api.gouv.fr commune contours",
    url: "https://geo.api.gouv.fr/decoupage-administratif/communes"
  },
  {
    label: "Wikipedia: Liste des quartiers de Nice",
    url: "https://fr.wikipedia.org/wiki/Liste_des_quartiers_de_Nice"
  },
  {
    label: "Wikipedia: Universite Cote d'Azur",
    url: "https://en.wikipedia.org/wiki/C%C3%B4te_d%27Azur_University"
  }
];

const nantesSources: Source[] = [
  {
    label: "SSMSI / data.gouv.fr crime indicators, 2025 geography",
    url: "https://www.data.gouv.fr/fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales/"
  },
  {
    label: "Nantes Metropole administrative quartiers",
    url: "https://data.nantesmetropole.fr/explore/dataset/244400404_quartiers-communes-nantes-metropole/"
  },
  {
    label: "geo.api.gouv.fr commune contours",
    url: "https://geo.api.gouv.fr/decoupage-administratif/communes"
  },
  {
    label: "Wikipedia: Liste des quartiers de Nantes",
    url: "https://fr.wikipedia.org/wiki/Liste_des_quartiers_de_Nantes"
  },
  {
    label: "Wikipedia: Nantes Universite",
    url: "https://fr.wikipedia.org/wiki/Nantes_Universit%C3%A9"
  },
  {
    label: "Wikipedia: Nantes tramway",
    url: "https://en.wikipedia.org/wiki/Nantes_tramway"
  }
];

const lyonSources: Source[] = [
  {
    label: "SSMSI / data.gouv.fr crime indicators, 2025 geography",
    url: "https://www.data.gouv.fr/fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales/"
  },
  {
    label: "Lyon city council quartier perimeters (perimetre_de_quartier)",
    url: "https://data.grandlyon.com/geoserver/ogc/features/v1/collections/ville-de-lyon:vdl_vie_citoyenne.perimetre_de_quartier/items"
  },
  {
    label: "geo.api.gouv.fr commune contours (Écully)",
    url: "https://geo.api.gouv.fr/decoupage-administratif/communes"
  },
  {
    label: "Wikipedia: Arrondissements de Lyon",
    url: "https://fr.wikipedia.org/wiki/Arrondissements_de_Lyon"
  },
  {
    label: "Wikipedia: Liste des quartiers de Lyon",
    url: "https://fr.wikipedia.org/wiki/Liste_des_quartiers_de_Lyon"
  },
  {
    label: "Wikipedia: La Guillotière",
    url: "https://fr.wikipedia.org/wiki/La_Guilloti%C3%A8re"
  },
  {
    label: "Wikipedia: Gerland",
    url: "https://fr.wikipedia.org/wiki/Gerland"
  },
  {
    label: "Wikipedia: La Doua (Villeurbanne campus cluster)",
    url: "https://fr.wikipedia.org/wiki/La_Doua"
  },
  {
    label: "Wikipedia: Mermoz (Lyon)",
    url: "https://fr.wikipedia.org/wiki/Mermoz_%28Lyon%29"
  },
  {
    label: "Wikipedia: La Duchère",
    url: "https://fr.wikipedia.org/wiki/La_Duch%C3%A8re"
  },
  {
    label: "Wikipedia: Buers",
    url: "https://fr.wikipedia.org/wiki/Buers"
  },
  {
    label: "Wikipedia: Saint-Jean (Villeurbanne)",
    url: "https://fr.wikipedia.org/wiki/Saint-Jean_%28Villeurbanne%29"
  }
];

export const cities: CityConfig[] = [
  {
    id: "paris",
    name: "Paris",
    title: "Paris districts + western suburbs",
    geojsonUrl: "/data/districts.geojson",
    center: [2.29, 48.84],
    zoom: 10.5,
    minZoom: 9.3,
    maxZoom: 15,
    defaultSelectedCode: "75101",
    areaOptions: ["Paris", "Inner suburb", "Versailles corridor"],
    sources: parisSources
  },
  {
    id: "bordeaux",
    name: "Bordeaux",
    title: "Bordeaux micro-areas + campus suburbs",
    geojsonUrl: "/data/bordeaux.geojson",
    center: [-0.579, 44.837],
    zoom: 12.5,
    minZoom: 10.5,
    maxZoom: 15,
    defaultSelectedCode: "talence-centre-forum-peixotto",
    areaOptions: ["Bordeaux", "Talence", "Pessac", "Gradignan"],
    parentFilterOptions: [
      "Bordeaux Centre",
      "Bordeaux Sud",
      "Chartrons-Grand Parc-Jardin Public",
      "Bordeaux Maritime",
      "La Bastide",
      "Nansouty-Saint-Genès",
      "Saint-Augustin-Tauzin",
      "Caudéran",
      "Talence",
      "Pessac",
      "Gradignan"
    ],
    sources: bordeauxSources
  },
  {
    id: "lyon",
    name: "Lyon",
    title: "Lyon micro-areas + Villeurbanne + Écully",
    geojsonUrl: "/data/lyon.geojson",
    center: [4.835, 45.764],
    zoom: 12,
    minZoom: 10.5,
    maxZoom: 15,
    defaultSelectedCode: "lyon-07-gerland",
    areaOptions: ["Lyon", "Villeurbanne", "Écully"],
    parentFilterOptions: [
      "Lyon 1",
      "Lyon 2",
      "Lyon 3",
      "Lyon 4",
      "Lyon 5",
      "Lyon 6",
      "Lyon 7",
      "Lyon 8",
      "Lyon 9",
      "Villeurbanne",
      "Écully"
    ],
    sources: lyonSources
  },
  {
    id: "toulouse",
    name: "Toulouse",
    title: "Toulouse micro-areas + campus belts",
    geojsonUrl: "/data/toulouse.geojson",
    center: [1.444, 43.604],
    zoom: 12,
    minZoom: 10.5,
    maxZoom: 15,
    defaultSelectedCode: "toulouse-rangueil-sauzelong",
    areaOptions: ["Centre", "Rive gauche", "Centre south", "South-east campus", "South-west campus", "North"],
    parentFilterOptions: [
      "Centre",
      "Rive gauche",
      "Centre south",
      "South-east campus",
      "South-west campus",
      "North"
    ],
    sources: toulouseSources
  },
  {
    id: "lille",
    name: "Lille",
    title: "Lille micro-areas + Villeneuve-d'Ascq campus",
    geojsonUrl: "/data/lille.geojson",
    center: [3.058, 50.632],
    zoom: 12,
    minZoom: 10.5,
    maxZoom: 15,
    defaultSelectedCode: "lille-vauban-esquermes",
    areaOptions: ["Lille Centre", "Vauban-Esquermes", "Vieux-Lille", "Wazemmes", "Moulins", "Fives", "Bois-Blancs", "Lille-Sud", "Villeneuve-d'Ascq"],
    parentFilterOptions: [
      "Lille Centre",
      "Vauban-Esquermes",
      "Vieux-Lille",
      "Wazemmes",
      "Moulins",
      "Fives",
      "Bois-Blancs",
      "Lille-Sud",
      "Villeneuve-d'Ascq"
    ],
    sources: lilleSources
  },
  {
    id: "marseille",
    name: "Marseille",
    title: "Marseille grouped student micro-areas",
    geojsonUrl: "/data/marseille.geojson",
    center: [5.369, 43.296],
    zoom: 11.6,
    minZoom: 10.5,
    maxZoom: 15,
    defaultSelectedCode: "marseille-baille-timone",
    areaOptions: [
      "Marseille 1",
      "Marseille 1/2",
      "Marseille 1/3",
      "Marseille 5",
      "Marseille 5/6",
      "Marseille 6",
      "Marseille 7",
      "Marseille 8",
      "Marseille 9",
      "Marseille 13",
      "Marseille 15"
    ],
    parentFilterOptions: [
      "Marseille 1",
      "Marseille 1/2",
      "Marseille 1/3",
      "Marseille 5",
      "Marseille 5/6",
      "Marseille 6",
      "Marseille 7",
      "Marseille 8",
      "Marseille 9",
      "Marseille 13",
      "Marseille 15"
    ],
    sources: marseilleSources
  },
  {
    id: "nice",
    name: "Nice",
    title: "Nice micro-areas + campus belts",
    geojsonUrl: "/data/nice.geojson",
    center: [7.262, 43.71],
    zoom: 12,
    minZoom: 10.5,
    maxZoom: 15,
    defaultSelectedCode: "nice-liberation-valrose",
    areaOptions: ["Centre", "Centre east", "North centre", "Centre west", "East inner city", "West campus", "North-east hills", "East", "North-east edge", "West airport"],
    parentFilterOptions: [
      "Centre",
      "Centre east",
      "North centre",
      "Centre west",
      "East inner city",
      "West campus",
      "North-east hills",
      "East",
      "North-east edge",
      "West airport"
    ],
    sources: niceSources
  },
  {
    id: "nantes",
    name: "Nantes",
    title: "Nantes administrative quartiers + campus belts",
    geojsonUrl: "/data/nantes.geojson",
    center: [-1.553, 47.218],
    zoom: 12,
    minZoom: 10.5,
    maxZoom: 15,
    defaultSelectedCode: "nantes-hauts-paves-saint-felix",
    areaOptions: [
      "Centre-ville",
      "Hauts-Pavés - Saint-Félix",
      "Nantes Nord",
      "Île de Nantes",
      "Malakoff - Saint-Donatien",
      "Dervallières - Zola",
      "Bellevue - Chantenay - Sainte-Anne",
      "Breil - Barberie",
      "Nantes Erdre",
      "Doulon - Bottière"
    ],
    parentFilterOptions: [
      "Centre-ville",
      "Hauts-Pavés - Saint-Félix",
      "Nantes Nord",
      "Île de Nantes",
      "Malakoff - Saint-Donatien",
      "Dervallières - Zola",
      "Bellevue - Chantenay - Sainte-Anne",
      "Breil - Barberie",
      "Nantes Erdre",
      "Doulon - Bottière"
    ],
    sources: nantesSources
  }
];

export const cityById = new Map<CityId, CityConfig>(cities.map((city) => [city.id, city]));


const parisPlaces: PlaceScore[] = [
  {
    cityId: "paris",
    id: "paris-01",
    name: "1st - Louvre",
    code: "75101",
    kind: "arrondissement",
    area: "Paris",
    scores: { security: 3.6, affordability: 1.8, transport: 9.8, studentEnergy: 6.2, services: 8.8, campusAccess: 7.5, greenCalm: 4.8 },
    rentLevel: "very high",
    studentFit: "mixed",
    summary: "Central, beautiful, extremely connected, but expensive and theft-heavy around tourist flows.",
    caveat: "Official per-resident crime rates are distorted by visitors and retail activity."
  },
  {
    cityId: "paris",
    id: "paris-02",
    name: "2nd - Bourse",
    code: "75102",
    kind: "arrondissement",
    area: "Paris",
    scores: { security: 5.0, affordability: 2.4, transport: 9.6, studentEnergy: 7.1, services: 8.6, campusAccess: 7.6, greenCalm: 3.8 },
    rentLevel: "very high",
    studentFit: "mixed",
    summary: "Central and convenient, but not a safe-feeling residential bargain: dense nightlife, pickpocketing, sex-work spillover, and little calm.",
    caveat: "Good for going out, weak for a student who wants quiet streets and low hassle."
  },
  {
    cityId: "paris",
    id: "paris-03",
    name: "3rd - Temple",
    code: "75103",
    kind: "arrondissement",
    area: "Paris",
    scores: { security: 6.9, affordability: 2.6, transport: 9.2, studentEnergy: 8.0, services: 8.8, campusAccess: 8.0, greenCalm: 5.2 },
    rentLevel: "very high",
    studentFit: "good",
    summary: "Excellent everyday life and central access, with a calmer feel than the most tourist-heavy core.",
    caveat: "Great if budget is not the binding constraint."
  },
  {
    cityId: "paris",
    id: "paris-04",
    name: "4th - Hotel-de-Ville",
    code: "75104",
    kind: "arrondissement",
    area: "Paris",
    scores: { security: 5.7, affordability: 2.2, transport: 9.5, studentEnergy: 8.1, services: 8.7, campusAccess: 8.1, greenCalm: 5.4 },
    rentLevel: "very high",
    studentFit: "good",
    summary: "Beautiful and hyper-central, but tourist density makes theft and harassment more relevant than the postcard image suggests.",
    caveat: "Great for access, not great value; safety is not terrible, but it is not premium either."
  },
  {
    cityId: "paris",
    id: "paris-05",
    name: "5th - Latin Quarter",
    code: "75105",
    kind: "arrondissement",
    area: "Paris",
    scores: { security: 7.2, affordability: 3.2, transport: 8.8, studentEnergy: 9.8, services: 9.0, campusAccess: 10, greenCalm: 6.8 },
    rentLevel: "high",
    studentFit: "excellent",
    summary: "One of the few places where the student-life reputation is deserved: campuses, libraries, cafes, and walkability.",
    caveat: "Still expensive and touristy near the river; do not pay luxury rent for a bad old studio."
  },
  {
    cityId: "paris",
    id: "paris-06",
    name: "6th - Luxembourg",
    code: "75106",
    kind: "arrondissement",
    area: "Paris",
    scores: { security: 7.5, affordability: 1.8, transport: 9.0, studentEnergy: 8.3, services: 9.0, campusAccess: 9.4, greenCalm: 7.0 },
    rentLevel: "very high",
    studentFit: "good",
    summary: "Excellent study environment, safer than the party districts, and close to top academic infrastructure.",
    caveat: "The brutal truth is price: most students should only choose it with family money or a rare deal."
  },
  {
    cityId: "paris",
    id: "paris-07",
    name: "7th - Palais-Bourbon",
    code: "75107",
    kind: "arrondissement",
    area: "Paris",
    scores: { security: 8.0, affordability: 1.7, transport: 8.4, studentEnergy: 5.2, services: 8.0, campusAccess: 7.5, greenCalm: 6.6 },
    rentLevel: "very high",
    studentFit: "mixed",
    summary: "Safe and orderly, but socially dead for many students and brutally overpriced.",
    caveat: "A good safety score, not a good student-value score."
  },
  {
    cityId: "paris",
    id: "paris-08",
    name: "8th - Elysee",
    code: "75108",
    kind: "arrondissement",
    area: "Paris",
    scores: { security: 4.9, affordability: 1.6, transport: 9.4, studentEnergy: 4.7, services: 8.4, campusAccess: 6.8, greenCalm: 5.6 },
    rentLevel: "very high",
    studentFit: "weak",
    summary: "Office/luxury district with ugly value for students; visitor and retail crime make the safety numbers look worse than resident life.",
    caveat: "Do not mistake prestige for student quality."
  },
  {
    cityId: "paris",
    id: "paris-09",
    name: "9th - Opera",
    code: "75109",
    kind: "arrondissement",
    area: "Paris",
    scores: { security: 5.8, affordability: 3.0, transport: 9.5, studentEnergy: 8.3, services: 8.9, campusAccess: 7.8, greenCalm: 4.4 },
    rentLevel: "high",
    studentFit: "good",
    summary: "Fun and practical, but noisy and theft-prone around nightlife and station flows.",
    caveat: "Good for social life; mediocre for calm and not cheap enough to be a bargain."
  },
  {
    cityId: "paris",
    id: "paris-10",
    name: "10th - Entrepot",
    code: "75110",
    kind: "arrondissement",
    area: "Paris",
    scores: { security: 3.8, affordability: 4.4, transport: 9.4, studentEnergy: 8.8, services: 8.4, campusAccess: 8.0, greenCalm: 4.0 },
    rentLevel: "medium",
    studentFit: "good",
    summary: "Useful but rough: Gare du Nord, Gare de l'Est, La Chapelle and Stalingrad exposure make this a bad default for safety-sensitive students.",
    caveat: "Some streets are fine. The district average deserves a hard penalty because the bad pockets are real and highly visible."
  },
  {
    cityId: "paris",
    id: "paris-11",
    name: "11th - Popincourt",
    code: "75111",
    kind: "arrondissement",
    area: "Paris",
    scores: { security: 6.8, affordability: 4.5, transport: 9.2, studentEnergy: 9.3, services: 9.0, campusAccess: 8.5, greenCalm: 4.8 },
    rentLevel: "medium",
    studentFit: "excellent",
    summary: "Probably the best social/student compromise inside Paris, but not calm and not risk-free at night.",
    caveat: "Good score is deserved for lifestyle, not because it is especially quiet or safe."
  },
  {
    cityId: "paris",
    id: "paris-12",
    name: "12th - Reuilly",
    code: "75112",
    kind: "arrondissement",
    area: "Paris",
    scores: { security: 7.0, affordability: 5.1, transport: 8.8, studentEnergy: 7.2, services: 8.2, campusAccess: 7.4, greenCalm: 8.4 },
    rentLevel: "medium",
    studentFit: "good",
    summary: "Good transport, more space, and access to green areas; less iconic but livable.",
    caveat: "Score depends on whether you are near Bastille/Daumesnil or the far eastern edge."
  },
  {
    cityId: "paris",
    id: "paris-13",
    name: "13th - Gobelins",
    code: "75113",
    kind: "arrondissement",
    area: "Paris",
    scores: { security: 7.3, affordability: 5.7, transport: 8.5, studentEnergy: 8.8, services: 8.5, campusAccess: 9.1, greenCalm: 6.2 },
    rentLevel: "medium",
    studentFit: "excellent",
    summary: "Strong student district around universities, libraries, Asian food, and comparatively better value.",
    caveat: "Some towers and large roads feel less village-like, but quality is solid."
  },
  {
    cityId: "paris",
    id: "paris-14",
    name: "14th - Observatoire",
    code: "75114",
    kind: "arrondissement",
    area: "Paris",
    scores: { security: 7.8, affordability: 5.3, transport: 8.6, studentEnergy: 8.5, services: 8.4, campusAccess: 9.7, greenCalm: 8.0 },
    rentLevel: "medium",
    studentFit: "excellent",
    summary: "One of the strongest genuinely deserved scores: student infrastructure, Montsouris, left-bank access, and calmer streets.",
    caveat: "Less party energy than the east, but that is part of why it works."
  },
  {
    cityId: "paris",
    id: "paris-15",
    name: "15th - Vaugirard",
    code: "75115",
    kind: "arrondissement",
    area: "Paris",
    scores: { security: 8.0, affordability: 4.8, transport: 8.8, studentEnergy: 6.8, services: 8.8, campusAccess: 7.5, greenCalm: 6.9 },
    rentLevel: "high",
    studentFit: "good",
    summary: "Safe, practical, and boring in a useful way. Good if you want stability more than nightlife.",
    caveat: "Not cheap, not exciting, but the safety score is deserved."
  },
  {
    cityId: "paris",
    id: "paris-16",
    name: "16th - Passy",
    code: "75116",
    kind: "arrondissement",
    area: "Paris",
    scores: { security: 8.3, affordability: 1.9, transport: 7.8, studentEnergy: 4.6, services: 7.6, campusAccess: 5.8, greenCalm: 8.7 },
    rentLevel: "very high",
    studentFit: "weak",
    summary: "Safe, wealthy, calm, and usually a poor fit for normal student life.",
    caveat: "Good safety, bad value and weak student atmosphere."
  },
  {
    cityId: "paris",
    id: "paris-17",
    name: "17th - Batignolles",
    code: "75117",
    kind: "arrondissement",
    area: "Paris",
    scores: { security: 7.6, affordability: 4.0, transport: 8.4, studentEnergy: 6.8, services: 8.4, campusAccess: 6.7, greenCalm: 6.8 },
    rentLevel: "high",
    studentFit: "good",
    summary: "Pleasant and increasingly lively, with good services and calmer residential streets.",
    caveat: "Less campus-dense than the left bank and east."
  },
  {
    cityId: "paris",
    id: "paris-18",
    name: "18th - Butte-Montmartre",
    code: "75118",
    kind: "arrondissement",
    area: "Paris",
    scores: { security: 3.6, affordability: 5.6, transport: 8.3, studentEnergy: 8.7, services: 8.0, campusAccess: 6.9, greenCalm: 5.4 },
    rentLevel: "medium",
    studentFit: "mixed",
    summary: "Do not average Montmartre charm with Goutte-d'Or, Barbes, Chateau Rouge, Porte de la Chapelle and La Chapelle. The rough pockets dominate the safety verdict.",
    caveat: "Can be fun and affordable, but it deserves a severe safety penalty unless you know the exact block."
  },
  {
    cityId: "paris",
    id: "paris-19",
    name: "19th - Buttes-Chaumont",
    code: "75119",
    kind: "arrondissement",
    area: "Paris",
    scores: { security: 5.2, affordability: 6.4, transport: 8.0, studentEnergy: 8.0, services: 7.7, campusAccess: 7.2, greenCalm: 8.7 },
    rentLevel: "medium",
    studentFit: "mixed",
    summary: "Good parks and value, but Stalingrad/Jaures/Ourcq edges and north-east street disorder make this much less safe-feeling than the greenery suggests.",
    caveat: "Buttes-Chaumont side can be good; Stalingrad and isolated canal edges deserve a hard penalty."
  },
  {
    cityId: "paris",
    id: "paris-20",
    name: "20th - Menilmontant",
    code: "75120",
    kind: "arrondissement",
    area: "Paris",
    scores: { security: 6.4, affordability: 6.2, transport: 8.0, studentEnergy: 8.6, services: 7.8, campusAccess: 7.5, greenCalm: 7.0 },
    rentLevel: "medium",
    studentFit: "good",
    summary: "Good student value and atmosphere, but not premium-safe; some eastern/northern edges feel rough late.",
    caveat: "Still one of the better east-side compromises, just not green by default."
  },
  {
    cityId: "paris",
    id: "boulogne",
    name: "Boulogne-Billancourt",
    code: "92012",
    kind: "commune",
    area: "Inner suburb",
    scores: { security: 8.2, affordability: 3.8, transport: 8.4, studentEnergy: 5.8, services: 8.6, campusAccess: 6.4, greenCalm: 7.8 },
    rentLevel: "high",
    studentFit: "good",
    summary: "Safe and polished, but expensive and not especially student-social.",
    caveat: "Deserves a good safety score, not an automatic top student-life score."
  },
  {
    cityId: "paris",
    id: "issy",
    name: "Issy-les-Moulineaux",
    code: "92040",
    kind: "commune",
    area: "Inner suburb",
    scores: { security: 8.4, affordability: 4.4, transport: 8.4, studentEnergy: 5.8, services: 8.2, campusAccess: 6.8, greenCalm: 7.3 },
    rentLevel: "high",
    studentFit: "good",
    summary: "Safe and efficient with metro/tram/RER options; more professional-residential than studenty.",
    caveat: "Good choice for western/southern campuses or internships."
  },
  {
    cityId: "paris",
    id: "montrouge",
    name: "Montrouge",
    code: "92049",
    kind: "commune",
    area: "Inner suburb",
    scores: { security: 8.3, affordability: 5.5, transport: 8.2, studentEnergy: 6.7, services: 8.0, campusAccess: 8.8, greenCalm: 6.5 },
    rentLevel: "medium",
    studentFit: "excellent",
    summary: "A genuinely strong close-suburb option: safer than the north-east, cheaper than central Paris, and close to Cite U/14th.",
    caveat: "Less nightlife, but that is a reasonable trade for safety."
  },
  {
    cityId: "paris",
    id: "clichy",
    name: "Clichy",
    code: "92024",
    kind: "commune",
    area: "Inner suburb",
    scores: { security: 5.9, affordability: 5.7, transport: 8.0, studentEnergy: 6.5, services: 7.7, campusAccess: 6.5, greenCalm: 5.5 },
    rentLevel: "medium",
    studentFit: "mixed",
    summary: "Practical and improving, but it does not deserve a green safety rating. It is a value compromise, not a comfort pick.",
    caveat: "Choose exact streets carefully; do not price it like Levallois."
  },
  {
    cityId: "paris",
    id: "saint-ouen",
    name: "Saint-Ouen-sur-Seine",
    code: "93070",
    kind: "commune",
    area: "Inner suburb",
    scores: { security: 3.9, affordability: 6.1, transport: 8.4, studentEnergy: 7.3, services: 7.4, campusAccess: 6.7, greenCalm: 5.2 },
    rentLevel: "medium",
    studentFit: "mixed",
    summary: "Better transport after line 14, but the safety reputation is still bad enough to cap the score hard.",
    caveat: "Targeted policing areas are a warning sign; do not let cheap rent or new metro access hide that."
  },
  {
    cityId: "paris",
    id: "levallois",
    name: "Levallois-Perret",
    code: "92044",
    kind: "commune",
    area: "Inner suburb",
    scores: { security: 8.4, affordability: 3.5, transport: 8.0, studentEnergy: 5.0, services: 8.4, campusAccess: 5.8, greenCalm: 6.0 },
    rentLevel: "high",
    studentFit: "mixed",
    summary: "Safe, clean, and convenient, but expensive and more family/professional than student.",
    caveat: "Good if safety outweighs social atmosphere."
  },
  {
    cityId: "paris",
    id: "neuilly",
    name: "Neuilly-sur-Seine",
    code: "92051",
    kind: "commune",
    area: "Inner suburb",
    scores: { security: 8.8, affordability: 1.8, transport: 7.8, studentEnergy: 3.8, services: 7.8, campusAccess: 5.2, greenCalm: 7.4 },
    rentLevel: "very high",
    studentFit: "weak",
    summary: "Very safe and comfortable, but usually a poor student-life value.",
    caveat: "The score is held back almost entirely by price and weak student energy."
  },
  {
    cityId: "paris",
    id: "vincennes",
    name: "Vincennes",
    code: "94080",
    kind: "commune",
    area: "Inner suburb",
    scores: { security: 8.3, affordability: 4.5, transport: 8.6, studentEnergy: 6.6, services: 8.4, campusAccess: 7.2, greenCalm: 9.0 },
    rentLevel: "high",
    studentFit: "good",
    summary: "Safe, green, and very connected via line 1/RER A; pricey but high quality.",
    caveat: "Better for balanced living than nightlife."
  },
  {
    cityId: "paris",
    id: "montreuil",
    name: "Montreuil",
    code: "93048",
    kind: "commune",
    area: "Inner suburb",
    scores: { security: 5.4, affordability: 6.5, transport: 7.6, studentEnergy: 8.0, services: 7.6, campusAccess: 7.4, greenCalm: 5.8 },
    rentLevel: "medium",
    studentFit: "mixed",
    summary: "Creative and affordable, but not green-safe. It is block-by-block and should be treated as a value/risk trade.",
    caveat: "Good for tolerant, street-smart students near metro; bad for anyone prioritizing calm."
  },
  {
    cityId: "paris",
    id: "saint-denis",
    name: "Saint-Denis",
    code: "93066",
    kind: "commune",
    area: "Inner suburb",
    scores: { security: 2.2, affordability: 7.1, transport: 8.0, studentEnergy: 7.2, services: 7.2, campusAccess: 7.4, greenCalm: 4.8 },
    rentLevel: "lower",
    studentFit: "mixed",
    summary: "Cheap and connected, but the safety reputation is bad enough that it should be a no-by-default recommendation for most students.",
    caveat: "Only consider it with local knowledge, a specific safe route, and a strong reason. Affordability does not redeem the risk."
  },
  {
    cityId: "paris",
    id: "nanterre",
    name: "Nanterre",
    code: "92050",
    kind: "commune",
    area: "Inner suburb",
    scores: { security: 5.7, affordability: 6.0, transport: 7.7, studentEnergy: 7.2, services: 7.4, campusAccess: 8.2, greenCalm: 6.2 },
    rentLevel: "medium",
    studentFit: "mixed",
    summary: "Useful for Paris Nanterre, but mixed and not comfort-safe by default.",
    caveat: "Campus/RER proximity can make it workable; the commune average should not be sold as easy."
  },
  {
    cityId: "paris",
    id: "courbevoie",
    name: "Courbevoie",
    code: "92026",
    kind: "commune",
    area: "Inner suburb",
    scores: { security: 8.0, affordability: 4.2, transport: 7.8, studentEnergy: 4.9, services: 8.0, campusAccess: 6.0, greenCalm: 6.4 },
    rentLevel: "high",
    studentFit: "mixed",
    summary: "Safe and practical near La Defense, but office-oriented and not cheap.",
    caveat: "Best for internships or western campuses."
  },
  {
    cityId: "paris",
    id: "puteaux",
    name: "Puteaux / La Defense edge",
    code: "92062",
    kind: "commune",
    area: "Inner suburb",
    scores: { security: 6.2, affordability: 4.1, transport: 8.4, studentEnergy: 4.8, services: 8.2, campusAccess: 6.1, greenCalm: 6.4 },
    rentLevel: "high",
    studentFit: "mixed",
    summary: "Useful for La Defense, but office flows and price make it mediocre for student life.",
    caveat: "Not unsafe like the north-east, but not green-worthy either."
  },
  {
    cityId: "paris",
    id: "suresnes",
    name: "Suresnes",
    code: "92073",
    kind: "commune",
    area: "Versailles corridor",
    scores: { security: 8.0, affordability: 4.8, transport: 6.9, studentEnergy: 4.7, services: 7.5, campusAccess: 5.8, greenCalm: 8.0 },
    rentLevel: "medium",
    studentFit: "mixed",
    summary: "Safe and pleasant with good calm, but weaker metro access and student density.",
    caveat: "Commute is the main limiter."
  },
  {
    cityId: "paris",
    id: "saint-cloud",
    name: "Saint-Cloud",
    code: "92064",
    kind: "commune",
    area: "Versailles corridor",
    scores: { security: 8.1, affordability: 3.8, transport: 6.8, studentEnergy: 3.9, services: 7.2, campusAccess: 5.4, greenCalm: 8.8 },
    rentLevel: "high",
    studentFit: "mixed",
    summary: "Very calm and green, but expensive and not very student-oriented.",
    caveat: "Good quality of life, weaker student convenience."
  },
  {
    cityId: "paris",
    id: "sevres",
    name: "Sevres",
    code: "92072",
    kind: "commune",
    area: "Versailles corridor",
    scores: { security: 8.0, affordability: 4.7, transport: 6.8, studentEnergy: 4.5, services: 7.2, campusAccess: 5.5, greenCalm: 7.8 },
    rentLevel: "medium",
    studentFit: "mixed",
    summary: "Pleasant and safe western suburb, but commute and student scene are middling.",
    caveat: "Works better for west/south-west campuses."
  },
  {
    cityId: "paris",
    id: "meudon",
    name: "Meudon",
    code: "92048",
    kind: "commune",
    area: "Versailles corridor",
    scores: { security: 8.2, affordability: 5.0, transport: 6.8, studentEnergy: 4.5, services: 7.2, campusAccess: 5.8, greenCalm: 9.0 },
    rentLevel: "medium",
    studentFit: "mixed",
    summary: "Safe, green, and livable, but less immediate for central student life.",
    caveat: "Transit quality depends strongly on station proximity."
  },
  {
    cityId: "paris",
    id: "clamart",
    name: "Clamart",
    code: "92023",
    kind: "commune",
    area: "Versailles corridor",
    scores: { security: 8.0, affordability: 5.4, transport: 6.6, studentEnergy: 4.6, services: 7.0, campusAccess: 5.8, greenCalm: 8.6 },
    rentLevel: "medium",
    studentFit: "mixed",
    summary: "Calm and comparatively safe, with better value than Paris but weaker student access.",
    caveat: "Choose carefully around train/tram links."
  },
  {
    cityId: "paris",
    id: "vanves",
    name: "Vanves",
    code: "92075",
    kind: "commune",
    area: "Inner suburb",
    scores: { security: 8.4, affordability: 5.0, transport: 8.0, studentEnergy: 5.8, services: 7.8, campusAccess: 7.6, greenCalm: 6.4 },
    rentLevel: "medium",
    studentFit: "good",
    summary: "Safe, close, and practical for south-west Paris access; quietly strong.",
    caveat: "Not a nightlife district."
  },
  {
    cityId: "paris",
    id: "malakoff",
    name: "Malakoff",
    code: "92046",
    kind: "commune",
    area: "Inner suburb",
    scores: { security: 7.5, affordability: 5.7, transport: 7.8, studentEnergy: 6.5, services: 7.6, campusAccess: 7.8, greenCalm: 6.0 },
    rentLevel: "medium",
    studentFit: "good",
    summary: "Solid south-side compromise: cheaper than Paris and close to the 14th, but not polished.",
    caveat: "Good practical score; not a luxury/safety score."
  },
  {
    cityId: "paris",
    id: "gentilly",
    name: "Gentilly",
    code: "94037",
    kind: "commune",
    area: "Inner suburb",
    scores: { security: 6.0, affordability: 6.0, transport: 7.4, studentEnergy: 6.3, services: 6.8, campusAccess: 8.7, greenCalm: 5.6 },
    rentLevel: "medium",
    studentFit: "mixed",
    summary: "Useful for Cite U and cheaper than Paris, but rougher and less comfortable than the 14th/Montrouge.",
    caveat: "Only good if the exact commute and street are good."
  },
  {
    cityId: "paris",
    id: "ivry",
    name: "Ivry-sur-Seine",
    code: "94041",
    kind: "commune",
    area: "Inner suburb",
    scores: { security: 5.8, affordability: 6.8, transport: 7.6, studentEnergy: 7.1, services: 7.4, campusAccess: 8.2, greenCalm: 5.3 },
    rentLevel: "lower",
    studentFit: "mixed",
    summary: "Affordable and useful for the 13th, but industrial/uneven enough that it should not be green.",
    caveat: "Value pick, not comfort pick."
  },
  {
    cityId: "paris",
    id: "villejuif",
    name: "Villejuif",
    code: "94076",
    kind: "commune",
    area: "Inner suburb",
    scores: { security: 6.1, affordability: 6.7, transport: 7.8, studentEnergy: 6.2, services: 7.0, campusAccess: 7.8, greenCalm: 5.8 },
    rentLevel: "lower",
    studentFit: "mixed",
    summary: "Good price and line 7 access, but not a high-comfort student area.",
    caveat: "Works for specific south-side campuses; otherwise it is a commute/value compromise."
  },
  {
    cityId: "paris",
    id: "chaville",
    name: "Chaville",
    code: "92022",
    kind: "commune",
    area: "Versailles corridor",
    scores: { security: 8.4, affordability: 5.2, transport: 6.8, studentEnergy: 3.9, services: 6.8, campusAccess: 5.2, greenCalm: 9.1 },
    rentLevel: "medium",
    studentFit: "mixed",
    summary: "Safe, green, and quiet between Paris and Versailles; student life is limited.",
    caveat: "Great calm, weaker convenience."
  },
  {
    cityId: "paris",
    id: "viroflay",
    name: "Viroflay",
    code: "78686",
    kind: "commune",
    area: "Versailles corridor",
    scores: { security: 8.7, affordability: 5.4, transport: 6.8, studentEnergy: 3.8, services: 6.8, campusAccess: 5.1, greenCalm: 9.2 },
    rentLevel: "medium",
    studentFit: "mixed",
    summary: "Very safe and calm on the Versailles approach, but low student density.",
    caveat: "Works only if the commute matches your campus."
  },
  {
    cityId: "paris",
    id: "velizy",
    name: "Velizy-Villacoublay",
    code: "78640",
    kind: "commune",
    area: "Versailles corridor",
    scores: { security: 8.0, affordability: 5.7, transport: 5.8, studentEnergy: 4.3, services: 7.2, campusAccess: 5.2, greenCalm: 8.0 },
    rentLevel: "medium",
    studentFit: "mixed",
    summary: "Safe and practical for some south-west jobs/campuses, but transit to Paris is weaker.",
    caveat: "Good value only if you do not need daily central Paris access."
  },
  {
    cityId: "paris",
    id: "saint-cyr",
    name: "Saint-Cyr-l'Ecole",
    code: "78545",
    kind: "commune",
    area: "Versailles corridor",
    scores: { security: 7.4, affordability: 6.3, transport: 6.4, studentEnergy: 4.7, services: 6.8, campusAccess: 5.0, greenCalm: 7.8 },
    rentLevel: "medium",
    studentFit: "mixed",
    summary: "More affordable Versailles-side option, but far for central student life.",
    caveat: "Best for western schools or a calm budget-first profile."
  },
  {
    cityId: "paris",
    id: "versailles",
    name: "Versailles",
    code: "78646",
    kind: "commune",
    area: "Versailles corridor",
    scores: { security: 8.4, affordability: 4.6, transport: 7.2, studentEnergy: 5.7, services: 8.2, campusAccess: 5.8, greenCalm: 9.0 },
    rentLevel: "high",
    studentFit: "good",
    summary: "Safe, beautiful, and service-rich, but too far for many Paris student routines.",
    caveat: "Great if your school is west. Bad if you need daily central/east Paris."
  }
];

export const placesByCity: Record<CityId, PlaceScore[]> = {
  paris: parisPlaces,
  bordeaux: bordeauxMicroPlaces,
  lyon: lyonMicroPlaces,
  toulouse: toulouseMicroPlaces,
  lille: lilleMicroPlaces,
  marseille: marseilleMicroPlaces,
  nice: niceMicroPlaces,
  nantes: nantesMicroPlaces
};

export function isMapPlace(place: PlaceScore) {
  return place.granularity !== "macro";
}

export function getPlacesForCity(cityId: CityId): PlaceScore[] {
  return placesByCity[cityId].filter(isMapPlace);
}

export function getMacroPlacesForCity(cityId: CityId): PlaceScore[] {
  if (cityId === "lyon") {
    return lyonMacroPlaces;
  }

  if (cityId === "bordeaux") {
    return bordeauxMacroPlaces;
  }

  return [];
}

const allPlaces = [
  ...parisPlaces,
  ...bordeauxMicroPlaces,
  ...bordeauxMacroPlaces,
  ...lyonMicroPlaces,
  ...lyonMacroPlaces,
  ...toulouseMicroPlaces,
  ...lilleMicroPlaces,
  ...marseilleMicroPlaces,
  ...niceMicroPlaces,
  ...nantesMicroPlaces
];
export const placeByCode = new Map<string, PlaceScore>(allPlaces.map((place) => [place.code, place]));
