import type {
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

import { notion } from "./client";

function getRequiredEnv(
  name: string
): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `${name} est absent des variables d’environnement`
    );
  }

  return value;
}

const athletesDatabaseId =
  getRequiredEnv(
    "NOTION_ATHLETES_DATABASE_ID"
  );

const NAME_PROPERTY = "Nom";
const SLUG_PROPERTY = "Slug";

const VMA_PROPERTY = "VMA";
const VO2_MAX_PROPERTY = "VO2 Max";
const FC_MAX_PROPERTY = "FC Max";
const FC_REST_PROPERTY = "FC Repos";

const LIFETIME_DISTANCE_PROPERTY =
  "Kilométrage à vie";

const ZONE_1_PROPERTY =
  "(Z1) 🟦 Récupération";

const ZONE_2_PROPERTY =
  "(Z2) 🟩 EF";

const ZONE_3_PROPERTY =
  "(Z3) 🟨 Tempo";

const ZONE_4_PROPERTY =
  "(Z4) 🟧 Seuil";

const ZONE_5_PROPERTY =
  "(Z5) 🟥 VO₂max / Anaérobie";

const RECOVERY_PROPERTY =
  "Recovery";

const ENDURANCE_FONDAMENTALE_PROPERTY =
  "Endurance Fondamentale";

const STEADY_PROPERTY =
  "Steady";

const PACE_MARATHON_PROPERTY =
  "Pace Marathon";

const PACE_SEMI_PROPERTY =
  "Pace Semi";

const SEUIL_PROPERTY =
  "Seuil";

const PACE_10_KM_PROPERTY =
  "Pace 10 km";

const INTERVAL_PROPERTY =
  "Interval";

const REPETITION_PROPERTY =
  "Répétition";

const COACH_ADVICE_PROPERTY =
  "Conseil du coach";

export type Athlete = {
  id: string;
  name: string;
  slug: string;

  vma: number | null;
  vo2Max: number | null;
  fcMax: number | null;
  fcRepos: number | null;

  lifetimeDistance: number | null;

  zone1: string;
  zone2: string;
  zone3: string;
  zone4: string;
  zone5: string;

  recovery: string;
  enduranceFondamentale: string;
  steady: string;
  paceMarathon: string;
  paceSemi: string;
  seuil: string;
  pace10km: string;
  interval: string;
  repetition: string;

  conseilCoach: string;
};

type NotionProperties =
  PageObjectResponse["properties"];

function getTitle(
  properties: NotionProperties,
  name: string
): string {
  const property = properties[name];

  if (!property || property.type !== "title") {
    return "";
  }

  return property.title
    .map((item) => item.plain_text)
    .join("")
    .trim();
}

function getRichText(
  properties: NotionProperties,
  name: string
): string {
  const property = properties[name];

  if (!property) {
    return "";
  }

  if (property.type === "rich_text") {
    return property.rich_text
      .map((item) => item.plain_text)
      .join("")
      .trim();
  }

  if (property.type === "title") {
    return property.title
      .map((item) => item.plain_text)
      .join("")
      .trim();
  }

  return "";
}

function getNumber(
  properties: NotionProperties,
  name: string
): number | null {
  const property = properties[name];

  if (!property) {
    return null;
  }

  if (property.type === "number") {
    return property.number;
  }

  if (
    property.type === "formula" &&
    property.formula.type === "number"
  ) {
    return property.formula.number;
  }

  if (
    property.type === "rollup" &&
    property.rollup.type === "number"
  ) {
    return property.rollup.number;
  }

  return null;
}

function getFormulaText(
  properties: NotionProperties,
  name: string
): string {
  const property = properties[name];

  if (!property) {
    console.warn(
      `[Athlète] Propriété introuvable : "${name}"`
    );

    return "";
  }

  if (property.type !== "formula") {
    console.warn(
      `[Athlète] "${name}" n'est pas une formule. Type reçu : ${property.type}`
    );

    return "";
  }

  if (property.formula.type === "string") {
    return property.formula.string?.trim() ?? "";
  }

  if (
    property.formula.type === "number" &&
    property.formula.number !== null
  ) {
    return String(property.formula.number);
  }

  if (property.formula.type === "boolean") {
    return property.formula.boolean
      ? "Oui"
      : "Non";
  }

  if (property.formula.type === "date") {
    return property.formula.date?.start ?? "";
  }

  return "";
}

