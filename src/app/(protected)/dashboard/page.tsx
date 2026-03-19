'use client'

import { useEffect, useState } from 'react'
import { collection, query, where, orderBy, limit, getDocs, getDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/hooks/useAuth'
import { COLLECTIONS, type GameSessionDoc } from '@/lib/firebase/firestore'
import Link from 'next/link'
import Image from 'next/image'
import { getAvatarUrl, formatTime } from '@/lib/utils'

export default function DashboardPage() {
  const { user, profile, loading } = useAuth()
  const [recentSessions, setRecentSessions] = useState<GameSessionDoc[]>([])
  const [bestScore, setBestScore] = useState(0)
  const [pendingChallenges, setPendingChallenges] = useState(0)

  useEffect(() => {
    if (!user) return
    const uid = user.uid

    const load = async () => {
      const [sessionsSnap, pendingSnap] = await Promise.all([
        getDocs(query(
          collection(db, COLLECTIONS.gameSessions),
          where('userId', '==', uid),
          orderBy('playedAt', 'desc'),
          limit(3)
        )),
        getDocs(query(
          collection(db, COLLECTIONS.challenges),
          where('challengedId', '==', uid),
          where('status', '==', 'pending')
        )),
      ])

      const sessions = sessionsSnap.docs.map(d => ({ id: d.id, ...d.data() } as GameSessionDoc))
      setRecentSessions(sessions)
      setBestScore(Math.max(0, ...sessions.map(s => s.score)))
      setPendingChallenges(pendingSnap.size)
    }
    load()
  }, [user])

  if (loading) return <div className="flex items-center justify-center h-64 text-purple-500 font-bold">⏳ Cargando...</div>

  const displayName = profile?.displayName ?? profile?.username ?? 'Jugador'
  const avatarUrl = getAvatarUrl(profile?.avatarUrl ?? null, profile?.username ?? 'user')

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4 bg-white/80 rounded-3xl p-5 shadow-sm border border-purple-100">
        <Image src={avatarUrl} alt="Avatar" width={64} height={64} className="rounded-full border-2 border-purple-300" />
        <div>
          <h1 className="text-2xl font-black text-purple-700">¡Hola, {displayName}! 👋</h1>
          <p className="text-gray-500 font-medium text-sm">Mejor puntuación: <span className="text-purple-600 font-bold">{bestScore} pts</span></p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { href: '/play',       icon: '🎮', label: 'Jugar ahora',  gradient: 'from-purple-500 to-violet-600' },
          { href: '/challenges', icon: '⚔️',  label: 'Retos',       gradient: 'from-pink-500 to-rose-500',    badge: pendingChallenges },
          { href: '/ranking',    icon: '🏆', label: 'Ranking',      gradient: 'from-yellow-400 to-amber-500' },
          { href: '/friends',    icon: '👫', label: 'Amigos',       gradient: 'from-emerald-500 to-green-600' },
        ].map(item => (
          <Link key={item.href} href={item.href}
            className={`relative flex flex-col items-center gap-2 p-5 bg-gradient-to-br ${item.gradient} rounded-3xl shadow-md text-white font-black text-lg hover:scale-105 transition-transform`}>
            <span className="text-4xl">{item.icon}</span>
            {item.label}
            {!!item.badge && (
              <span className="absolute top-3 right-3 bg-yellow-400 text-gray-900 rounded-full text-xs font-black w-6 h-6 flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      {recentSessions.length > 0 && (
        <div className="bg-white/80 rounded-3xl p-5 shadow-sm border border-purple-100">
          <h2 className="text-lg font-black text-gray-800 mb-3">🕐 Partidas recientes</h2>
          <div className="space-y-2">
            {recentSessions.map(session => (
              <div key={session.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <span className="font-bold text-sm text-gray-700 capitalize">{session.deckSlug}</span>
                  <span className="ml-2 text-xs text-gray-400 capitalize">{session.difficulty}</span>
                </div>
                <div className="text-right">
                  <div className="font-black text-purple-600">{session.score} pts</div>
                  <div className="text-xs text-gray-400">{formatTime(session.timeSeconds)} · {session.moves} mov</div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/history" className="block text-center text-sm text-purple-600 font-bold mt-3 hover:underline">
            Ver todo el historial →
          </Link>
        </div>
      )}
    </div>
  )
}
