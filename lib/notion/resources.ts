import { unstable_cache } from "next/cache";

import { notion } from "@/lib/notion/client";

import { getRequiredEnv } from "@/lib/env";

const athletesDatabaseId = getRequiredEnv(
  "NOTION_ATHLETES_DATABASE_ID"
);

const clientsDatabaseId = getRequiredEnv(
  "NOTION_CLIENTS_DATABASE_ID"
);

const accessResourcesDatabaseId =
  process.env.NOTION_ACCES_FICHES_DATABASE_ID;

if (!athletesDatabaseId) {
  throw new Error(
    "NOTION_ATHLETES_DATABASE_ID est absent de .env.local"
  );
}

if (!accessResourcesDatabaseId) {
  throw new Error(
    "NOTION_ACCES_FICHES_DATABASE_ID est absent de .env.local"
  );
}

/*
  Base Athlètes
*/
const ATHLETE_SLUG_PROPERTY = "Slug";
const ATHLETE_CLIENT_PROPERTY = "Client";

/*
  Base Fiches à distribuer
*/
const ACCESS_CLIENT_PROPERTY = "Clients";
const ACCESS_RESOURCE_PROPERTY = "Fiche";
const ACCESS_CATEGORY_PROPERTY = "Agrégation";
const ACCESS_UNLOCKED_PROPERTY = "Débloqué";
const ACCESS_UNLOCK_DATE_PROPERTY = "Date deblocage";
const ACCESS_ORDER_PROPERTY = "Ordre";

/*
  Base Fiches ressources
*/
const RESOURCE_NAME_PROPERTY = "Nom";
const RESOURCE_CATEGORY_PROPERTY = "Catégorie";
const RESOURCE_PDF_PROPERTY = "PDF";
const RESOURCE_PREVIEW_PROPERTY = "Aperçu";
const RESOURCE_NUMBER_PROPERTY = "Numéro";

type NotionProperties = Record<string, any>;

type NotionPage = {
  id: string;
  properties: NotionProperties;
};

export type ClientResource = {
  id: string;
  title: string;
  category: string;
  description: string;
  pdf: string;
  cover: string;
  number: number | null;
};

export type ResourcesCount = {
  nutrition: number;
  sport: number;
  science: number;
  running: number;
  recovery: number;
  mindset: number;
};

function createEmptyCounts(): ResourcesCount {
  return {
    nutrition: 0,
    sport: 0,
    science: 0,
    running: 0,
    recovery: 0,
    mindset: 0,
  };
}

