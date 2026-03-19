'use client'

import { useEffect, useState } from 'react'
import { collection, query, where, getDocs, getDoc, doc, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { useAuth } from '@/hooks/useAuth'
import { COLLECTIONS, type ChallengeDoc, type UserDoc } from '@/lib/firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'
import { getAvatarUrl, timeAgo } from '@/lib/utils'
import { AcceptChallengeButton } from '@/components/social/AcceptChallengeButton'

interface ChallengeWithProfiles extends ChallengeDoc {
  id: string
  challengerProfile: UserDoc | null
  challengedProfile: UserDoc | null
}

export default function ChallengesPage() {
  const { user, loading } = useAuth()
  const [challenges, setChallenges] = useState<ChallengeWithProfiles[]>([])

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const [sentSnap, receivedSnap] = await Promise.all([
        getDocs(query(collection(db, COLLECTIONS.challenges), where('challengerId', '==', user.uid), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, COLLECTIONS.challenges), where('challengedId', '==', user.uid), orderBy('createdAt', 'desc'))),
      ])

      const allDocs = [...sentSnap.docs, ...receivedSnap.docs].map(d => ({ id: d.id, ...d.data() } as ChallengeDoc & { id: string }))
      const uniqueUids = [...new Set([...allDocs.map(c => c.challengerId), ...allDocs.map(c => c.challengedId)])]

      const profileMap: Record<string, UserDoc> = {}
      await Promise.all(uniqueUids.map(async uid => {
        const s = await getDoc(doc(db, COLLECTIONS.users, uid))
        if (s.exists()) profileMap[uid] = s.data() as UserDoc
      }))

      setChallenges(allDocs.map(c => ({
        ...c,
        challengerProfile: profileMap[c.challengerId] ?? null,
        challengedProfile: profileMap[c.challengedId] ?? null,
      })))
    }
    load()
  }, [user])

  if (loading) return <div className="flex items-center justify-center h-64 text-purple-500 font-bold">⏳ Cargando...</div>

  const pending  = challenges.filter(c => c.challengedId === user?.uid && c.status === 'pending')
  const sent     = challenges.filter(c => c.challengerId === user?.uid)
  const received = challenges.filter(c => c.challengedId === user?.uid && c.status !== 'pending')

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-black text-purple-700 mb-6 text-center">⚔️ Retos</h1>

      {pending.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-black text-gray-800 mb-3">🔔 Pendientes ({pending.length})</h2>
          <div className="space-y-2">
            {pending.map(c => (
              <div key={c.id} className="bg-yellow-50 rounded-2xl border border-yellow-300 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Image src={getAvatarUrl(c.challengerProfile?.avatarUrl ?? null, c.challengerProfile?.username ?? 'user')} alt="" width={40} height={40} className="rounded-full border-2 border-yellow-300" />
                  <div>
                    <p className="font-black text-gray-800">@{c.challengerProfile?.username} te reta</p>
                    <p className="text-xs text-gray-500 capitalize">{c.deckSlug} · {c.difficulty} · {timeAgo(new Date(c.createdAt).toISOString())}</p>
                  </div>
                </div>
                <AcceptChallengeButton challenge={{ id: c.id!, seed: c.seed, difficulty: c.difficulty, deckSlug: c.deckSlug }} />
              </div>
            ))}
          </div>
        </section>
      )}

      {sent.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-black text-gray-800 mb-3">📤 Enviados</h2>
          <ChallengeList items={sent} getOtherProfile={c => c.challengedProfile} />
        </section>
      )}

      {received.length > 0 && (
        <section>
          <h2 className="text-lg font-black text-gray-800 mb-3">📥 Recibidos</h2>
          <ChallengeList items={received} getOtherProfile={c => c.challengerProfile} />
        </section>
      )}

      {challenges.length === 0 && (
        <div className="text-center py-16 text-gray-400 font-bold">
          <div className="text-5xl mb-3">⚔️</div>
          <p>Aún no tienes retos.</p>
          <Link href="/friends" className="mt-4 inline-block px-6 py-3 rounded-2xl bg-purple-500 text-white font-bold">Ver amigos</Link>
        </div>
      )}
    </div>
  )
}

function ChallengeList({ items, getOtherProfile }: { items: ChallengeWithProfiles[]; getOtherProfile: (c: ChallengeWithProfiles) => UserDoc | null }) {
  return (
    <div className="space-y-2">
      {items.map(c => {
        const other = getOtherProfile(c)
        const statusColor = c.status === 'completed' ? 'bg-green-50 border-green-200' : c.status === 'declined' ? 'bg-red-50 border-red-200' : 'bg-white/80 border-purple-100'
        return (
          <div key={c.id} className={`flex items-center justify-between p-3 rounded-2xl border shadow-sm ${statusColor}`}>
            <div className="flex items-center gap-2">
              <Image src={getAvatarUrl(other?.avatarUrl ?? null, other?.username ?? 'user')} alt="" width={36} height={36} className="rounded-full border-2 border-purple-200" />
              <div>
                <div className="font-bold text-sm text-gray-800">@{other?.username}</div>
                <div className="text-xs text-gray-400 capitalize">{c.deckSlug} · {c.difficulty}</div>
              </div>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${c.status === 'completed' ? 'bg-green-100 text-green-700' : c.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
              {c.status === 'completed' ? '✅ Completado' : c.status === 'pending' ? '⏳ Pendiente' : '❌ Rechazado'}
            </span>
          </div>
        )
      })}
    </div>
  )
}
