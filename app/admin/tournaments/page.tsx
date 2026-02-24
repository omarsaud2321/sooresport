import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminTournaments() {
  const tournaments = await prisma.tournament.findMany({
    orderBy: [{ game: { nameEn: "asc" } }, { name: "asc" }],
    include: { game: true }
  });

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <h1 className="text-xl font-semibold">Tournaments</h1>
        <div className="flex gap-3">
          <Link href="/admin/tournaments/new" className="rounded bg-brand px-3 py-2 text-sm font-medium text-white">
            Add
          </Link>
          <Link href="/admin" className="text-sm text-muted hover:text-text self-center">Back</Link>
        </div>
      </div>

      <div className="space-y-2">
        {tournaments.map((t) => (
          <div key={t.id} className="rounded border border-border bg-card p-3">
            <div className="text-xs text-muted">{t.game.nameEn}</div>
            <div className="font-medium">{t.name}</div>
            <div className="text-xs text-muted">tier: {t.tier} • region: {t.region} • slug: {t.slug}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
