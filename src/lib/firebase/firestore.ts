// Firestore collection names and typed helpers
export const COLLECTIONS = {
  users:        'users',
  usernames:    'usernames',   // username → uid lookup
  gameSessions: 'game_sessions',
  connections:  'connections',
  challenges:   'challenges',
} as const

// ---- Types -------------------------------------------------------

export interface UserDoc {
  uid: string
  username: string
  displayName: string
  avatarUrl: string | null
  bio: string
  country: string
  createdAt: number  // ms timestamp
}

export interface GameSessionDoc {
  id?: string
  userId: string
  deckSlug: string
  difficulty: 'easy' | 'medium' | 'hard'
  moves: number
  timeSeconds: number
  score: number
  completed: boolean
  seed: string
  playedAt: number
}

export interface ConnectionDoc {
  id?: string
  requesterId: string
  receiverId: string
  status: 'pending' | 'accepted' | 'blocked'
  createdAt: number
}

export interface ChallengeDoc {
  id?: string
  challengerId: string
  challengedId: string
  deckSlug: string
  difficulty: 'easy' | 'medium' | 'hard'
  seed: string
  challengerSessionId: string | null
  challengedSessionId: string | null
  status: 'pending' | 'accepted' | 'completed' | 'declined'
  winnerId: string | null
  createdAt: number
  expiresAt: number
}
