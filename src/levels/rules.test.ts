import { describe, expect, it } from 'vitest'
import { misspellName, rankFor } from './certificate'
import { MAX_RESETS, RESET_PROGRESS, STUCK_PROGRESS, initialLoadingState, loadingReducer } from './loadingReducer'
import { PASSWORD_RULES, countRulesToReveal, evaluateRules, isPasswordValid } from './passwordRules'
import { PHONE_MAX, PHONE_MIN, formatPhone, isMobilePhone, randomPhone } from './phone'

const VALID_PASSWORD = 'Maio#96!xyz'

describe('passwordRules', () => {
  it('should reveal only the first rule for an empty password', () => {
    expect(countRulesToReveal('', '')).toBe(1)
  })

  it('should reject a password containing the player name', () => {
    expect(isPasswordValid('Maio#96!jan', 'Jan')).toBe(false)
  })

  it('should reject a password whose length is not prime', () => {
    expect(isPasswordValid('Maio#96!xy', '')).toBe(false)
  })

  it('should reject digits that do not sum to fifteen', () => {
    expect(isPasswordValid('Maio#95!xyz', '')).toBe(false)
  })

  it('should accept a password that satisfies every rule', () => {
    expect(isPasswordValid(VALID_PASSWORD, 'Jan')).toBe(true)
    expect(countRulesToReveal(VALID_PASSWORD, 'Jan')).toBe(PASSWORD_RULES.length)
  })

  it('should evaluate only revealed rules', () => {
    const evaluated = evaluateRules('abc', '', 2)

    expect(evaluated.map(({ isSatisfied }) => isSatisfied)).toEqual([false, false])
  })
})

describe('phone', () => {
  it('should format eleven digits as a Brazilian mobile number', () => {
    expect(formatPhone(11987654321)).toBe('(11) 98765-4321')
  })

  it('should detect mobile numbers by the digit after the area code', () => {
    expect(isMobilePhone(11987654321)).toBe(true)
    expect(isMobilePhone(PHONE_MIN)).toBe(false)
  })

  it('should keep random numbers inside the slider range', () => {
    expect(randomPhone(() => 0)).toBe(PHONE_MIN)
    expect(randomPhone(() => 0.9999999999999)).toBeLessThanOrEqual(PHONE_MAX)
  })
})

describe('loadingReducer', () => {
  it('should reset progress the first time it reaches the end', () => {
    const almostDone = { ...initialLoadingState, progress: STUCK_PROGRESS - 1 }

    expect(loadingReducer(almostDone, { type: 'tick' })).toEqual({
      progress: RESET_PROGRESS,
      resetCount: 1,
      phase: 'loading',
    })
  })

  it('should get stuck after the allowed resets', () => {
    const almostDone = { progress: STUCK_PROGRESS - 1, resetCount: MAX_RESETS, phase: 'loading' as const }
    const stuck = loadingReducer(almostDone, { type: 'tick' })

    expect(stuck.phase).toBe('stuck')
    expect(loadingReducer(stuck, { type: 'tick' })).toBe(stuck)
  })

  it('should restart from scratch', () => {
    const stuck = { progress: STUCK_PROGRESS, resetCount: MAX_RESETS, phase: 'stuck' as const }

    expect(loadingReducer(stuck, { type: 'restart' })).toEqual(initialLoadingState)
  })
})

describe('certificate', () => {
  it('should misspell the name by reversing it', () => {
    expect(misspellName('Jan')).toBe('naJ')
  })

  it('should rank by score', () => {
    expect(rankFor(-1)).toBe('Vítima Oficial do Design')
    expect(rankFor(50)).toBe('Sobrevivente da Interface')
    expect(rankFor(100)).toBe('Mestre Zen da UX Hostil')
  })
})
