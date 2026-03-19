import type { DeckDefinition, DeckCard } from '@/types/game'

// All cards use emoji — open source, no license needed, works everywhere.
// Each deck has ≥18 unique cards to support all difficulty levels.
const DECKS: DeckDefinition[] = [
  {
    slug: 'animals',
    name: 'Animales',
    icon: '🐶',
    cards: [
      { pairId: 'a1',  emoji: '🐶', label: 'Perro' },
      { pairId: 'a2',  emoji: '🐱', label: 'Gato' },
      { pairId: 'a3',  emoji: '🐭', label: 'Ratón' },
      { pairId: 'a4',  emoji: '🐰', label: 'Conejo' },
      { pairId: 'a5',  emoji: '🦊', label: 'Zorro' },
      { pairId: 'a6',  emoji: '🐻', label: 'Oso' },
      { pairId: 'a7',  emoji: '🐼', label: 'Panda' },
      { pairId: 'a8',  emoji: '🐨', label: 'Koala' },
      { pairId: 'a9',  emoji: '🐯', label: 'Tigre' },
      { pairId: 'a10', emoji: '🦁', label: 'León' },
      { pairId: 'a11', emoji: '🐮', label: 'Vaca' },
      { pairId: 'a12', emoji: '🐷', label: 'Cerdo' },
      { pairId: 'a13', emoji: '🐸', label: 'Rana' },
      { pairId: 'a14', emoji: '🐵', label: 'Mono' },
      { pairId: 'a15', emoji: '🐧', label: 'Pingüino' },
      { pairId: 'a16', emoji: '🦆', label: 'Pato' },
      { pairId: 'a17', emoji: '🦉', label: 'Búho' },
      { pairId: 'a18', emoji: '🦋', label: 'Mariposa' },
    ],
  },
  {
    slug: 'fruits',
    name: 'Frutas',
    icon: '🍎',
    cards: [
      { pairId: 'f1',  emoji: '🍎', label: 'Manzana' },
      { pairId: 'f2',  emoji: '🍊', label: 'Naranja' },
      { pairId: 'f3',  emoji: '🍋', label: 'Limón' },
      { pairId: 'f4',  emoji: '🍇', label: 'Uvas' },
      { pairId: 'f5',  emoji: '🍓', label: 'Fresa' },
      { pairId: 'f6',  emoji: '🍒', label: 'Cereza' },
      { pairId: 'f7',  emoji: '🍑', label: 'Melocotón' },
      { pairId: 'f8',  emoji: '🍍', label: 'Piña' },
      { pairId: 'f9',  emoji: '🥭', label: 'Mango' },
      { pairId: 'f10', emoji: '🍌', label: 'Plátano' },
      { pairId: 'f11', emoji: '🍉', label: 'Sandía' },
      { pairId: 'f12', emoji: '🍈', label: 'Melón' },
      { pairId: 'f13', emoji: '🍐', label: 'Pera' },
      { pairId: 'f14', emoji: '🥝', label: 'Kiwi' },
      { pairId: 'f15', emoji: '🍅', label: 'Tomate' },
      { pairId: 'f16', emoji: '🫐', label: 'Arándano' },
      { pairId: 'f17', emoji: '🥥', label: 'Coco' },
      { pairId: 'f18', emoji: '🍆', label: 'Berenjena' },
    ],
  },
  {
    slug: 'space',
    name: 'Espacio',
    icon: '🚀',
    cards: [
      { pairId: 's1',  emoji: '🚀', label: 'Cohete' },
      { pairId: 's2',  emoji: '🌙', label: 'Luna' },
      { pairId: 's3',  emoji: '⭐', label: 'Estrella' },
      { pairId: 's4',  emoji: '🌍', label: 'Tierra' },
      { pairId: 's5',  emoji: '🪐', label: 'Saturno' },
      { pairId: 's6',  emoji: '☀️', label: 'Sol' },
      { pairId: 's7',  emoji: '🛸', label: 'OVNI' },
      { pairId: 's8',  emoji: '🌠', label: 'Meteoro' },
      { pairId: 's9',  emoji: '🔭', label: 'Telescopio' },
      { pairId: 's10', emoji: '👨‍🚀', label: 'Astronauta' },
      { pairId: 's11', emoji: '🌌', label: 'Galaxia' },
      { pairId: 's12', emoji: '☄️', label: 'Cometa' },
      { pairId: 's13', emoji: '🌑', label: 'Eclipse' },
      { pairId: 's14', emoji: '🛰️', label: 'Satélite' },
      { pairId: 's15', emoji: '🌟', label: 'Supernova' },
      { pairId: 's16', emoji: '💫', label: 'Destello' },
      { pairId: 's17', emoji: '🌏', label: 'Planeta' },
      { pairId: 's18', emoji: '🪨', label: 'Asteroide' },
    ],
  },
  {
    slug: 'dinos',
    name: 'Dinosaurios',
    icon: '🦕',
    cards: [
      { pairId: 'd1',  emoji: '🦕', label: 'Diplodocus' },
      { pairId: 'd2',  emoji: '🦖', label: 'T-Rex' },
      { pairId: 'd3',  emoji: '🐊', label: 'Cocodrilo' },
      { pairId: 'd4',  emoji: '🦎', label: 'Lagarto' },
      { pairId: 'd5',  emoji: '🐢', label: 'Tortuga' },
      { pairId: 'd6',  emoji: '🐍', label: 'Serpiente' },
      { pairId: 'd7',  emoji: '🦴', label: 'Hueso' },
      { pairId: 'd8',  emoji: '🥚', label: 'Huevo' },
      { pairId: 'd9',  emoji: '🌋', label: 'Volcán' },
      { pairId: 'd10', emoji: '🪨', label: 'Roca' },
      { pairId: 'd11', emoji: '🌿', label: 'Hoja' },
      { pairId: 'd12', emoji: '🌴', label: 'Palmera' },
      { pairId: 'd13', emoji: '🦷', label: 'Diente' },
      { pairId: 'd14', emoji: '🐾', label: 'Huella' },
      { pairId: 'd15', emoji: '🦅', label: 'Águila' },
      { pairId: 'd16', emoji: '🏔️', label: 'Montaña' },
      { pairId: 'd17', emoji: '☁️', label: 'Nube' },
      { pairId: 'd18', emoji: '🌊', label: 'Ola' },
    ],
  },
  {
    slug: 'vehicles',
    name: 'Vehículos',
    icon: '🚗',
    cards: [
      { pairId: 'v1',  emoji: '🚗', label: 'Coche' },
      { pairId: 'v2',  emoji: '🚕', label: 'Taxi' },
      { pairId: 'v3',  emoji: '🚌', label: 'Autobús' },
      { pairId: 'v4',  emoji: '🚎', label: 'Trolebús' },
      { pairId: 'v5',  emoji: '🚓', label: 'Policía' },
      { pairId: 'v6',  emoji: '🚑', label: 'Ambulancia' },
      { pairId: 'v7',  emoji: '🚒', label: 'Bomberos' },
      { pairId: 'v8',  emoji: '✈️', label: 'Avión' },
      { pairId: 'v9',  emoji: '🚂', label: 'Tren' },
      { pairId: 'v10', emoji: '🚁', label: 'Helicóptero' },
      { pairId: 'v11', emoji: '⛵', label: 'Velero' },
      { pairId: 'v12', emoji: '🛳️', label: 'Barco' },
      { pairId: 'v13', emoji: '🚲', label: 'Bicicleta' },
      { pairId: 'v14', emoji: '🛵', label: 'Moto' },
      { pairId: 'v15', emoji: '🚜', label: 'Tractor' },
      { pairId: 'v16', emoji: '🏎️', label: 'F1' },
      { pairId: 'v17', emoji: '🚀', label: 'Cohete' },
      { pairId: 'v18', emoji: '🛶', label: 'Canoa' },
    ],
  },
]

export function getDeckBySlug(slug: string): DeckDefinition | undefined {
  return DECKS.find(d => d.slug === slug)
}

export function getAllDecks(): DeckDefinition[] {
  return DECKS
}

export function getDeckCards(slug: string, pairCount: number): DeckCard[] {
  const deck = getDeckBySlug(slug) ?? DECKS[0]
  return deck.cards.slice(0, pairCount)
}
