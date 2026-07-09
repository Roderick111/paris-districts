import type { PlaceScore } from "@/data/cities";

export const niceMicroPlaces: PlaceScore[] = [
  {
    id: "nice-jean-medecin-core", cityId: "nice", name: "Jean-Medecin core", code: "nice-jean-medecin-core", kind: "quartier",
    area: "Centre", granularity: "micro", parentName: "Centre",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nice-student-life.md (medium confidence).",
    scores: {
      security: 5.6,
      affordability: 2.3,
      transport: 9.6,
      studentEnergy: 8.0,
      services: 9.4,
      campusAccess: 8.0,
      greenCalm: 3.4
    },
    rentLevel: "very high", studentFit: "good",
    summary: "Balanced centre micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-carabacel", cityId: "nice", name: "Carabacel", code: "nice-carabacel", kind: "quartier",
    area: "Centre east", granularity: "micro", parentName: "Centre east",
    confidence: "medium",
    evidenceNote: "official/IRIS group geometry from nice-student-life.md (medium confidence).",
    scores: {
      security: 6.2,
      affordability: 2.6,
      transport: 9.1,
      studentEnergy: 7.4,
      services: 8.8,
      campusAccess: 8.0,
      greenCalm: 4.4
    },
    rentLevel: "very high", studentFit: "good",
    summary: "Balanced centre east micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-thiers-station-edge", cityId: "nice", name: "Thiers / station edge", code: "nice-thiers-station-edge", kind: "quartier",
    area: "Centre west", granularity: "micro", parentName: "Centre west",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nice-student-life.md (medium confidence).",
    scores: {
      security: 5.1,
      affordability: 3.5,
      transport: 9.3,
      studentEnergy: 7.2,
      services: 8.5,
      campusAccess: 8.0,
      greenCalm: 4.0
    },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced centre west micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-musiciens", cityId: "nice", name: "Musiciens", code: "nice-musiciens", kind: "quartier",
    area: "Centre west", granularity: "micro", parentName: "Centre west",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nice-student-life.md (medium confidence).",
    scores: {
      security: 6.1,
      affordability: 3.0,
      transport: 8.9,
      studentEnergy: 6.8,
      services: 8.7,
      campusAccess: 7.8,
      greenCalm: 4.8
    },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced centre west micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-vernier", cityId: "nice", name: "Vernier", code: "nice-vernier", kind: "quartier",
    area: "North centre", granularity: "micro", parentName: "North centre",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nice-student-life.md (medium confidence).",
    scores: {
      security: 5.7,
      affordability: 4.3,
      transport: 8.8,
      studentEnergy: 7.6,
      services: 8.0,
      campusAccess: 8.6,
      greenCalm: 4.7
    },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced north centre micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-liberation", cityId: "nice", name: "Liberation", code: "nice-liberation", kind: "quartier",
    area: "North centre", granularity: "micro", parentName: "North centre",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nice-student-life.md (medium confidence).",
    scores: {
      security: 6.6,
      affordability: 4.6,
      transport: 8.9,
      studentEnergy: 8.3,
      services: 8.5,
      campusAccess: 9.3,
      greenCalm: 5.8
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Balanced north centre micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-borriglione-valrose", cityId: "nice", name: "Borriglione / Valrose", code: "nice-borriglione-valrose", kind: "quartier",
    area: "North centre campus", granularity: "micro", parentName: "North centre campus",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nice-student-life.md (medium confidence).",
    scores: {
      security: 6.8,
      affordability: 4.7,
      transport: 8.8,
      studentEnergy: 8.3,
      services: 8.3,
      campusAccess: 9.6,
      greenCalm: 6.0
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Campus-first north centre campus pick with structural university access.", caveat: "Best for campus-first students, not for a historic-centre lifestyle."
  },
  {
    id: "nice-saint-maurice", cityId: "nice", name: "Saint-Maurice", code: "nice-saint-maurice", kind: "quartier",
    area: "North centre", granularity: "micro", parentName: "North centre",
    confidence: "medium",
    evidenceNote: "official/IRIS group geometry from nice-student-life.md (medium confidence).",
    scores: {
      security: 6.5,
      affordability: 4.8,
      transport: 8.0,
      studentEnergy: 7.0,
      services: 7.6,
      campusAccess: 8.6,
      greenCalm: 6.0
    },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced north centre micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-cimiez", cityId: "nice", name: "Cimiez", code: "nice-cimiez", kind: "quartier",
    area: "North-east hills", granularity: "micro", parentName: "North-east hills",
    confidence: "medium",
    evidenceNote: "official/IRIS group geometry from nice-student-life.md (medium confidence).",
    scores: {
      security: 8.1,
      affordability: 2.6,
      transport: 7.0,
      studentEnergy: 4.8,
      services: 7.9,
      campusAccess: 7.3,
      greenCalm: 8.2
    },
    rentLevel: "very high", studentFit: "good",
    summary: "Safer north-east hills pocket with premium rent and calmer daily life.", caveat: "Quality-of-life pick, not a value student default."
  },
  {
    id: "nice-rimiez", cityId: "nice", name: "Rimiez", code: "nice-rimiez", kind: "quartier",
    area: "North-east hills", granularity: "micro", parentName: "North-east hills",
    confidence: "medium",
    evidenceNote: "official/IRIS group geometry from nice-student-life.md (medium confidence).",
    scores: {
      security: 8.3,
      affordability: 2.7,
      transport: 6.2,
      studentEnergy: 4.2,
      services: 7.4,
      campusAccess: 6.8,
      greenCalm: 8.8
    },
    rentLevel: "very high", studentFit: "good",
    summary: "Safer north-east hills pocket with premium rent and calmer daily life.", caveat: "Quality-of-life pick, not a value student default."
  },
  {
    id: "nice-vieux-nice", cityId: "nice", name: "Vieux-Nice", code: "nice-vieux-nice", kind: "quartier",
    area: "Historic centre", granularity: "micro", parentName: "Historic centre",
    confidence: "medium",
    evidenceNote: "official/IRIS group geometry from nice-student-life.md (medium confidence).",
    scores: {
      security: 5.4,
      affordability: 2.8,
      transport: 8.9,
      studentEnergy: 9.0,
      services: 9.1,
      campusAccess: 7.5,
      greenCalm: 4.0
    },
    rentLevel: "very high", studentFit: "good",
    summary: "High-energy historic centre streets with strong student social life.", caveat: "Social life is real; comfort and safety are not automatic."
  },
  {
    id: "nice-port", cityId: "nice", name: "Port", code: "nice-port", kind: "quartier",
    area: "East centre", granularity: "micro", parentName: "East centre",
    confidence: "medium",
    evidenceNote: "official/IRIS group geometry from nice-student-life.md (medium confidence).",
    scores: {
      security: 5.9,
      affordability: 3.0,
      transport: 8.7,
      studentEnergy: 8.4,
      services: 8.9,
      campusAccess: 7.6,
      greenCalm: 5.2
    },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced east centre micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-riquier", cityId: "nice", name: "Riquier", code: "nice-riquier", kind: "quartier",
    area: "East inner city", granularity: "micro", parentName: "East inner city",
    confidence: "medium",
    evidenceNote: "official/IRIS group geometry from nice-student-life.md (medium confidence).",
    scores: {
      security: 5.8,
      affordability: 5.3,
      transport: 8.6,
      studentEnergy: 7.2,
      services: 8.1,
      campusAccess: 7.6,
      greenCalm: 5.0
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Balanced east inner city micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-saint-roch", cityId: "nice", name: "Saint-Roch", code: "nice-saint-roch", kind: "quartier",
    area: "East", granularity: "micro", parentName: "East",
    confidence: "medium",
    evidenceNote: "official/IRIS group geometry from nice-student-life.md (medium confidence).",
    scores: {
      security: 5.7,
      affordability: 5.8,
      transport: 8.3,
      studentEnergy: 6.8,
      services: 7.7,
      campusAccess: 7.6,
      greenCalm: 5.2
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Balanced east micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-saint-jean-d-angely", cityId: "nice", name: "Saint-Jean-d'Angely", code: "nice-saint-jean-d-angely", kind: "quartier",
    area: "East campus", granularity: "micro", parentName: "East campus",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nice-student-life.md (medium confidence).",
    scores: {
      security: 5.8,
      affordability: 5.2,
      transport: 8.6,
      studentEnergy: 7.6,
      services: 7.8,
      campusAccess: 9.0,
      greenCalm: 5.2
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Balanced east campus micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-pasteur", cityId: "nice", name: "Pasteur", code: "nice-pasteur", kind: "quartier",
    area: "East", granularity: "micro", parentName: "East",
    confidence: "medium",
    evidenceNote: "official/IRIS group geometry from nice-student-life.md (medium confidence).",
    scores: {
      security: 4.5,
      affordability: 6.7,
      transport: 7.6,
      studentEnergy: 5.8,
      services: 7.0,
      campusAccess: 8.1,
      greenCalm: 5.0
    },
    rentLevel: "lower", studentFit: "mixed",
    summary: "Balanced east micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-ariane", cityId: "nice", name: "Ariane", code: "nice-ariane", kind: "quartier",
    area: "North-east edge", granularity: "micro", parentName: "North-east edge",
    confidence: "medium",
    evidenceNote: "official/IRIS group geometry from nice-student-life.md (medium confidence).",
    scores: {
      security: 3.2,
      affordability: 7.4,
      transport: 6.8,
      studentEnergy: 4.8,
      services: 6.2,
      campusAccess: 5.6,
      greenCalm: 5.6
    },
    rentLevel: "lower", studentFit: "weak",
    summary: "Ariane stays hard-capped on safety despite useful north-east edge links.", caveat: "Cheap rent and transport cannot offset the risk profile."
  },
  {
    id: "nice-rue-de-france-promenade-edge", cityId: "nice", name: "Rue de France / Promenade edge", code: "nice-rue-de-france-promenade-edge", kind: "quartier",
    area: "Centre west coast", granularity: "micro", parentName: "Centre west coast",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nice-student-life.md (medium confidence).",
    scores: {
      security: 6.1,
      affordability: 2.8,
      transport: 8.7,
      studentEnergy: 7.2,
      services: 8.8,
      campusAccess: 7.4,
      greenCalm: 4.8
    },
    rentLevel: "very high", studentFit: "good",
    summary: "Balanced centre west coast micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-baumettes-magnan", cityId: "nice", name: "Baumettes / Magnan", code: "nice-baumettes-magnan", kind: "quartier",
    area: "West coast", granularity: "micro", parentName: "West coast",
    confidence: "medium",
    evidenceNote: "official/IRIS group geometry from nice-student-life.md (medium confidence).",
    scores: {
      security: 6.2,
      affordability: 4.2,
      transport: 8.0,
      studentEnergy: 6.8,
      services: 7.8,
      campusAccess: 8.2,
      greenCalm: 5.8
    },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced west coast micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-carlone-campus", cityId: "nice", name: "Carlone campus", code: "nice-carlone-campus", kind: "quartier",
    area: "West campus", granularity: "micro", parentName: "West campus",
    confidence: "medium",
    evidenceNote: "IRIS group geometry from nice-student-life.md (medium confidence).",
    scores: {
      security: 6.5,
      affordability: 4.8,
      transport: 7.6,
      studentEnergy: 7.3,
      services: 7.4,
      campusAccess: 9.2,
      greenCalm: 6.3
    },
    rentLevel: "high", studentFit: "good",
    summary: "Balanced west campus micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-madeleine", cityId: "nice", name: "Madeleine", code: "nice-madeleine", kind: "quartier",
    area: "West valley", granularity: "micro", parentName: "West valley",
    confidence: "medium",
    evidenceNote: "official/IRIS group geometry from nice-student-life.md (medium confidence).",
    scores: {
      security: 6.1,
      affordability: 5.1,
      transport: 7.4,
      studentEnergy: 6.5,
      services: 7.2,
      campusAccess: 8.5,
      greenCalm: 6.2
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Balanced west valley micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-arenas-saint-augustin-edhec", cityId: "nice", name: "Arenas / Saint-Augustin / EDHEC", code: "nice-arenas-saint-augustin-edhec", kind: "quartier",
    area: "West airport", granularity: "micro", parentName: "West airport",
    confidence: "medium",
    evidenceNote: "official/IRIS group geometry from nice-student-life.md (medium confidence).",
    scores: {
      security: 5.0,
      affordability: 5.4,
      transport: 8.4,
      studentEnergy: 6.2,
      services: 7.4,
      campusAccess: 8.2,
      greenCalm: 5.2
    },
    rentLevel: "medium", studentFit: "good",
    summary: "Balanced west airport micro-area with mixed student trade-offs.", caveat: "Block choice inside the polygon still matters."
  },
  {
    id: "nice-context-north-west-hills", cityId: "nice", name: "North-west hills context", code: "nice-context-north-west-hills", kind: "quartier",
    area: "North-west hills context", granularity: "micro", parentName: "North-west hills context",
    confidence: "low",
    coverageRole: "context",
    geometryBasis: "iris_partition",
    evidenceNote: "Full-coverage context zone from official IRIS partition (06088); map continuity, not a primary student pick.",
    scores: {
      security: 6.0,
      affordability: 5.5,
      transport: 7.0,
      studentEnergy: 5.5,
      services: 6.5,
      campusAccess: 5.5,
      greenCalm: 6.5
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Full-coverage context zone; useful for map continuity, not a primary student pick.", caveat: "Broad official geometry; block-level choice still matters."
  },
  {
    id: "nice-context-saint-sylvestre-las-planas", cityId: "nice", name: "Saint-Sylvestre / Las Planas context", code: "nice-context-saint-sylvestre-las-planas", kind: "quartier",
    area: "Saint-Sylvestre / Las Planas context", granularity: "micro", parentName: "Saint-Sylvestre / Las Planas context",
    confidence: "low",
    coverageRole: "context",
    geometryBasis: "iris_partition",
    evidenceNote: "Full-coverage context zone from official IRIS partition (06088); map continuity, not a primary student pick.",
    scores: {
      security: 6.0,
      affordability: 5.5,
      transport: 7.0,
      studentEnergy: 5.5,
      services: 6.5,
      campusAccess: 5.5,
      greenCalm: 6.5
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Full-coverage context zone; useful for map continuity, not a primary student pick.", caveat: "Broad official geometry; block-level choice still matters."
  },
  {
    id: "nice-context-rimiez-gairaut-east", cityId: "nice", name: "Rimiez / upper east context", code: "nice-context-rimiez-gairaut-east", kind: "quartier",
    area: "Rimiez / upper east context", granularity: "micro", parentName: "Rimiez / upper east context",
    confidence: "low",
    coverageRole: "context",
    geometryBasis: "iris_partition",
    evidenceNote: "Full-coverage context zone from official IRIS partition (06088); map continuity, not a primary student pick.",
    scores: {
      security: 6.0,
      affordability: 5.5,
      transport: 7.0,
      studentEnergy: 5.5,
      services: 6.5,
      campusAccess: 5.5,
      greenCalm: 6.5
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Full-coverage context zone; useful for map continuity, not a primary student pick.", caveat: "Broad official geometry; block-level choice still matters."
  },
  {
    id: "nice-context-east-hills", cityId: "nice", name: "East hills context", code: "nice-context-east-hills", kind: "quartier",
    area: "East hills context", granularity: "micro", parentName: "East hills context",
    confidence: "low",
    coverageRole: "context",
    geometryBasis: "iris_partition",
    evidenceNote: "Full-coverage context zone from official IRIS partition (06088); map continuity, not a primary student pick.",
    scores: {
      security: 6.0,
      affordability: 5.5,
      transport: 7.0,
      studentEnergy: 5.5,
      services: 6.5,
      campusAccess: 5.5,
      greenCalm: 6.5
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Full-coverage context zone; useful for map continuity, not a primary student pick.", caveat: "Broad official geometry; block-level choice still matters."
  },
  {
    id: "nice-context-west-hills", cityId: "nice", name: "West hills context", code: "nice-context-west-hills", kind: "quartier",
    area: "West hills context", granularity: "micro", parentName: "West hills context",
    confidence: "low",
    coverageRole: "context",
    geometryBasis: "iris_partition",
    evidenceNote: "Full-coverage context zone from official IRIS partition (06088); map continuity, not a primary student pick.",
    scores: {
      security: 6.0,
      affordability: 5.5,
      transport: 7.0,
      studentEnergy: 5.5,
      services: 6.5,
      campusAccess: 5.5,
      greenCalm: 6.5
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Full-coverage context zone; useful for map continuity, not a primary student pick.", caveat: "Broad official geometry; block-level choice still matters."
  },
  {
    id: "nice-context-airport-var", cityId: "nice", name: "Airport / Var plain context", code: "nice-context-airport-var", kind: "quartier",
    area: "Airport / Var plain context", granularity: "micro", parentName: "Airport / Var plain context",
    confidence: "low",
    coverageRole: "context",
    geometryBasis: "iris_partition",
    evidenceNote: "Full-coverage context zone from official IRIS partition (06088); map continuity, not a primary student pick.",
    scores: {
      security: 6.0,
      affordability: 5.5,
      transport: 7.0,
      studentEnergy: 5.5,
      services: 6.5,
      campusAccess: 5.5,
      greenCalm: 6.5
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Full-coverage context zone; useful for map continuity, not a primary student pick.", caveat: "Broad official geometry; block-level choice still matters."
  },
  {
    id: "nice-context-north-centre-fill", cityId: "nice", name: "North-centre fill context", code: "nice-context-north-centre-fill", kind: "quartier",
    area: "North-centre fill context", granularity: "micro", parentName: "North-centre fill context",
    confidence: "low",
    coverageRole: "context",
    geometryBasis: "iris_partition",
    evidenceNote: "Full-coverage context zone from official IRIS partition (06088); map continuity, not a primary student pick.",
    scores: {
      security: 6.0,
      affordability: 5.5,
      transport: 7.0,
      studentEnergy: 5.5,
      services: 6.5,
      campusAccess: 5.5,
      greenCalm: 6.5
    },
    rentLevel: "medium", studentFit: "mixed",
    summary: "Full-coverage context zone; useful for map continuity, not a primary student pick.", caveat: "Broad official geometry; block-level choice still matters."
  },
  {
    id: "nice-context-peripheral", cityId: "nice", name: "Peripheral low-relevance context", code: "nice-context-peripheral", kind: "quartier",
    area: "Peripheral low-relevance context", granularity: "micro", parentName: "Peripheral low-relevance context",
    confidence: "low",
    coverageRole: "low_relevance",
    geometryBasis: "iris_partition",
    evidenceNote: "Full-coverage context zone from official IRIS partition (06088); map continuity, not a primary student pick.",
    scores: {
      security: 6.0,
      affordability: 5.5,
      transport: 7.0,
      studentEnergy: 4.5,
      services: 6.5,
      campusAccess: 5.5,
      greenCalm: 6.5
    },
    rentLevel: "medium", studentFit: "weak",
    summary: "Full-coverage context zone; useful for map continuity, not a primary student pick.", caveat: "Broad official geometry; block-level choice still matters."
  },
];
