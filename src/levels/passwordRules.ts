const MIN_PASSWORD_LENGTH = 8
const REQUIRED_DIGIT_SUM = 15
const SMALLEST_PRIME = 2

const MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
]

export type PasswordRule = {
  id: string
  description: string
  isSatisfied: (password: string, playerName: string) => boolean
}

export type EvaluatedRule = {
  rule: PasswordRule
  isSatisfied: boolean
}

function sumDigits(password: string): number {
  return Array.from(password.matchAll(/\d/g)).reduce((total, [digit]) => total + Number(digit), 0)
}

function isPrime(value: number): boolean {
  if (value < SMALLEST_PRIME) {
    return false
  }
  for (let divisor = SMALLEST_PRIME; divisor * divisor <= value; divisor++) {
    if (value % divisor === 0) {
      return false
    }
  }
  return true
}

export const PASSWORD_RULES: PasswordRule[] = [
  {
    id: 'length',
    description: `Deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`,
    isSatisfied: (password) => password.length >= MIN_PASSWORD_LENGTH,
  },
  {
    id: 'uppercase',
    description: 'Deve ter uma letra maiúscula.',
    isSatisfied: (password) => /\p{Lu}/u.test(password),
  },
  {
    id: 'digit',
    description: 'Deve ter um número.',
    isSatisfied: (password) => /\d/.test(password),
  },
  {
    id: 'special',
    description: 'Deve ter um caractere especial.',
    isSatisfied: (password) => /[^\p{L}\p{N}]/u.test(password),
  },
  {
    id: 'digit-sum',
    description: `Os números da senha devem somar ${REQUIRED_DIGIT_SUM}.`,
    isSatisfied: (password) => sumDigits(password) === REQUIRED_DIGIT_SUM,
  },
  {
    id: 'month',
    description: 'Deve conter um mês do ano, em português.',
    isSatisfied: (password) => MONTHS.some((month) => password.toLowerCase().includes(month)),
  },
  {
    id: 'no-name',
    description: 'Não pode conter o seu nome. Que falta de criatividade.',
    isSatisfied: (password, playerName) =>
      playerName.trim() === '' || !password.toLowerCase().includes(playerName.trim().toLowerCase()),
  },
  {
    id: 'prime-length',
    description: 'O tamanho total da senha deve ser um número primo.',
    isSatisfied: (password) => isPrime(password.length),
  },
]

export function countRulesToReveal(password: string, playerName: string): number {
  const firstFailingIndex = PASSWORD_RULES.findIndex((rule) => !rule.isSatisfied(password, playerName))
  return firstFailingIndex === -1 ? PASSWORD_RULES.length : firstFailingIndex + 1
}

export function evaluateRules(password: string, playerName: string, revealedCount: number): EvaluatedRule[] {
  return PASSWORD_RULES.slice(0, revealedCount).map((rule) => ({
    rule,
    isSatisfied: rule.isSatisfied(password, playerName),
  }))
}

export function isPasswordValid(password: string, playerName: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.isSatisfied(password, playerName))
}
