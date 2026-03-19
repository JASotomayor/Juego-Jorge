'use client'

import { useState } from 'react'
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS, type ConnectionDoc } from '@/lib/firebase/firestore'

interface Props {
  currentUserId: string
  targetUserId: string
  initialConnection: ConnectionDoc | null
}

export function ConnectionButton({ currentUserId, targetUserId, initialConnection }: Props) {
  const [connection, setConnection] = useState(initialConnection)
  const [loading, setLoading] = useState(false)

  const isSent     = connection?.requesterId === currentUserId && connection?.status === 'pending'
  const isReceived = connection?.receiverId  === currentUserId && connection?.status === 'pending'
  const isAccepted = connection?.status === 'accepted'

  const handleConnect = async () => {
    setLoading(true)
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.connections), {
        requesterId: currentUserId, receiverId: targetUserId,
        status: 'pending', createdAt: Date.now(),
      })
      setConnection({ id: docRef.id, requesterId: currentUserId, receiverId: targetUserId, status: 'pending', createdAt: Date.now() })
    } finally { setLoading(false) }
  }

  const handleAccept = async () => {
    if (!connection?.id) return
    setLoading(true)
    try {
      await updateDoc(doc(db, COLLECTIONS.connections, connection.id), { status: 'accepted' })
      setConnection(c => c ? { ...c, status: 'accepted' } : c)
    } finally { setLoading(false) }
  }

  if (isAccepted) return <span className="px-4 py-2 rounded-xl bg-green-100 text-green-700 font-bold text-sm">✅ Conectados</span>
  if (isSent)     return <span className="px-4 py-2 rounded-xl bg-gray-100 text-gray-500 font-bold text-sm">⏳ Solicitud enviada</span>
  if (isReceived) return (
    <button onClick={handleAccept} disabled={loading}
      className="px-4 py-2 rounded-xl bg-green-500 text-white font-bold text-sm hover:opacity-90 transition disabled:opacity-50">
      ✅ Aceptar solicitud
    </button>
  )
  return (
    <button onClick={handleConnect} disabled={loading}
      className="px-4 py-2 rounded-xl bg-purple-500 text-white font-bold text-sm hover:opacity-90 transition disabled:opacity-50">
      {loading ? '⏳' : '➕ Conectar'}
    </button>
  )
}
