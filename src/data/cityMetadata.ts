import type { CityConfig, CityId, Source } from "@/data/types";

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
  },
  {
    label: "Wikipedia: Croix (Nord)",
    url: "https://fr.wikipedia.org/wiki/Croix_(Nord)"
  },
  {
    label: "Wikipedia: Roubaix",
    url: "https://fr.wikipedia.org/wiki/Roubaix"
  },
  {
    label: "Wikipedia: Tourcoing",
    url: "https://fr.wikipedia.org/wiki/Tourcoing"
  },
  {
    label: "Wikipedia: EDHEC Nord",
    url: "https://fr.wikipedia.org/wiki/%C3%89cole_des_hautes_%C3%A9tudes_commerciales_du_Nord"
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

const rennesSources: Source[] = [
  {
    label: "SSMSI / data.gouv.fr crime indicators, 2025 geography",
    url: "https://www.data.gouv.fr/fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales/"
  },
  {
    label: "Rennes Metropole 12 administrative quartiers",
    url: "https://data.rennesmetropole.fr/explore/dataset/perimetres-des-12-quartiers-de-la-ville-de-rennes/"
  },
  {
    label: "geo.api.gouv.fr commune contours",
    url: "https://geo.api.gouv.fr/decoupage-administratif/communes"
  },
  {
    label: "Wikipedia: Quartiers de Rennes",
    url: "https://fr.wikipedia.org/wiki/Quartiers_de_Rennes"
  }
];

const strasbourgSources: Source[] = [
  {
    label: "SSMSI / data.gouv.fr crime indicators, 2025 geography",
    url: "https://www.data.gouv.fr/fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales/"
  },
  {
    label: "Strasbourg Eurometropole functional quartiers",
    url: "https://data.strasbourg.eu/explore/dataset/strasbourg_23_quartiers/"
  },
  {
    label: "geo.api.gouv.fr commune contours",
    url: "https://geo.api.gouv.fr/decoupage-administratif/communes"
  },
  {
    label: "Wikipedia: Quartiers de Strasbourg",
    url: "https://fr.wikipedia.org/wiki/Quartiers_de_Strasbourg"
  }
];

const grenobleSources: Source[] = [
  {
    label: "SSMSI / data.gouv.fr crime indicators, 2025 geography",
    url: "https://www.data.gouv.fr/fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales/"
  },
  {
    label: "Grenoble-Alpes Metropole unions de quartier",
    url: "https://data.metropolegrenoble.fr/"
  },
  {
    label: "geo.api.gouv.fr commune contours",
    url: "https://geo.api.gouv.fr/decoupage-administratif/communes"
  },
  {
    label: "Wikipedia: Quartiers de Grenoble",
    url: "https://fr.wikipedia.org/wiki/Quartiers_de_Grenoble"
  }
];

const montpellierSources: Source[] = [
  {
    label: "SSMSI / data.gouv.fr crime indicators, 2025 geography",
    url: "https://www.data.gouv.fr/fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales/"
  },
  {
    label: "INSEE IRIS boundaries (Montpellier commune 34172)",
    url: "https://geoservices.ign.fr/contoursiris"
  },
  {
    label: "geo.api.gouv.fr commune contours",
    url: "https://geo.api.gouv.fr/decoupage-administratif/communes"
  },
  {
    label: "Wikipedia: Quartiers de Montpellier",
    url: "https://fr.wikipedia.org/wiki/Quartiers_de_Montpellier"
  }
];

const toulonSources: Source[] = [
  {
    label: "SSMSI / data.gouv.fr crime indicators, 2025 geography",
    url: "https://www.data.gouv.fr/fr/datasets/bases-statistiques-communale-departementale-et-regionale-de-la-delinquance-enregistree-par-la-police-et-la-gendarmerie-nationales/"
  },
  {
    label: "INSEE IRIS boundaries (Toulon commune 83137)",
    url: "https://geoservices.ign.fr/contoursiris"
  },
  {
    label: "geo.api.gouv.fr commune contours",
    url: "https://geo.api.gouv.fr/decoupage-administratif/communes"
  },
  {
    label: "Wikipedia: Quartiers de Toulon",
    url: "https://fr.wikipedia.org/wiki/Quartiers_de_Toulon"
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
    outlineGeojsonUrl: "/data/districts-outlines.geojson",
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
    title: "Bordeaux districts + campus suburbs",
    geojsonUrl: "/data/bordeaux.geojson",
    outlineGeojsonUrl: "/data/bordeaux-outlines.geojson",
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
    outlineGeojsonUrl: "/data/lyon-outlines.geojson",
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
    title: "Toulouse official quartiers + campus belts",
    geojsonUrl: "/data/toulouse.geojson",
    outlineGeojsonUrl: "/data/toulouse-outlines.geojson",
    center: [1.444, 43.604],
    zoom: 12,
    minZoom: 10.5,
    maxZoom: 15,
    defaultSelectedCode: "toulouse-rangueil-sauzelong",
    areaOptions: [
      "Centre",
      "Centre north",
      "Centre east",
      "Station east",
      "Rive gauche",
      "South-west",
      "West",
      "North",
      "North-east",
      "East",
      "South-east",
      "South-east campus",
      "Centre south",
      "North-west campus",
      "South-west campus",
      "South-west periphery"
    ],
    parentFilterOptions: [
      "Centre",
      "Centre north",
      "Centre east",
      "Station east",
      "Rive gauche",
      "South-west",
      "West",
      "North",
      "North-east",
      "East",
      "South-east",
      "South-east campus",
      "Centre south",
      "North-west campus",
      "South-west campus",
      "South-west periphery"
    ],
    sources: toulouseSources
  },
  {
    id: "lille",
    name: "Lille",
    title: "Lille + Roubaix-Tourcoing student quality map",
    geojsonUrl: "/data/lille.geojson",
    outlineGeojsonUrl: "/data/lille-outlines.geojson",
    center: [3.12, 50.64],
    zoom: 12,
    minZoom: 10.5,
    maxZoom: 15,
    defaultSelectedCode: "lille-vauban-esquermes",
    areaOptions: [
      "Lille-Centre",
      "Vieux-Lille",
      "Vauban-Esquermes",
      "Wazemmes",
      "Moulins",
      "Fives",
      "Hellemmes",
      "Bois-Blancs",
      "Lille-Sud",
      "Saint-Maurice Pellevoisin",
      "Lomme",
      "Lambersart",
      "La Madeleine",
      "Mons-en-Barœul",
      "Villeneuve-d'Ascq",
      "Croix",
      "Roubaix",
      "Tourcoing"
    ],
    parentFilterOptions: [
      "Lille-Centre",
      "Vieux-Lille",
      "Vauban-Esquermes",
      "Wazemmes",
      "Moulins",
      "Fives",
      "Hellemmes",
      "Bois-Blancs",
      "Lille-Sud",
      "Saint-Maurice Pellevoisin",
      "Lomme",
      "Lambersart",
      "La Madeleine",
      "Mons-en-Barœul",
      "Villeneuve-d'Ascq",
      "Croix",
      "Roubaix",
      "Tourcoing"
    ],
    sources: lilleSources
  },
  {
    id: "marseille",
    name: "Marseille",
    title: "Marseille student quality districts",
    geojsonUrl: "/data/marseille.geojson",
    outlineGeojsonUrl: "/data/marseille-outlines.geojson",
    center: [5.369, 43.296],
    zoom: 11.6,
    minZoom: 10.5,
    maxZoom: 15,
    defaultSelectedCode: "marseille-baille-timone-conception",
    areaOptions: ["1e", "2e", "3e", "4e", "5e", "6e", "6e/7e", "7e", "8e", "8e/9e", "9e", "10e", "11e", "12e", "13e", "14e", "15e", "16e"],
    parentFilterOptions: ["1e", "2e", "3e", "4e", "5e", "6e", "6e/7e", "7e", "8e", "8e/9e", "9e", "10e", "11e", "12e", "13e", "14e", "15e", "16e"],
    sources: marseilleSources
  },
  {
    id: "nice",
    name: "Nice",
    title: "Nice quartier corridors + campus belts",
    geojsonUrl: "/data/nice.geojson",
    outlineGeojsonUrl: "/data/nice-outlines.geojson",
    center: [7.262, 43.71],
    zoom: 12,
    minZoom: 10.5,
    maxZoom: 15,
    defaultSelectedCode: "nice-liberation-valrose",
    areaOptions: [
      "Historic centre",
      "Centre",
      "Centre west",
      "North centre campus",
      "North centre",
      "North-east hills",
      "East inner city",
      "East campus",
      "East",
      "North-east edge",
      "Centre west coast",
      "West coast",
      "West campus",
      "West valley",
      "West hills",
      "West airport",
      "West",
      "Far west",
      "East hills"
    ],
    parentFilterOptions: [
      "Historic centre",
      "Centre",
      "Centre west",
      "North centre campus",
      "North centre",
      "North-east hills",
      "East inner city",
      "East campus",
      "East",
      "North-east edge",
      "Centre west coast",
      "West coast",
      "West campus",
      "West valley",
      "West hills",
      "West airport",
      "West",
      "Far west",
      "East hills"
    ],
    sources: niceSources
  },
  {
    id: "nantes",
    name: "Nantes",
    title: "Nantes official quartiers + campus belts",
    geojsonUrl: "/data/nantes.geojson",
    outlineGeojsonUrl: "/data/nantes-outlines.geojson",
    center: [-1.553, 47.218],
    zoom: 12,
    minZoom: 10.5,
    maxZoom: 15,
    defaultSelectedCode: "nantes-saint-felix-michelet",
    areaOptions: [
      "Centre-ville",
      "Hauts-Pavés - Saint-Félix",
      "Nantes Nord",
      "Nantes Erdre",
      "Ile de Nantes",
      "Malakoff - Saint-Donatien",
      "Dervallières - Zola",
      "Bellevue - Chantenay - Sainte-Anne",
      "Breil - Barberie",
      "Doulon - Bottière",
      "Nantes Sud"
    ],
    parentFilterOptions: [
      "Centre-ville",
      "Hauts-Pavés - Saint-Félix",
      "Nantes Nord",
      "Nantes Erdre",
      "Ile de Nantes",
      "Malakoff - Saint-Donatien",
      "Dervallières - Zola",
      "Bellevue - Chantenay - Sainte-Anne",
      "Breil - Barberie",
      "Doulon - Bottière",
      "Nantes Sud"
    ],
    sources: nantesSources
  },
  {
    id: "strasbourg",
    name: "Strasbourg",
    title: "Strasbourg official quartiers + Illkirch campus",
    geojsonUrl: "/data/strasbourg.geojson",
    outlineGeojsonUrl: "/data/strasbourg-outlines.geojson",
    center: [7.752, 48.573],
    zoom: 12,
    minZoom: 10.5,
    maxZoom: 15,
    defaultSelectedCode: "strasbourg-bourse-esplanade-krutenau",
    areaOptions: [
      "Centre-east",
      "Centre",
      "Station core",
      "North-east premium",
      "North-east",
      "West campus",
      "West cap",
      "West-south",
      "South-west",
      "South-west cap",
      "South",
      "South-east",
      "East edge",
      "South cap",
      "Campus suburb"
    ],
    parentFilterOptions: [
      "Centre-east",
      "Centre",
      "Station core",
      "North-east premium",
      "North-east",
      "West campus",
      "West cap",
      "West-south",
      "South-west",
      "South-west cap",
      "South",
      "South-east",
      "East edge",
      "South cap",
      "Campus suburb"
    ],
    sources: strasbourgSources
  },
  {
    id: "montpellier",
    name: "Montpellier",
    title: "Montpellier major districts + campus belts",
    geojsonUrl: "/data/montpellier.geojson",
    outlineGeojsonUrl: "/data/montpellier-outlines.geojson",
    center: [3.877, 43.611],
    zoom: 12,
    minZoom: 10.5,
    maxZoom: 15,
    defaultSelectedCode: "montpellier-beaux-arts-boutonnet",
    areaOptions: [
      "Montpellier Centre",
      "North centre",
      "West centre",
      "East centre",
      "East campus",
      "East",
      "North campus",
      "North-east",
      "South-west",
      "West",
      "North-west cap",
      "South"
    ],
    parentFilterOptions: [
      "Montpellier Centre",
      "North centre",
      "West centre",
      "East centre",
      "East campus",
      "East",
      "North campus",
      "North-east",
      "South-west",
      "West",
      "North-west cap",
      "South"
    ],
    sources: montpellierSources
  },
  {
    id: "rennes",
    name: "Rennes",
    title: "Rennes official quartiers + campus belts",
    geojsonUrl: "/data/rennes.geojson",
    outlineGeojsonUrl: "/data/rennes-outlines.geojson",
    center: [-1.677, 48.117],
    zoom: 12,
    minZoom: 10.5,
    maxZoom: 15,
    defaultSelectedCode: "rennes-thabor-saint-helier-alphonse-guerin",
    areaOptions: [
      "Centre",
      "East centre",
      "West centre",
      "North",
      "North cap",
      "North-east campus",
      "East-south",
      "South centre",
      "West inner",
      "West campus",
      "South cap",
      "South-west"
    ],
    parentFilterOptions: [
      "Centre",
      "East centre",
      "West centre",
      "North",
      "North cap",
      "North-east campus",
      "East-south",
      "South centre",
      "West inner",
      "West campus",
      "South cap",
      "South-west"
    ],
    sources: rennesSources
  },
  {
    id: "toulon",
    name: "Toulon",
    title: "Toulon commute districts + La Garde campus",
    geojsonUrl: "/data/toulon.geojson",
    outlineGeojsonUrl: "/data/toulon-outlines.geojson",
    center: [5.930, 43.124],
    zoom: 11.8,
    minZoom: 10.5,
    maxZoom: 15,
    defaultSelectedCode: "toulon-la-garde-campus",
    areaOptions: [
      "Centre",
      "East centre",
      "East coast",
      "East inner",
      "East",
      "West",
      "North-west",
      "West edge",
      "Campus suburb",
      "Commute edge"
    ],
    parentFilterOptions: [
      "Centre",
      "East centre",
      "East coast",
      "East inner",
      "East",
      "West",
      "North-west",
      "West edge",
      "Campus suburb",
      "Commute edge"
    ],
    sources: toulonSources
  },
  {
    id: "grenoble",
    name: "Grenoble",
    title: "Grenoble sector districts + campus edges",
    geojsonUrl: "/data/grenoble.geojson",
    outlineGeojsonUrl: "/data/grenoble-outlines.geojson",
    center: [5.724, 45.188],
    zoom: 12,
    minZoom: 10.5,
    maxZoom: 15,
    defaultSelectedCode: "grenoble-gieres-campus",
    areaOptions: [
      "Centre",
      "Centre-east",
      "Centre-west",
      "North-west campus",
      "West inner",
      "East river",
      "West cap",
      "East inner",
      "East",
      "South-east",
      "South-east cap",
      "South cap",
      "Campus suburb"
    ],
    parentFilterOptions: [
      "Centre",
      "Centre-east",
      "Centre-west",
      "North-west campus",
      "West inner",
      "East river",
      "West cap",
      "East inner",
      "East",
      "South-east",
      "South-east cap",
      "South cap",
      "Campus suburb"
    ],
    sources: grenobleSources
  }
];

export const cityById = new Map<CityId, CityConfig>(cities.map((city) => [city.id, city]));
