'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type { CardData, Difficulty, GameResult } from '@/types/game'
import { DIFFICULTY_CONFIG } from '@/types/game'
import { shuffleWithSeed, generateSeed } from '@/lib/game/shuffle'
import { calculateScore } from '@/lib/game/scoring'
import { getDeckCards } from '@/lib/game/decks'

export function useGame(difficulty: Difficulty, deckSlug: string, fixedSeed?: string) {
  const [cards, setCards] = useState<CardData[]>([])
  const [flippedIds, setFlippedIds] = useState<string[]>([])
  const [moves, setMoves] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const seedRef = useRef<string>('')

  const initGame = useCallback(() => {
    const { pairs } = DIFFICULTY_CONFIG[difficulty]
    const deckCards = getDeckCards(deckSlug, pairs)
    const seed = fixedSeed ?? generateSeed()
    seedRef.current = seed

    const paired: CardData[] = deckCards.flatMap((card, i) => [
      { id: `${i}-a`, pairId: card.pairId, emoji: card.emoji, label: card.label, isFlipped: false, isMatched: false },
      { id: `${i}-b`, pairId: card.pairId, emoji: card.emoji, label: card.label, isFlipped: false, isMatched: false },
    ])

    setCards(shuffleWithSeed(paired, seed))
    setFlippedIds([])
    setMoves(0)
    setIsLocked(false)
    setIsComplete(false)
    setIsRunning(false)
  }, [difficulty, deckSlug, fixedSeed])

  useEffect(() => { initGame() }, [initGame])

  // Detect completion
  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.isMatched)) {
      setIsComplete(true)
      setIsRunning(false)
    }
  }, [cards])

  // Sync flippedIds + cards to avoid stale closure — use refs for match check
  const cardsRef = useRef(cards)
  const flippedRef = useRef(flippedIds)
  useEffect(() => { cardsRef.current = cards }, [cards])
  useEffect(() => { flippedRef.current = flippedIds }, [flippedIds])

  const flipCard = useCallback((cardId: string) => {
    if (isLocked) return

    const currentCards = cardsRef.current
    const currentFlipped = flippedRef.current

    if (currentFlipped.includes(cardId)) return

    const card = currentCards.find(c => c.id === cardId)
    if (!card || card.isMatched || card.isFlipped) return

    // First card of a pair
    if (currentFlipped.length === 0) {
      setCards(prev => prev.map(c => c.id === cardId ? { ...c, isFlipped: true } : c))
      setFlippedIds([cardId])
      setIsRunning(true)
      return
    }

    // Second card of a pair
    const [firstId] = currentFlipped
    const firstCard = currentCards.find(c => c.id === firstId)!

    setCards(prev => prev.map(c => c.id === cardId ? { ...c, isFlipped: true } : c))
    setFlippedIds([])
    setMoves(m => m + 1)
    setIsLocked(true)

    if (firstCard.pairId === card.pairId) {
      // Match — reveal both and release lock quickly
      setTimeout(() => {
        setCards(prev => prev.map(c =>
          c.id === firstId || c.id === cardId ? { ...c, isMatched: true } : c
        ))
        setIsLocked(false)
      }, 400)
    } else {
      // No match — flip back after pause
      setTimeout(() => {
        setCards(prev => prev.map(c =>
          c.id === firstId || c.id === cardId ? { ...c, isFlipped: false } : c
        ))
        setIsLocked(false)
      }, 1000)
    }
  }, [isLocked])

  const buildResult = useCallback((timeSeconds: number): GameResult => ({
    moves,
    timeSeconds,
    score: calculateScore(moves, timeSeconds, difficulty),
    difficulty,
    deckSlug,
    seed: seedRef.current,
  }), [moves, difficulty, deckSlug])

  return {
    cards,
    moves,
    isComplete,
    isRunning,
    isLocked,
    flipCard,
    buildResult,
    resetGame: initGame,
    seed: seedRef.current,
  }
}
