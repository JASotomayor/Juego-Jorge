export type Difficulty = 'easy' | 'medium' | 'hard'

export interface CardData {
  id: string       // unique position id e.g. "0-a", "0-b"
  pairId: string   // cards with the same pairId are a match
  emoji: string
  label: string
  isFlipped: boolean
  isMatched: boolean
}

export interface DeckCard {
  pairId: string
  emoji: string
  label: string
}

export interface DeckDefinition {
  slug: string
  name: string
  icon: string
  cards: DeckCard[]
}

export interface GameResult {
  moves: number
  timeSeconds: number
  score: number
  difficulty: Difficulty
  deckSlug: string
  seed: string
}

export const DIFFICULTY_CONFIG: Record<Difficulty, { pairs: number; cols: number; label: string }> = {
  easy:   { pairs: 8,  cols: 4, label: 'Fácil' },
  medium: { pairs: 12, cols: 6, label: 'Medio' },
  hard:   { pairs: 18, cols: 6, label: 'Difícil' },
}
