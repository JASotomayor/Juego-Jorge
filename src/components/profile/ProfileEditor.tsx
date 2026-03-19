'use client'

import { useState } from 'react'
import Image from 'next/image'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS, type UserDoc } from '@/lib/firebase/firestore'
import { getAvatarUrl } from '@/lib/utils'

interface Props {
  profile: UserDoc | null
  userId: string
}

export function ProfileEditor({ profile, userId }: Props) {
  const [displayName, setDisplayName] = useState(profile?.displayName ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [country, setCountry] = useState(profile?.country ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const avatarUrl = getAvatarUrl(profile?.avatarUrl ?? null, profile?.username ?? 'user')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await updateDoc(doc(db, COLLECTIONS.users, userId), { displayName, bio, country })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Error al guardar. Intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="bg-white/80 rounded-3xl p-6 border border-purple-100 shadow-sm space-y-4">
      <div className="flex flex-col items-center gap-2">
        <Image src={avatarUrl} alt="Avatar" width={80} height={80} className="rounded-full border-4 border-purple-300" />
        <span className="font-black text-lg text-purple-700">@{profile?.username}</span>
      </div>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">{error}</div>}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Nombre para mostrar</label>
        <input value={displayName} onChange={e => setDisplayName(e.target.value)} maxLength={50}
          className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none font-medium bg-white"
          placeholder="Tu nombre visible" />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Biografía</label>
        <textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={160} rows={3}
          className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none font-medium bg-white resize-none"
          placeholder="Cuéntanos algo sobre ti..." />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">País / Ciudad (opcional)</label>
        <input value={country} onChange={e => setCountry(e.target.value)} maxLength={50}
          className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none font-medium bg-white"
          placeholder="España, México, Argentina..." />
      </div>
      <button type="submit" disabled={saving}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-600 text-white font-black text-lg shadow-md hover:opacity-90 transition disabled:opacity-50">
        {saving ? '⏳ Guardando...' : saved ? '✅ ¡Guardado!' : '💾 Guardar cambios'}
      </button>
    </form>
  )
}
