import type { PlaceScore } from "@/data/cities";

export const niceMicroPlaces: PlaceScore[] = [
  {
    id: "nice-jean-medecin-carabacel", cityId: "nice", name: "Jean-Médecin / Carabacel", code: "nice-jean-medecin-carabacel", kind: "quartier",
    area: "Centre", granularity: "micro", parentName: "Centre",
    confidence: "medium",
    evidenceNote: "Official Nice quartier polygons (medium confidence).",
    scores: {
      security: 5.8,
      affordability: 2.4,
      transport: 9.4,
      studentEnergy: 7.8,
      services: 9.2,
      campusAccess: 8.0,
      greenCalm: 3.8
    },
    rentLevel: "very high", studentFit: "good",
    summary: "Hyper-connected retail core with strong services.", caveat: "Useful but rent-hostile and not calm."
  },
  {
    id: "nice-vieux-nice-port", cityId: "nice", name: "Vieux-Nice / Port", code: "nice-vieux-nice-port", kind: "quartier",
    area: "Centre east", granularity: "micro", parentName: "Centre east",
    confidence: "medium",
    evidenceNote: "Official Nice quartier polygons (medium confidence).",
    scores: {
      security: 5.6,
      affordability: 2.8,
      transport: 8.8,
      studentEnergy: 8.8,
      services: 9.0,
      campusAccess: 7.6,
      greenCalm: 4.6
    },
    rentLevel: "very high", studentFit: "good",
    summary: "Energetic old town and port with tourist exposure.", caveat: "No postcard inflation: tourism and rent matter."
  },
  {
    id: "nice-liberation-valrose", cityId: "nice", name: "Libération / Borriglione / Valrose", code: "nice-liberation-valrose", kind: "quartier",
    area: "North centre", granularity: "micro", parentName: "North centre",
    confidence: "medium",
    evidenceNote: "Official Nice quartier polygons (medium confidence).",
    scores: {
      security: 6.6,
      affordability: 4.6,
      transport: 8.8,
      studentEnergy: 8.2,
      services: 8.4,
      campusAccess: 9.4,
      greenCalm: 5.8
    },
    rentLevel: "high", studentFit: "excellent",
    summary: "Most credible first student pick with Valrose campus access.", caveat: "Leads Nice on practical student quality."
  },
  {
    id: "nice-thiers-musiciens", cityId: "nice", name: "Thiers / Musiciens", code: "nice-thiers-musiciens", kind: "quartier",
    area: "Centre west", granularity: "micro", parentName: "Centre west",
    confidence: "medium",
    evidenceNote: "Official Nice quartier polygons (medium confidence).",
    scores: {
      security: 5.4,
      affordability: 3.4,
      transport: 9.0,
      studentEnergy: 7.0,
      services: 8.6,
      campusAccess: 8.0,
      greenCalm: 4.4
    },
    rentLevel: "high", studentFit: "good",
    summary: "Central west belt with good services and tram access.", caveat: "Rent-limited and less student-dense than Valrose."
  },
  {
    id: "nice-riquier-saint-roch", cityId: "nice", name: "Riquier / Saint-Roch", code: "nice-riquier-saint-roch", kind: "quartier",
    area: "East inner city", granularity: "micro", parentName: "East inner city",
    confidence: "medium",
    evidenceNote: "Official Nice quartier polygons (medium confidence).",
    scores: {
      security: 5.8,
      affordability: 5.4,
      transport: 8.4,
      studentEnergy: 7.0,
      services: 8.0,
      campusAccess: 7.6,
      greenCalm: 5.0
    },
    rentLevel: "medium", studentFit: "good",
    summary: "More affordable inner-east option with improving access.", caveat: "Different risk profile from Pasteur or Ariane."
  },
  {
    id: "nice-carlone-madeleine", cityId: "nice", name: "Carlone / Madeleine", code: "nice-carlone-madeleine", kind: "quartier",
    area: "West campus", granularity: "micro", parentName: "West campus",
    confidence: "medium",
    evidenceNote: "Official Nice quartier polygons (medium confidence).",
    scores: {
      security: 6.4,
      affordability: 4.8,
      transport: 7.6,
      studentEnergy: 7.2,
      services: 7.4,
      campusAccess: 9.0,
      greenCalm: 6.2
    },
    rentLevel: "high", studentFit: "good",
    summary: "Underrated west-side campus belt with real university access.", caveat: "Practical campus option with less brutal rent than the core."
  },
  {
    id: "nice-cimiez-rimiez", cityId: "nice", name: "Cimiez / Rimiez", code: "nice-cimiez-rimiez", kind: "quartier",
    area: "North-east hills", granularity: "micro", parentName: "North-east hills",
    confidence: "medium",
    evidenceNote: "Official Nice quartier polygons (medium confidence).",
    scores: {
      security: 8.2,
      affordability: 2.6,
      transport: 6.8,
      studentEnergy: 4.6,
      services: 7.8,
      campusAccess: 7.2,
      greenCalm: 8.4
    },
    rentLevel: "very high", studentFit: "good",
    summary: "Safe and green hillside belt with low student energy.", caveat: "Not a normal student default despite the safety."
  },
  {
    id: "nice-pasteur-roquebilliere", cityId: "nice", name: "Pasteur / Roquebillière", code: "nice-pasteur-roquebilliere", kind: "quartier",
    area: "East", granularity: "micro", parentName: "East",
    confidence: "medium",
    evidenceNote: "Official Nice quartier polygons (medium confidence).",
    scores: {
      security: 4.4,
      affordability: 6.8,
      transport: 7.6,
      studentEnergy: 5.8,
      services: 7.0,
      campusAccess: 8.0,
      greenCalm: 5.0
    },
    rentLevel: "lower", studentFit: "mixed",
    summary: "Campus-linked east side with value, but hard safety caps.", caveat: "Do not combine with Riquier into one soft eastern score."
  },
  {
    id: "nice-ariane", cityId: "nice", name: "Ariane", code: "nice-ariane", kind: "quartier",
    area: "North-east edge", granularity: "micro", parentName: "North-east edge",
    confidence: "medium",
    evidenceNote: "Official Nice quartier polygon (medium confidence).",
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
    summary: "Affordable north-east edge that stays hard-capped on safety.", caveat: "Cheap rent cannot rescue the risk profile."
  },
  {
    id: "nice-arenas-saint-augustin", cityId: "nice", name: "Arénas / Saint-Augustin / EDHEC", code: "nice-arenas-saint-augustin", kind: "quartier",
    area: "West airport", granularity: "micro", parentName: "West airport",
    confidence: "medium",
    evidenceNote: "Official Nice quartier polygons (medium confidence).",
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
    summary: "Airport-business belt with EDHEC utility and tram access.", caveat: "Useful for specific schools, not broad student life."
  },
];
