import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function TeamPage({ params }: { params: Promise<{ locale: "ar" | "en"; id: string }> }) {
  const { locale, id } = await params;

  const team = await prisma.team.findUnique({
    where: { id },
    include: {
      game: true,
      roster: { orderBy: { createdAt: "asc" } },
      posts: {
        where: { lang: locale },
        orderBy: { publishedAt: "desc" },
        take: 10
      }
    }
  });
  if (!team) return notFound();

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="text-sm text-muted">{team.game.nameEn}</div>
        <h1 className="mt-1 text-2xl font-semibold">{team.name}</h1>
        <div className="mt-4">
          <h2 className="font-medium">{locale === "ar" ? "الروستر" : "Roster"}</h2>
          <div className="mt-2 grid gap-3 md:grid-cols-2">
            {team.roster.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded border border-border bg-bg p-3">
                <div className="h-12 w-12 overflow-hidden rounded bg-card">
                  {/* Using img for simplicity */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={p.name}
                    src={p.photoUrl ?? "https://placehold.co/96x96/png?text=Soor"}
                    className="h-12 w-12 object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium">{p.name}</div>
                  {p.role ? <div className="text-xs text-muted">{p.role}</div> : null}
                </div>
              </div>
            ))}
            {team.roster.length === 0 ? (
              <div className="text-muted">{locale === "ar" ? "ما فيه لاعبين مضافين للروستر." : "No players in roster yet."}</div>
            ) : null}
          </div>
        </div>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">{locale === "ar" ? "آخر أخبار الفريق" : "Latest team posts"}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {team.posts.map((p) => (
            <Link key={p.id} href={`/${locale}/post/${p.id}`} className="rounded-lg border border-border bg-card p-4 hover:border-brand">
              <div className="text-xs text-muted">{new Date(p.publishedAt).toLocaleDateString()}</div>
              <div className="mt-1 font-medium">{p.title}</div>
              {p.excerpt ? <div className="mt-1 text-sm text-muted">{p.excerpt}</div> : null}
            </Link>
          ))}
          {team.posts.length === 0 ? (
            <div className="text-muted">{locale==="ar" ? "لا توجد أخبار مرتبطة بهذا الفريق بعد." : "No posts for this team yet."}</div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
