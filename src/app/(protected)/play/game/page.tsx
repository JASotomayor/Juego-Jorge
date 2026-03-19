import { GameScreen } from '@/components/game/GameScreen'
import type { Difficulty } from '@/types/game'

interface Props {
  searchParams: Promise<{ difficulty?: string; deck?: string; seed?: string }>
}

export default async function GamePage({ searchParams }: Props) {
  const params = await searchParams
  const difficulty = (params.difficulty ?? 'easy') as Difficulty
  const deck = params.deck ?? 'animals'
  const seed = params.seed

  return <GameScreen difficulty={difficulty} deckSlug={deck} fixedSeed={seed} />
}
