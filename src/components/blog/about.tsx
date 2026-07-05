import Image from "next/image";

import { WoodTexture } from "@/components/shared/wood-texture";
import { getSiteSettings } from "@/lib/settings";

export async function About({
  postsWrittenCount,
}: {
  postsWrittenCount: number;
}) {
  const settings = await getSiteSettings();

  return (
    <section
      className="relative overflow-hidden bg-white px-6 py-20"
      id="about"
    >
      <WoodTexture />

      <div className="absolute top-20 right-20 h-40 w-40 -rotate-12 border-2 border-zinc-200" />
      <div className="absolute bottom-40 left-10 h-32 w-32 rotate-45 bg-zinc-900 opacity-5" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-start gap-12 md:grid-cols-12">
          <div className="space-y-6 md:col-span-5">
            <div className="relative">
              <div className="absolute -top-4 -left-4 h-full w-full border-2 border-zinc-900" />
              <div className="relative aspect-3/4 overflow-hidden bg-zinc-100">
                <Image
                  alt="workspace"
                  className="object-cover grayscale"
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  src="https://images.unsplash.com/photo-1495121553079-4c61bcce1894?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900 p-4 text-center text-white">
                <div className="mb-1 text-3xl font-bold">
                  {postsWrittenCount}
                </div>
                <div className="font-mono text-xs text-zinc-400">
                  posts written
                </div>
              </div>
              <div className="border-2 border-zinc-900 p-4 text-center">
                <div className="mb-1 text-3xl font-bold text-zinc-900">∞</div>
                <div className="font-mono text-xs text-zinc-600">
                  bugs created
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 md:col-span-7">
            <div>
              <div className="mb-6 flex items-center gap-4">
                <div className="h-12 w-1 bg-zinc-900" />
                <h2 className="text-4xl font-bold text-zinc-900 md:text-5xl">
                  about me
                </h2>
              </div>

              <div className="space-y-6 text-lg leading-relaxed text-zinc-700">
                {settings.bio.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="border-l-4 border-zinc-900 bg-zinc-50 py-4 pl-6">
              <h3 className="mb-4 font-mono text-sm tracking-wider text-zinc-900 uppercase">
                Currently Using →
              </h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-zinc-600">
                {settings.currentlyUsing.map((item) => (
                  <div className="flex items-center gap-2" key={item}>
                    <div className="h-2 w-2 bg-zinc-900" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-mono text-sm tracking-wider text-zinc-900 uppercase">
                Other Interests →
              </h3>
              <div className="flex flex-wrap gap-3">
                {settings.otherInterests.map((interest, index) => (
                  <span
                    className={`px-4 py-2 text-sm ${
                      index % 2 === 1
                        ? "bg-zinc-900 text-white"
                        : "border border-zinc-900 bg-white text-zinc-900"
                    }`}
                    key={interest}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
