import { useEffect, useReducer, useState, type KeyboardEvent } from 'react'
import type { LevelProps } from '../game/types'
import { ActionButton } from '../ui/ActionButton'
import { initialLoadingState, loadingReducer } from './loadingReducer'

const TICK_MS = 80
const HOLD_DURATION_MS = 3000
const HOLD_TICK_MS = 100
const SPEED_UP_PENALTY = 6
const PERCENT = 100
const HOLD_KEYS = new Set([' ', 'Enter'])

export function LoadingLevel({ onComplete, onPenalty }: LevelProps) {
  const [loading, dispatch] = useReducer(loadingReducer, initialLoadingState)
  const [isHolding, setIsHolding] = useState(false)
  const [holdElapsed, setHoldElapsed] = useState(0)
  const [releasedEarly, setReleasedEarly] = useState(false)

  useEffect(() => {
    if (loading.phase !== 'loading') {
      return
    }
    const intervalId = setInterval(() => dispatch({ type: 'tick' }), TICK_MS)
    return () => clearInterval(intervalId)
  }, [loading.phase])

  useEffect(() => {
    if (!isHolding) {
      return
    }
    const intervalId = setInterval(() => setHoldElapsed((elapsed) => elapsed + HOLD_TICK_MS), HOLD_TICK_MS)
    return () => clearInterval(intervalId)
  }, [isHolding])

  useEffect(() => {
    if (holdElapsed >= HOLD_DURATION_MS) {
      onComplete()
    }
  }, [holdElapsed, onComplete])

  const startHolding = () => {
    setReleasedEarly(false)
    setIsHolding(true)
  }

  const stopHolding = () => {
    if (!isHolding) {
      return
    }
    setIsHolding(false)
    setHoldElapsed(0)
    setReleasedEarly(true)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (HOLD_KEYS.has(event.key) && !event.repeat) {
      event.preventDefault()
      startHolding()
    }
  }

  const handleKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (HOLD_KEYS.has(event.key)) {
      stopHolding()
    }
  }

  const handleSpeedUp = () => {
    dispatch({ type: 'restart' })
    setIsHolding(false)
    setHoldElapsed(0)
    onPenalty('Tentou acelerar e reiniciou tudo', SPEED_UP_PENALTY)
  }

  const holdPercent = Math.round((holdElapsed / HOLD_DURATION_MS) * PERCENT)

  return (
    <div className="card">
      <div
        className="progress"
        role="progressbar"
        aria-label="Progresso do salvamento"
        aria-valuemin={0}
        aria-valuemax={PERCENT}
        aria-valuenow={loading.progress}
      >
        <div className="progress-fill" style={{ width: `${loading.progress}%` }} />
      </div>
      <p className="progress-label">{loading.progress}%</p>
      {loading.phase === 'loading' && loading.resetCount > 0 && (
        <p className="hint">Ops, perdemos tudo. Recomeçando...</p>
      )}
      {loading.phase === 'stuck' && (
        <>
          <p>Travou no 99%. Segure o botão por 3 segundos para empurrar o último 1%.</p>
          {releasedEarly && <p className="error">Soltou cedo demais! Do zero.</p>}
          <ActionButton
            className="hold-button"
            onPointerDown={startHolding}
            onPointerUp={stopHolding}
            onPointerLeave={stopHolding}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
          >
            Segure para empurrar ({holdPercent}%)
          </ActionButton>
        </>
      )}
      <div className="actions">
        <ActionButton tone="loud" icon="next" onClick={handleSpeedUp}>
          Acelerar
        </ActionButton>
      </div>
    </div>
  )
}
