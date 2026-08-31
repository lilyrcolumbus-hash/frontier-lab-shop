'use client'

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="px-4 py-2 rounded-full bg-black text-white text-sm font-semibold hover:bg-black/85 transition-colors"
    >
      Print packing slip
    </button>
  )
}
