import { useRef, useState, type PointerEvent } from 'react'
import type { LevelProps } from '../game/types'
import { ActionButton } from '../ui/ActionButton'

const MIN_HOLD_MS = 2000
const MAX_HOLD_MS = 2200
const MS_PER_SECOND = 1000
const SECONDS_DECIMALS = 3
const WRONG_HOLD_PENALTY = 1
const WRONG_BUTTON_PENALTY = 3

function formatSeconds(milliseconds: number): string {
  return String(Number((milliseconds / MS_PER_SECOND).toFixed(SECONDS_DECIMALS)))
}

function describeAttempt(heldMs: number): string {
  if (heldMs < MIN_HOLD_MS) {
    return `Você segurou apenas ${formatSeconds(heldMs)}s, precisa segurar por 2s.`
  }
  return `Você segurou ${formatSeconds(heldMs)}s. Passou do ponto, precisa segurar por 2s.`
}

export function PreciseHoldLevel({ onComplete, onPenalty }: LevelProps) {
  const holdStartRef = useRef<number | null>(null)
  const [attemptCount, setAttemptCount] = useState(0)
  const [feedback, setFeedback] = useState('')

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    holdStartRef.current = event.timeStamp
    setFeedback('')
  }

  const handleRelease = (event: PointerEvent<HTMLButtonElement>) => {
    if (holdStartRef.current === null) {
      return
    }
    const heldMs = event.timeStamp - holdStartRef.current
    holdStartRef.current = null
    if (heldMs >= MIN_HOLD_MS && heldMs <= MAX_HOLD_MS) {
      onComplete()
      return
    }
    setAttemptCount(attemptCount + 1)
    setFeedback(describeAttempt(heldMs))
    onPenalty('Segurou pelo tempo errado', WRONG_HOLD_PENALTY)
  }

  return (
    <div className="card">
      <p>Segure o botão por exatamente 2 segundos. Nem mais, nem menos.</p>
      <ActionButton
        className="hold-button precise-hold-button"
        onPointerDown={handlePointerDown}
        onPointerUp={handleRelease}
        onPointerCancel={handleRelease}
        onPointerLeave={handleRelease}
        onContextMenu={(event) => event.preventDefault()}
      >
        Segure aqui
      </ActionButton>
      {feedback && (
        <p className="error" role="alert">
          {feedback}
        </p>
      )}
      {attemptCount > 0 && <p className="hint">Tentativas: {attemptCount}</p>}
      <div className="actions">
        <ActionButton
          tone="loud"
          icon="next"
          onClick={() => onPenalty('Clicou em Continuar sem segurar', WRONG_BUTTON_PENALTY)}
        >
          Continuar
        </ActionButton>
      </div>
    </div>
  )
}
