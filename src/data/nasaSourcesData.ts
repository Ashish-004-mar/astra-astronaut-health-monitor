export type SourceCategory =
  | "PUBLIC NASA DATA API"
  | "RESEARCH REFERENCE"
  | "RESEARCH DATA REPOSITORY"
  | "NASA IMAGERY API";

export type SourceGroup = "ACTIVE_DATA_API" | "RESEARCH_REFERENCE";

export type SourceDomain = "ALL" | "SPACE ENVIRONMENT" | "CREW HEALTH";

export interface NasaSource {
  id: string;
  title: string;
  officialOrg: string;
  category: SourceCategory;
  group: SourceGroup;
  domain: "SPACE ENVIRONMENT" | "CREW HEALTH";
  url: string;
  shortDesc: string;
  astraRelevance: string;
  integrationStatus: "ACTIVE LIVE DATA" | "RESEARCH & DESIGN REFERENCE";
  integrationBadge: string;
  integrationDetails?: {
    provider: string;
    endpoint: string;
    retrievedData: string;
    cachedStatus: string;
    documentationUrl: string;
  };
  limitations: string;
  keyTopics: string[];
}

export const NASA_SOURCES_DATA: NasaSource[] = [
  {
    id: "nasa-donki-api",
    title: "NASA Open APIs — DONKI Space Weather",
    officialOrg: "NASA Goddard Space Flight Center / CCMC",
    category: "PUBLIC NASA DATA API",
    group: "ACTIVE_DATA_API",
    domain: "SPACE ENVIRONMENT",
    url: "https://kauai.ccmc.gsfc.nasa.gov/DONKI/",
    shortDesc:
      "Public real-time space weather observations, including Solar Flares (FLR), Coronal Mass Ejections (CME), and Geomagnetic Storms (GST).",
    astraRelevance:
      "Direct live integration: powers ASTRA's Space Weather service (`src/services/spaceWeather.ts`). Fetches public solar flare notifications, classified by flare intensity.",
    integrationStatus: "ACTIVE LIVE DATA",
    integrationBadge: "ACTIVE DATA INTEGRATION",
    integrationDetails: {
      provider: "NASA Goddard Space Flight Center (DONKI)",
      endpoint: "https://api.nasa.gov/DONKI/FLR",
      retrievedData:
        "Solar flare events (flrID, beginTime, classType, sourceLocation, activity bulletin URL).",
      cachedStatus:
        "Local browser cache (`astra-space-cache`) with autonomous deterministic fallback when spacecraft communication is delayed or offline.",
      documentationUrl: "https://api.nasa.gov/",
    },
    limitations:
      "Public solar event notices provide general space environmental context and do NOT represent an astronaut's individual absorbed tissue radiation dose. Dosimeter readings inside the habitat remain simulated.",
    keyTopics: [
      "Solar Flares",
      "Coronal Mass Ejections",
      "Space Weather",
      "Radiation Threat Index",
    ],
  },
  {
    id: "nasa-hrp-risks",
    title: "NASA Human Spaceflight Risks",
    officialOrg: "NASA Human Research Program (HRP)",
    category: "RESEARCH REFERENCE",
    group: "RESEARCH_REFERENCE",
    domain: "CREW HEALTH",
    url: "https://www.nasa.gov/hrp/risks/",
    shortDesc:
      "NASA research concerning physiological, behavioral, and performance risks associated with long-duration human spaceflight.",
    astraRelevance:
      "Scientific foundation for monitoring astronaut physical and behavioral wellbeing across cardiovascular, sleep, stress, and musculoskeletal axes.",
    integrationStatus: "RESEARCH & DESIGN REFERENCE",
    integrationBadge: "RESEARCH & DESIGN REFERENCE",
    limitations:
      "Informs software telemetry modeling and clinical rationales. ASTRA is an independent educational prototype and does not replace NASA certified flight surgeons.",
    keyTopics: [
      "Cardiovascular Health",
      "Orthostatic Intolerance",
      "Sleep Loss",
      "Clinical Anomaly Detection",
    ],
  },
  {
    id: "nasa-five-hazards",
    title: "Five Hazards of Human Spaceflight",
    officialOrg: "NASA Human Research Program (HRP)",
    category: "RESEARCH REFERENCE",
    group: "RESEARCH_REFERENCE",
    domain: "SPACE ENVIRONMENT",
    url: "https://www.nasa.gov/hrp/hazards/",
    shortDesc:
      "The five fundamental spaceflight hazards: Space Radiation, Isolation and Confinement, Distance from Earth, Altered Gravity, and Hostile/Closed Environments.",
    astraRelevance:
      "Directly drives ASTRA's Mission Health Risks taxonomy, spaceflight hazard radar, and deep-space autonomy design requirements.",
    integrationStatus: "RESEARCH & DESIGN REFERENCE",
    integrationBadge: "RESEARCH & DESIGN REFERENCE",
    limitations:
      "Hazard threat assessments are modeled from NASA published mission risk profiles. Habitat sensors and cosmic dosimeters are simulated.",
    keyTopics: [
      "Cosmic Radiation",
      "Sensory Isolation",
      "Comms Latency (22 min)",
      "Microgravity Fluid Shifts",
    ],
  },
  {
    id: "nasa-osdr",
    title: "NASA OSDR — Space Biology Research Data",
    officialOrg: "NASA Biological & Physical Sciences",
    category: "RESEARCH DATA REPOSITORY",
    group: "RESEARCH_REFERENCE",
    domain: "CREW HEALTH",
    url: "https://science.nasa.gov/biological-physical/data/osdr/",
    shortDesc:
      "Global open repository hosting multi-omics, transcriptomic, and physiological datasets from spaceflight missions and ground analogs.",
    astraRelevance:
      "Scientific benchmark for understanding longitudinal spaceflight health changes and defining nominal physiological ranges.",
    integrationStatus: "RESEARCH & DESIGN REFERENCE",
    integrationBadge: "RESEARCH & DESIGN REFERENCE",
    limitations:
      "Research reference only. ASTRA does not stream live in-flight astronaut biometric telemetry from OSDR servers.",
    keyTopics: [
      "Space Omics",
      "Longitudinal Health",
      "Bioinformatics",
      "Cellular Deconditioning",
    ],
  },
  {
    id: "nasa-epic-imagery",
    title: "NASA EPIC — Earth Imagery",
    officialOrg: "NASA Goddard Space Flight Center / DSCOVR",
    category: "NASA IMAGERY API",
    group: "RESEARCH_REFERENCE",
    domain: "SPACE ENVIRONMENT",
    url: "https://epic.gsfc.nasa.gov/about/api",
    shortDesc:
      "Daily full-disc natural color Earth imagery and metadata from NASA's Earth Polychromatic Imaging Camera (EPIC) at the Sun-Earth L1 point.",
    astraRelevance:
      "Inspiration for global planetary visualization and visual continuity to support astronaut psychological grounding during deep space transit.",
    integrationStatus: "RESEARCH & DESIGN REFERENCE",
    integrationBadge: "RESEARCH & DESIGN REFERENCE",
    limitations:
      "The in-app 3D globe utilizes Three.js shaders with planetary texture maps derived from NASA Visible Earth public domain imagery, rather than streaming live real-time full-resolution EPIC satellite image feeds.",
    keyTopics: [
      "Planetary Visualization",
      "Psychological Grounding",
      "Orbital Geometry",
      "Visible Earth",
    ],
  },
  {
    id: "nasa-iss-research",
    title: "International Space Station Research & Technology",
    officialOrg: "NASA Space Station Directorate",
    category: "RESEARCH REFERENCE",
    group: "RESEARCH_REFERENCE",
    domain: "CREW HEALTH",
    url: "https://www.nasa.gov/international-space-station/space-station-research-and-technology/",
    shortDesc:
      "Over 25 years of microgravity research, human physiology studies, and environmental hardware validation aboard the ISS.",
    astraRelevance:
      "Provides empirical background for microgravity countermeasures, exercise regimes, and medical monitoring technologies.",
    integrationStatus: "RESEARCH & DESIGN REFERENCE",
    integrationBadge: "RESEARCH & DESIGN REFERENCE",
    limitations:
      "Serves as empirical reference literature for countermeasure timelines and physiological adaptation curves.",
    keyTopics: [
      "Microgravity Countermeasures",
      "Resistive Exercise",
      "Bone Density Loss",
      "T2 Treadmill Standards",
    ],
  },
  {
    id: "nasa-behavioral-health",
    title: "Behavioral Conditions & Psychiatric Disorders Risk",
    officialOrg: "NASA Human Research Program (HRP)",
    category: "RESEARCH REFERENCE",
    group: "RESEARCH_REFERENCE",
    domain: "CREW HEALTH",
    url: "https://www.nasa.gov/reference/risk-of-behavioral-conditions-and-psychiatric-disorders/",
    shortDesc:
      "NASA research on behavioral health, mood changes, and psychological risks during prolonged isolation and confinement in deep space.",
    astraRelevance:
      "Informs ASTRA MindSpace, stress recovery studio, audio relaxation chimes, and voluntary daily mental wellbeing check-ins.",
    integrationStatus: "RESEARCH & DESIGN REFERENCE",
    integrationBadge: "RESEARCH & DESIGN REFERENCE",
    limitations:
      "MindSpace is an educational stress-coping, reflection, and crew resilience tool. It does NOT clinically diagnose, treat, or cure psychiatric disorders.",
    keyTopics: [
      "Confinement Resilience",
      "Autonomic Stress Recovery",
      "Private Reflection",
      "Circadian Entrainment",
    ],
  },
  {
    id: "nasa-teamwork-research",
    title: "NASA Crew Teamwork Research",
    officialOrg: "NASA Human Factors & Behavioral Performance",
    category: "RESEARCH REFERENCE",
    group: "RESEARCH_REFERENCE",
    domain: "CREW HEALTH",
    url: "https://www.nasa.gov/reference/risk-of-inadequate-teamwork/",
    shortDesc:
      "NASA research concerning crew coordination, interpersonal communication challenges, and collaborative performance under isolated conditions.",
    astraRelevance:
      "Directly inspires ASTRA MindSpace Crew Harmony module, peer debriefing workflows, and shared operational readiness tracking.",
    integrationStatus: "RESEARCH & DESIGN REFERENCE",
    integrationBadge: "RESEARCH & DESIGN REFERENCE",
    limitations:
      "Provides self-reported sociometric indicators and structured team reflection tools without evaluating confidential military or clinical crew records.",
    keyTopics: [
      "Team Harmony",
      "Conflict Resolution",
      "Autonomous Debriefing",
      "Crew Communication",
    ],
  },
  {
    id: "nasa-nutrition",
    title: "Risk of Inadequate Food and Nutrition",
    officialOrg: "NASA Human Research Program (HRP)",
    category: "RESEARCH REFERENCE",
    group: "RESEARCH_REFERENCE",
    domain: "CREW HEALTH",
    url: "https://www.nasa.gov/reference/risk-of-inadequate-food-and-nutrition/",
    shortDesc:
      "NASA research concerning nutrition risks during spaceflight, evaluating nutrient degradation (Thiamine, Vitamin C, Potassium) and metabolic caloric requirements.",
    astraRelevance:
      "Underpins ASTRA's Mission Nutrition Galley, tracking micronutrient stability, caloric expenditure, and countermeasure meal suggestions.",
    integrationStatus: "RESEARCH & DESIGN REFERENCE",
    integrationBadge: "RESEARCH & DESIGN REFERENCE",
    limitations:
      "The simulated food inventory and shelf-life depletion formulas demonstrate bioastronautics principles and were not directly supplied or packaged by NASA food labs.",
    keyTopics: [
      "Shelf-Life Degradation",
      "Micronutrient Stability",
      "Caloric Equilibrium",
      "Microgravity Galley",
    ],
  },
  {
    id: "nasa-eclss",
    title: "Environmental Control & Life Support Systems (ECLSS)",
    officialOrg: "NASA Marshall Space Flight Center / JSC",
    category: "RESEARCH REFERENCE",
    group: "RESEARCH_REFERENCE",
    domain: "SPACE ENVIRONMENT",
    url: "https://www.nasa.gov/reference/environmental-control-and-life-support-systems-eclss/",
    shortDesc:
      "Spacecraft environmental control, oxygen generation, cabin CO₂ scrubbing, and closed-loop water recovery systems (ISS 98% water recovery milestone).",
    astraRelevance:
      "Architectural foundation for ASTRA AquaGuard water purity monitoring (TOC < 500 ppb) and spacecraft cabin atmosphere telemetry.",
    integrationStatus: "RESEARCH & DESIGN REFERENCE",
    integrationBadge: "RESEARCH & DESIGN REFERENCE",
    limitations:
      "ASTRA monitors and visualizes simulated life-support telemetry; it does not physically process or actuate spacecraft ECLSS valve assemblies.",
    keyTopics: [
      "Water Recovery System (WRS)",
      "Total Organic Carbon (TOC)",
      "Cabin Atmosphere",
      "Closed-Loop ECLSS",
    ],
  },
];
