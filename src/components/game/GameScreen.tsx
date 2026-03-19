'use client'

import { useEffect } from 'react'
import { Board } from './Board'
import { GameStats } from './GameStats'
import { ResultModal } from './ResultModal'
import { useGame } from '@/hooks/useGame'
import { useTimer } from '@/hooks/useTimer'
import type { Difficulty } from '@/types/game'
import { DIFFICULTY_CONFIG } from '@/types/game'
import { getAllDecks } from '@/lib/game/decks'
import Link from 'next/link'

interface GameScreenProps {
  difficulty: Difficulty
  deckSlug: string
  fixedSeed?: string
}

export function GameScreen({ difficulty, deckSlug, fixedSeed }: GameScreenProps) {
  const { cards, moves, isComplete, isRunning, flipCard, buildResult, resetGame, seed } =
    useGame(difficulty, deckSlug, fixedSeed)
  const { seconds, reset: resetTimer } = useTimer(isRunning && !isComplete)

  const matchedPairs = cards.filter(c => c.isMatched).length / 2

  const handleCardClick = (id: string) => {
    flipCard(id)
  }

  const handlePlayAgain = () => {
    resetGame()
    resetTimer()
  }

  const gameResult = isComplete ? buildResult(seconds) : null
  const deckName = getAllDecks().find(d => d.slug === deckSlug)?.name ?? deckSlug
  const { label: diffLabel } = DIFFICULTY_CONFIG[difficulty]

  return (
    <div className="min-h-screen flex flex-col items-center py-4 px-2">
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-4 px-2">
        <Link href="/play" className="text-purple-600 font-bold text-sm hover:underline">
          ← Volver
        </Link>
        <div className="text-center">
          <h1 className="font-black text-lg text-purple-700">
            {deckName} · {diffLabel}
          </h1>
        </div>
        <button
          onClick={handlePlayAgain}
          className="text-sm font-bold text-gray-500 hover:text-purple-600 transition"
        >
          🔄 Reset
        </button>
      </div>

      {/* Stats */}
      <div className="mb-4 w-full max-w-2xl px-2">
        <GameStats
          moves={moves}
          seconds={seconds}
          matchedPairs={matchedPairs}
          difficulty={difficulty}
        />
      </div>

      {/* Board */}
      <div className="flex-1 flex items-start justify-center w-full mt-2">
        <Board cards={cards} difficulty={difficulty} onCardClick={handleCardClick} />
      </div>

      {/* Result */}
      {isComplete && gameResult && (
        <ResultModal result={gameResult} onPlayAgain={handlePlayAgain} />
      )}
    </div>
  )
}
