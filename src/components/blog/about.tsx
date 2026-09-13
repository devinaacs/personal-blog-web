import Image from "next/image";

import { CountUp } from "@/components/shared/count-up";
import { Reveal } from "@/components/shared/reveal";
import { getSiteSettings } from "@/lib/settings";

export async function About({
  postsWrittenCount,
}: {
  postsWrittenCount: number;
}) {
  const settings = await getSiteSettings();

  return (
    <section className="bg-paper px-6 py-20" id="about">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-16 flex items-baseline gap-6 border-b-2 border-ink pb-6">
          <span className="font-mono text-2xl font-bold text-ink-faint">
            03
          </span>
          <h2 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
            about me
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <Reveal as="div" className="md:col-span-4" y={16}>
            <div className="relative aspect-3/4 overflow-hidden border-2 border-ink bg-paper-dim">
              {settings.workspaceImageUrl && (
                <Image
                  alt="workspace"
                  className="object-cover grayscale"
                  fill
                  priority
                  sizes="(min-width: 768px) 33vw, 100vw"
                  src={settings.workspaceImageUrl}
                />
              )}
            </div>
          </Reveal>

          <Reveal as="div" className="md:col-span-8" delay={0.1} y={16}>
            <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-ink-soft">
              {settings.bio.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 border-t-2 border-ink pt-6">
              <h3 className="mb-4 font-mono text-xs tracking-wider text-ink uppercase">
                Currently Using →
              </h3>
              <div className="grid grid-cols-2 gap-y-3 text-ink-soft sm:grid-cols-3">
                {settings.currentlyUsing.map((item) => (
                  <div className="flex items-center gap-2" key={item}>
                    <div className="h-1.5 w-1.5 bg-accent" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="mb-4 font-mono text-xs tracking-wider text-ink uppercase">
                Other Interests →
              </h3>
              <div className="flex flex-wrap gap-2">
                {settings.otherInterests.map((interest, index) => (
                  <span
                    className={`border border-ink px-3 py-1.5 text-sm ${
                      index % 2 === 1 ? "bg-ink text-paper" : "bg-paper text-ink"
                    }`}
                    key={interest}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal
          className="mt-16 grid grid-cols-2 divide-x-2 divide-y-2 divide-ink border-2 border-ink sm:grid-cols-4 sm:divide-y-0"
          delay={0.2}
          y={16}
        >
          <div className="px-6 py-8 text-center">
            <div className="text-4xl font-bold text-ink">
              <CountUp value={postsWrittenCount} />
            </div>
            <div className="mt-1 font-mono text-xs tracking-wider text-ink-faint uppercase">
              posts written
            </div>
          </div>
          <div className="px-6 py-8 text-center">
            <div className="text-4xl font-bold text-accent">∞</div>
            <div className="mt-1 font-mono text-xs tracking-wider text-ink-faint uppercase">
              bugs created
            </div>
          </div>
          <div className="px-6 py-8 text-center">
            <div className="text-4xl font-bold text-ink">
              {settings.establishedYear}
            </div>
            <div className="mt-1 font-mono text-xs tracking-wider text-ink-faint uppercase">
              est.
            </div>
          </div>
          <div className="px-6 py-8 text-center">
            <div className="text-4xl font-bold text-ink">24/7</div>
            <div className="mt-1 font-mono text-xs tracking-wider text-ink-faint uppercase">
              overthinking
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
