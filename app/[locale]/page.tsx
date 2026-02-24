export const dynamic = "force-dynamic";
export const revalidate = 0;
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Home({ params }: { params: Promise<{ locale: "ar" | "en" }> }) {
  const { locale } = await params;
  const latest = await prisma.post.findMany({
    take: 12,
    orderBy: { publishedAt: "desc" },
    where: { lang: locale },
    include: { game: true, tournament: true, team: true }
  });

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-border bg-card p-6">
        <h1 className="text-2xl font-semibold">
          Soor<span className="text-brand">Sports</span>
        </h1>
        <p className="mt-2 text-muted">
          {locale === "ar"
            ? "موقع رسمي ومرتب—ويخدم شغلك على X بسرعة."
            : "Clean & official—built to speed up your X workflow."}
        </p>
        <div className="mt-4 flex gap-3">
          <Link className="rounded bg-brand px-4 py-2 text-sm font-medium text-white" href={`/${locale}/games`}>
            {locale === "ar" ? "ابدأ من الألعاب" : "Browse games"}
          </Link>
          <Link className="rounded border border-border bg-bg px-4 py-2 text-sm text-text" href="/admin">
            {locale === "ar" ? "لوحة التحكم" : "Admin"}
          </Link>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold">{locale === "ar" ? "آخر الأخبار" : "Latest posts"}</h2>
          <Link className="text-sm text-muted hover:text-text" href={`/${locale}/games`}>
            {locale === "ar" ? "كل الألعاب" : "All games"}
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {latest.map((p) => (
            <Link
              key={p.id}
              href={`/${locale}/post/${p.id}`}
              className="rounded-lg border border-border bg-card p-4 hover:border-brand"
            >
              <div className="text-xs text-muted">
                {p.game.nameEn} • {new Date(p.publishedAt).toLocaleDateString()}
                {p.tournament ? ` • ${p.tournament.name}` : ""}
                {p.team ? ` • ${p.team.name}` : ""}
              </div>
              <div className="mt-1 font-medium">{p.title}</div>
              {p.excerpt ? <div className="mt-1 text-sm text-muted">{p.excerpt}</div> : null}
            </Link>
          ))}
          {latest.length === 0 ? (
            <div className="text-muted">
              {locale === "ar" ? "ما فيه أخبار لسه—أضف أول خبر من لوحة التحكم." : "No posts yet—create one in Admin."}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
