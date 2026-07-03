import { notion, getClientByName } from "@/lib/notion";

function getNumber(prop: any) {
  return prop?.number ?? 0;
}

function getDate(prop: any) {
  return prop?.date?.start ?? "";
}

export async function getClient() {
  const page: any = await getClientByName("Medea Desclos");

  if (!page) return null;

  const p = page.properties;

  let bilans: any[] = [];

  if (process.env.NOTION_BILANS_DATABASE_ID) {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_BILANS_DATABASE_ID,
      filter: {
        property: "Clients",
        relation: {
          contains: page.id,
        },
      },
      sorts: [
        {
          property: "Date du bilan",
          direction: "ascending",
        },
      ],
    });

    bilans = response.results.map((bilan: any) => {
      const bp = bilan.properties;

      return {
        date: getDate(bp["Date du bilan"]),
        poids: getNumber(bp["Poids"]),
        taille: getNumber(bp["Tour de taille"]),
        hanche: getNumber(bp["Tour de hanches"]),
      };
    });
  }

  const dernierBilan = bilans[bilans.length - 1];

  return {
    id: page.id,
    nom: p?.Nom?.title?.[0]?.plain_text ?? "Médéa",
    poidsInitial: p?.["Poids initial"]?.number ?? 83,
    poidsActuel: dernierBilan?.poids ?? 80,
    objectif: 73,
    prochaineSeance:
      p?.["Prochaine séance"]?.rollup?.date?.start ?? "04 juil.",
    messageCoach:
      p?.["Message du coach"]?.formula?.string ??
      "🔥 Très beau travail cette semaine ! Continue comme ça 💜",
    resteARegler: p?.["Reste à encaisser"]?.rollup?.number ?? 150,
    photo: "",
    bilans,
  };
}