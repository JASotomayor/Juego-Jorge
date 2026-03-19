'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/firebase/firestore'

export function RegisterForm() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (username.length < 3) { setError('Username: mínimo 3 caracteres'); return }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) { setError('Solo letras, números y _ (sin espacios)'); return }

    setLoading(true)
    try {
      // Check username availability
      const usernameSnap = await getDoc(doc(db, COLLECTIONS.usernames, username.toLowerCase()))
      if (usernameSnap.exists()) { setError('Ese username ya está en uso'); setLoading(false); return }

      // Create Firebase Auth user
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      const uid = credential.user.uid
      const now = Date.now()

      // Save profile
      await setDoc(doc(db, COLLECTIONS.users, uid), {
        uid,
        username: username.toLowerCase(),
        displayName: username,
        avatarUrl: null,
        bio: '',
        country: '',
        createdAt: now,
      })

      // Reserve username
      await setDoc(doc(db, COLLECTIONS.usernames, username.toLowerCase()), { uid })

      // Set session cookie
      const idToken = await credential.user.getIdToken()
      await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      })

      router.push('/dashboard')
    } catch (err: unknown) {
      const code = (err as { code?: string }).code
      setError(
        code === 'auth/email-already-in-use' ? 'Ese email ya tiene una cuenta'
        : code === 'auth/weak-password' ? 'La contraseña debe tener al menos 6 caracteres'
        : 'Error al crear la cuenta'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-3 text-sm font-medium">{error}</div>
      )}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Nombre de usuario</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value.toLowerCase())} required maxLength={30}
          placeholder="jugador123"
          className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none font-medium text-gray-800 bg-white/80"
        />
        <p className="text-xs text-gray-400 mt-1 font-medium">Solo letras, números y _ (sin espacios)</p>
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
          placeholder="tu@email.com"
          className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none font-medium text-gray-800 bg-white/80"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none font-medium text-gray-800 bg-white/80"
        />
      </div>
      <button type="submit" disabled={loading}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-lg shadow-md hover:opacity-90 transition disabled:opacity-50">
        {loading ? '⏳ Creando cuenta...' : '🚀 ¡Crear cuenta gratis!'}
      </button>
      <p className="text-center text-sm text-gray-600 font-medium">
        ¿Ya tienes cuenta?{' '}
        <Link href="/auth/login" className="text-purple-600 font-bold hover:underline">Inicia sesión</Link>
      </p>
    </form>
  )
}
