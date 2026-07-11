import { Client } from "@notionhq/client";

const requiredEnvVariables = [
  "NOTION_TOKEN",
  "NOTION_CLIENTS_DATABASE_ID",
  "NOTION_BILANS_DATABASE_ID",
  "NOTION_CLIENT_CHALLENGES_DATABASE_ID",
  "NOTION_SEANCES_DATABASE_ID",
  "NOTION_FICHES_DATABASE_ID",
  "NOTION_ACCES_FICHES_DATABASE_ID",
];

const missingEnvVariables = requiredEnvVariables.filter(
  (name) => !process.env[name]?.trim()
);

if (missingEnvVariables.length > 0) {
  throw new Error(
    `Variables Vercel manquantes : ${missingEnvVariables.join(", ")}`
  );
}

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