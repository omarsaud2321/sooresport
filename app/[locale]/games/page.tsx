export const dynamic = "force-dynamic";
export const revalidate = 0;
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function GamesPage({ params }: { params: Promise<{ locale: "ar" | "en" }> }) {
  const { locale } = await params;
  const games = await prisma.game.findMany({ orderBy: { nameEn: "asc" } });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{locale === "ar" ? "الألعاب" : "Games"}</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {games.map((g) => (
          <Link
            key={g.id}
            href={`/${locale}/games/${g.slug}`}
            className="rounded-lg border border-border bg-card p-4 hover:border-brand"
          >
            <div className="font-medium">{locale === "ar" ? g.nameAr : g.nameEn}</div>
            <div className="text-sm text-muted">{g.nameEn}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
