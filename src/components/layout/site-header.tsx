import Link from "next/link";

import { SiteNav } from "@/components/layout/site-nav";
import { siteConfig } from "@/config/site";
import { getSiteSettings } from "@/lib/settings";

export async function SiteHeader() {
  const settings = await getSiteSettings();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper">
      <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-line sm:grid-cols-[1fr_auto_auto] sm:divide-x sm:divide-y-0">
        <div className="px-6 py-5">
          <Link
            className="text-2xl font-bold tracking-tight text-ink"
            href="/"
          >
            {settings.siteName}
          </Link>
          <p className="mt-1 font-mono text-xs text-ink-soft">
            {settings.tagline}
          </p>
        </div>

        <div className="flex items-center px-6 py-5 font-mono text-xs tracking-widest text-ink-faint uppercase">
          est. {settings.establishedYear}
        </div>

        <div className="flex items-center px-2 py-2 sm:px-0 sm:py-0">
          <SiteNav items={siteConfig.mainNav} />
        </div>
      </div>
    </header>
  );
}
