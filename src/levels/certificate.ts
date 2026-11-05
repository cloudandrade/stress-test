const SURVIVOR_THRESHOLD = 0
const ZEN_MASTER_THRESHOLD = 100

export function misspellName(name: string): string {
  return Array.from(name).reverse().join('')
}

export function rankFor(score: number): string {
  if (score < SURVIVOR_THRESHOLD) {
    return 'Vítima Oficial do Design'
  }
  if (score < ZEN_MASTER_THRESHOLD) {
    return 'Sobrevivente da Interface'
  }
  return 'Mestre Zen da UX Hostil'
}
