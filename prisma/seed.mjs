import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function slugify(s) {
  return s.toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  // Games
  const games = [
    { slug: "cod", nameAr: "كول أوف ديوتي", nameEn: "Call of Duty" },
    { slug: "cs2", nameAr: "كاونتر سترايك 2", nameEn: "Counter-Strike 2" },
    { slug: "rocket-league", nameAr: "روكِت ليق", nameEn: "Rocket League" },
    { slug: "overwatch", nameAr: "أوفر واتش", nameEn: "Overwatch" }
  ];

  for (const g of games) {
    await prisma.game.upsert({
      where: { slug: g.slug },
      update: { nameAr: g.nameAr, nameEn: g.nameEn },
      create: g
    });
  }

  const cod = await prisma.game.findUnique({ where: { slug: "cod" } });

  // COD tournaments (filters)
  const codTournaments = [
    { slug: "cdl", name: "CDL", tier: "CDL", region: "GLOBAL" },
    { slug: "challengers-mena", name: "Challengers (MENA)", tier: "CHALLENGERS", region: "MENA" },
    { slug: "challengers-eu", name: "Challengers (EU)", tier: "CHALLENGERS", region: "EU" },
    { slug: "challengers-na", name: "Challengers (NA)", tier: "CHALLENGERS", region: "NA" },
    { slug: "saudi-league", name: "Saudi League", tier: "SAUDI_LEAGUE", region: "MENA" }
  ];

  for (const t of codTournaments) {
    await prisma.tournament.upsert({
      where: { gameId_slug: { gameId: cod.id, slug: t.slug } },
      update: { name: t.name, tier: t.tier, region: t.region },
      create: { ...t, gameId: cod.id }
    });
  }

  // COD teams (logos/rosters can be filled later in Admin)
  const teams = [
    "Riyadh Falcons",
    "FaZe Vegas",
    "OpTic Texas",
    "Los Angeles Thieves",
    "Paris Gentle Mates",
    "G2 Minnesota",
    "Miami Heretics",
    "Boston Breach",
    "Vancouver Surge",
    "Cloud9 New York",
    "Carolina Royal Ravens",
    "Toronto KOI"
  ];

  for (const name of teams) {
    const slug = slugify(name);
    await prisma.team.upsert({
      where: { gameId_slug: { gameId: cod.id, slug } },
      update: { name },
      create: { name, slug, gameId: cod.id }
    });
  }
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
