'use client'

import { formatTime } from '@/lib/utils'
import type { Difficulty } from '@/types/game'
import { DIFFICULTY_CONFIG } from '@/types/game'

interface GameStatsProps {
  moves: number
  seconds: number
  matchedPairs: number
  difficulty: Difficulty
}

export function GameStats({ moves, seconds, matchedPairs, difficulty }: GameStatsProps) {
  const { pairs, label } = DIFFICULTY_CONFIG[difficulty]

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
      <Stat icon="🕐" label="Tiempo" value={formatTime(seconds)} />
      <Stat icon="🔄" label="Movimientos" value={String(moves)} />
      <Stat icon="✅" label="Parejas" value={`${matchedPairs}/${pairs}`} />
      <Stat icon="🎯" label="Nivel" value={label} />
    </div>
  )
}

function Stat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center bg-white/70 rounded-2xl px-4 py-2 shadow-sm border border-purple-100 min-w-[80px]">
      <span className="text-xl">{icon}</span>
      <span className="text-lg font-bold text-purple-700 leading-tight">{value}</span>
      <span className="text-xs text-gray-500 font-medium">{label}</span>
    </div>
  )
}
