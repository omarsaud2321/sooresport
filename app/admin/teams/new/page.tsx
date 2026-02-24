import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function NewTeam() {
  const games = await prisma.game.findMany({ orderBy: { nameEn: "asc" } });

  async function action(formData: FormData) {
    "use server";
    const gameId = String(formData.get("gameId"));
    const name = String(formData.get("name"));
    const slug = String(formData.get("slug"));
    const logoUrl = String(formData.get("logoUrl") || "");
    await prisma.team.create({ data: { gameId, name, slug, logoUrl: logoUrl || null } });
    redirect("/admin/teams");
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="flex items-end justify-between">
        <h1 className="text-xl font-semibold">Add Team</h1>
        <Link href="/admin/teams" className="text-sm text-muted hover:text-text">Back</Link>
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
          Team name
          <input name="name" className="mt-1 w-full rounded border border-border bg-bg px-3 py-2" required />
        </label>
        <label className="block text-sm">
          Slug (e.g. optic-texas)
          <input name="slug" className="mt-1 w-full rounded border border-border bg-bg px-3 py-2" required />
        </label>
        <label className="block text-sm">
          Logo URL (optional)
          <input name="logoUrl" className="mt-1 w-full rounded border border-border bg-bg px-3 py-2" />
        </label>
        <button className="w-full rounded bg-brand px-4 py-2 text-sm font-medium text-white">
          Create
        </button>
      </form>
    </div>
  );
}
