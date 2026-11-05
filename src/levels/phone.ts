export const PHONE_MIN = 10_000_000_000
export const PHONE_MAX = 99_999_999_999

const PHONE_DIGITS = 11
const AREA_CODE_END = 2
const PREFIX_END = 7
const MOBILE_PREFIX_INDEX = 2
const MOBILE_PREFIX_DIGIT = '9'

function toDigits(value: number): string {
  return String(value).padStart(PHONE_DIGITS, '0')
}

export function formatPhone(value: number): string {
  const digits = toDigits(value)
  return `(${digits.slice(0, AREA_CODE_END)}) ${digits.slice(AREA_CODE_END, PREFIX_END)}-${digits.slice(PREFIX_END)}`
}

export function isMobilePhone(value: number): boolean {
  return toDigits(value)[MOBILE_PREFIX_INDEX] === MOBILE_PREFIX_DIGIT
}

export function randomPhone(random: () => number = Math.random): number {
  return PHONE_MIN + Math.floor(random() * (PHONE_MAX - PHONE_MIN + 1))
}
