import Link from "next/link";

import { WoodTexture } from "@/components/shared/wood-texture";
import { siteConfig } from "@/config/site";
import { getSiteSettings } from "@/lib/settings";

export async function SiteHeader() {
  const settings = await getSiteSettings();

  return (
    <header className="relative overflow-hidden border-b border-zinc-800 bg-zinc-900 px-6 py-8">
      <WoodTexture />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-baseline gap-3">
            <Link
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
              href="/"
            >
              {settings.siteName}
            </Link>
            <span className="mb-2 hidden h-2 w-2 rounded-full bg-zinc-500 md:inline-block" />
            <span className="hidden text-zinc-500 md:inline">
              est. {settings.establishedYear}
            </span>
          </div>
          <p className="font-mono text-sm text-zinc-400">{settings.tagline}</p>
        </div>

        <nav className="flex gap-5 font-mono text-sm sm:flex-col sm:items-end sm:gap-2">
          {siteConfig.mainNav.map((item) => (
            <Link
              className="border-b-2 border-transparent pb-1 text-zinc-400 transition-colors hover:border-white hover:text-white sm:border-r-2 sm:border-b-0 sm:pr-3 sm:pb-0"
              href={item.href}
              key={item.href}
            >
              [{item.title}]
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
