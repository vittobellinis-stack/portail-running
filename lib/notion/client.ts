import { Client } from "@notionhq/client";

if (!process.env.NOTION_TOKEN) {
  throw new Error("La variable NOTION_TOKEN est manquante.");
}

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});