export type Difficulty = 'easy' | 'medium' | 'hard'
export type ConnectionStatus = 'pending' | 'accepted' | 'blocked'
export type ChallengeStatus = 'pending' | 'accepted' | 'completed' | 'declined'

export interface Profile {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  country: string | null
  created_at: string
  updated_at: string
}

export interface Deck {
  id: string
  slug: string
  name: string
  emoji: string | null
  is_active: boolean
  created_at: string
}

export interface GameSession {
  id: string
  user_id: string
  deck_slug: string
  difficulty: Difficulty
  moves: number
  time_seconds: number
  score: number
  completed: boolean
  seed: string | null
  played_at: string
}

export interface Connection {
  id: string
  requester_id: string
  receiver_id: string
  status: ConnectionStatus
  created_at: string
}

export interface Challenge {
  id: string
  challenger_id: string
  challenged_id: string
  deck_slug: string
  difficulty: Difficulty
  seed: string
  challenger_session_id: string | null
  challenged_session_id: string | null
  status: ChallengeStatus
  winner_id: string | null
  created_at: string
  expires_at: string
}

export interface RankingEntry {
  id: string
  user_id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  score: number
  moves: number
  time_seconds: number
  difficulty: Difficulty
  deck_slug: string
  played_at: string
  rank: number
}
