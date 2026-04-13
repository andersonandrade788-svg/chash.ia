'use client'

export default function EbookError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center p-6">
      <p className="text-red-400 font-bold text-lg">Erro na página</p>
      <p className="text-purple-300/60 text-sm max-w-md">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
        style={{ background: 'linear-gradient(135deg,#9333ea,#38bdf8)' }}
      >
        Tentar novamente
      </button>
    </div>
  )
}
