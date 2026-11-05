import { useState, type FormEvent } from 'react'
import type { LevelProps } from '../game/types'

const MIN_NAME_LENGTH = 2
const MAX_BUTTON_SWAPS = 3
const OBEY_PENALTY = 3

type NameStep = 'typing' | 'confirming'

export function NameLevel({ onComplete, onPenalty, onPlayerNameChange }: LevelProps) {
  const [name, setName] = useState('')
  const [step, setStep] = useState<NameStep>('typing')
  const [swapCount, setSwapCount] = useState(0)
  const [error, setError] = useState('')

  const trimmedName = name.trim()
  const areButtonsSwapped = swapCount % 2 === 1

  const handleErase = () => {
    setName('')
    setError('')
    onPenalty('Obedeceu ao botão bonito', OBEY_PENALTY)
  }

  const handleAdvanceHover = () => {
    if (swapCount < MAX_BUTTON_SWAPS) {
      setSwapCount(swapCount + 1)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (trimmedName.length < MIN_NAME_LENGTH) {
      setError('Isso não é um nome, é uma inicial.')
      return
    }
    setError('')
    setStep('confirming')
  }

  const handleDeny = () => {
    setName('')
    setStep('typing')
    onPenalty('Errou o próprio nome', OBEY_PENALTY)
  }

  const handleConfirm = () => {
    onPlayerNameChange(trimmedName)
    onComplete()
  }

  if (step === 'confirming') {
    return (
      <div className="card">
        <p>
          Seu nome é mesmo <strong>“{trimmedName}”</strong>? Parece nome de vilão de novela.
        </p>
        <div className="actions">
          <button type="button" className="cta" onClick={handleDeny}>
            Não, errei
          </button>
          <button type="button" className="neutral" onClick={handleConfirm}>
            Sim, é esse
          </button>
        </div>
      </div>
    )
  }

  const eraseButton = (
    <button key="erase" type="button" className="cta cta--huge" onClick={handleErase}>
      Apagar
    </button>
  )
  const advanceButton = (
    <button key="advance" type="submit" className="neutral" onMouseEnter={handleAdvanceHover}>
      Avançar
    </button>
  )
  const buttons = areButtonsSwapped ? [advanceButton, eraseButton] : [eraseButton, advanceButton]

  return (
    <form className="card" onSubmit={handleSubmit}>
      <label className="field">
        <span>Nome (o completo, mas sem sobrenome)</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex.: o seu, não o do seu cachorro"
          autoComplete="off"
        />
      </label>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="actions">{buttons}</div>
    </form>
  )
}
