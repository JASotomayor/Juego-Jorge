'use client'

import { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/hooks/useAuth'
import { COLLECTIONS, type GameSessionDoc } from '@/lib/firebase/firestore'
import { ProfileEditor } from '@/components/profile/ProfileEditor'

export default function MyProfilePage() {
  const { user, profile, loading } = useAuth()
  const [stats, setStats] = useState({ games: 0, bestScore: 0, avgMoves: 0 })

  useEffect(() => {
    if (!user) return
    getDocs(query(collection(db, COLLECTIONS.gameSessions), where('userId', '==', user.uid))).then(snap => {
      const sessions = snap.docs.map(d => d.data() as GameSessionDoc)
      const games = sessions.length
      const bestScore = games > 0 ? Math.max(...sessions.map(s => s.score)) : 0
      const avgMoves = games > 0 ? Math.round(sessions.reduce((s, g) => s + g.moves, 0) / games) : 0
      setStats({ games, bestScore, avgMoves })
    })
  }, [user])

  if (loading) return <div className="flex items-center justify-center h-64 text-purple-500 font-bold">⏳ Cargando...</div>

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-black text-purple-700 mb-6 text-center">👤 Mi Perfil</h1>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Partidas', value: stats.games, icon: '🎮' },
          { label: 'Mejor score', value: stats.bestScore, icon: '🏆' },
          { label: 'Avg mov.', value: stats.avgMoves, icon: '🔄' },
        ].map(stat => (
          <div key={stat.label} className="bg-white/80 rounded-2xl p-3 text-center border border-purple-100 shadow-sm">
            <div className="text-2xl">{stat.icon}</div>
            <div className="font-black text-xl text-purple-700">{stat.value}</div>
            <div className="text-xs text-gray-400 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
      <ProfileEditor profile={profile} userId={user?.uid ?? ''} />
    </div>
  )
}
