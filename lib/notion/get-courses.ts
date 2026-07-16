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

const racesDatabaseId =
  getRequiredEnv(
    "NOTION_RACES_DATABASE_ID"
  );
export type Race = {
  id: string;
  name: string;
  date: string;
  preparationStartDate: string;
  distance: string;
  location: string;
  targetTime: string;
  resultTime: string;
  averagePace: string;

  ranking: number | null;
  participants: number | null;

  categoryRanking: number | null;
  categoryParticipants: number | null;

  sexRanking: number | null;
  sexParticipants: number | null;

  status: string;
  isPersonalBest: boolean;
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

function getDate(
  properties: NotionProperties,
  name: string
): string {
  const property = properties[name];

  if (!property) {
    return "";
  }

  if (property.type === "date") {
    return property.date?.start ?? "";
  }

  if (
    property.type === "formula" &&
    property.formula.type === "date"
  ) {
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

  if (property.type === "title") {
    return property.title
      .map((item) => item.plain_text)
      .join("")
      .trim();
  }

  if (property.type === "rich_text") {
    return property.rich_text
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

    if (property.formula.type === "boolean") {
      return property.formula.boolean
        ? "Oui"
        : "Non";
    }

    if (property.formula.type === "date") {
      return property.formula.date?.start ?? "";
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

          if (item.type === "select") {
            return item.select?.name ?? "";
          }

          return "";
        })
        .filter(Boolean)
        .join(", ");
    }
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

function getCheckbox(
  properties: NotionProperties,
  name: string
): boolean {
  const property = properties[name];

  if (!property) {
    return false;
  }

  if (property.type === "checkbox") {
    return property.checkbox;
  }

  if (
    property.type === "formula" &&
    property.formula.type === "boolean"
  ) {
return property.formula.boolean ?? false;  }

  return false;
}

function mapRace(
  page: PageObjectResponse
): Race {
  const properties = page.properties;

  return {
    id: page.id,

    name:
      getTitle(
        properties,
        "Nom"
      ) || "Course",

    date: getDate(
      properties,
      "Date"
    ),

    preparationStartDate: getDate(
      properties,
      "Début préparation"
    ),

    distance: getTextValue(
      properties,
      "Distance"
    ),

    location: getTextValue(
      properties,
      "Lieu"
    ),

    targetTime: getTextValue(
      properties,
      "Objectif"
    ),

    /*
      Cette propriété peut être une formule Notion.
      Exemple de résultat : 39'49 ou 1h34'12.
    */
    resultTime: getTextValue(
      properties,
      "Temps affiché"
    ),

    /*
      Cette propriété peut également être une formule.
    */
    averagePace: getTextValue(
      properties,
      "Allure moyenne"
    ),

    ranking: getNumber(
      properties,
      "Classement"
    ),

    participants: getNumber(
      properties,
      "Participants"
    ),

    categoryRanking: getNumber(
      properties,
      "Classement catégorie"
    ),

    categoryParticipants: getNumber(
      properties,
      "Participants catégorie"
    ),

    sexRanking: getNumber(
      properties,
      "Classement sexe"
    ),

    sexParticipants: getNumber(
      properties,
      "Participants sexe"
    ),

    status: getTextValue(
      properties,
      "Statut"
    ),

    isPersonalBest: getCheckbox(
      properties,
      "RP"
    ),
  };
}

export async function getCoursesByAthleteId(
  athleteId: string
): Promise<Race[]> {
  if (!athleteId) {
    return [];
  }

  const response =
    await notion.databases.query({
      database_id: racesDatabaseId,

      filter: {
        property: "Athlète",
        relation: {
          contains: athleteId,
        },
      },

      sorts: [
        {
          property: "Date",
          direction: "ascending",
        },
      ],

      page_size: 100,
    });

  return response.results
    .filter(
      (
        result
      ): result is PageObjectResponse =>
        "properties" in result
    )
    .map(mapRace);
}