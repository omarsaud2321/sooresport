import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

function makeTweetAr(title: string, url: string, tags: string[]) {
  const t = tags.map((x) => `#${x}`).join(" ");
  return `${title}

${t}
${url}`.trim();
}
function makeTweetEn(title: string, url: string, tags: string[]) {
  const t = tags.map((x) => `#${x}`).join(" ");
  return `${title}

${t}
${url}`.trim();
}

// NOTE: translation is stubbed for MVP (you can edit manually in Admin later)
function autoTranslateToEnglish(ar: string) {
  // For now: just return the Arabic text; later we can plug a real translator.
  return ar;
}

export default async function NewPost() {
  const games = await prisma.game.findMany({ orderBy: { nameEn: "asc" } });
  const tournaments = await prisma.tournament.findMany({ include: { game: true }, orderBy: [{ game: { nameEn: "asc" } }, { name: "asc" }] });
  const teams = await prisma.team.findMany({ include: { game: true }, orderBy: [{ game: { nameEn: "asc" } }, { name: "asc" }] });

  async function action(formData: FormData) {
    "use server";
    const gameId = String(formData.get("gameId"));
    const section = String(formData.get("section"));
    const tournamentId = String(formData.get("tournamentId") || "");
    const teamId = String(formData.get("teamId") || "");
    const titleAr = String(formData.get("titleAr"));
    const contentAr = String(formData.get("contentAr") || "");
    const excerptAr = String(formData.get("excerptAr") || "");

    const titleEn = autoTranslateToEnglish(titleAr);
    const excerptEn = autoTranslateToEnglish(excerptAr);
    const contentEn = autoTranslateToEnglish(contentAr);

    // placeholder URL (will work once deployed)
    const url = process.env.PUBLIC_SITE_URL ? `${process.env.PUBLIC_SITE_URL}/ar` : "https://sooresports.vercel.app/ar";

    const tagsBase = ["SoorSports"];
    const tweetAr = makeTweetAr(titleAr, url, tagsBase);
    const tweetEn = makeTweetEn(titleEn, url, tagsBase);

    const tournamentLink = tournamentId && tournamentId !== "none" ? tournamentId : undefined;
    const teamLink = teamId && teamId !== "none" ? teamId : undefined;

    await prisma.post.createMany({
      data: [
        {
          lang: "ar",
          title: titleAr,
          excerpt: excerptAr || null,
          content: contentAr || null,
          section: section as any,
          gameId,
          tournamentId: tournamentLink,
          teamId: teamLink,
          tweetTextAr: tweetAr,
          tweetTextEn: tweetEn
        },
        {
          lang: "en",
          title: titleEn,
          excerpt: excerptEn || null,
          content: contentEn || null,
          section: section as any,
          gameId,
          tournamentId: tournamentLink,
          teamId: teamLink,
          tweetTextAr: tweetAr,
          tweetTextEn: tweetEn
        }
      ]
    });

    redirect("/admin");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-end justify-between">
        <h1 className="text-xl font-semibold">Create Post (Arabic first)</h1>
        <Link href="/admin" className="text-sm text-muted hover:text-text">Back</Link>
      </div>

      <form action={action} className="space-y-4 rounded-lg border border-border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block text-sm">
            Game
            <select name="gameId" className="mt-1 w-full rounded border border-border bg-bg px-3 py-2">
              {games.map((g) => (
                <option key={g.id} value={g.id}>{g.nameEn}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            Section
            <select name="section" className="mt-1 w-full rounded border border-border bg-bg px-3 py-2">
              <option value="NEWS">News</option>
              <option value="TOURNAMENTS">Tournaments</option>
              <option value="TEAMS">Teams</option>
            </select>
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="block text-sm">
            Tournament (optional)
            <select name="tournamentId" className="mt-1 w-full rounded border border-border bg-bg px-3 py-2">
              <option value="none">None</option>
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.game.nameEn} — {t.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            Team (optional)
            <select name="teamId" className="mt-1 w-full rounded border border-border bg-bg px-3 py-2">
              <option value="none">None</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.game.nameEn} — {t.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block text-sm">
          Arabic title
          <input name="titleAr" className="mt-1 w-full rounded border border-border bg-bg px-3 py-2" required />
        </label>

        <label className="block text-sm">
          Arabic excerpt (optional)
          <input name="excerptAr" className="mt-1 w-full rounded border border-border bg-bg px-3 py-2" />
        </label>

        <label className="block text-sm">
          Arabic content (optional)
          <textarea name="contentAr" rows={6} className="mt-1 w-full rounded border border-border bg-bg px-3 py-2" />
        </label>

        <button className="w-full rounded bg-brand px-4 py-2 text-sm font-medium text-white">
          Save (creates AR + EN)
        </button>

        <div className="text-xs text-muted">
          Translation is a placeholder in MVP (EN copies AR). Later we’ll plug real translation (B).
        </div>
      </form>
    </div>
  );
}
