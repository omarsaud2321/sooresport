import Link from "next/link";
import { logout } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function AdminHome() {
  async function signout() {
    "use server";
    logout();
    redirect("/admin/login");
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">SoorSports Admin</h1>
        <form action={signout}>
          <button className="rounded border border-border bg-card px-3 py-2 text-sm">Sign out</button>
        </form>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Link href="/admin/posts/new" className="rounded-lg border border-border bg-card p-4 hover:border-brand">
          <div className="font-medium">Create post</div>
          <div className="text-sm text-muted">Arabic first + auto English draft</div>
        </Link>
        <Link href="/admin/games" className="rounded-lg border border-border bg-card p-4 hover:border-brand">
          <div className="font-medium">Manage games</div>
          <div className="text-sm text-muted">COD, CS2, Rocket League, Overwatch…</div>
        </Link>
        <Link href="/admin/tournaments" className="rounded-lg border border-border bg-card p-4 hover:border-brand">
          <div className="font-medium">Manage tournaments</div>
          <div className="text-sm text-muted">CDL / Challengers / Saudi League…</div>
        </Link>
        <Link href="/admin/teams" className="rounded-lg border border-border bg-card p-4 hover:border-brand">
          <div className="font-medium">Manage teams & roster</div>
          <div className="text-sm text-muted">Teams + roster (name + photo)</div>
        </Link>
      </div>
    </div>
  );
}
