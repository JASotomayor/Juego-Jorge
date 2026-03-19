'use client'

import { useRouter } from 'next/navigation'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'
import { COLLECTIONS } from '@/lib/firebase/firestore'

interface Props {
  challenge: { id: string; seed: string; difficulty: string; deckSlug: string }
}

export function AcceptChallengeButton({ challenge }: Props) {
  const router = useRouter()

  const accept = async () => {
    await updateDoc(doc(db, COLLECTIONS.challenges, challenge.id), { status: 'accepted' })
    router.push(`/play/game?difficulty=${challenge.difficulty}&deck=${challenge.deckSlug}&seed=${challenge.seed}`)
  }

  const decline = async () => {
    await updateDoc(doc(db, COLLECTIONS.challenges, challenge.id), { status: 'declined' })
    router.refresh()
  }

  return (
    <div className="flex gap-2">
      <button onClick={accept} className="flex-1 py-2 rounded-xl bg-green-500 text-white font-black text-sm hover:opacity-90 transition">⚔️ ¡Aceptar reto!</button>
      <button onClick={decline} className="px-4 py-2 rounded-xl border-2 border-red-200 text-red-500 font-bold text-sm hover:bg-red-50 transition">Rechazar</button>
    </div>
  )
}
