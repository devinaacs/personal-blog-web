import { WoodTexture } from "@/components/shared/wood-texture";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-zinc-50 px-6 py-20 md:py-32">
      <WoodTexture />

      <div className="absolute top-10 right-10 h-32 w-32 rotate-12 border border-zinc-300 opacity-30" />
      <div className="absolute bottom-20 left-1/4 h-24 w-24 -rotate-6 border border-zinc-300 opacity-20" />

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px w-12 bg-zinc-900" />
            <span className="font-mono text-xs tracking-widest text-zinc-600 uppercase">
              Personal Journal
            </span>
          </div>

          <div className="mb-12 space-y-4">
            <h2 className="text-5xl leading-none font-bold text-zinc-900 md:text-7xl">
              thoughts,
            </h2>
            <h2 className="text-5xl leading-none font-bold text-zinc-900 md:pl-20 md:text-7xl">
              code,
            </h2>
            <h2 className="text-5xl leading-none font-bold text-zinc-400 md:pl-10 md:text-7xl">
              & everything
            </h2>
            <h2 className="text-5xl leading-none font-bold text-zinc-400 md:pl-32 md:text-7xl">
              in between
            </h2>
          </div>

          <div className="relative max-w-xl border-l-4 border-zinc-900 bg-white p-8 shadow-lg">
            <div className="absolute -top-3 -left-3 h-6 w-6 bg-zinc-900" />
            <p className="text-lg leading-relaxed font-light text-zinc-700">
              Welcome to my digital corner. I write about the things that keep
              me up at night—usually bugs in my code, but sometimes life
              stuff too. No templates here, just raw thoughts typed out at
              2am.
            </p>
          </div>

          <div className="mt-16 flex items-center gap-3">
            <div className="h-16 w-px bg-zinc-300" />
            <span className="origin-left -rotate-90 font-mono text-xs text-zinc-500">
              scroll
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
