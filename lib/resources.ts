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
  });

  return (response.results as any[])
    .map((access) => {
      const p = access.properties;

      const ficheCategory =
        p["Catégorie fiche"]?.rollup?.array?.[0]?.select?.name ?? "";

      if (slugify(ficheCategory) !== slugify(category)) {
        return null;
      }

      const title =
        p["Titre fiche"]?.rollup?.array?.[0]?.title?.[0]?.plain_text ??
        p["Titre fiche"]?.rollup?.array?.[0]?.rich_text?.[0]?.plain_text ??
        "";

      const pdfItem =
        p["PDF fiche"]?.rollup?.array?.[0];

      const previewItem =
        p["Aperçu fiche"]?.rollup?.array?.[0];

      const numberItem =
        p["Numéro fiche"]?.rollup?.array?.[0];

      const pdf =
        pdfItem?.files?.[0]?.file?.url ??
        pdfItem?.files?.[0]?.external?.url ??
        "";

      const cover =
        previewItem?.files?.[0]?.file?.url ??
        previewItem?.files?.[0]?.external?.url ??
        "";

      const number =
        numberItem?.number ??
        null;

      if (!pdf) return null;

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
    .filter(Boolean);
}
export async function getResourcesCount(slug: string) {
  const client = await getClientPage(slug);

  if (!client) {
    return {
      nutrition: 0,
      sport: 0,
      science: 0,
      running: 0,
    };
  }

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
    const p = access.properties;

    const category =
      p["Catégorie fiche"]?.rollup?.array?.[0]?.select?.name ?? "";

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
    revalidate: 300,
  }
);