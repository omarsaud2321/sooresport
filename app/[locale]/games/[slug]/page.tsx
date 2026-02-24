export const dynamic = "force-dynamic";
export const revalidate = 0;
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function GamePage({
  params,
  searchParams
}: {
  params: Promise<{ locale: "ar" | "en"; slug: string }>;
  searchParams: Promise<{ section?: string; filter?: string }>;
}) {
  const { locale, slug } = await params;
  const sp = await searchParams;

  const game = await prisma.game.findUnique({ where: { slug } });
  if (!game) return notFound();

  const section = (sp.section ?? "news") as "news" | "tournaments" | "teams";
  const filter = sp.filter ?? "";

  const tournaments = await prisma.tournament.findMany({
    where: { gameId: game.id },
    orderBy: { name: "asc" }
  });

  const posts = await prisma.post.findMany({
    take: 30,
    orderBy: { publishedAt: "desc" },
    where: {
      lang: locale,
      gameId: game.id,
      section: section === "news" ? "NEWS" : section === "tournaments" ? "TOURNAMENTS" : "TEAMS",
      ...(section === "tournaments" && filter ? { tournament: { slug: filter } } : {})
    },
    include: { tournament: true, team: true }
  });

  const teams = await prisma.team.findMany({
    where: { gameId: game.id },
    orderBy: { name: "asc" }
  });

  const title = locale === "ar" ? game.nameAr : game.nameEn;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="flex gap-2">
          <Link className={`rounded px-3 py-1 text-sm ${section==="news" ? "bg-brand text-white" : "border border-border bg-card"}`}
            href={`/${locale}/games/${slug}?section=news`}>
            {locale === "ar" ? "الأخبار" : "News"}
          </Link>
          <Link className={`rounded px-3 py-1 text-sm ${section==="tournaments" ? "bg-brand text-white" : "border border-border bg-card"}`}
            href={`/${locale}/games/${slug}?section=tournaments`}>
            {locale === "ar" ? "البطولات" : "Tournaments"}
          </Link>
          <Link className={`rounded px-3 py-1 text-sm ${section==="teams" ? "bg-brand text-white" : "border border-border bg-card"}`}
            href={`/${locale}/games/${slug}?section=teams`}>
            {locale === "ar" ? "الفرق" : "Teams"}
          </Link>
        </div>
      </div>

      {slug === "cod" && section === "tournaments" ? (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-sm text-muted">{locale === "ar" ? "فلترة (COD)" : "Filters (COD)"}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              { slug: "", label: locale==="ar" ? "الكل" : "All" },
              { slug: "cdl", label: "CDL" },
              { slug: "challengers-mena", label: "Challengers (MENA)" },
              { slug: "challengers-eu", label: "Challengers (EU)" },
              { slug: "challengers-na", label: "Challengers (NA)" },
              { slug: "saudi-league", label: "Saudi League" }
            ].map((f) => (
              <Link key={f.slug} href={`/${locale}/games/${slug}?section=tournaments&filter=${f.slug}`}
                className={`rounded px-3 py-1 text-sm ${filter===f.slug ? "bg-brand text-white" : "border border-border bg-bg"}`}>
                {f.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {section === "teams" ? (
        <div className="grid gap-3 md:grid-cols-2">
          {teams.map((t) => (
            <Link key={t.id} href={`/${locale}/teams/${t.id}`} className="rounded-lg border border-border bg-card p-4 hover:border-brand">
              <div className="font-medium">{t.name}</div>
              <div className="text-sm text-muted">{locale==="ar" ? "اضغط لعرض الروستر" : "View roster"}</div>
            </Link>
          ))}
          {teams.length === 0 ? <div className="text-muted">{locale==="ar" ? "ما فيه فرق مضافة." : "No teams yet."}</div> : null}
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {posts.map((p) => (
            <Link key={p.id} href={`/${locale}/post/${p.id}`} className="rounded-lg border border-border bg-card p-4 hover:border-brand">
              <div className="text-xs text-muted">
                {new Date(p.publishedAt).toLocaleDateString()}
                {p.tournament ? ` • ${p.tournament.name}` : ""}
                {p.team ? ` • ${p.team.name}` : ""}
              </div>
              <div className="mt-1 font-medium">{p.title}</div>
              {p.excerpt ? <div className="mt-1 text-sm text-muted">{p.excerpt}</div> : null}
            </Link>
          ))}
          {posts.length === 0 ? (
            <div className="text-muted">{locale==="ar" ? "ما فيه أخبار في هذا القسم لسه." : "No posts in this section yet."}</div>
          ) : null}
        </div>
      )}
    </div>
  );
}
