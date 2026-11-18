const DIMINUTIVE_SUFFIX = 'inho'

export function suggestName(name: string): string {
  return `${name.replace(/[aeiou]$/i, '')}${DIMINUTIVE_SUFFIX}`
}
