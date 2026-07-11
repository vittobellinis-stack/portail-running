import { notion } from "@/lib/notion";
import { unstable_cache } from "next/cache";

function clean(value?: string) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function slugify(value?: string) {
  return clean(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function textFromTitle(prop: any) {
  return prop?.title?.[0]?.plain_text ?? "";
}

function getProp(properties: any, search: string) {
  if (!properties) return null;

  const key = Object.keys(properties).find((name) =>
    clean(name).startsWith(clean(search))
  );

  return key ? properties[key] : null;
}

function textFromRollup(prop: any) {
  const item = prop?.rollup?.array?.[0];

  return (
    item?.title?.[0]?.plain_text ??
    item?.rich_text?.[0]?.plain_text ??
    item?.formula?.string ??
    ""
  );
}

function selectFromRollup(prop: any) {
  const item = prop?.rollup?.array?.[0];

  return (
    item?.select?.name ??
    item?.status?.name ??
    item?.rich_text?.[0]?.plain_text ??
    item?.title?.[0]?.plain_text ??
    ""
  );
}

function numberFromRollup(prop: any) {
  if (prop?.rollup?.type === "number") {
    return prop.rollup.number ?? null;
  }

  const item = prop?.rollup?.array?.[0];

  return item?.number ?? item?.formula?.number ?? null;
}

function fileFromRollup(prop: any) {
  const item = prop?.rollup?.array?.[0];

  const file =
    item?.files?.[0] ??
    item?.file ??
    item?.external ??
    null;

  return (
    file?.file?.url ??
    file?.external?.url ??
    item?.files?.[0]?.file?.url ??
    item?.files?.[0]?.external?.url ??
    ""
  );
}

async function getClientPage(slug: string) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_CLIENTS_DATABASE_ID!,
    filter: {
      property: "Slug",
      rich_text: {
        equals: slug,
      },
    },
    page_size: 1,
  });

  return (response.results as any[])[0] ?? null;
}

export async function getClientResources(
  slug: string,
  category: string
) {
  const client = await getClientPage(slug);

  if (!client) return [];

  const today = new Date().toISOString().split("T")[0];

  const response = await notion.databases.query({
    database_id: process.env.NOTION_ACCES_FICHES_DATABASE_ID!,
    filter: {
      and: [
        {
          property: "Clients",
          relation: {
            contains: client.id,
          },
        },
        {
          property: "Débloqué",
          checkbox: {
            equals: true,
          },
        },
        {
          property: "Date deblocage",
          date: {
            on_or_before: today,
          },
        },
      ],
    },
    page_size: 100,
  });

 const fiches = await Promise.all(
  (response.results as any[]).map(async (access) => {
      const p = access.properties;

      const title = textFromRollup(
        getProp(p, "Titre fiche")
      );

      const ficheCategory = selectFromRollup(
        getProp(p, "Catégorie fiche")
      );

 const ficheRelation =
  getProp(p, "Fiche")?.relation?.[0];

if (!ficheRelation) {
  return null;
}

const fichePage: any = await notion.pages.retrieve({
  page_id: ficheRelation.id,
});

const ficheProperties = fichePage.properties;

const pdfFile = ficheProperties["PDF"]?.files?.[0];
const coverFile = ficheProperties["Aperçu"]?.files?.[0];

const pdf =
  pdfFile?.file?.url ??
  pdfFile?.external?.url ??
  "";

const cover =
  coverFile?.file?.url ??
  coverFile?.external?.url ??
  "";

      const number = numberFromRollup(
        getProp(p, "Numéro fiche")
      );

      if (slugify(ficheCategory) !== slugify(category)) {
        return null;
      }

      if (!pdf) {
        return null;
      }

      return {
        id: access.id,
        title,
        category: ficheCategory,
        description: "",
        pdf,
        cover,
        number,
      };
       })
);

return fiches.filter(Boolean);
}

export async function getResourcesCount(slug: string) {
  const client = await getClientPage(slug);

  const emptyCounts = {
  nutrition: 0,
  sport: 0,
  science: 0,
  running: 0,
  recovery: 0,
  mindset: 0,
};

  if (!client) return emptyCounts;

  const today = new Date().toISOString().split("T")[0];

  const response = await notion.databases.query({
    database_id: process.env.NOTION_ACCES_FICHES_DATABASE_ID!,
    filter: {
      and: [
        {
          property: "Clients",
          relation: {
            contains: client.id,
          },
        },
        {
          property: "Débloqué",
          checkbox: {
            equals: true,
          },
        },
        {
          property: "Date deblocage",
          date: {
            on_or_before: today,
          },
        },
      ],
    },
    page_size: 100,
  });

  const counts: Record<string, number> = {
    ...emptyCounts,
  };

  for (const access of response.results as any[]) {
    const p = access.properties;

    const category = selectFromRollup(
      getProp(p, "Catégorie fiche")
    );

    const categorySlug = slugify(category);

    if (categorySlug in counts) {
      counts[categorySlug] += 1;
    }
  }

  return counts;
}

export const getCachedClientResources = unstable_cache(
  async (slug: string, category: string) => {
    return getClientResources(slug, category);
  },
  ["client-resources"],
  {
    revalidate: 300,
  }
);

export const getCachedResourcesCount = unstable_cache(
  async (slug: string) => {
    return getResourcesCount(slug);
  },
  ["resources-count"],
  {
    revalidate: 300,
  }
);