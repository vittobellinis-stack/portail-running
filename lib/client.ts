import { notion } from "@/lib/notion";
import { unstable_cache } from "next/cache";

function textFromTitle(prop: any) {
  return prop?.title?.[0]?.plain_text ?? "";
}

function textFromRichText(prop: any) {
  return prop?.rich_text?.[0]?.plain_text ?? "";
}

function numberFromProperty(prop: any): number {
  if (!prop) return 0;

  if (prop.type === "number") {
    return prop.number ?? 0;
  }

  if (prop.type === "formula" && prop.formula?.type === "number") {
    return prop.formula.number ?? 0;
  }

  if (prop.type === "rollup" && prop.rollup?.type === "number") {
    return prop.rollup.number ?? 0;
  }

  return 0;
}

function dateFromProperty(prop: any) {
  return prop?.date?.start ?? "";
}

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

function numberFromRollupArray(prop: any) {
  const item = prop?.rollup?.array?.[0];

  return (
    item?.number ??
    item?.formula?.number ??
    0
  );
}
async function getLatestBilan(clientPageId: string) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_BILANS_DATABASE_ID!,
    filter: {
      property: "Clients",
      relation: {
        contains: clientPageId,
      },
    },
    sorts: [
      {
        property: "Date du bilan",
        direction: "descending",
      },
    ],
    page_size: 1,
  });

  const bilan: any = response.results[0];

  if (!bilan) return null;

  const p = bilan.properties;

  return {
    poids: numberFromProperty(getProp(p, "Poids")),
    taille: numberFromProperty(getProp(p, "Tour de taille")),
    hanches: numberFromProperty(getProp(p, "Tour de hanches")),
    date: dateFromProperty(getProp(p, "Date du bilan")),
  };
}

async function getBilans(clientPageId: string) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_BILANS_DATABASE_ID!,
    filter: {
      and: [
        {
          property: "Clients",
          relation: {
            contains: clientPageId,
          },
        },
        {
          property: "Période du bilan",
          select: {
            equals: "Bilan mensuel",
          },
        },
      ],
    },
    sorts: [
      {
        property: "Date du bilan",
        direction: "descending",
      },
    ],
    page_size: 3,
  });

  return (response.results as any[]).map((bilan) => {
    const p = bilan.properties;

    return {
      poids: numberFromProperty(getProp(p, "Poids")),
      taille: numberFromProperty(getProp(p, "Tour de taille")),
      hanches: numberFromProperty(getProp(p, "Tour de hanches")),
      date: dateFromProperty(getProp(p, "Date du bilan")),
    };
  });
}

async function getChallenges(clientPageId: string) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_CLIENT_CHALLENGES_DATABASE_ID!,
    filter: {
      property: "Clients",
      relation: {
        contains: clientPageId,
      },
    },
    page_size: 20,
  });

  return (response.results as any[]).map((item) => {
    const p = item.properties;

    const titreItem = p["Titre"]?.rollup?.array?.[0];
    const descriptionItem = p["Description"]?.rollup?.array?.[0];
    const categorieItem = p["Catégorie"]?.rollup?.array?.[0];
    const difficulteItem = p["Difficulté"]?.rollup?.array?.[0];
    const dureeItem = p["Durée"]?.rollup?.array?.[0];
    const iconeItem = p["Icone"]?.rollup?.array?.[0];
    const pointItem = p["Point"]?.rollup?.array?.[0];

    return {
      title:
        titreItem?.title?.[0]?.plain_text ??
        titreItem?.rich_text?.[0]?.plain_text ??
        "",

      description:
        descriptionItem?.rich_text?.[0]?.plain_text ??
        descriptionItem?.title?.[0]?.plain_text ??
        "",

      points:
        pointItem?.number ??
        pointItem?.formula?.number ??
        0,

      categorie:
        categorieItem?.select?.name ??
        categorieItem?.rich_text?.[0]?.plain_text ??
        "",

      difficulte:
        difficulteItem?.select?.name ??
        difficulteItem?.rich_text?.[0]?.plain_text ??
        "",

      duree:
        dureeItem?.select?.name ??
        dureeItem?.rich_text?.[0]?.plain_text ??
        "",

      statut: p["Statut"]?.status?.name ?? "",

      debut: p["Début"]?.date?.start ?? "",

      fin: p["Fin"]?.date?.start ?? "",

      icon:
        iconeItem?.select?.name ??
        iconeItem?.rich_text?.[0]?.plain_text ??
        "target",

      periode:
        dureeItem?.select?.name ??
        dureeItem?.rich_text?.[0]?.plain_text ??
        "Semaine",
    };
  });
}

async function getNextSessions(clientPageId: string) {
  const today = new Date().toISOString().split("T")[0];

  const response = await notion.databases.query({
    database_id: process.env.NOTION_SEANCES_DATABASE_ID!,
    filter: {
      and: [
        {
          property: "Clients",
          relation: {
            contains: clientPageId,
          },
        },
        {
          property: "Date",
          date: {
            on_or_after: today,
          },
        },
      ],
    },
    sorts: [
      {
        property: "Date",
        direction: "ascending",
      },
    ],
    page_size: 3,
  });

  return (response.results as any[]).map((session) => {
    const p = session.properties;
    const dateStart = p["Date"]?.date?.start ?? "";

    return {
      title: textFromTitle(p["Séance"]),
      date: dateStart,
      type: p["Type"]?.select?.name ?? "",
      etat: p["État"]?.status?.name ?? "",
      heure: dateStart
        ? new Date(dateStart).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Europe/Paris",
          })
        : "Heure à définir",
    };
  });
}

export async function getClient(slug: string) {
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

const page: any = response.results[0];
  const p = page.properties;

  const [latestBilan, bilans, challenges, sessions] = await Promise.all([
    getLatestBilan(page.id),
    getBilans(page.id),
    getChallenges(page.id),
    getNextSessions(page.id),
  ]);

  const poidsInitial = numberFromProperty(
    getProp(p, "Poids initial")
  );

  const poidsActuel = latestBilan?.poids ?? 0;

  const objectifPoids = numberFromProperty(
    getProp(p, "Objectif poids")
  );

  return {
    nom: textFromTitle(p["Nom"]),
    poidsInitial,
    poidsActuel,
    objectifPoids,
    challenges,
    sessions,
    dernierBilan: latestBilan,
    bilans,

    password: textFromRichText(
      getProp(p, "Mot de passe")
    ),

    messageCoach:
      textFromRichText(getProp(p, "Message coach")) ||
      "Bravo, continue comme ça 💜",

    challenge1:
      textFromRichText(getProp(p, "Challenge 1")) ||
      "Boire 2L d’eau",

    challenge2:
      textFromRichText(getProp(p, "Challenge 2")) ||
      "Petit-déjeuner protéiné",
  };
}

export const getCachedClient = unstable_cache(
  async (slug: string) => {
    return getClient(slug);
  },
  ["client-data"],
  {
    revalidate: 300,
  }
);

export async function checkClientPassword(
  slug: string,
  password: string
) {
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

const page: any = response.results[0];
  if (!page) return false;

  const storedPassword = textFromRichText(
    getProp(page.properties, "Mot de passe")
  );

  return storedPassword === password;
}