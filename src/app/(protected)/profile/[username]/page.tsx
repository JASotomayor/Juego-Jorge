'use client'

import { useEffect, useState } from 'react'
import { collection, query, where, getDocs, getDoc, doc, orderBy, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/hooks/useAuth'
import { COLLECTIONS, type UserDoc, type GameSessionDoc, type ConnectionDoc } from '@/lib/firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAvatarUrl, formatTime } from '@/lib/utils'
import { ConnectionButton } from '@/components/social/ConnectionButton'
import { ChallengeButton } from '@/components/social/ChallengeButton'

interface Props { params: Promise<{ username: string }> }

export default function UserProfilePage({ params }: Props) {
  const { user: currentUser, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<UserDoc | null>(null)
  const [sessions, setSessions] = useState<GameSessionDoc[]>([])
  const [connection, setConnection] = useState<ConnectionDoc | null>(null)
  const [gamesPlayed, setGamesPlayed] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [notFoundState, setNotFoundState] = useState(false)
  const [username, setUsername] = useState('')

  useEffect(() => {
    params.then(p => setUsername(p.username))
  }, [params])

  useEffect(() => {
    if (!username) return
    const load = async () => {
      // Lookup uid from username
      const usernameSnap = await getDoc(doc(db, COLLECTIONS.usernames, username))
      if (!usernameSnap.exists()) { setNotFoundState(true); return }
      const uid = usernameSnap.data().uid

      const [profileSnap, sessionsSnap] = await Promise.all([
        getDoc(doc(db, COLLECTIONS.users, uid)),
        getDocs(query(collection(db, COLLECTIONS.gameSessions), where('userId', '==', uid), orderBy('score', 'desc'), limit(3))),
      ])

      if (!profileSnap.exists()) { setNotFoundState(true); return }
      const p = profileSnap.data() as UserDoc
      setProfile(p)
      const s = sessionsSnap.docs.map(d => d.data() as GameSessionDoc)
      setSessions(s)
      setGamesPlayed(s.length)
      setBestScore(s.length > 0 ? Math.max(...s.map(x => x.score)) : 0)

      if (currentUser && currentUser.uid !== uid) {
        const connSnap = await getDocs(query(
          collection(db, COLLECTIONS.connections),
          where('requesterId', 'in', [currentUser.uid, uid]),
          where('receiverId', 'in', [currentUser.uid, uid])
        ))
        if (!connSnap.empty) setConnection({ id: connSnap.docs[0].id, ...connSnap.docs[0].data() } as ConnectionDoc)
      }
    }
    load()
  }, [username, currentUser])

  if (notFoundState) return notFound()
  if (authLoading || !profile) return <div className="flex items-center justify-center h-64 text-purple-500 font-bold">⏳ Cargando...</div>

  const isOwn = currentUser?.uid === profile.uid
  const avatarUrl = getAvatarUrl(profile.avatarUrl, profile.username)

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="bg-white/80 rounded-3xl p-6 border border-purple-100 shadow-sm text-center mb-4">
        <Image src={avatarUrl} alt={profile.username} width={80} height={80} className="rounded-full border-4 border-purple-300 mx-auto mb-3" />
        <h1 className="text-2xl font-black text-purple-700">{profile.displayName ?? profile.username}</h1>
        <p className="text-gray-500 font-medium">@{profile.username}</p>
        {profile.country && <p className="text-sm text-gray-400 mt-1">📍 {profile.country}</p>}
        {profile.bio && <p className="text-gray-600 text-sm mt-2 font-medium">{profile.bio}</p>}
        {!isOwn && currentUser && (
          <div className="flex gap-2 justify-center mt-4">
            <ConnectionButton currentUserId={currentUser.uid} targetUserId={profile.uid} initialConnection={connection} />
            <ChallengeButton targetUserId={profile.uid} targetUsername={profile.username} />
          </div>
        )}
        {isOwn && (
          <Link href="/profile" className="mt-4 inline-block px-4 py-2 rounded-xl border-2 border-purple-300 text-purple-700 font-bold text-sm hover:bg-purple-50 transition">
            ✏️ Editar perfil
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/80 rounded-2xl p-4 border border-purple-100 shadow-sm text-center">
          <div className="text-3xl font-black text-purple-700">{gamesPlayed}</div>
          <div className="text-sm text-gray-500 font-medium">Partidas jugadas</div>
        </div>
        <div className="bg-white/80 rounded-2xl p-4 border border-purple-100 shadow-sm text-center">
          <div className="text-3xl font-black text-purple-700">{bestScore}</div>
          <div className="text-sm text-gray-500 font-medium">Mejor puntuación</div>
        </div>
      </div>
      {sessions.length > 0 && (
        <div className="bg-white/80 rounded-2xl p-4 border border-purple-100 shadow-sm">
          <h2 className="font-black text-gray-800 mb-3">🏆 Mejores partidas</h2>
          {sessions.map((s, i) => (
            <div key={i} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="text-sm"><span className="font-bold capitalize text-gray-700">{s.deckSlug}</span><span className="ml-2 text-xs text-gray-400 capitalize">{s.difficulty}</span></div>
              <div><span className="font-black text-purple-700">{s.score} pts</span><span className="text-xs text-gray-400 ml-2">{formatTime(s.timeSeconds)}</span></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
