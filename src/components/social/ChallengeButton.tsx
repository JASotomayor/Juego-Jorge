'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/hooks/useAuth'
import { COLLECTIONS } from '@/lib/firebase/firestore'
import { generateSeed } from '@/lib/game/shuffle'
import type { Difficulty } from '@/types/game'

const DIFFICULTY_LABELS: Record<Difficulty, string> = { easy: 'Fácil', medium: 'Medio', hard: 'Difícil' }

export function ChallengeButton({ targetUserId, targetUsername }: { targetUserId: string; targetUsername: string }) {
  const router = useRouter()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [loading, setLoading] = useState(false)

  const handleChallenge = async () => {
    if (!user) return
    setLoading(true)
    try {
      const seed = generateSeed()
      await addDoc(collection(db, COLLECTIONS.challenges), {
        challengerId: user.uid, challengedId: targetUserId,
        deckSlug: 'animals', difficulty, seed,
        challengerSessionId: null, challengedSessionId: null,
        status: 'pending', winnerId: null,
        createdAt: Date.now(), expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      })
      setOpen(false)
      router.push(`/play/game?difficulty=${difficulty}&deck=animals&seed=${seed}`)
    } finally { setLoading(false) }
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-xl bg-pink-500 text-white font-bold text-sm hover:opacity-90 transition">
        ⚔️ Retar
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-black text-purple-700 mb-2">⚔️ Retar a @{targetUsername}</h3>
            <p className="text-sm text-gray-500 mb-4">Jugarás primero. Tu rival recibirá el mismo tablero.</p>
            <label className="block text-sm font-bold text-gray-700 mb-2">Dificultad</label>
            <div className="flex gap-2 mb-6">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2 rounded-xl font-bold text-sm border-2 transition ${difficulty === d ? 'bg-purple-500 text-white border-purple-500' : 'border-gray-200 text-gray-600 hover:border-purple-300'}`}>
                  {DIFFICULTY_LABELS[d]}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setOpen(false)} className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold">Cancelar</button>
              <button onClick={handleChallenge} disabled={loading}
                className="flex-1 py-3 rounded-2xl bg-pink-500 text-white font-black hover:opacity-90 transition disabled:opacity-50">
                {loading ? '⏳' : '⚔️ ¡Retar!'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
