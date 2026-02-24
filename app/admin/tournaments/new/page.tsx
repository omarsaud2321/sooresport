import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function NewTournament() {
  const games = await prisma.game.findMany({ orderBy: { nameEn: "asc" } });

  async function action(formData: FormData) {
    "use server";
    const gameId = String(formData.get("gameId"));
    const name = String(formData.get("name"));
    const slug = String(formData.get("slug"));
    const tier = String(formData.get("tier"));
    const region = String(formData.get("region"));

    await prisma.tournament.create({
      data: { gameId, name, slug, tier: tier as any, region: region as any }
    });

    redirect("/admin/tournaments");
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="flex items-end justify-between">
        <h1 className="text-xl font-semibold">Add Tournament</h1>
        <Link href="/admin/tournaments" className="text-sm text-muted hover:text-text">Back</Link>
      </div>

      <form action={action} className="space-y-3 rounded-lg border border-border bg-card p-4">
        <label className="block text-sm">
          Game
          <select name="gameId" className="mt-1 w-full rounded border border-border bg-bg px-3 py-2">
            {games.map((g) => (
              <option key={g.id} value={g.id}>{g.nameEn}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Name
          <input name="name" className="mt-1 w-full rounded border border-border bg-bg px-3 py-2" required />
        </label>
        <label className="block text-sm">
          Slug (e.g. cdl, challengers-mena)
          <input name="slug" className="mt-1 w-full rounded border border-border bg-bg px-3 py-2" required />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm">
            Tier
            <select name="tier" className="mt-1 w-full rounded border border-border bg-bg px-3 py-2">
              <option value="CDL">CDL</option>
              <option value="CHALLENGERS">CHALLENGERS</option>
              <option value="SAUDI_LEAGUE">SAUDI_LEAGUE</option>
              <option value="OTHER">OTHER</option>
            </select>
          </label>
          <label className="block text-sm">
            Region
            <select name="region" className="mt-1 w-full rounded border border-border bg-bg px-3 py-2">
              <option value="GLOBAL">GLOBAL</option>
              <option value="MENA">MENA</option>
              <option value="EU">EU</option>
              <option value="NA">NA</option>
            </select>
          </label>
        </div>

        <button className="w-full rounded bg-brand px-4 py-2 text-sm font-medium text-white">
          Create
        </button>
      </form>
    </div>
  );
}
