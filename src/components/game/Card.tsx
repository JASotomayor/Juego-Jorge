'use client'

import { cn } from '@/lib/utils'
import type { CardData } from '@/types/game'

interface CardProps {
  card: CardData
  onClick: (id: string) => void
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-14 h-14 text-3xl',
  md: 'w-16 h-16 text-4xl',
  lg: 'w-20 h-20 text-5xl',
}

export function Card({ card, onClick, size = 'md' }: CardProps) {
  const isVisible = card.isFlipped || card.isMatched

  return (
    <div
      className={cn('card-container cursor-pointer select-none', sizeClasses[size])}
      onClick={() => !card.isMatched && onClick(card.id)}
      role="button"
      aria-label={isVisible ? card.label : 'Carta boca abajo'}
      aria-pressed={card.isFlipped}
    >
      <div className={cn('card-inner w-full h-full', isVisible && 'flipped')}>
        {/* Front — card back design */}
        <div className="card-face card-front-face flex items-center justify-center
          bg-gradient-to-br from-violet-500 to-purple-700
          border-2 border-purple-400 shadow-md
          hover:from-violet-400 hover:to-purple-600 transition-colors">
          <span className="text-2xl">🃏</span>
        </div>

        {/* Back — emoji face */}
        <div className={cn(
          'card-face card-back-face flex items-center justify-center',
          'border-2 shadow-md transition-all',
          card.isMatched
            ? 'bg-gradient-to-br from-emerald-400 to-green-500 border-green-400 animate-pulse-match'
            : 'bg-gradient-to-br from-yellow-100 to-amber-200 border-yellow-300'
        )}>
          <span role="img" aria-label={card.label}>{card.emoji}</span>
        </div>
      </div>
    </div>
  )
}
