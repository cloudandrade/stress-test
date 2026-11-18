import type { ComponentType } from 'react'

export type LevelProps = {
  playerName: string
  score: number
  onComplete: () => void
  onPenalty: (reason: string, points: number) => void
  onPlayerNameChange: (name: string) => void
}

export type LevelVariant = {
  title: string
  Component: ComponentType<LevelProps>
}

export type Level = LevelVariant & {
  id: string
  reward: number
  mobileVariant?: LevelVariant
}
