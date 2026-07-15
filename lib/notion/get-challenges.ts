import { unstable_cache } from "next/cache";

import { notion } from "@/lib/notion/client";

const athletesDatabaseId =
  process.env.NOTION_ATHLETES_DATABASE_ID;

const clientChallengesDatabaseId =
  process.env.NOTION_CLIENT_CHALLENGES_DATABASE_ID;

if (!athletesDatabaseId) {
  throw new Error(
    "NOTION_ATHLETES_DATABASE_ID est absent de .env.local"
  );
}

if (!clientChallengesDatabaseId) {
  throw new Error(
    "NOTION_CLIENT_CHALLENGES_DATABASE_ID est absent de .env.local"
  );
}

/*
  Base Athlètes
*/
const ATHLETE_SLUG_PROPERTY = "Slug";
const ATHLETE_CLIENT_PROPERTY = "Client";

/*
  Base Client Challenges
*/
const CHALLENGE_CLIENT_PROPERTY = "Clients";
const CHALLENGE_TITLE_PROPERTY = "Titre";
const CHALLENGE_DESCRIPTION_PROPERTY =
  "Description";
const CHALLENGE_CATEGORY_PROPERTY =
  "Catégorie";
const CHALLENGE_DIFFICULTY_PROPERTY =
  "Difficulté";
const CHALLENGE_DURATION_PROPERTY = "Durée";
const CHALLENGE_ICON_PROPERTY = "Icone";
const CHALLENGE_POINTS_PROPERTY = "Point";
const CHALLENGE_STATUS_PROPERTY = "Statut";
const CHALLENGE_START_PROPERTY = "Début";
const CHALLENGE_END_PROPERTY = "Fin";

type NotionProperties = Record<
  string,
  any
>;

type NotionPage = {
  id: string;
  properties: NotionProperties;
};

export type ChallengePeriod =
  | "week"
  | "month";

export type ClientChallenge = {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  difficulty: string;
  duration: string;
  status: string;
  startDate: string;
  endDate: string;
  icon: string;
  period: ChallengePeriod;
};

function clean(
  value?: string
): string {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .trim();
}

function isNotionPage(
  value: unknown
): value is NotionPage {
  return Boolean(
    value &&
      typeof value === "object" &&
      "id" in value &&
      "properties" in value
  );
}

function getProperty(
  properties: NotionProperties,
  searchedName: string
): any | null {
  if (!properties) {
    return null;
  }

  const normalizedName =
    clean(searchedName);

  const exactKey = Object.keys(
    properties
  ).find(
    (name) =>
      clean(name) === normalizedName
  );

  if (exactKey) {
    return properties[exactKey];
  }

  const partialKey = Object.keys(
    properties
  ).find((name) =>
    clean(name).startsWith(
      normalizedName
    )
  );

  return partialKey
    ? properties[partialKey]
    : null;
}

function getRelationIds(
  property: any
): string[] {
  if (
    !property ||
    property.type !== "relation"
  ) {
    return [];
  }

  return (
    property.relation?.map(
      (item: any) => item.id
    ) ?? []
  );
}

function getTextFromRichContent(
  items: any[]
): string {
  return (
    items
      ?.map(
        (item) =>
          item.plain_text ?? ""
      )
      .join("")
      .trim() ?? ""
  );
}

function getTextValue(
  property: any
): string {
  if (!property) {
    return "";
  }

  if (property.type === "title") {
    return getTextFromRichContent(
      property.title
    );
  }

  if (
    property.type === "rich_text"
  ) {
    return getTextFromRichContent(
      property.rich_text
    );
  }

  if (property.type === "select") {
    return property.select?.name ?? "";
  }

  if (property.type === "status") {
    return property.status?.name ?? "";
  }

  if (
    property.type === "formula"
  ) {
    if (
      property.formula?.type ===
      "string"
    ) {
      return (
        property.formula.string ?? ""
      );
    }

    if (
      property.formula?.type ===
        "number" &&
      property.formula.number !== null
    ) {
      return String(
        property.formula.number
      );
    }
  }

  return "";
}

function getNumberValue(
  property: any
): number {
  if (!property) {
    return 0;
  }

  if (property.type === "number") {
    return property.number ?? 0;
  }

  if (
    property.type === "formula" &&
    property.formula?.type ===
      "number"
  ) {
    return (
      property.formula.number ?? 0
    );
  }

  if (
    property.type === "rollup" &&
    property.rollup?.type ===
      "number"
  ) {
    return (
      property.rollup.number ?? 0
    );
  }

  return 0;
}

function getDateValue(
  property: any
): string {
  if (
    !property ||
    property.type !== "date"
  ) {
    return "";
  }

  return property.date?.start ?? "";
}

function getRollupItems(
  property: any
): any[] {
  if (
    !property ||
    property.type !== "rollup" ||
    property.rollup?.type !== "array"
  ) {
    return [];
  }

  return property.rollup.array ?? [];
}

function getRollupText(
  property: any
): string {
  const items =
    getRollupItems(property);

  return items
    .map((item) => {
      if (item.type === "title") {
        return getTextFromRichContent(
          item.title
        );
      }

      if (
        item.type === "rich_text"
      ) {
        return getTextFromRichContent(
          item.rich_text
        );
      }

      if (item.type === "select") {
        return (
          item.select?.name ?? ""
        );
      }

      if (item.type === "status") {
        return (
          item.status?.name ?? ""
        );
      }

      if (
        item.type === "formula"
      ) {
        if (
          item.formula?.type ===
          "string"
        ) {
          return (
            item.formula.string ?? ""
          );
        }

        if (
          item.formula?.type ===
            "number" &&
          item.formula.number !== null
        ) {
          return String(
            item.formula.number
          );
        }
      }

      return "";
    })
    .filter(Boolean)
    .join(", ");
}

