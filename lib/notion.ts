import { Client as NotionClient } from "@notionhq/client";

export const notion = new NotionClient({
  auth: process.env.NOTION_TOKEN,
});

export async function getClientByName(name: string) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_CLIENTS_DATABASE_ID!,
    filter: {
      property: "Nom",
      title: {
        equals: name,
      },
    },
  });

  return response.results[0];
}