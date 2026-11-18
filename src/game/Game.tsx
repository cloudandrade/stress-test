import { useEffect, useReducer, useState } from 'react'
import { ScoreBoard, type ScoreBoardCorner } from '../score/ScoreBoard'
import { initialScoreState, scoreReducer } from '../score/scoreReducer'
import { LEVELS } from './levels'
import { SiteHeader } from './SiteHeader'
import { SupportChat } from './SupportChat'

const SCOREBOARD_CORNERS: ScoreBoardCorner[] = ['top-right', 'bottom-left', 'top-left', 'bottom-right']
const LEVELS_AHEAD_SHOWN = 1
const SUPPORT_CHAT_DELAY_MS = 7000

export function Game() {
  const [score, dispatch] = useReducer(scoreReducer, initialScoreState)
  const [levelIndex, setLevelIndex] = useState(0)
  const [playerName, setPlayerName] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsChatOpen(true), SUPPORT_CHAT_DELAY_MS)
    return () => clearTimeout(timeoutId)
  }, [levelIndex])

  const level = LEVELS[levelIndex]
  const isLastLevel = levelIndex === LEVELS.length - 1
  const levelNumber = levelIndex + 1
  const advertisedTotal = Math.min(levelNumber + LEVELS_AHEAD_SHOWN, LEVELS.length)
  const corner = SCOREBOARD_CORNERS[levelIndex % SCOREBOARD_CORNERS.length]

  const goToLevel = (nextLevelIndex: number) => {
    setIsChatOpen(false)
    setLevelIndex(nextLevelIndex)
  }

  const restart = () => {
    dispatch({ type: 'reset' })
    setPlayerName('')
    goToLevel(0)
  }

  const handleComplete = () => {
    if (isLastLevel) {
      restart()
      return
    }
    dispatch({ type: 'award', points: level.reward, reason: level.title })
    goToLevel(levelIndex + 1)
  }

  const handlePenalty = (reason: string, points: number) => {
    dispatch({ type: 'penalize', points, reason })
  }

  const LevelComponent = level.Component

  return (
    <div className="app">
      <SiteHeader onPenalty={handlePenalty} onHelp={() => setIsChatOpen(true)} />
      <ScoreBoard score={score} corner={corner} />
      <main className="stage">
        <p className="stage-progress">
          Fase {levelNumber} de {advertisedTotal}
        </p>
        <h1 className="stage-title">{level.title}</h1>
        <LevelComponent
          key={level.id}
          playerName={playerName}
          score={score.total}
          onComplete={handleComplete}
          onPenalty={handlePenalty}
          onPlayerNameChange={setPlayerName}
        />
      </main>
      {isChatOpen && <SupportChat onClose={() => setIsChatOpen(false)} onPenalty={handlePenalty} />}
    </div>
  )
}
