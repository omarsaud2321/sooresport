import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ReactNode } from "react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: "ar" | "en" }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-screen" dir={locale === "ar" ? "rtl" : "ltr"}>
        <header className="sticky top-0 z-10 border-b border-border bg-bg/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href={`/${locale}`} className="font-semibold tracking-wide">
              Soor<span className="text-brand">Sports</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm text-muted">
              <Link href={`/${locale}`}>Home</Link>
              <Link href={`/${locale}/games`}>Games</Link>
              <Link href={`/admin`} className="text-muted hover:text-text">
                Admin
              </Link>
              <div className="flex items-center gap-2 rounded border border-border bg-card px-2 py-1">
                <Link href={`/ar`} className={locale === "ar" ? "text-text" : ""}>
                  AR
                </Link>
                <span className="text-border">|</span>
                <Link href={`/en`} className={locale === "en" ? "text-text" : ""}>
                  EN
                </Link>
              </div>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

        <footer className="border-t border-border py-8 text-center text-xs text-muted">
          © {new Date().getFullYear()} SoorSports
        </footer>
      </div>
    </NextIntlClientProvider>
  );
}
