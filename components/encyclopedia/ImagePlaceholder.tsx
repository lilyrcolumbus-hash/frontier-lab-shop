interface ImagePlaceholderProps {
  prompt: string
  name: string
  className?: string
}

export function ImagePlaceholder({ prompt, name, className = '' }: ImagePlaceholderProps) {
  return (
    <div className={`w-full bg-elevated flex flex-col items-center justify-center gap-5 p-8 ${className}`}>
      {/* Mushroom silhouette icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-14 h-14 text-cream-muted/40"
      >
        <path d="M32 8C18 8 8 18 8 28c0 4 4 6 8 6h5l-2 18h26l-2-18h5c4 0 8-2 8-6C56 18 46 8 32 8z" />
        <path d="M24 34l1-6M40 34l-1-6" />
      </svg>

      {/* Label */}
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-amber flex-shrink-0"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-amber">
          Imagen pendiente — Generar en OpenArt
        </span>
      </div>

      {/* Prompt box */}
      <div className="w-full max-w-xl bg-bg border border-amber/30 rounded-none p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber/70 mb-2">
          Prompt para {name}
        </p>
        <p className="font-mono text-xs text-cream leading-relaxed">{prompt}</p>
      </div>

      <p className="text-xs text-cream-muted/60">
        Recomendado: FLUX.1 en OpenArt · Modo: Photorealistic
      </p>
    </div>
  )
}
