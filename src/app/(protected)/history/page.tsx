'use client'

import { useEffect, useState } from 'react'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/hooks/useAuth'
import { COLLECTIONS, type GameSessionDoc } from '@/lib/firebase/firestore'
import { formatTime, timeAgo } from '@/lib/utils'

export default function HistoryPage() {
  const { user, loading } = useAuth()
  const [sessions, setSessions] = useState<(GameSessionDoc & { id: string })[]>([])

  useEffect(() => {
    if (!user) return
    getDocs(query(
      collection(db, COLLECTIONS.gameSessions),
      where('userId', '==', user.uid),
      orderBy('playedAt', 'desc'),
      limit(50)
    )).then(snap => setSessions(snap.docs.map(d => ({ id: d.id, ...d.data() } as GameSessionDoc & { id: string }))))
  }, [user])

  if (loading) return <div className="flex items-center justify-center h-64 text-purple-500 font-bold">⏳ Cargando...</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-black text-purple-700 mb-6 text-center">📋 Historial</h1>
      {sessions.length === 0 ? (
        <div className="text-center py-16 text-gray-400 font-bold">
          <div className="text-5xl mb-3">🎮</div>
          <p>Aún no has jugado ninguna partida.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sessions.map(session => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-white/80 rounded-2xl border border-purple-100 shadow-sm">
              <div>
                <div className="font-bold text-gray-800 capitalize">
                  {session.deckSlug}
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-bold bg-purple-100 text-purple-600 capitalize">{session.difficulty}</span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {formatTime(session.timeSeconds)} · {session.moves} movimientos · {timeAgo(new Date(session.playedAt).toISOString())}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-purple-700">{session.score}</div>
                <div className="text-xs text-gray-400">pts</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
