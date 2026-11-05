import { useState } from 'react'
import type { LevelProps } from '../game/types'

const WRONG_ANSWER_PENALTY = 2
const TRAFFIC_LIGHT = '🚦'

type CaptchaRound = {
  instruction: string
  tiles: string[]
  isTarget: (tile: string) => boolean
}

const CAPTCHA_ROUNDS: CaptchaRound[] = [
  {
    instruction: 'Selecione todos os quadrados com semáforos.',
    tiles: ['🚦', '🚗', '🌳', '🚦', '🏠', '🚲', '🐈', '🚦', '🚌'],
    isTarget: (tile) => tile === TRAFFIC_LIGHT,
  },
  {
    instruction: 'Robôs também acertariam essa. Agora selecione os quadrados SEM semáforos.',
    tiles: ['🚌', '🚦', '🐈', '🚦', '🌳', '🚗', '🚦', '🏠', '🚲'],
    isTarget: (tile) => tile !== TRAFFIC_LIGHT,
  },
  {
    instruction: 'Última: selecione TODOS os quadrados. Sim, todos.',
    tiles: ['🤖', '🤖', '🤖', '🤖', '🙂', '🤖', '🤖', '🤖', '🤖'],
    isTarget: () => true,
  },
]

function isSelectionCorrect(round: CaptchaRound, selected: Set<number>): boolean {
  return round.tiles.every((tile, index) => round.isTarget(tile) === selected.has(index))
}

export function CaptchaLevel({ onComplete, onPenalty }: LevelProps) {
  const [roundIndex, setRoundIndex] = useState(0)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [error, setError] = useState('')

  const round = CAPTCHA_ROUNDS[roundIndex]

  const toggleTile = (index: number) => {
    const next = new Set(selected)
    if (next.has(index)) {
      next.delete(index)
    } else {
      next.add(index)
    }
    setSelected(next)
  }

  const handleVerify = () => {
    setSelected(new Set())
    if (!isSelectionCorrect(round, selected)) {
      setError('Hmm, comportamento suspeito de robô. Tente de novo.')
      onPenalty('Falhou no captcha', WRONG_ANSWER_PENALTY)
      return
    }
    setError('')
    if (roundIndex === CAPTCHA_ROUNDS.length - 1) {
      onComplete()
      return
    }
    setRoundIndex(roundIndex + 1)
  }

  return (
    <div className="card">
      <p className="captcha-instruction">{round.instruction}</p>
      <div className="captcha-grid">
        {round.tiles.map((tile, index) => (
          <button
            key={index}
            type="button"
            className={selected.has(index) ? 'captcha-tile captcha-tile--selected' : 'captcha-tile'}
            aria-pressed={selected.has(index)}
            aria-label={`Quadrado ${index + 1}: ${tile}`}
            onClick={() => toggleTile(index)}
          >
            {tile}
          </button>
        ))}
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="actions">
        <button type="button" className="neutral" onClick={handleVerify}>
          Verificar
        </button>
      </div>
    </div>
  )
}
