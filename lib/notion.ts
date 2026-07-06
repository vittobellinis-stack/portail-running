import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function getClientBySlug(slug: string) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_CLIENTS_DATABASE_ID!,
    filter: {
      property: "Slug",
      rich_text: {
        equals: slug,
      },
    },
  });

  return response.results[0] ?? null;
}