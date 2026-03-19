import { GameScreen } from '@/components/game/GameScreen'

// Ruta pública de demo — no requiere auth, no guarda scores
export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50">
      <div className="flex items-center justify-between px-4 py-3 bg-white/80 border-b border-purple-100">
        <span className="font-black text-xl text-purple-700">🃏 Memory Match — Demo</span>
        <a
          href="/auth/register"
          className="px-4 py-2 rounded-xl bg-purple-500 text-white font-bold text-sm hover:opacity-90"
        >
          Crear cuenta gratis →
        </a>
      </div>
      <GameScreen difficulty="easy" deckSlug="animals" />
    </div>
  )
}
