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

  if (prop.type === "number") return prop.number ?? 0;

  if (prop.type === "formula" && prop.formula?.type === "number") {
    return prop.formula.number ?? 0;
  }

  return 0;
}

function dateFromProperty(prop: any) {
  return prop?.date?.start ?? "";
}

function clean(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function slugify(value: string) {
  return clean(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getProp(properties: any, search: string) {
  const key = Object.keys(properties).find((k) =>
    clean(k).startsWith(clean(search))
  );

  return key ? properties[key] : null;
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

  console.log("DATE BRUTE =", dateFromProperty(getProp(p, "Date du bilan")));

  return {
    poids: numberFromProperty(getProp(p, "Poids")),
    taille: numberFromProperty(getProp(p, "Tour de taille")),
    hanches: numberFromProperty(getProp(p, "Tour de hanches")),
    date: dateFromProperty(getProp(p, "Date du bilan")),
  };
});
}

export async function getClient(slug: string) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_CLIENTS_DATABASE_ID!,
  });

  const page: any = response.results.find((item: any) => {
    const nom = textFromTitle(item.properties["Nom"]);
    return slugify(nom) === slug;
  });

  if (!page) return null;

  const p = page.properties;

  const latestBilan = await getLatestBilan(page.id);
  console.log(latestBilan);
  const bilans = await getBilans(page.id);
  const challenges = await getChallenges(page.id);
const sessions = await getNextSessions(page.id);
console.log("SESSIONS =", sessions);
  const poidsInitial = numberFromProperty(getProp(p, "Poids initial"));
  const poidsActuel = latestBilan?.poids ?? 0;
  const objectifPoids = numberFromProperty(getProp(p, "Objectif poids"));

  return {
    nom: textFromTitle(p["Nom"]),
    poidsInitial,
    poidsActuel,
    objectifPoids,
    challenges,
sessions,
    dernierBilan: latestBilan,
    bilans,
password: textFromRichText(getProp(p, "Mot de passe")),

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
async function getChallenges(clientPageId: string) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_CHALLENGES_DATABASE_ID!,
    page_size: 20,
  });

  return (response.results as any[])
    .sort((a, b) => {
      const ordreA = a.properties["ordre"]?.number ?? 999;
      const ordreB = b.properties["ordre"]?.number ?? 999;
      return ordreA - ordreB;
    })
    .slice(0, 2)
    .map((challenge) => {
      const p = challenge.properties;

      return {
        title: textFromTitle(p["Challenge"]),
        description: textFromRichText(p["description"]),
        points: numberFromProperty(p["Points"]),
        categorie: p["Catégories"]?.select?.name ?? "",
        difficulte: p["Difficulté"]?.select?.name ?? "",
        duree: p["Durée"]?.select?.name ?? "",
        validation: p["Validation"]?.select?.name ?? "",
        ordre: numberFromProperty(p["ordre"]),
      };
    });
}
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
          })
        : "Heure à définir",
    };
  });
}
export const getCachedClient = unstable_cache(
  async (slug: string) => {
    return getClient(slug);
  },
  ["clients"],
  {
    revalidate: 60,
  }
);