import { login } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function AdminLogin() {
  async function action(formData: FormData) {
    "use server";
    const password = String(formData.get("password") || "");
    const ok = await login(password);
    if (ok) redirect("/admin");
    // If failed, just redirect back with query (simple)
    redirect("/admin/login?err=1");
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="text-xl font-semibold">Admin Login</h1>
      <p className="text-sm text-muted">Only you can access this area.</p>
      <form action={action} className="space-y-3 rounded-lg border border-border bg-card p-4">
        <label className="block text-sm">
          Password
          <input
            name="password"
            type="password"
            className="mt-1 w-full rounded border border-border bg-bg px-3 py-2"
            placeholder="••••••••"
            required
          />
        </label>
        <button className="w-full rounded bg-brand px-4 py-2 text-sm font-medium text-white">
          Sign in
        </button>
      </form>
      <div className="text-xs text-muted">
        Tip: set <code>ADMIN_PASSWORD_HASH</code> in <code>.env.local</code>.
      </div>
    </div>
  );
}
