import type { PlaceScore } from "@/data/cities";

export const toulouseMicroPlaces: PlaceScore[] = [
  {
    id: "toulouse-capitole-carmes-esquirol", cityId: "toulouse", name: "Capitole / Carmes / Esquirol", code: "toulouse-capitole-carmes-esquirol", kind: "quartier",
    area: "Centre", granularity: "micro", parentName: "Centre",
    confidence: "medium",
    evidenceNote: "Split from official Capitole / Arnaud Bernard / Carmes quartier (medium confidence).",
    scores: {
      security: 5.8,
      affordability: 2.4,
      transport: 9.6,
      studentEnergy: 8.8,
      services: 9.3,
      campusAccess: 8.8,
      greenCalm: 4.2
    },
    rentLevel: "very high", studentFit: "good",
    summary: "Useful and beautiful centre with strong services, but rent and tourist exposure hold it down.", caveat: "Do not pay prestige rents for a rough old studio near the party core."
  },
  {
    id: "toulouse-arnaud-bernard-saint-sernin", cityId: "toulouse", name: "Arnaud-Bernard / Saint-Sernin", code: "toulouse-arnaud-bernard-saint-sernin", kind: "quartier",
    area: "Centre", granularity: "micro", parentName: "Centre",
    confidence: "low",
    evidenceNote: "Split from official Capitole / Arnaud Bernard / Carmes quartier (low confidence).",
    scores: {
      security: 4.9,
      affordability: 4.2,
      transport: 9.0,
      studentEnergy: 9.4,
      services: 8.4,
      campusAccess: 9.0,
      greenCalm: 3.8
    },
    rentLevel: "high", studentFit: "mixed",
    summary: "High-energy student streets near Saint-Sernin, but disorder and late-night friction are real.", caveat: "Energy is real; comfort is not — stay a high-friction pick, not a generic centre score."
  },
  {
    id: "toulouse-compans-amidonniers", cityId: "toulouse", name: "Compans / Amidonniers", code: "toulouse-compans-amidonniers", kind: "quartier",
    area: "Centre", granularity: "micro", parentName: "Centre",
    confidence: "medium",
    evidenceNote: "Official Toulouse quartier polygon (medium confidence).",
    scores: {
      security: 6.8,
      affordability: 3.8,
      transport: 8.8,
      studentEnergy: 7.2,
      services: 8.4,
      campusAccess: 8.0,
      greenCalm: 7.0
    },
    rentLevel: "high", studentFit: "good",
    summary: "Calmer central compromise with better green calm than the party districts.", caveat: "Good if you want centre access without Arnaud-Bernard chaos."
  },
  {
    id: "toulouse-chalets-bayard-saint-aubin", cityId: "toulouse", name: "Chalets / Bayard / Saint-Aubin", code: "toulouse-chalets-bayard-saint-aubin", kind: "quartier",
    area: "Centre", granularity: "micro", parentName: "Centre",
    confidence: "medium",
    evidenceNote: "Official Toulouse quartier polygon (medium confidence).",
    scores: {
      security: 6.2,
      affordability: 3.6,
      transport: 9.0,
      studentEnergy: 8.4,
      services: 8.4,
      campusAccess: 8.2,
      greenCalm: 4.8
    },
    rentLevel: "high", studentFit: "good",
    summary: "Lively east-centre belt with strong services and metro access.", caveat: "Still expensive and not especially calm."
  },
  {
    id: "toulouse-saint-cyprien-patte-doie", cityId: "toulouse", name: "Saint-Cyprien / Patte-d'Oie", code: "toulouse-saint-cyprien-patte-doie", kind: "quartier",
    area: "Rive gauche", granularity: "micro", parentName: "Rive gauche",
    confidence: "medium",
    evidenceNote: "Official Toulouse quartier polygon (medium confidence).",
    scores: {
      security: 6.7,
      affordability: 4.8,
      transport: 8.8,
      studentEnergy: 8.5,
      services: 8.2,
      campusAccess: 8.0,
      greenCalm: 6.0
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Best centre-adjacent compromise on the left bank with relative value and student life.", caveat: "Strong first-pass pick, but not a campus-default like Rangueil."
  },
  {
    id: "toulouse-saint-michel-saint-agne", cityId: "toulouse", name: "Saint-Michel / Saint-Agne", code: "toulouse-saint-michel-saint-agne", kind: "quartier",
    area: "Centre south", granularity: "micro", parentName: "Centre south",
    confidence: "medium",
    evidenceNote: "Split from Saint-Michel / Empalot official quartier (medium confidence).",
    scores: {
      security: 5.4,
      affordability: 5.4,
      transport: 8.8,
      studentEnergy: 8.4,
      services: 8.0,
      campusAccess: 8.8,
      greenCalm: 4.5
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Useful south-centre student belt with metro and campus links.", caveat: "Split from a large official quartier; block choice still matters."
  },
  {
    id: "toulouse-empalot", cityId: "toulouse", name: "Empalot", code: "toulouse-empalot", kind: "quartier",
    area: "Centre south", granularity: "micro", parentName: "Centre south",
    confidence: "low",
    evidenceNote: "Split from Saint-Michel / Empalot official quartier (low confidence).",
    scores: {
      security: 4.4,
      affordability: 7.0,
      transport: 8.0,
      studentEnergy: 6.0,
      services: 6.8,
      campusAccess: 8.0,
      greenCalm: 5.0
    },
    rentLevel: "lower", studentFit: "mixed",
    summary: "Affordable southern pocket with campus utility, but safety cap dominates.", caveat: "Do not let metro access or rent rescue a hard safety penalty."
  },
  {
    id: "toulouse-rangueil-sauzelong", cityId: "toulouse", name: "Rangueil / Sauzelong / Jules-Julien", code: "toulouse-rangueil-sauzelong", kind: "quartier",
    area: "South-east campus", granularity: "micro", parentName: "South-east campus",
    confidence: "medium",
    evidenceNote: "Official Toulouse campus quartier polygon (medium confidence).",
    scores: {
      security: 7.0,
      affordability: 5.6,
      transport: 8.6,
      studentEnergy: 8.8,
      services: 7.8,
      campusAccess: 10.0,
      greenCalm: 7.0
    },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Top student score because campus access is structural, not vibes-driven.", caveat: "Best for campus-first students, not for a historic-centre lifestyle."
  },
  {
    id: "toulouse-mirail-reynerie-bellefontaine", cityId: "toulouse", name: "Mirail / Reynerie / Bellefontaine", code: "toulouse-mirail-reynerie-bellefontaine", kind: "quartier",
    area: "South-west campus", granularity: "micro", parentName: "South-west campus",
    confidence: "medium",
    evidenceNote: "Official Toulouse quartier polygon (medium confidence).",
    scores: {
      security: 3.8,
      affordability: 7.4,
      transport: 8.0,
      studentEnergy: 6.8,
      services: 6.8,
      campusAccess: 8.8,
      greenCalm: 5.6
    },
    rentLevel: "lower", studentFit: "mixed",
    summary: "Cheap campus-linked belt that stays hard-capped on safety.", caveat: "Affordability and metro access do not redeem the risk profile."
  },
  {
    id: "toulouse-minimes-barriere-paris", cityId: "toulouse", name: "Minimes / Barrière de Paris / La Vache", code: "toulouse-minimes-barriere-paris", kind: "quartier",
    area: "North", granularity: "micro", parentName: "North",
    confidence: "medium",
    evidenceNote: "Official Toulouse quartier polygon (medium confidence).",
    scores: {
      security: 5.8,
      affordability: 5.8,
      transport: 8.6,
      studentEnergy: 7.0,
      services: 7.6,
      campusAccess: 7.2,
      greenCalm: 5.8
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Practical northern sector with metro access and tolerable value.", caveat: "Practical, not premium-safe or especially student-social."
  },
];
