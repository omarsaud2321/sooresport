import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ManageRoster({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = await prisma.team.findUnique({
    where: { id },
    include: { game: true, roster: { orderBy: { createdAt: "asc" } } }
  });

  if (!team) {
    return (
      <div className="space-y-3">
        <div className="text-muted">Team not found.</div>
        <Link href="/admin/teams" className="text-sm text-muted hover:text-text">Back</Link>
      </div>
    );
  }

  async function addPlayer(formData: FormData) {
    "use server";
    const name = String(formData.get("name"));
    const photoUrl = String(formData.get("photoUrl") || "");
    const role = String(formData.get("role") || "");
    await prisma.player.create({
      data: { teamId: team.id, name, photoUrl: photoUrl || null, role: role || null }
    });
    redirect(`/admin/teams/${team.id}`);
  }

  async function removePlayer(formData: FormData) {
    "use server";
    const playerId = String(formData.get("playerId"));
    await prisma.player.delete({ where: { id: playerId } });
    redirect(`/admin/teams/${team.id}`);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs text-muted">{team.game.nameEn}</div>
          <h1 className="text-xl font-semibold">{team.name} — Roster</h1>
        </div>
        <Link href="/admin/teams" className="text-sm text-muted hover:text-text">Back</Link>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="font-medium">Add player</h2>
        <form action={addPlayer} className="mt-3 grid gap-3">
          <input name="name" placeholder="Player name" className="w-full rounded border border-border bg-bg px-3 py-2" required />
          <input name="photoUrl" placeholder="Photo URL (optional)" className="w-full rounded border border-border bg-bg px-3 py-2" />
          <input name="role" placeholder="Role (optional)" className="w-full rounded border border-border bg-bg px-3 py-2" />
          <button className="rounded bg-brand px-4 py-2 text-sm font-medium text-white">Add</button>
        </form>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="font-medium">Current roster</h2>
        <div className="mt-3 space-y-2">
          {team.roster.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 rounded border border-border bg-bg p-3">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-muted">{p.role ?? "—"}</div>
              </div>
              <form action={removePlayer}>
                <input type="hidden" name="playerId" value={p.id} />
                <button className="rounded border border-border bg-card px-3 py-2 text-sm hover:border-brand">
                  Remove
                </button>
              </form>
            </div>
          ))}
          {team.roster.length === 0 ? <div className="text-muted">No players yet.</div> : null}
        </div>
      </div>
    </div>
  );
}
