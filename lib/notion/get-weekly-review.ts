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

const weeklyReviewsDatabaseId =
  getRequiredEnv(
    "NOTION_WEEKLY_REVIEWS_DATABASE_ID"
  );

const ATHLETE_PROPERTY = "Athlète";
const DATE_PROPERTY = "Date du bilan";
const FORM_PROPERTY = "État de forme";
const VOLUME_PROPERTY = "Volume hebdo.";

export type WeeklyReview = {
  id: string;
  date: string;
  formState: string;
  weeklyVolume: number | null;
};

export type WeeklyReviewSummary = {
  latestReview: WeeklyReview | null;
  lifetimeDistance: number;
};

type NotionProperties =
  PageObjectResponse["properties"];

function isPageObjectResponse(
  value: unknown
): value is PageObjectResponse {
  return Boolean(
    value &&
      typeof value === "object" &&
      "object" in value &&
      value.object === "page" &&
      "properties" in value
  );
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

function getFormState(
  properties: NotionProperties,
  name: string
): string {
  const property = properties[name];

  if (!property) {
    console.warn(
      `[Bilan hebdo] Propriété introuvable : "${name}"`
    );

    return "";
  }

  if (property.type === "select") {
    return property.select?.name ?? "";
  }

  if (property.type === "status") {
    return property.status?.name ?? "";
  }

  if (property.type === "multi_select") {
    return property.multi_select
      .map((option) => option.name)
      .join(", ");
  }

  if (property.type === "rich_text") {
    return property.rich_text
      .map((item) => item.plain_text)
      .join("")
      .trim();
  }

  if (
    property.type === "formula" &&
    property.formula.type === "string"
  ) {
    return property.formula.string?.trim() ?? "";
  }

  console.warn(
    `[Bilan hebdo] "${name}" a le type "${property.type}"`
  );

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

function getTimestamp(
  properties: NotionProperties
): number {
  const date = getDate(
    properties,
    DATE_PROPERTY
  );

  if (!date) {
    return 0;
  }

  const timestamp =
    new Date(date).getTime();

  return Number.isNaN(timestamp)
    ? 0
    : timestamp;
}

export async function getWeeklyReviewSummaryByAthleteId(
  athleteId: string
): Promise<WeeklyReviewSummary> {
  if (!athleteId) {
    return {
      latestReview: null,
      lifetimeDistance: 0,
    };
  }

  const response =
    await notion.databases.query({
      database_id:
        weeklyReviewsDatabaseId,

      filter: {
        property:
          ATHLETE_PROPERTY,

        relation: {
          contains: athleteId,
        },
      },

      page_size: 100,
    });

  const pages = response.results
    .filter(isPageObjectResponse)
    .sort(
      (a, b) =>
        getTimestamp(b.properties) -
        getTimestamp(a.properties)
    );

  const latestPage =
    pages[0] ?? null;

  const latestReview: WeeklyReview | null =
    latestPage
      ? {
          id: latestPage.id,

          date: getDate(
            latestPage.properties,
            DATE_PROPERTY
          ),

          formState: getFormState(
            latestPage.properties,
            FORM_PROPERTY
          ),

          weeklyVolume: getNumber(
            latestPage.properties,
            VOLUME_PROPERTY
          ),
        }
      : null;

  const lifetimeDistance =
    pages.reduce(
      (total, page) => {
        const weeklyVolume =
          getNumber(
            page.properties,
            VOLUME_PROPERTY
          );

        return (
          total +
          (weeklyVolume ?? 0)
        );
      },
      0
    );

  return {
    latestReview,
    lifetimeDistance,
  };
}