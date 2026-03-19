import Link from 'next/link'
import { getAllDecks } from '@/lib/game/decks'
import type { Difficulty } from '@/types/game'
import { DIFFICULTY_CONFIG } from '@/types/game'

export default function PlaySetupPage() {
  const decks = getAllDecks()
  const difficulties = Object.entries(DIFFICULTY_CONFIG) as [Difficulty, typeof DIFFICULTY_CONFIG[Difficulty]][]

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-black text-purple-700 mb-6 text-center">🎮 Nueva Partida</h1>

      {/* Difficulty */}
      <section className="mb-6">
        <h2 className="text-lg font-black text-gray-700 mb-3">Elige dificultad</h2>
        <div className="grid grid-cols-3 gap-3">
          {difficulties.map(([key, config]) => (
            <Link
              key={key}
              href={`/play/game?difficulty=${key}&deck=animals`}
              className="flex flex-col items-center gap-1 p-4 bg-white/80 rounded-2xl
                border-2 border-purple-200 hover:border-purple-500 hover:bg-purple-50
                transition font-bold text-center shadow-sm"
            >
              <span className="text-2xl">
                {key === 'easy' ? '🟢' : key === 'medium' ? '🟡' : '🔴'}
              </span>
              <span className="text-gray-800">{config.label}</span>
              <span className="text-xs text-gray-400">{config.pairs} parejas</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Deck picker */}
      <section>
        <h2 className="text-lg font-black text-gray-700 mb-3">Elige mazo</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {decks.map(deck => (
            <Link
              key={deck.slug}
              href={`/play/game?difficulty=easy&deck=${deck.slug}`}
              className="flex flex-col items-center gap-1 p-4 bg-white/80 rounded-2xl
                border-2 border-purple-200 hover:border-purple-500 hover:bg-purple-50
                transition font-bold text-center shadow-sm"
            >
              <span className="text-3xl">{deck.icon}</span>
              <span className="text-gray-800 text-sm">{deck.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <p className="text-center text-xs text-gray-400 font-medium mt-6">
        Selecciona dificultad y mazo para empezar. Puedes cambiarlos en la pantalla de juego.
      </p>
    </div>
  )
}
