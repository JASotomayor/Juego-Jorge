'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase/client'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password)
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
        code === 'auth/invalid-credential' ? 'Email o contraseña incorrectos'
        : code === 'auth/too-many-requests' ? 'Demasiados intentos. Espera un momento.'
        : 'Error al iniciar sesión'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-3 text-sm font-medium">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
        <input
          type="email" value={email} onChange={e => setEmail(e.target.value)} required
          placeholder="tu@email.com"
          className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none font-medium text-gray-800 bg-white/80"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña</label>
        <input
          type="password" value={password} onChange={e => setPassword(e.target.value)} required
          placeholder="••••••••"
          className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none font-medium text-gray-800 bg-white/80"
        />
      </div>
      <button type="submit" disabled={loading}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-600 text-white font-black text-lg shadow-md hover:opacity-90 transition disabled:opacity-50">
        {loading ? '⏳ Entrando...' : '🎮 Entrar a jugar'}
      </button>
      <p className="text-center text-sm text-gray-600 font-medium">
        ¿No tienes cuenta?{' '}
        <Link href="/auth/register" className="text-purple-600 font-bold hover:underline">Regístrate gratis</Link>
      </p>
    </form>
  )
}
