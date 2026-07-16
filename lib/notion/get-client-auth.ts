import type {
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

import { notion } from "@/lib/notion/client";

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

const clientsDatabaseId =
  getRequiredEnv(
    "NOTION_CLIENTS_DATABASE_ID"
  );

const CLIENT_SLUG_PROPERTY = "Slug";
const CLIENT_PASSWORD_PROPERTY =
  "Mot de passe";

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

function getTextValue(
  properties: NotionProperties,
  name: string
): string {
  const property = properties[name];

  if (!property) {
    return "";
  }

  if (
    property.type === "rich_text"
  ) {
    return property.rich_text
      .map(
        (item) =>
          item.plain_text
      )
      .join("")
      .trim();
  }

  if (property.type === "title") {
    return property.title
      .map(
        (item) =>
          item.plain_text
      )
      .join("")
      .trim();
  }

  if (
    property.type === "formula" &&
    property.formula.type ===
      "string"
  ) {
    return (
      property.formula.string?.trim() ??
      ""
    );
  }

  return "";
}

export async function checkClientPassword(
  slug: string,
  password: string
): Promise<boolean> {
  const cleanSlug = slug
    .trim()
    .toLowerCase();

  const cleanPassword =
    password.trim();

  if (
    !cleanSlug ||
    !cleanPassword
  ) {
    return false;
  }

  const response =
    await notion.databases.query({
      database_id:
        clientsDatabaseId,

      filter: {
        property:
          CLIENT_SLUG_PROPERTY,

        rich_text: {
          equals: cleanSlug,
        },
      },

      page_size: 1,
    });

  const result =
    response.results[0];

  if (
    !result ||
    !isPageObjectResponse(result)
  ) {
    return false;
  }

  const storedPassword =
    getTextValue(
      result.properties,
      CLIENT_PASSWORD_PROPERTY
    );

  return (
    storedPassword ===
    cleanPassword
  );
}