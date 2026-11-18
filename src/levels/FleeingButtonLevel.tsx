import { useState } from 'react'
import type { LevelProps } from '../game/types'
import { ActionButton } from '../ui/ActionButton'

const ESCAPES_UNTIL_TIRED = 7
const MAX_OFFSET_PERCENT = 70
const WRONG_BUTTON_PENALTY = 4

const TAUNTS = ['Continuar', 'Quase!', 'Errou 😜', 'Tá lento hein', 'Aqui ó', 'Mais rápido!', 'Cansando...']

type Position = { left: number; top: number }

const INITIAL_POSITION: Position = { left: 35, top: 40 }

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

  const handleFleeingClick = () => {
    if (isTired) {
      onComplete()
      return
    }
    flee()
  }

  return (
    <div className="card">
      <p>Clique em Continuar. Só isso.</p>
      <div className="arena">
        <ActionButton
          className="fleeing"
          style={{ left: `${position.left}%`, top: `${position.top}%` }}
          onMouseEnter={flee}
          onClick={handleFleeingClick}
        >
          {isTired ? 'Tá bom, pode clicar 😮‍💨' : TAUNTS[escapeCount]}
        </ActionButton>
      </div>
      <div className="actions">
        <ActionButton
          tone="loud"
          icon="next"
          onClick={() => onPenalty('Clicou no Continuar errado', WRONG_BUTTON_PENALTY)}
        >
          Continuar
        </ActionButton>
      </div>
    </div>
  )
}
