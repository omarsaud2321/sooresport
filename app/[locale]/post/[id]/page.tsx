export const dynamic = "force-dynamic";
export const revalidate = 0;
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function PostPage({
  params
}: {
  params: Promise<{ locale: "ar" | "en"; id: string }>;
}) {
  const { locale, id } = await params;
  const post = await prisma.post.findFirst({
    where: { id, lang: locale },
    include: { game: true, tournament: true, team: true }
  });
  if (!post) return notFound();

  return (
    <article className="space-y-4">
      <div className="text-sm text-muted">
        {post.game.nameEn}
        {post.tournament ? ` • ${post.tournament.name}` : ""}
        {post.team ? ` • ${post.team.name}` : ""}
        {" • "}
        {new Date(post.publishedAt).toLocaleString()}
      </div>
      <h1 className="text-2xl font-semibold">{post.title}</h1>
      {post.excerpt ? <p className="text-muted">{post.excerpt}</p> : null}
      <div className="rounded-lg border border-border bg-card p-4 whitespace-pre-wrap leading-7">
        {post.content ?? (locale === "ar" ? "بدون تفاصيل إضافية." : "No extra details.")}
      </div>

      <section className="rounded-lg border border-border bg-card p-4">
        <h2 className="font-medium">{locale === "ar" ? "نص التغريدة" : "Tweet text"}</h2>
        <div className="mt-2 grid gap-3 md:grid-cols-2">
          <div className="rounded border border-border bg-bg p-3 text-sm whitespace-pre-wrap">
            {post.tweetTextAr ?? "—"}
          </div>
          <div className="rounded border border-border bg-bg p-3 text-sm whitespace-pre-wrap">
            {post.tweetTextEn ?? "—"}
          </div>
        </div>
      </section>
    </article>
  );
}
