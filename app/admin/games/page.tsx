import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminGames() {
  const games = await prisma.game.findMany({ orderBy: { nameEn: "asc" } });

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <h1 className="text-xl font-semibold">Games</h1>
        <Link href="/admin" className="text-sm text-muted hover:text-text">Back</Link>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {games.map((g) => (
          <div key={g.id} className="rounded-lg border border-border bg-card p-4">
            <div className="font-medium">{g.nameEn}</div>
            <div className="text-sm text-muted">{g.nameAr}</div>
            <div className="mt-2 text-xs text-muted">slug: {g.slug}</div>
          </div>
        ))}
      </div>
      <div className="text-xs text-muted">
        To add more games later, we can add a Create form (kept simple for MVP).
      </div>
    </div>
  );
}