function clean(value?: string): string {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function slugify(value?: string): string {
  return clean(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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

  const normalizedSearch =
    clean(searchedName);

  const exactKey = Object.keys(
    properties
  ).find(
    (name) =>
      clean(name) === normalizedSearch
  );

  if (exactKey) {
    return properties[exactKey];
  }

  const partialKey = Object.keys(
    properties
  ).find((name) =>
    clean(name).startsWith(
      normalizedSearch
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

function getTitleValue(
  property: any
): string {
  if (!property) {
    return "";
  }

  if (property.type === "title") {
    return (
      property.title
        ?.map(
          (item: any) =>
            item.plain_text ?? ""
        )
        .join("")
        .trim() ?? ""
    );
  }

  if (
    property.type === "rich_text"
  ) {
    return (
      property.rich_text
        ?.map(
          (item: any) =>
            item.plain_text ?? ""
        )
        .join("")
        .trim() ?? ""
    );
  }

  return "";
}

function getTextValue(
  property: any
): string {
  if (!property) {
    return "";
  }

  if (property.type === "title") {
    return getTitleValue(property);
  }

  if (
    property.type === "rich_text"
  ) {
    return (
      property.rich_text
        ?.map(
          (item: any) =>
            item.plain_text ?? ""
        )
        .join("")
        .trim() ?? ""
    );
  }

  if (property.type === "select") {
    return property.select?.name ?? "";
  }

  if (property.type === "status") {
    return property.status?.name ?? "";
  }

  if (property.type === "formula") {
    if (
      property.formula?.type ===
      "string"
    ) {
      return property.formula.string ?? "";
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

function getRollupText(
  property: any
): string {
  if (!property) {
    return "";
  }

  if (property.type !== "rollup") {
    return getTextValue(property);
  }

  if (
    property.rollup?.type !== "array"
  ) {
    return "";
  }

  return (
    property.rollup.array
      ?.map((item: any) => {
        if (item.type === "select") {
          return item.select?.name ?? "";
        }

        if (item.type === "status") {
          return item.status?.name ?? "";
        }

        if (item.type === "title") {
          return (
            item.title
              ?.map(
                (text: any) =>
                  text.plain_text ?? ""
              )
              .join("")
              .trim() ?? ""
          );
        }

        if (
          item.type === "rich_text"
        ) {
          return (
            item.rich_text
              ?.map(
                (text: any) =>
                  text.plain_text ?? ""
              )
              .join("")
              .trim() ?? ""
          );
        }

        if (
          item.type === "formula" &&
          item.formula?.type ===
            "string"
        ) {
          return (
            item.formula.string ?? ""
          );
        }

        return "";
      })
      .filter(Boolean)
      .join(", ") ?? ""
  );
}

function getNumberValue(
  property: any
): number | null {
  if (!property) {
    return null;
  }

  if (property.type === "number") {
    return property.number;
  }

  if (
    property.type === "formula" &&
    property.formula?.type ===
      "number"
  ) {
    return property.formula.number;
  }

  if (
    property.type === "rollup" &&
    property.rollup?.type ===
      "number"
  ) {
    return property.rollup.number;
  }

  return null;
}

function getFileUrl(
  property: any
): string {
  if (
    !property ||
    property.type !== "files"
  ) {
    return "";
  }

  const file = property.files?.[0];

  if (!file) {
    return "";
  }

  if (file.type === "file") {
    return file.file?.url ?? "";
  }

  if (file.type === "external") {
    return file.external?.url ?? "";
  }

  return "";
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

function isUnlockedForToday(
  accessPage: NotionPage
): boolean {
  const dateProperty = getProperty(
    accessPage.properties,
    ACCESS_UNLOCK_DATE_PROPERTY
  );

  const unlockDate =
    getDateValue(dateProperty);

  /*
    Date vide = disponible immédiatement.
  */
  if (!unlockDate) {
    return true;
  }

  const today = new Date()
    .toISOString()
    .split("T")[0];

  return unlockDate <= today;
}

function getAccessCategory(
  accessPage: NotionPage
): string {
  const property = getProperty(
    accessPage.properties,
    ACCESS_CATEGORY_PROPERTY
  );

  return (
    getRollupText(property) ||
    getTextValue(property)
  );
}

async function getAthletePageBySlug(
  slug?: string
): Promise<NotionPage | null> {
  const cleanSlug = slug?.trim();

  if (!cleanSlug) {
    console.warn(
      "[Ressources] Slug absent"
    );

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

  const page = response.results[0];

  if (!isNotionPage(page)) {
    console.warn(
      `[Ressources] Aucun athlète trouvé pour "${cleanSlug}"`
    );

    return null;
  }

  return page;
}

async function getClientIdFromAthleteSlug(
  slug?: string
): Promise<string | null> {
  const athlete =
    await getAthletePageBySlug(slug);

  if (!athlete) {
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
      `[Ressources] Aucun Client relié à l’athlète "${slug}"`
    );

    return null;
  }

  return clientId;
}

async function getUnlockedAccessPages(
  clientId: string
): Promise<NotionPage[]> {
  const response =
    await notion.databases.query({
      database_id:
        accessResourcesDatabaseId,

      filter: {
        and: [
          {
            property:
              ACCESS_CLIENT_PROPERTY,

            relation: {
              contains: clientId,
            },
          },
          {
            property:
              ACCESS_UNLOCKED_PROPERTY,

            checkbox: {
              equals: true,
            },
          },
        ],
      },

      page_size: 100,
    });

  const pages =
    response.results.filter(
      isNotionPage
    );

  return pages
    .filter(isUnlockedForToday)
    .sort((a, b) => {
      const orderA =
        getNumberValue(
          getProperty(
            a.properties,
            ACCESS_ORDER_PROPERTY
          )
        ) ?? 0;

      const orderB =
        getNumberValue(
          getProperty(
            b.properties,
            ACCESS_ORDER_PROPERTY
          )
        ) ?? 0;

      return orderA - orderB;
    });
}

async function mapAccessToResources(
  accessPage: NotionPage
): Promise<ClientResource[]> {
  const relationProperty =
    getProperty(
      accessPage.properties,
      ACCESS_RESOURCE_PROPERTY
    );

  const resourceIds =
    getRelationIds(relationProperty);

  if (resourceIds.length === 0) {
    console.warn(
      `[Ressources] Aucune fiche reliée sur la ligne ${accessPage.id}`
    );

    return [];
  }

  const resources = await Promise.all(
    resourceIds.map(
      async (
        resourceId
      ): Promise<ClientResource | null> => {
        const response =
          await notion.pages.retrieve({
            page_id: resourceId,
          });

        if (!isNotionPage(response)) {
          return null;
        }

        const properties =
          response.properties;

        const title =
          getTitleValue(
            getProperty(
              properties,
              RESOURCE_NAME_PROPERTY
            )
          ) || "Fiche";

        /*
          Ici, on utilise la vraie catégorie
          de chaque fiche ressource.
        */
        const category =
          getTextValue(
            getProperty(
              properties,
              RESOURCE_CATEGORY_PROPERTY
            )
          );

        const pdf =
          getFileUrl(
            getProperty(
              properties,
              RESOURCE_PDF_PROPERTY
            )
          );

        const cover =
          getFileUrl(
            getProperty(
              properties,
              RESOURCE_PREVIEW_PROPERTY
            )
          );

        const number =
          getNumberValue(
            getProperty(
              properties,
              RESOURCE_NUMBER_PROPERTY
            )
          );

        return {
          id: response.id,
          title,
          category,
          description: "",
          pdf,
          cover,
          number,
        };
      }
    )
  );

  return resources.filter(
    (
      resource
    ): resource is ClientResource =>
      resource !== null
  );
}

export async function getResourcesCount(
  slug: string
): Promise<ResourcesCount> {
  const counts =
    createEmptyCounts();

  const clientId =
    await getClientIdFromAthleteSlug(
      slug
    );

  if (!clientId) {
    return counts;
  }

  const accessPages =
    await getUnlockedAccessPages(
      clientId
    );

  const resourceGroups =
    await Promise.all(
      accessPages.map(
        mapAccessToResources
      )
    );

  const resources =
    resourceGroups.flat();

  for (const resource of resources) {
    const categorySlug =
      slugify(resource.category);

    if (categorySlug in counts) {
      counts[
        categorySlug as keyof ResourcesCount
      ] += 1;
    }
  }

  console.log(
    "[Ressources] Compteurs finaux :",
    counts
  );

  return counts;
}

export async function getClientResources(
  slug: string,
  category: string
): Promise<ClientResource[]> {
  const clientId =
    await getClientIdFromAthleteSlug(
      slug
    );

  if (!clientId) {
    return [];
  }

  const requestedCategory =
    slugify(category);

  const accessPages =
    await getUnlockedAccessPages(
      clientId
    );

  const resourceGroups =
    await Promise.all(
      accessPages.map(
        mapAccessToResources
      )
    );

  const resources =
    resourceGroups.flat();

  return resources.filter(
    (resource) =>
      slugify(resource.category) ===
      requestedCategory
  );
}

/*
  Cache utilisable plus tard.
  Pour les tests, utilise les fonctions
  getResourcesCount et getClientResources.
*/
export const getCachedResourcesCount =
  unstable_cache(
    getResourcesCount,
    ["resources-count"],
    {
      revalidate: 300,
    }
  );

export const getCachedClientResources =
  unstable_cache(
    getClientResources,
    ["client-resources"],
    {
      revalidate: 300,
    }
  );