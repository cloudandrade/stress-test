import { useReducer, useState } from 'react'
import { ScoreBoard, type ScoreBoardCorner } from '../score/ScoreBoard'
import { initialScoreState, scoreReducer } from '../score/scoreReducer'
import { LEVELS } from './levels'

const SCOREBOARD_CORNERS: ScoreBoardCorner[] = ['top-right', 'bottom-left', 'top-left', 'bottom-right']
const LEVELS_AHEAD_SHOWN = 1

export function Game() {
  const [score, dispatch] = useReducer(scoreReducer, initialScoreState)
  const [levelIndex, setLevelIndex] = useState(0)
  const [playerName, setPlayerName] = useState('')

  const level = LEVELS[levelIndex]
  const isLastLevel = levelIndex === LEVELS.length - 1
  const levelNumber = levelIndex + 1
  const advertisedTotal = Math.min(levelNumber + LEVELS_AHEAD_SHOWN, LEVELS.length)
  const corner = SCOREBOARD_CORNERS[levelIndex % SCOREBOARD_CORNERS.length]

  const restart = () => {
    dispatch({ type: 'reset' })
    setPlayerName('')
    setLevelIndex(0)
  }

  const handleComplete = () => {
    if (isLastLevel) {
      restart()
      return
    }
    dispatch({ type: 'award', points: level.reward, reason: level.title })
    setLevelIndex(levelIndex + 1)
  }

  const handlePenalty = (reason: string, points: number) => {
    dispatch({ type: 'penalize', points, reason })
  }

  const LevelComponent = level.Component

  return (
    <div className="app">
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
    </div>
  )
}
