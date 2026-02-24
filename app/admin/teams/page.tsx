import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminTeams() {
  const teams = await prisma.team.findMany({
    orderBy: [{ game: { nameEn: "asc" } }, { name: "asc" }],
    include: { game: true, roster: true }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <h1 className="text-xl font-semibold">Teams</h1>
        <div className="flex gap-3">
          <Link href="/admin/teams/new" className="rounded bg-brand px-3 py-2 text-sm font-medium text-white">
            Add team
          </Link>
          <Link href="/admin" className="text-sm text-muted hover:text-text self-center">Back</Link>
        </div>
      </div>

      <div className="space-y-2">
        {teams.map((t) => (
          <div key={t.id} className="rounded border border-border bg-card p-3">
            <div className="text-xs text-muted">{t.game.nameEn}</div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="text-xs text-muted">players: {t.roster.length} • slug: {t.slug}</div>
              </div>
              <Link className="rounded border border-border bg-bg px-3 py-2 text-sm hover:border-brand" href={`/admin/teams/${t.id}`}>
                Manage roster
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
