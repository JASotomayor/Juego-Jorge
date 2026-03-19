'use client'

import { Card } from './Card'
import type { CardData, Difficulty } from '@/types/game'
import { DIFFICULTY_CONFIG } from '@/types/game'
import { cn } from '@/lib/utils'

interface BoardProps {
  cards: CardData[]
  difficulty: Difficulty
  onCardClick: (id: string) => void
}

const cardSizeByDifficulty: Record<Difficulty, 'sm' | 'md' | 'lg'> = {
  easy:   'lg',
  medium: 'md',
  hard:   'sm',
}

export function Board({ cards, difficulty, onCardClick }: BoardProps) {
  const { cols } = DIFFICULTY_CONFIG[difficulty]
  const cardSize = cardSizeByDifficulty[difficulty]

  return (
    <div
      className="grid gap-2 sm:gap-3 mx-auto w-fit"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      role="grid"
      aria-label="Tablero de juego"
    >
      {cards.map(card => (
        <Card
          key={card.id}
          card={card}
          onClick={onCardClick}
          size={cardSize}
        />
      ))}
    </div>
  )
}
