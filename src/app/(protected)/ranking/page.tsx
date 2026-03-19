'use client'

import { useEffect, useState } from 'react'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS, type GameSessionDoc, type UserDoc } from '@/lib/firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'
import { getAvatarUrl, formatTime } from '@/lib/utils'

interface RankEntry extends GameSessionDoc {
  id: string
  profile: UserDoc | null
}

export default function RankingPage() {
  const [entries, setEntries] = useState<RankEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(query(
        collection(db, COLLECTIONS.gameSessions),
        orderBy('score', 'desc'),
        limit(50)
      ))

      const sessions = snap.docs.map(d => ({ id: d.id, ...d.data() } as GameSessionDoc & { id: string })
      )

      // Fetch profiles for each unique userId
      const userIds = [...new Set(sessions.map(s => s.userId))]
      const profileMap: Record<string, UserDoc> = {}
      await Promise.all(userIds.map(async uid => {
        const { getDoc, doc } = await import('firebase/firestore')
        const snap = await getDoc(doc(db, COLLECTIONS.users, uid))
        if (snap.exists()) profileMap[uid] = snap.data() as UserDoc
      }))

      setEntries(sessions.map(s => ({ ...s, profile: profileMap[s.userId] ?? null })))
      setLoading(false)
    }
    load()
  }, [])

  const medals = ['🥇', '🥈', '🥉']

  if (loading) return <div className="flex items-center justify-center h-64 text-purple-500 font-bold">⏳ Cargando ranking...</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-black text-purple-700 mb-6 text-center">🏆 Ranking Global</h1>

      {entries.length === 0 ? (
        <div className="text-center py-16 text-gray-400 font-bold">
          <div className="text-5xl mb-3">🎮</div>
          <p>Aún no hay partidas. ¡Sé el primero!</p>
          <Link href="/play" className="mt-4 inline-block px-6 py-3 rounded-2xl bg-purple-500 text-white font-bold">Jugar ahora</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, i) => {
            const avatarUrl = getAvatarUrl(entry.profile?.avatarUrl ?? null, entry.profile?.username ?? 'user')
            return (
              <div key={entry.id}
                className={`flex items-center gap-3 p-4 rounded-2xl border shadow-sm
                  ${i === 0 ? 'bg-yellow-50 border-yellow-300' : i === 1 ? 'bg-gray-50 border-gray-300' : i === 2 ? 'bg-amber-50 border-amber-300' : 'bg-white/80 border-purple-100'}`}>
                <div className="w-8 text-center font-black text-lg">{medals[i] ?? `${i + 1}`}</div>
                <Image src={avatarUrl} alt="" width={40} height={40} className="rounded-full border-2 border-purple-200" />
                <div className="flex-1 min-w-0">
                  <Link href={`/profile/${entry.profile?.username}`} className="font-black text-gray-800 hover:text-purple-600 truncate block">
                    {entry.profile?.displayName ?? entry.profile?.username ?? 'Jugador'}
                  </Link>
                  <div className="text-xs text-gray-400 capitalize">{entry.deckSlug} · {entry.difficulty}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-purple-700 text-lg">{entry.score}</div>
                  <div className="text-xs text-gray-400">{formatTime(entry.timeSeconds)} · {entry.moves} mov</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
