import { getSiteSettings } from "@/lib/settings";

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-paper/15 md:grid-cols-2 md:divide-x md:divide-y-0">
        <div className="space-y-4 px-6 py-12">
          <h3 className="text-2xl font-bold tracking-tight">
            {settings.siteName}
          </h3>
          <p className="max-w-sm text-sm leading-relaxed text-paper/60">
            {settings.footerBlurb}
          </p>
          <div className="h-1 w-16 bg-accent" />
        </div>

        <div className="px-6 py-12">
          <h4 className="mb-4 font-mono text-xs tracking-widest text-paper/60 uppercase">
            Get in touch
          </h4>
          <div className="space-y-2 text-paper/80">
            {settings.email && (
              <a
                className="block w-fit transition-colors hover:text-accent"
                href={`mailto:${settings.email}`}
              >
                {settings.email}
              </a>
            )}
            {settings.github && (
              <a
                className="block w-fit transition-colors hover:text-accent"
                href={settings.github}
              >
                {settings.github.replace("https://", "")}
              </a>
            )}
            {settings.threads && (
              <a
                className="block w-fit transition-colors hover:text-accent"
                href={settings.threads}
              >
                {settings.threads.replace("https://", "")}
              </a>
            )}
            {settings.linkedin && (
              <a
                className="block w-fit transition-colors hover:text-accent"
                href={settings.linkedin}
              >
                {settings.linkedin.replace("https://", "")}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-paper/15 px-6 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 font-mono text-xs text-paper/60 md:flex-row">
          <p>© {year} — built with Next.js</p>
          <p>set in Geist, ruled on a Swiss grid</p>
        </div>
      </div>
    </footer>
  );
}
