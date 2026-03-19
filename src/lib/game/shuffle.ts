// Seeded PRNG (mulberry32) — deterministic shuffle for challenges
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seedToNumber(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (Math.imul(31, hash) + seed.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

export function shuffleWithSeed<T>(array: T[], seed: string): T[] {
  const arr = [...array]
  const rand = mulberry32(seedToNumber(seed))
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function generateSeed(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
