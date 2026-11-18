export const LOCAL_NUMBER_MIN = 100_000_000
export const LOCAL_NUMBER_MAX = 999_999_999

const FIRST_AREA_CODE = 11
const LAST_AREA_CODE = 99
const DECIMAL_BASE = 10
const FIRST_TWO_DIGIT_TENS = 2
const PREFIX_LENGTH = 5
const MOBILE_PREFIX_DIGIT = '9'

const UNITS = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove']
const TEENS = ['onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove']
const TENS = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa']

export type AreaCodeOption = {
  code: number
  label: string
}

export function spellAreaCode(code: number): string {
  const tens = Math.floor(code / DECIMAL_BASE)
  const units = code % DECIMAL_BASE
  if (tens < FIRST_TWO_DIGIT_TENS) {
    return TEENS[code - FIRST_AREA_CODE]
  }
  return units === 0 ? TENS[tens] : `${TENS[tens]} e ${UNITS[units]}`
}

function buildAreaCodeOptions(): AreaCodeOption[] {
  const options: AreaCodeOption[] = []
  for (let code = FIRST_AREA_CODE; code <= LAST_AREA_CODE; code++) {
    if (code % DECIMAL_BASE !== 0) {
      options.push({ code, label: spellAreaCode(code) })
    }
  }
  return options.sort((first, second) => first.label.localeCompare(second.label, 'pt-BR'))
}

export const AREA_CODE_OPTIONS = buildAreaCodeOptions()

export function formatLocalNumber(value: number): string {
  const digits = String(value)
  return `${digits.slice(0, PREFIX_LENGTH)}-${digits.slice(PREFIX_LENGTH)}`
}

export function isMobileNumber(value: number): boolean {
  return String(value).startsWith(MOBILE_PREFIX_DIGIT)
}

export function randomLocalNumber(random: () => number = Math.random): number {
  return LOCAL_NUMBER_MIN + Math.floor(random() * (LOCAL_NUMBER_MAX - LOCAL_NUMBER_MIN + 1))
}
