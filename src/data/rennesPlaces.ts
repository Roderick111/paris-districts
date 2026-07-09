import type { PlaceScore } from "@/data/cities";

export const rennesPlaces: PlaceScore[] = [
  {
    id: "rennes-centre", cityId: "rennes", name: "Centre", code: "rennes-centre", kind: "quartier",
    area: "Centre", granularity: "micro", parentName: "Centre",
    confidence: "high", coverageRole: "primary", geometryBasis: "official_quartier",
    evidenceNote: "Official Rennes administrative quartier polygon.",
    scores: {
      security: 6.4,
      affordability: 3.4,
      transport: 9.8,
      studentEnergy: 9.2,
      services: 9.2,
      campusAccess: 8.8,
      greenCalm: 4.4
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "High-energy centre with strong services and tram access.", caveat: "Rent and nightlife friction are real; not a calm pick."
  },
  {
    id: "rennes-thabor-saint-helier-alphonse-guerin", cityId: "rennes", name: "Thabor / Saint-Helier / Alphonse Guerin", code: "rennes-thabor-saint-helier-alphonse-guerin", kind: "quartier",
    area: "East centre", granularity: "micro", parentName: "East centre",
    confidence: "high", coverageRole: "primary", geometryBasis: "official_quartier",
    evidenceNote: "Official Rennes administrative quartier polygon.",
    scores: {
      security: 7.8,
      affordability: 3.2,
      transport: 9.0,
      studentEnergy: 7.8,
      services: 8.8,
      campusAccess: 8.6,
      greenCalm: 8.0
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Premium east-centre belt with park calm and strong services.", caveat: "Leads Rennes on balanced quality; still not cheap."
  },
  {
    id: "rennes-bourg-levesque-la-touche-moulin-du-comte", cityId: "rennes", name: "Bourg-l'Evesque / La Touche / Moulin du Comte", code: "rennes-bourg-levesque-la-touche-moulin-du-comte", kind: "quartier",
    area: "West centre", granularity: "micro", parentName: "West centre",
    confidence: "high", coverageRole: "primary", geometryBasis: "official_quartier",
    evidenceNote: "Official Rennes administrative quartier polygon.",
    scores: {
      security: 6.4,
      affordability: 4.2,
      transport: 8.8,
      studentEnergy: 7.6,
      services: 8.2,
      campusAccess: 8.4,
      greenCalm: 6.0
    },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced west-centre residential pick with good campus links.", caveat: "Less social than Centre or Thabor."
  },
  {
    id: "rennes-nord-saint-martin", cityId: "rennes", name: "Nord / Saint-Martin", code: "rennes-nord-saint-martin", kind: "quartier",
    area: "North", granularity: "micro", parentName: "North",
    confidence: "high", coverageRole: "primary", geometryBasis: "official_quartier",
    evidenceNote: "Official Rennes administrative quartier polygon.",
    scores: {
      security: 6.2,
      affordability: 4.8,
      transport: 8.6,
      studentEnergy: 6.8,
      services: 7.8,
      campusAccess: 7.8,
      greenCalm: 6.6
    },
    rentLevel: "high", studentFit: "good",
    summary: "Practical northern belt with metro access and tolerable value.", caveat: "Commuter-value zone, not a headline student scene."
  },
  {
    id: "rennes-maurepas-patton", cityId: "rennes", name: "Maurepas / Patton", code: "rennes-maurepas-patton", kind: "quartier",
    area: "North cap", granularity: "micro", parentName: "North cap",
    confidence: "high", coverageRole: "risk_cap", geometryBasis: "official_quartier",
    evidenceNote: "Official Rennes administrative quartier polygon.",
    scores: {
      security: 4.8,
      affordability: 6.8,
      transport: 8.2,
      studentEnergy: 6.0,
      services: 7.0,
      campusAccess: 6.8,
      greenCalm: 6.0
    },
    rentLevel: "lower", studentFit: "mixed",
    summary: "Affordable north belt capped by safety profile.", caveat: "Value trade, not a comfort default."
  },
  {
    id: "rennes-jeanne-darc-longs-champs-beaulieu", cityId: "rennes", name: "Jeanne d'Arc / Longs-Champs / Beaulieu", code: "rennes-jeanne-darc-longs-champs-beaulieu", kind: "quartier",
    area: "North-east campus", granularity: "micro", parentName: "North-east campus",
    confidence: "high", coverageRole: "campus", geometryBasis: "official_quartier",
    evidenceNote: "Official Rennes administrative quartier polygon.",
    scores: {
      security: 7.2,
      affordability: 4.8,
      transport: 8.6,
      studentEnergy: 7.4,
      services: 7.8,
      campusAccess: 9.4,
      greenCalm: 7.6
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Campus-first north-east belt with structural university access.", caveat: "Best for campus-first students, not centre lifestyle."
  },
  {
    id: "rennes-la-pommeraie", cityId: "rennes", name: "La Pommeraie", code: "rennes-la-pommeraie", kind: "quartier",
    area: "East-south", granularity: "micro", parentName: "East-south",
    confidence: "high", coverageRole: "primary", geometryBasis: "official_quartier",
    evidenceNote: "Official Rennes administrative quartier polygon.",
    scores: {
      security: 7.2,
      affordability: 4.2,
      transport: 7.4,
      studentEnergy: 6.2,
      services: 7.4,
      campusAccess: 7.2,
      greenCalm: 7.6
    },
    rentLevel: "high", studentFit: "good",
    summary: "Calmer east-south residential belt with green edges.", caveat: "Less student-social than Thabor or Beaulieu."
  },
  {
    id: "rennes-sud-gare", cityId: "rennes", name: "Sud-Gare", code: "rennes-sud-gare", kind: "quartier",
    area: "South centre", granularity: "micro", parentName: "South centre",
    confidence: "high", coverageRole: "primary", geometryBasis: "official_quartier",
    evidenceNote: "Official Rennes administrative quartier polygon.",
    scores: {
      security: 6.0,
      affordability: 5.0,
      transport: 9.2,
      studentEnergy: 7.6,
      services: 8.2,
      campusAccess: 8.0,
      greenCalm: 5.8
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Station-adjacent south-centre belt with strong transit.", caveat: "Useful hub access; block choice still matters."
  },
  {
    id: "rennes-cleunay-arsenal-redon", cityId: "rennes", name: "Cleunay / Arsenal-Redon", code: "rennes-cleunay-arsenal-redon", kind: "quartier",
    area: "West inner", granularity: "micro", parentName: "West inner",
    confidence: "high", coverageRole: "primary", geometryBasis: "official_quartier",
    evidenceNote: "Official Rennes administrative quartier polygon.",
    scores: {
      security: 6.2,
      affordability: 5.2,
      transport: 8.6,
      studentEnergy: 7.2,
      services: 7.8,
      campusAccess: 7.4,
      greenCalm: 6.4
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Inner-west belt with reasonable value and tram access.", caveat: "Mixed comfort; not a premium student default."
  },
  {
    id: "rennes-villejean-beauregard", cityId: "rennes", name: "Villejean / Beauregard", code: "rennes-villejean-beauregard", kind: "quartier",
    area: "West campus", granularity: "micro", parentName: "West campus",
    confidence: "high", coverageRole: "campus", geometryBasis: "official_quartier",
    evidenceNote: "Official Rennes administrative quartier polygon.",
    scores: {
      security: 5.8,
      affordability: 6.2,
      transport: 9.0,
      studentEnergy: 8.2,
      services: 7.6,
      campusAccess: 10.0,
      greenCalm: 6.0
    },
    rentLevel: "medium", studentFit: "excellent",
    summary: "West campus pole with structural university access and metro.", caveat: "Campus utility over centre social life."
  },
  {
    id: "rennes-le-blosne", cityId: "rennes", name: "Le Blosne", code: "rennes-le-blosne", kind: "quartier",
    area: "South cap", granularity: "micro", parentName: "South cap",
    confidence: "high", coverageRole: "risk_cap", geometryBasis: "official_quartier",
    evidenceNote: "Official Rennes administrative quartier polygon.",
    scores: {
      security: 4.2,
      affordability: 7.0,
      transport: 8.8,
      studentEnergy: 6.0,
      services: 6.8,
      campusAccess: 6.8,
      greenCalm: 5.6
    },
    rentLevel: "lower", studentFit: "mixed",
    summary: "Affordable south belt with a hard safety cap.", caveat: "Cheap rent cannot offset the risk profile."
  },
  {
    id: "rennes-brequigny", cityId: "rennes", name: "Brequigny", code: "rennes-brequigny", kind: "quartier",
    area: "South-west", granularity: "micro", parentName: "South-west",
    confidence: "high", coverageRole: "context", geometryBasis: "official_quartier",
    evidenceNote: "Official Rennes administrative quartier polygon.",
    scores: {
      security: 5.0,
      affordability: 6.4,
      transport: 8.4,
      studentEnergy: 6.4,
      services: 7.2,
      campusAccess: 7.0,
      greenCalm: 5.8
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Outer south-west context with moderate value.", caveat: "Honest peripheral belt; limited student scene."
  },
];
