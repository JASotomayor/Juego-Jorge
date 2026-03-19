'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { collection, query, where, orderBy, startAt, endAt, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS, type UserDoc } from '@/lib/firebase/firestore'
import { getAvatarUrl } from '@/lib/utils'

export function UserSearch() {
  const [q, setQ] = useState('')
  const [results, setResults] = useState<UserDoc[]>([])
  const [loading, setLoading] = useState(false)

  const search = async (value: string) => {
    setQ(value)
    if (value.length < 2) { setResults([]); return }
    setLoading(true)
    try {
      const snap = await getDocs(query(
        collection(db, COLLECTIONS.users),
        orderBy('username'),
        startAt(value.toLowerCase()),
        endAt(value.toLowerCase() + '\uf8ff'),
      ))
      setResults(snap.docs.map(d => d.data() as UserDoc).slice(0, 8))
    } finally { setLoading(false) }
  }

  return (
    <div className="relative">
      <input type="search" value={q} onChange={e => search(e.target.value)}
        placeholder="Buscar jugador por username..."
        className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none font-medium bg-white"
      />
      {loading && <div className="absolute right-4 top-3.5 text-purple-400">⏳</div>}
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-purple-100 shadow-xl z-10 overflow-hidden">
          {results.map(profile => (
            <Link key={profile.uid} href={`/profile/${profile.username}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition border-b border-gray-50 last:border-0"
              onClick={() => { setQ(''); setResults([]) }}>
              <Image src={getAvatarUrl(profile.avatarUrl, profile.username)} alt={profile.username} width={36} height={36} className="rounded-full border-2 border-purple-200" />
              <div>
                <div className="font-bold text-gray-800">{profile.displayName ?? profile.username}</div>
                <div className="text-xs text-gray-400">@{profile.username}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
