import Link from "next/link";

import { WoodTexture } from "@/components/shared/wood-texture";
import { siteConfig } from "@/config/site";

export function SiteHeader() {
  return (
    <header className="relative overflow-hidden border-b border-zinc-800 bg-zinc-900 px-6 py-8">
      <WoodTexture />
      <div className="relative mx-auto flex max-w-7xl items-end justify-between">
        <div>
          <div className="mb-2 flex items-baseline gap-3">
            <Link
              className="text-4xl font-bold tracking-tight text-white md:text-5xl"
              href="/"
            >
              {siteConfig.name}
            </Link>
            <span className="mb-2 hidden h-2 w-2 rounded-full bg-zinc-500 md:inline-block" />
            <span className="hidden text-zinc-500 md:inline">est. 2024</span>
          </div>
          <p className="font-mono text-sm text-zinc-400">
            {siteConfig.tagline}
          </p>
        </div>

        <nav className="hidden flex-col gap-2 text-right font-mono text-sm sm:flex">
          {siteConfig.mainNav.map((item) => (
            <Link
              className="border-r-2 border-transparent pr-3 text-zinc-400 transition-colors hover:border-white hover:text-white"
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
