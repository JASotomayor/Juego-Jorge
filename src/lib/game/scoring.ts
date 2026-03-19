import type { Difficulty } from '@/types/game'

const BASE_SCORE: Record<Difficulty, number> = {
  easy:   500,
  medium: 1000,
  hard:   2000,
}

const MOVE_PENALTY: Record<Difficulty, number> = {
  easy:   8,
  medium: 6,
  hard:   4,
}

const TIME_PENALTY: Record<Difficulty, number> = {
  easy:   2,
  medium: 3,
  hard:   4,
}

export function calculateScore(
  moves: number,
  timeSeconds: number,
  difficulty: Difficulty
): number {
  const base = BASE_SCORE[difficulty]
  const movePenalty = moves * MOVE_PENALTY[difficulty]
  const timePenalty = timeSeconds * TIME_PENALTY[difficulty]
  return Math.max(0, base - movePenalty - timePenalty)
}

export function getRating(score: number, difficulty: Difficulty): '⭐' | '⭐⭐' | '⭐⭐⭐' {
  const base = BASE_SCORE[difficulty]
  const ratio = score / base
  if (ratio >= 0.75) return '⭐⭐⭐'
  if (ratio >= 0.40) return '⭐⭐'
  return '⭐'
}