function getTextValue(
  properties: NotionProperties,
  name: string
): string {
  const property = properties[name];

  if (!property) {
    return "";
  }

  if (property.type === "rich_text") {
    return property.rich_text
      .map((item) => item.plain_text)
      .join("")
      .trim();
  }

  if (property.type === "title") {
    return property.title
      .map((item) => item.plain_text)
      .join("")
      .trim();
  }

  if (property.type === "select") {
    return property.select?.name ?? "";
  }

  if (property.type === "status") {
    return property.status?.name ?? "";
  }

  if (property.type === "formula") {
    if (property.formula.type === "string") {
      return property.formula.string?.trim() ?? "";
    }

    if (
      property.formula.type === "number" &&
      property.formula.number !== null
    ) {
      return String(property.formula.number);
    }
  }

  if (property.type === "rollup") {
    if (
      property.rollup.type === "number" &&
      property.rollup.number !== null
    ) {
      return String(property.rollup.number);
    }

    if (property.rollup.type === "array") {
      return property.rollup.array
        .map((item) => {
          if (item.type === "title") {
            return item.title
              .map((text) => text.plain_text)
              .join("");
          }

          if (item.type === "rich_text") {
            return item.rich_text
              .map((text) => text.plain_text)
              .join("");
          }

          if (
            item.type === "number" &&
            item.number !== null
          ) {
            return String(item.number);
          }

          return "";
        })
        .filter(Boolean)
        .join(", ");
    }
  }

  return "";
}

function mapAthlete(
  page: PageObjectResponse
): Athlete {
  const properties = page.properties;

  return {
    id: page.id,

    name:
      getTitle(
        properties,
        NAME_PROPERTY
      ) || "Athlète",

    slug: getRichText(
      properties,
      SLUG_PROPERTY
    ),

    vma: getNumber(
      properties,
      VMA_PROPERTY
    ),

    vo2Max: getNumber(
      properties,
      VO2_MAX_PROPERTY
    ),

    fcMax: getNumber(
      properties,
      FC_MAX_PROPERTY
    ),

    fcRepos: getNumber(
      properties,
      FC_REST_PROPERTY
    ),

    lifetimeDistance: getNumber(
      properties,
      LIFETIME_DISTANCE_PROPERTY
    ),

    zone1: getFormulaText(
      properties,
      ZONE_1_PROPERTY
    ),

    zone2: getFormulaText(
      properties,
      ZONE_2_PROPERTY
    ),

    zone3: getFormulaText(
      properties,
      ZONE_3_PROPERTY
    ),

    zone4: getFormulaText(
      properties,
      ZONE_4_PROPERTY
    ),

    zone5: getFormulaText(
      properties,
      ZONE_5_PROPERTY
    ),

    recovery: getFormulaText(
      properties,
      RECOVERY_PROPERTY
    ),

    enduranceFondamentale: getFormulaText(
      properties,
      ENDURANCE_FONDAMENTALE_PROPERTY
    ),

    steady: getFormulaText(
      properties,
      STEADY_PROPERTY
    ),

    paceMarathon: getFormulaText(
      properties,
      PACE_MARATHON_PROPERTY
    ),

    paceSemi: getFormulaText(
      properties,
      PACE_SEMI_PROPERTY
    ),

    seuil: getFormulaText(
      properties,
      SEUIL_PROPERTY
    ),

    pace10km: getFormulaText(
      properties,
      PACE_10_KM_PROPERTY
    ),

    interval: getFormulaText(
      properties,
      INTERVAL_PROPERTY
    ),

    repetition: getFormulaText(
      properties,
      REPETITION_PROPERTY
    ),

    conseilCoach: getTextValue(
      properties,
      COACH_ADVICE_PROPERTY
    ),
  };
}

export async function getAthleteBySlug(
  slug: string
): Promise<Athlete | null> {
  const cleanSlug = slug.trim();

  if (!cleanSlug) {
    return null;
  }

  const response =
    await notion.databases.query({
      database_id: athletesDatabaseId!,

      filter: {
        property: SLUG_PROPERTY,
        rich_text: {
          equals: cleanSlug,
        },
      },

      page_size: 1,
    });

  const result = response.results[0];

  if (
    !result ||
    !("properties" in result)
  ) {
    return null;
  }

  return mapAthlete(
    result as PageObjectResponse
  );
}

export async function getAthleteById(
  athleteId: string
): Promise<Athlete | null> {
  if (!athleteId) {
    return null;
  }

  const response =
    await notion.pages.retrieve({
      page_id: athleteId,
    });

  if (!("properties" in response)) {
    return null;
  }

  return mapAthlete(
    response as PageObjectResponse
  );
}