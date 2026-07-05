export function WoodTexture() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
      <svg width="100%" height="100%">
        <defs>
          <pattern
            id="wood-grain"
            x="0"
            y="0"
            width="400"
            height="400"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0,200 Q100,195 200,200 T400,200 M0,180 Q100,175 200,180 T400,180 M0,220 Q100,225 200,220 T400,220 M0,160 Q100,165 200,160 T400,160 M0,240 Q100,235 200,240 T400,240"
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
              opacity="0.3"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wood-grain)" />
      </svg>
    </div>
  );
}
