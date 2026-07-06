import { notion } from "@/lib/notion";
import { unstable_cache } from "next/cache";

function clean(value?: string) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function slugify(value: string) {
  return clean(value).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function title(prop: any) {
  return prop?.title?.[0]?.plain_text ?? "";
}

function richText(prop: any) {
  return prop?.rich_text?.[0]?.plain_text ?? "";
}

function fileUrl(prop: any) {
  const file = prop?.files?.[0];
  return file?.file?.url ?? file?.external?.url ?? "";
}

function getProp(properties: any, search: string) {
  const key = Object.keys(properties).find((k) =>
    clean(k).startsWith(clean(search))
  );

  return key ? properties[key] : null;
}

async function getClientPage(slug: string) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_CLIENTS_DATABASE_ID!,
  });

  return (response.results as any[]).find((page) => {
    return slugify(title(page.properties["Nom"])) === slug;
  });
}

async function getFicheById(pageId: string) {
  const page: any = await notion.pages.retrieve({ page_id: pageId });
  const p = page.properties;
  console.log("PROPRIÉTÉS FICHE =", Object.keys(p));
console.dir(p, { depth: null });

return {
  id: page.id,
  title: title(p["Nom"]),
  category: p["Catégorie"]?.select?.name ?? "",
  description: richText(p["Description"]),
  pdf: fileUrl(p["PDF"]),
  cover: fileUrl(p["Aperçu"]),
  number: p["Numéro"]?.number ?? null,
};
}

export async function getClientResources(slug: string, category: string) {
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
  });

  const fiches = await Promise.all(
    (response.results as any[]).map(async (access) => {
      const ficheRelation = getProp(access.properties, "Fiche")?.relation?.[0];

      if (!ficheRelation) return null;

      const fiche = await getFicheById(ficheRelation.id);

const ficheCategory = slugify(fiche.category);
const urlCategory = slugify(category);

console.log({
  urlCategory: category,
  ficheCategory: fiche.category,
  slugUrl: urlCategory,
  slugFiche: ficheCategory,
  fiche: fiche.title,
});

if (!fiche.pdf) return null;

if (ficheCategory !== urlCategory) {
  return null;
}

return fiche;
    })
  );

  return fiches.filter(Boolean);
}
export async function getResourcesCount(slug: string) {
  const client = await getClientPage(slug);
  if (!client) return {};

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
  });

  const counts: Record<string, number> = {
    nutrition: 0,
    sport: 0,
    science: 0,
    running: 0,
  };

  for (const access of response.results as any[]) {
    const ficheRelation = getProp(access.properties, "Fiche")?.relation?.[0];
    if (!ficheRelation) continue;

    const fiche = await getFicheById(ficheRelation.id);

    const cat = slugify(fiche.category);

    if (counts[cat] !== undefined) {
      counts[cat]++;
    }
  }

  return counts;
}
export const getCachedClientResources = unstable_cache(
  async (slug: string, category: string) => {
    return getClientResources(slug, category);
  },
  ["resources"],
  {
    revalidate: 60,
  }
);
export const getCachedResourcesCount = unstable_cache(
  async (slug: string) => {
    return getResourcesCount(slug);
  },
  ["resources-count"],
  {
    revalidate: 60,
  }
);