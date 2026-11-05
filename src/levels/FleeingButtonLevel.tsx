import { useState } from 'react'
import type { LevelProps } from '../game/types'

const ESCAPES_UNTIL_TIRED = 7
const MAX_OFFSET_PERCENT = 75
const GIVE_UP_PENALTY = 5

const TAUNTS = [
  'Clique em mim',
  'Quase!',
  'Errou 😜',
  'Tá lento hein',
  'Aqui ó',
  'Mais rápido!',
  'Cansando...',
]

type Position = { left: number; top: number }

const INITIAL_POSITION: Position = { left: 40, top: 40 }

function randomPosition(): Position {
  return {
    left: Math.random() * MAX_OFFSET_PERCENT,
    top: Math.random() * MAX_OFFSET_PERCENT,
  }
}

export function FleeingButtonLevel({ onComplete, onPenalty }: LevelProps) {
  const [escapeCount, setEscapeCount] = useState(0)
  const [position, setPosition] = useState(INITIAL_POSITION)

  const isTired = escapeCount >= ESCAPES_UNTIL_TIRED

  const flee = () => {
    if (isTired) {
      return
    }
    setEscapeCount(escapeCount + 1)
    setPosition(randomPosition())
  }

  const handleClick = () => {
    if (isTired) {
      onComplete()
      return
    }
    flee()
  }

  return (
    <div className="card">
      <p>É só clicar no botão cinza. Fácil, né?</p>
      <div className="arena">
        <button
          type="button"
          className="neutral fleeing"
          style={{ left: `${position.left}%`, top: `${position.top}%` }}
          onMouseEnter={flee}
          onClick={handleClick}
        >
          {isTired ? 'Tá bom, pode clicar 😮‍💨' : TAUNTS[escapeCount]}
        </button>
      </div>
      <button type="button" className="cta" onClick={() => onPenalty('Pensou em desistir', GIVE_UP_PENALTY)}>
        Desistir
      </button>
    </div>
  )
}