function getRollupNumber(
  property: any
): number {
  if (
    property?.type === "rollup" &&
    property.rollup?.type ===
      "number"
  ) {
    return (
      property.rollup.number ?? 0
    );
  }

  const firstItem =
    getRollupItems(property)[0];

  if (!firstItem) {
    return 0;
  }

  if (firstItem.type === "number") {
    return firstItem.number ?? 0;
  }

  if (
    firstItem.type === "formula" &&
    firstItem.formula?.type ===
      "number"
  ) {
    return (
      firstItem.formula.number ?? 0
    );
  }

  return 0;
}

function readTextProperty(
  properties: NotionProperties,
  propertyName: string
): string {
  const property = getProperty(
    properties,
    propertyName
  );

  return (
    getRollupText(property) ||
    getTextValue(property)
  );
}

function readNumberProperty(
  properties: NotionProperties,
  propertyName: string
): number {
  const property = getProperty(
    properties,
    propertyName
  );

  return (
    getRollupNumber(property) ||
    getNumberValue(property)
  );
}

function getChallengePeriod(
  duration: string
): ChallengePeriod {
  const normalizedDuration =
    clean(duration);

  if (
    normalizedDuration.includes(
      "mois"
    ) ||
    normalizedDuration.includes(
      "mensuel"
    )
  ) {
    return "month";
  }

  return "week";
}

function isAvailableToday(
  challenge: ClientChallenge
): boolean {
  const today = new Date()
    .toISOString()
    .split("T")[0];

  if (
    challenge.startDate &&
    challenge.startDate > today
  ) {
    return false;
  }

  if (
    challenge.endDate &&
    challenge.endDate < today
  ) {
    return false;
  }

  const normalizedStatus =
    clean(challenge.status);

  if (
    normalizedStatus ===
      "annule" ||
    normalizedStatus ===
      "archive"
  ) {
    return false;
  }

  return true;
}

async function getAthleteBySlug(
  slug: string
): Promise<NotionPage | null> {
  const cleanSlug = slug?.trim();

  if (!cleanSlug) {
    return null;
  }

  const response =
    await notion.databases.query({
      database_id:
        athletesDatabaseId,

      filter: {
        property:
          ATHLETE_SLUG_PROPERTY,

        rich_text: {
          equals: cleanSlug,
        },
      },

      page_size: 1,
    });

  const page =
    response.results[0];

  return isNotionPage(page)
    ? page
    : null;
}

async function getClientIdFromSlug(
  slug: string
): Promise<string | null> {
  const athlete =
    await getAthleteBySlug(slug);

  if (!athlete) {
    console.warn(
      `[Challenges] Aucun athlète trouvé pour "${slug}"`
    );

    return null;
  }

  const clientProperty =
    getProperty(
      athlete.properties,
      ATHLETE_CLIENT_PROPERTY
    );

  const clientId =
    getRelationIds(
      clientProperty
    )[0] ?? null;

  if (!clientId) {
    console.warn(
      `[Challenges] Aucun client relié à l’athlète "${slug}"`
    );
  }

  return clientId;
}

function mapChallenge(
  page: NotionPage
): ClientChallenge {
  const properties =
    page.properties;

  const duration =
    readTextProperty(
      properties,
      CHALLENGE_DURATION_PROPERTY
    ) || "Semaine";

  return {
    id: page.id,

    title:
      readTextProperty(
        properties,
        CHALLENGE_TITLE_PROPERTY
      ) || "Challenge",

    description:
      readTextProperty(
        properties,
        CHALLENGE_DESCRIPTION_PROPERTY
      ),

    points:
      readNumberProperty(
        properties,
        CHALLENGE_POINTS_PROPERTY
      ),

    category:
      readTextProperty(
        properties,
        CHALLENGE_CATEGORY_PROPERTY
      ),

    difficulty:
      readTextProperty(
        properties,
        CHALLENGE_DIFFICULTY_PROPERTY
      ),

    duration,

    status:
      readTextProperty(
        properties,
        CHALLENGE_STATUS_PROPERTY
      ),

    startDate:
      getDateValue(
        getProperty(
          properties,
          CHALLENGE_START_PROPERTY
        )
      ),

    endDate:
      getDateValue(
        getProperty(
          properties,
          CHALLENGE_END_PROPERTY
        )
      ),

    icon:
      readTextProperty(
        properties,
        CHALLENGE_ICON_PROPERTY
      ) || "target",

    period:
      getChallengePeriod(
        duration
      ),
  };
}

export async function getChallengesByAthleteSlug(
  slug: string
): Promise<ClientChallenge[]> {
  const clientId =
    await getClientIdFromSlug(slug);

  if (!clientId) {
    return [];
  }

  const response =
    await notion.databases.query({
      database_id:
        clientChallengesDatabaseId,

      filter: {
        property:
          CHALLENGE_CLIENT_PROPERTY,

        relation: {
          contains: clientId,
        },
      },

      page_size: 50,
    });

  return response.results
    .filter(isNotionPage)
    .map(mapChallenge)
    .filter(isAvailableToday);
}

export const getCachedChallengesByAthleteSlug =
  unstable_cache(
    getChallengesByAthleteSlug,
    ["running-challenges"],
    {
      revalidate: 300,
    }
  );