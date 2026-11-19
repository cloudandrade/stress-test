import { useReducer, useRef, useState } from 'react'
import { initialScoreState, scoreReducer } from '../score/scoreReducer'
import { useScoreLog } from '../score/useScoreLog'
import { useEnterTriggersCta } from '../ui/useEnterTriggersCta'
import { useIsMobile } from '../ui/useIsMobile'
import { LEVELS } from './levels'
import { SiteHeader } from './SiteHeader'

const LEVELS_AHEAD_SHOWN = 1
const BACK_PENALTY = 3

export function Game() {
  const stageRef = useRef<HTMLElement>(null)
  const [score, dispatch] = useReducer(scoreReducer, initialScoreState)
  const [levelIndex, setLevelIndex] = useState(0)
  const [rewardedLevelIds, setRewardedLevelIds] = useState<ReadonlySet<string>>(new Set())
  const [playerName, setPlayerName] = useState('')
  const [runCount, setRunCount] = useState(0)
  const isMobile = useIsMobile()

  useScoreLog(score)
  useEnterTriggersCta(stageRef)

  const level = LEVELS[levelIndex]
  const isFirstLevel = levelIndex === 0
  const isLastLevel = levelIndex === LEVELS.length - 1
  const levelNumber = levelIndex + 1
  const advertisedTotal = Math.min(levelNumber + LEVELS_AHEAD_SHOWN, LEVELS.length)

  const restart = () => {
    setRunCount(runCount + 1)
    dispatch({ type: 'reset' })
    setRewardedLevelIds(new Set())
    setPlayerName('')
    setLevelIndex(0)
  }

  const handleComplete = () => {
    if (isLastLevel) {
      restart()
      return
    }
    if (!rewardedLevelIds.has(level.id)) {
      dispatch({ type: 'award', points: level.reward, reason: level.title })
      setRewardedLevelIds(new Set(rewardedLevelIds).add(level.id))
    }
    setLevelIndex(levelIndex + 1)
  }

  const handlePenalty = (reason: string, points: number) => {
    dispatch({ type: 'penalize', points, reason })
  }

  const handleBack = () => {
    handlePenalty('Voltou uma fase', BACK_PENALTY)
    setLevelIndex(levelIndex - 1)
  }

  const activeVariant = isMobile && level.mobileVariant ? level.mobileVariant : level
  const variantId = activeVariant === level ? level.id : `${level.id}-mobile`
  const variantKey = `${runCount}-${variantId}`
  const LevelComponent = activeVariant.Component

  return (
    <div className="app">
      <SiteHeader onBack={isFirstLevel ? undefined : handleBack} onHome={restart} />
      <p className="site-notice">
        Após o cadastro das informações básicas, iniciaremos o seu teste de stress e compartilharemos a sua nota.
      </p>
      <main ref={stageRef} className="stage">
        <p className="stage-progress">
          Fase {levelNumber} de {advertisedTotal}
        </p>
        <h1 className="stage-title">{activeVariant.title}</h1>
        <LevelComponent
          key={variantKey}
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
