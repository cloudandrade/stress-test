import type { ComponentType } from 'react'

export type LevelProps = {
  playerName: string
  score: number
  onComplete: () => void
  onPenalty: (reason: string, points: number) => void
  onPlayerNameChange: (name: string) => void
}

export type Level = {
  id: string
  title: string
  reward: number
  Component: ComponentType<LevelProps>
}
