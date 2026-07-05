import { WoodTexture } from "@/components/shared/wood-texture";
import { getSiteSettings } from "@/lib/settings";

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-zinc-900 px-6 py-16 text-white">
      <WoodTexture />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 grid gap-12 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">{settings.siteName}</h3>
            <p className="text-sm leading-relaxed text-zinc-400">
              {settings.footerBlurb}
            </p>
            <div className="h-px w-24 bg-zinc-700" />
          </div>

          <div>
            <h4 className="mb-4 font-mono text-xs tracking-widest text-zinc-500 uppercase">
              Get in touch
            </h4>
            <div className="space-y-2 text-zinc-300">
              <a
                className="block transition-colors hover:text-white"
                href={`mailto:${settings.email}`}
              >
                {settings.email}
              </a>
              <a
                className="block transition-colors hover:text-white"
                href={settings.github}
              >
                {settings.github.replace("https://", "")}
              </a>
              <a
                className="block transition-colors hover:text-white"
                href={settings.twitter}
              >
                {settings.twitter.replace("https://", "")}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-zinc-500 md:flex-row">
            <p className="font-mono">
              © {year} • Built with Next.js • Fueled by coffee
            </p>
            <p className="font-mono">
              Design inspired by brutalism & swiss design
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
