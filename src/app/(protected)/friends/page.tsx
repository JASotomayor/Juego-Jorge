'use client'

import { useEffect, useState } from 'react'
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/hooks/useAuth'
import { COLLECTIONS, type UserDoc, type ConnectionDoc } from '@/lib/firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'
import { getAvatarUrl } from '@/lib/utils'
import { UserSearch } from '@/components/social/UserSearch'

export default function FriendsPage() {
  const { user, loading } = useAuth()
  const [friends, setFriends] = useState<UserDoc[]>([])

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const [sentSnap, receivedSnap] = await Promise.all([
        getDocs(query(collection(db, COLLECTIONS.connections), where('requesterId', '==', user.uid), where('status', '==', 'accepted'))),
        getDocs(query(collection(db, COLLECTIONS.connections), where('receiverId', '==', user.uid), where('status', '==', 'accepted'))),
      ])

      const friendUids = [
        ...sentSnap.docs.map(d => (d.data() as ConnectionDoc).receiverId),
        ...receivedSnap.docs.map(d => (d.data() as ConnectionDoc).requesterId),
      ]

      const profiles = await Promise.all(
        friendUids.map(uid => getDoc(doc(db, COLLECTIONS.users, uid)).then(s => s.exists() ? s.data() as UserDoc : null))
      )
      setFriends(profiles.filter(Boolean) as UserDoc[])
    }
    load()
  }, [user])

  if (loading) return <div className="flex items-center justify-center h-64 text-purple-500 font-bold">⏳ Cargando...</div>

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-black text-purple-700 mb-6 text-center">👫 Amigos</h1>
      <div className="mb-6 relative"><UserSearch /></div>
      {friends.length === 0 ? (
        <div className="text-center py-12 text-gray-400 font-bold">
          <div className="text-5xl mb-3">👻</div>
          <p>Aún no tienes amigos conectados.</p>
          <p className="text-sm mt-1">Busca jugadores arriba para conectar.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {friends.map(friend => (
            <Link key={friend.uid} href={`/profile/${friend.username}`}
              className="flex items-center gap-3 p-4 bg-white/80 rounded-2xl border border-purple-100 shadow-sm hover:bg-purple-50 transition">
              <Image src={getAvatarUrl(friend.avatarUrl, friend.username)} alt={friend.username} width={48} height={48} className="rounded-full border-2 border-purple-200" />
              <div className="flex-1">
                <div className="font-black text-gray-800">{friend.displayName ?? friend.username}</div>
                <div className="text-sm text-gray-400">@{friend.username}</div>
              </div>
              <span className="text-purple-400 font-bold">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
