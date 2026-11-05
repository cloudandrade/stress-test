import { vi } from 'vitest'
import type { LevelProps } from '../game/types'

export function createLevelProps(overrides: Partial<LevelProps> = {}) {
  return {
    playerName: '',
    score: 0,
    onComplete: vi.fn<LevelProps['onComplete']>(),
    onPenalty: vi.fn<LevelProps['onPenalty']>(),
    onPlayerNameChange: vi.fn<LevelProps['onPlayerNameChange']>(),
    ...overrides,
  }
}
