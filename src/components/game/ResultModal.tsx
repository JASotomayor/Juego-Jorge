'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/hooks/useAuth'
import { COLLECTIONS } from '@/lib/firebase/firestore'
import { formatTime } from '@/lib/utils'
import { getRating } from '@/lib/game/scoring'
import type { GameResult } from '@/types/game'

interface ResultModalProps {
  result: GameResult
  onPlayAgain: () => void
}

export function ResultModal({ result, onPlayAgain }: ResultModalProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const rating = getRating(result.score, result.difficulty)

  const saveScore = async () => {
    if (!user) return
    setSaving(true)
    try {
      await addDoc(collection(db, COLLECTIONS.gameSessions), {
        userId:      user.uid,
        deckSlug:    result.deckSlug,
        difficulty:  result.difficulty,
        moves:       result.moves,
        timeSeconds: result.timeSeconds,
        score:       result.score,
        completed:   true,
        seed:        result.seed,
        playedAt:    Date.now(),
      })
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center animate-bounce-in">
        <div className="text-6xl mb-2">{rating}</div>
        <h2 className="text-3xl font-black text-purple-700 mb-1">¡Completado!</h2>
        <div className="grid grid-cols-2 gap-3 my-6">
          {[
            { label: 'Puntuación', value: String(result.score), icon: '🏆' },
            { label: 'Tiempo',     value: formatTime(result.timeSeconds), icon: '🕐' },
            { label: 'Movimientos', value: String(result.moves), icon: '🔄' },
            { label: 'Nivel',      value: result.difficulty === 'easy' ? 'Fácil' : result.difficulty === 'medium' ? 'Medio' : 'Difícil', icon: '🎯' },
          ].map(s => (
            <div key={s.label} className="bg-purple-50 rounded-2xl p-3">
              <div className="text-2xl">{s.icon}</div>
              <div className="text-xl font-black text-purple-800">{s.value}</div>
              <div className="text-xs text-gray-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {user && !saved ? (
            <button onClick={saveScore} disabled={saving}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-600 text-white font-bold text-lg shadow-md hover:opacity-90 transition disabled:opacity-50">
              {saving ? '⏳ Guardando...' : '💾 Guardar puntuación'}
            </button>
          ) : saved ? (
            <div className="text-green-600 font-bold py-2">✅ ¡Puntuación guardada!</div>
          ) : null}
          <button onClick={onPlayAgain}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-bold text-lg shadow-md hover:opacity-90 transition">
            🔄 Jugar de nuevo
          </button>
          <button onClick={() => router.push('/ranking')}
            className="w-full py-3 rounded-2xl border-2 border-purple-300 text-purple-700 font-bold text-lg hover:bg-purple-50 transition">
            🏅 Ver ranking
          </button>
        </div>
      </div>
    </div>
  )
}
