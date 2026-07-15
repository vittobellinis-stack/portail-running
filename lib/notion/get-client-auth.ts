import type {
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

import { notion } from "@/lib/notion/client";

const clientsDatabaseId =
  process.env.NOTION_CLIENTS_DATABASE_ID;

if (!clientsDatabaseId) {
  throw new Error(
    "NOTION_CLIENTS_DATABASE_ID est absent de .env.local"
  );
}

const CLIENT_SLUG_PROPERTY = "Slug";
const CLIENT_PASSWORD_PROPERTY =
  "Mot de passe";

type NotionProperties =
  PageObjectResponse["properties"];

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

  if (
    property.type === "formula" &&
    property.formula.type === "string"
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

  if (!cleanSlug || !cleanPassword) {
    return false;
  }

  const response =
    await notion.databases.query({
      database_id: clientsDatabaseId,

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
    !("properties" in result)
  ) {
    return false;
  }

  const storedPassword =
    getTextValue(
      result.properties,
      CLIENT_PASSWORD_PROPERTY
    );

  return (
    storedPassword === cleanPassword
  );
}