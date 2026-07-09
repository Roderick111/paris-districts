import type { PlaceScore } from "@/data/cities";

export const lilleMicroPlaces: PlaceScore[] = [
  {
    id: "lille-centre", cityId: "lille", name: "Lille-Centre", code: "lille-centre", kind: "quartier",
    area: "Lille-Centre", granularity: "micro", parentName: "Lille-Centre",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier",
    evidenceNote: "Official Lille district polygon; central hub with Lille-Flandres/Europe, dense services, high rent.",
    scores: {
      security: 5.6, affordability: 2.6, transport: 9.9, studentEnergy: 8.0,
      services: 9.4, campusAccess: 8.0, greenCalm: 3.6
    },
    rentLevel: "very high", studentFit: "good",
    summary: "Central station district with maximum transport and services, but premium rent and busy nights.",
    caveat: "Strong convenience; station crowds and nightlife noise cap comfort."
  },
  {
    id: "lille-vieux-lille", cityId: "lille", name: "Vieux-Lille", code: "lille-vieux-lille", kind: "quartier",
    area: "Vieux-Lille", granularity: "micro", parentName: "Vieux-Lille",
    confidence: "high", coverageRole: "primary", geometryBasis: "official_quartier",
    evidenceNote: "Official Vieux-Lille quartier; historic core, calmer streets, very high rents, tourist-facing safety premium.",
    scores: {
      security: 7.4, affordability: 2.0, transport: 8.3, studentEnergy: 6.8,
      services: 8.9, campusAccess: 7.0, greenCalm: 5.8
    },
    rentLevel: "very high", studentFit: "mixed",
    summary: "Pretty historic centre with strong safety and services, but weak value for student budgets.",
    caveat: "Lifestyle prestige pick, not a default student value zone."
  },
  {
    id: "lille-vauban-esquermes", cityId: "lille", name: "Vauban-Esquermes", code: "lille-vauban-esquermes", kind: "quartier",
    area: "Vauban-Esquermes", granularity: "micro", parentName: "Vauban-Esquermes",
    confidence: "high", coverageRole: "primary", geometryBasis: "official_quartier",
    evidenceNote: "Official Vauban-Esquermes district; Université catholique de Lille, young resident profile, citadelle green edge.",
    scores: {
      security: 7.5, affordability: 3.8, transport: 8.2, studentEnergy: 9.4,
      services: 8.3, campusAccess: 9.7, greenCalm: 7.6
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Top Lille student district with Catho presence, campus access, and calmer west-side streets.",
    caveat: "Rent is high, but fit is structurally strong for campus-first students."
  },
  {
    id: "lille-wazemmes", cityId: "lille", name: "Wazemmes", code: "lille-wazemmes", kind: "quartier",
    area: "Wazemmes", granularity: "micro", parentName: "Wazemmes",
    confidence: "high", coverageRole: "primary", geometryBasis: "official_quartier",
    evidenceNote: "Official Wazemmes + Faubourg de Béthune; market/social energy, strong affordability, mixed comfort and safety.",
    scores: {
      security: 4.9, affordability: 6.4, transport: 8.8, studentEnergy: 9.4,
      services: 8.2, campusAccess: 8.4, greenCalm: 3.9
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Lively value district with market culture and high student energy.",
    caveat: "Social life is real; safety and calm are not automatic."
  },
  {
    id: "lille-moulins", cityId: "lille", name: "Moulins", code: "lille-moulins", kind: "quartier",
    area: "Moulins", granularity: "micro", parentName: "Moulins",
    confidence: "medium", coverageRole: "risk_cap", geometryBasis: "official_quartier",
    evidenceNote: "Official Lille-Moulins district; campus edge value, weaker reputation on comfort and safety.",
    scores: {
      security: 4.5, affordability: 6.8, transport: 8.5, studentEnergy: 8.2,
      services: 7.4, campusAccess: 9.1, greenCalm: 4.1
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Campus-adjacent value with strong university access but weaker safety/comfort caps.",
    caveat: "Useful for budget campus access; not a quality-of-life default."
  },
  {
    id: "lille-fives", cityId: "lille", name: "Fives", code: "lille-fives", kind: "quartier",
    area: "Fives", granularity: "micro", parentName: "Fives",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier",
    evidenceNote: "Official Fives district; practical east-side value, metro-linked, mixed residential comfort.",
    scores: {
      security: 5.4, affordability: 6.5, transport: 8.7, studentEnergy: 7.1,
      services: 7.3, campusAccess: 7.1, greenCalm: 4.9
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Practical east Lille with decent metro value and moderate student presence.",
    caveat: "Works as a budget metro suburb-in-the-city; less social buzz than Wazemmes."
  },
  {
    id: "lille-bois-blancs", cityId: "lille", name: "Bois-Blancs", code: "lille-bois-blancs", kind: "quartier",
    area: "Bois-Blancs", granularity: "micro", parentName: "Bois-Blancs",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier",
    evidenceNote: "Official Bois-Blancs district; calmer west side, Euratechnologies employment hub, moderate student fit.",
    scores: {
      security: 6.5, affordability: 5.4, transport: 7.9, studentEnergy: 6.9,
      services: 7.3, campusAccess: 6.5, greenCalm: 6.8
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Calmer western district with green edges and moderate rent.",
    caveat: "Better for quiet daily life than for student nightlife."
  },
  {
    id: "lille-sud", cityId: "lille", name: "Lille-Sud", code: "lille-sud", kind: "quartier",
    area: "Lille-Sud", granularity: "micro", parentName: "Lille-Sud",
    confidence: "medium", coverageRole: "risk_cap", geometryBasis: "official_quartier",
    evidenceNote: "Official Lille-Sud district; affordable southern belt, security reputation limits overall score.",
    scores: {
      security: 4.2, affordability: 7.1, transport: 7.7, studentEnergy: 5.6,
      services: 6.7, campusAccess: 7.1, greenCalm: 5.3
    },
    rentLevel: "lower", studentFit: "weak",
    summary: "Affordable southern Lille with visible safety cap despite useful transport.",
    caveat: "Budget option only if you accept reputation and block-level caution."
  },
  {
    id: "lille-saint-maurice-pellevoisin", cityId: "lille", name: "Saint-Maurice Pellevoisin", code: "lille-saint-maurice-pellevoisin", kind: "quartier",
    area: "Saint-Maurice Pellevoisin", granularity: "micro", parentName: "Saint-Maurice Pellevoisin",
    confidence: "medium", coverageRole: "context", geometryBasis: "official_quartier",
    evidenceNote: "Official Saint-Maurice Pellevoisin district; residential east-centre, decent transport, lower student energy.",
    scores: {
      security: 6.3, affordability: 5.8, transport: 8.1, studentEnergy: 5.2,
      services: 7.5, campusAccess: 6.8, greenCalm: 6.1
    },
    rentLevel: "medium", studentFit: "weak",
    summary: "Residential east-centre belt with calm daily life and limited student scene.",
    caveat: "Fine for quiet commuting; weak as a student social hub."
  },
  {
    id: "lille-hellemmes", cityId: "lille", name: "Hellemmes", code: "lille-hellemmes", kind: "quartier",
    area: "Hellemmes", granularity: "micro", parentName: "Hellemmes",
    confidence: "medium", coverageRole: "context", geometryBasis: "official_quartier",
    evidenceNote: "Official Hellemmes district; metro-linked northeast value, medium student fit.",
    scores: {
      security: 5.9, affordability: 6.2, transport: 8.6, studentEnergy: 7.0,
      services: 7.2, campusAccess: 7.7, greenCalm: 5.5
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Practical northeast district with metro access and moderate student presence.",
    caveat: "More commuter-value than campus-social."
  },
  {
    id: "lille-lomme-chr", cityId: "lille", name: "Lomme / CHR", code: "lille-lomme-chr", kind: "quartier",
    area: "Lomme", granularity: "micro", parentName: "Lomme",
    confidence: "medium", coverageRole: "campus", geometryBasis: "official_quartier",
    evidenceNote: "Official Lomme district; CHR health campus access, value rents, weaker central student energy.",
    scores: {
      security: 6.2, affordability: 6.1, transport: 8.3, studentEnergy: 6.6,
      services: 7.5, campusAccess: 8.4, greenCalm: 6.3
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Health-campus adjacent west district with solid value and CHR access.",
    caveat: "Useful for health sciences; less central student nightlife."
  },
  {
    id: "lille-lambersart", cityId: "lille", name: "Lambersart", code: "lille-lambersart", kind: "quartier",
    area: "Lambersart", granularity: "micro", parentName: "Lambersart",
    confidence: "low", coverageRole: "context", geometryBasis: "commune_context",
    evidenceNote: "Whole Lambersart commune; calm inner suburb context, safer reputation, higher rent, low student energy.",
    scores: {
      security: 6.8, affordability: 4.2, transport: 8.0, studentEnergy: 5.0,
      services: 7.8, campusAccess: 6.2, greenCalm: 6.9
    },
    rentLevel: "high", studentFit: "weak",
    summary: "Calm connected suburb with limited student scene.",
    caveat: "Residential comfort suburb, not a student destination."
  },
  {
    id: "lille-la-madeleine", cityId: "lille", name: "La Madeleine", code: "lille-la-madeleine", kind: "quartier",
    area: "La Madeleine", granularity: "micro", parentName: "La Madeleine",
    confidence: "medium", coverageRole: "context", geometryBasis: "commune_context",
    evidenceNote: "Whole La Madeleine commune context; tram-linked inner suburb, calmer and pricier than Wazemmes.",
    scores: {
      security: 7.1, affordability: 3.6, transport: 8.6, studentEnergy: 6.3,
      services: 8.1, campusAccess: 7.1, greenCalm: 6.4
    },
    rentLevel: "high", studentFit: "mixed",
    summary: "Close tram suburb with good services and calmer streets.",
    caveat: "Connected and pleasant, but rent limits student value."
  },
  {
    id: "lille-mons-en-baroeul", cityId: "lille", name: "Mons-en-Barœul", code: "lille-mons-en-baroeul", kind: "quartier",
    area: "Mons-en-Barœul", granularity: "micro", parentName: "Mons-en-Barœul",
    confidence: "low", coverageRole: "context", geometryBasis: "commune_context",
    evidenceNote: "Whole Mons-en-Barœul commune context; metro suburb value, medium student fit, mixed comfort reputation.",
    scores: {
      security: 6.0, affordability: 6.0, transport: 8.4, studentEnergy: 6.2,
      services: 7.0, campusAccess: 7.3, greenCalm: 5.8
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Metro-linked eastern suburb with practical rents and moderate fit.",
    caveat: "Suburban comfort varies block by block."
  },
  {
    id: "lille-vda-cite-scientifique-triolo", cityId: "lille", name: "Villeneuve Cité Scientifique / Triolo", code: "lille-vda-cite-scientifique-triolo", kind: "quartier",
    area: "Villeneuve-d'Ascq", granularity: "micro", parentName: "Villeneuve-d'Ascq",
    confidence: "high", coverageRole: "campus", geometryBasis: "official_quartier",
    evidenceNote: "Official VDA Cité Scientifique + Triolo quartiers; Université de Lille main campus spine.",
    scores: {
      security: 6.9, affordability: 5.6, transport: 8.8, studentEnergy: 8.6,
      services: 7.8, campusAccess: 9.8, greenCalm: 7.4
    },
    rentLevel: "medium", studentFit: "excellent",
    summary: "Primary university campus belt with structural student presence.",
    caveat: "Campus-first geography; less historic-centre lifestyle."
  },
  {
    id: "lille-vda-pont-de-bois-hotel-de-ville", cityId: "lille", name: "Villeneuve Pont-de-Bois / Hôtel-de-Ville", code: "lille-vda-pont-de-bois-hotel-de-ville", kind: "quartier",
    area: "Villeneuve-d'Ascq", granularity: "micro", parentName: "Villeneuve-d'Ascq",
    confidence: "medium", coverageRole: "primary", geometryBasis: "official_quartier",
    evidenceNote: "Official VDA Pont-de-Bois + Hôtel-de-Ville quartiers; campus-adjacent civic centre, metro-linked.",
    scores: {
      security: 6.5, affordability: 5.8, transport: 8.6, studentEnergy: 8.2,
      services: 7.6, campusAccess: 9.2, greenCalm: 6.8
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Campus-linked civic centre with strong university access and services.",
    caveat: "More administrative than social-student hub."
  },
  {
    id: "lille-vda-annappes-ascq-brigode", cityId: "lille", name: "Villeneuve Annappes / Ascq / Brigode", code: "lille-vda-annappes-ascq-brigode", kind: "quartier",
    area: "Villeneuve-d'Ascq", granularity: "micro", parentName: "Villeneuve-d'Ascq",
    confidence: "medium", coverageRole: "context", geometryBasis: "official_quartier",
    evidenceNote: "Official VDA eastern residential quartiers; campus-adjacent context, district-reputation fallback.",
    scores: {
      security: 6.4, affordability: 6.0, transport: 8.0, studentEnergy: 7.4,
      services: 7.2, campusAccess: 8.4, greenCalm: 6.6
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Eastern VDA residential belt with moderate campus proximity.",
    caveat: "Residential context; not a primary campus pick."
  },
  {
    id: "lille-vda-cousinerie-recuel-sart", cityId: "lille", name: "Villeneuve Cousinerie / Recueil / Sart", code: "lille-vda-cousinerie-recuel-sart", kind: "quartier",
    area: "Villeneuve-d'Ascq", granularity: "micro", parentName: "Villeneuve-d'Ascq",
    confidence: "low", coverageRole: "context", geometryBasis: "official_quartier",
    evidenceNote: "Official VDA northern quartiers; residential context belt, broad district-reputation fallback.",
    scores: {
      security: 6.2, affordability: 6.1, transport: 7.8, studentEnergy: 6.8,
      services: 7.0, campusAccess: 7.6, greenCalm: 6.4
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Northern VDA context with calm residential streets.",
    caveat: "Low student social energy; continuity suburb."
  },
  {
    id: "lille-vda-breucq-flers-edge", cityId: "lille", name: "Villeneuve Flers / Les Prés edge", code: "lille-vda-breucq-flers-edge", kind: "quartier",
    area: "Villeneuve-d'Ascq", granularity: "micro", parentName: "Villeneuve-d'Ascq",
    confidence: "low", coverageRole: "context", geometryBasis: "official_quartier",
    evidenceNote: "Official VDA west-edge quartiers (Flers-Bourg, Les Prés); peripheral context, low campus relevance.",
    scores: {
      security: 6.0, affordability: 6.3, transport: 7.4, studentEnergy: 5.6,
      services: 6.6, campusAccess: 6.2, greenCalm: 6.8
    },
    rentLevel: "medium", studentFit: "weak",
    summary: "Quiet west-edge VDA with green calm and limited student scene.",
    caveat: "Peripheral context; weak as a student destination."
  },
  {
    id: "lille-croix-barbieux-edhec", cityId: "lille", name: "Croix Barbieux / EDHEC", code: "lille-croix-barbieux-edhec", kind: "quartier",
    area: "Croix", granularity: "micro", parentName: "Croix",
    confidence: "medium", coverageRole: "campus", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Major Croix comfort band: Beaumont/Barbieux/EDHEC edge; IRIS merged for readability, not micro precision.",
    scores: {
      security: 7.0, affordability: 5.0, transport: 8.0, studentEnergy: 7.6,
      services: 7.5, campusAccess: 9.4, greenCalm: 7.6
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Croix's best student band around Parc Barbieux and EDHEC access.",
    caveat: "Rent rises near campus; cross-border Croix/Roubaix identity."
  },
  {
    id: "lille-croix-context", cityId: "lille", name: "Croix (rest of commune)", code: "lille-croix-context", kind: "quartier",
    area: "Croix", granularity: "micro", parentName: "Croix",
    confidence: "low", coverageRole: "context", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Remaining Croix commune context; centre, Saint-Pierre, canal belts merged; district-reputation fallback.",
    scores: {
      security: 6.4, affordability: 6.1, transport: 8.2, studentEnergy: 6.0,
      services: 7.2, campusAccess: 6.4, greenCalm: 6.0
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Broad Croix suburb context with metro/tram links and calm residential feel.",
    caveat: "Honest commune-level score; not micro IRIS precision."
  },
  {
    id: "lille-roubaix-barbieux-edhec", cityId: "lille", name: "Roubaix Barbieux / EDHEC", code: "lille-roubaix-barbieux-edhec", kind: "quartier",
    area: "Roubaix", granularity: "micro", parentName: "Roubaix",
    confidence: "medium", coverageRole: "campus", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Best Roubaix student-comfort band: Parc Barbieux, EDHEC edge, Épeule/Mackellerie spine; IRIS backend only.",
    scores: {
      security: 6.8, affordability: 5.4, transport: 8.2, studentEnergy: 7.4,
      services: 7.5, campusAccess: 9.2, greenCalm: 7.2
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Roubaix's strongest student-comfort zone around Barbieux and EDHEC.",
    caveat: "Premium within Roubaix; still check block-level comfort off the park."
  },
  {
    id: "lille-roubaix-centre-west", cityId: "lille", name: "Roubaix centre-west", code: "lille-roubaix-centre-west", kind: "quartier",
    area: "Roubaix", granularity: "micro", parentName: "Roubaix",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Roubaix urban core belt: Grand-Place, Justice, Édouard Vaillant; metro/tram hub, safety-capped broad score.",
    scores: {
      security: 5.5, affordability: 5.8, transport: 8.7, studentEnergy: 6.6,
      services: 8.2, campusAccess: 7.0, greenCalm: 4.3
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Dense Roubaix centre-west with maximum services and transport, safety-capped.",
    caveat: "Convenience yes; reputation and comfort vary sharply by street."
  },
  {
    id: "lille-roubaix-east-north-context", cityId: "lille", name: "Roubaix east / north", code: "lille-roubaix-east-north-context", kind: "quartier",
    area: "Roubaix", granularity: "micro", parentName: "Roubaix",
    confidence: "low", coverageRole: "context", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Roubaix east/north context belt: Pile, Trois Ponts, Moulin, Hommelet, Alma, Union; priority-policy reputation, risk-capped.",
    scores: {
      security: 4.8, affordability: 6.8, transport: 7.8, studentEnergy: 5.6,
      services: 6.6, campusAccess: 6.0, greenCalm: 4.0
    },
    rentLevel: "lower", studentFit: "weak",
    summary: "Affordable east/north Roubaix context with visible safety and comfort caps.",
    caveat: "Budget/context territory; not a default student destination."
  },
  {
    id: "lille-tourcoing-centre-gare", cityId: "lille", name: "Tourcoing Centre / Gare", code: "lille-tourcoing-centre-gare", kind: "quartier",
    area: "Tourcoing", granularity: "micro", parentName: "Tourcoing",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Tourcoing centre/gare major zone; metro line 2 hub, station services, mixed safety reputation.",
    scores: {
      security: 5.9, affordability: 5.9, transport: 8.6, studentEnergy: 6.5,
      services: 8.0, campusAccess: 6.7, greenCalm: 4.5
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Tourcoing hub with strong transport and services, moderate safety cap.",
    caveat: "Central convenience with reputation-driven caution."
  },
  {
    id: "lille-tourcoing-south-west", cityId: "lille", name: "Tourcoing south-west", code: "lille-tourcoing-south-west", kind: "quartier",
    area: "Tourcoing", granularity: "micro", parentName: "Tourcoing",
    confidence: "medium", coverageRole: "primary", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Tourcoing south-west major zone: Blanc Seau, Gambetta, Brun Pain, Francs; tram/metro connector belt.",
    scores: {
      security: 6.0, affordability: 6.1, transport: 8.3, studentEnergy: 6.1,
      services: 7.4, campusAccess: 6.4, greenCalm: 5.4
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Well-linked south-west Tourcoing with practical rents and calm residential pockets.",
    caveat: "Useful connector zone; not a campus destination."
  },
  {
    id: "lille-tourcoing-north-east-context", cityId: "lille", name: "Tourcoing north-east", code: "lille-tourcoing-north-east-context", kind: "quartier",
    area: "Tourcoing", granularity: "micro", parentName: "Tourcoing",
    confidence: "low", coverageRole: "context", geometryBasis: "iris_fallback_major_zone",
    evidenceNote: "Tourcoing north-east context/risk belt: Bourgogne, Pont Rompu, Phalempins, Virolois, Croix Rouge; priority-sector reputation.",
    scores: {
      security: 4.7, affordability: 6.8, transport: 7.5, studentEnergy: 5.0,
      services: 6.3, campusAccess: 5.4, greenCalm: 4.0
    },
    rentLevel: "lower", studentFit: "weak",
    summary: "Affordable north-east Tourcoing context with hard safety and comfort caps.",
    caveat: "Not a default student zone; reputation-limited broad belt."
  }
];
