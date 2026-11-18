import { useState, type FormEvent } from 'react'
import type { LevelProps } from '../game/types'
import { ActionButton } from '../ui/ActionButton'
import { suggestName } from './name'

const MIN_NAME_LENGTH = 2
const MAX_BUTTON_SWAPS = 3
const OBEY_PENALTY = 3
const AUTOCORRECT_PENALTY = 2

type NameStep = 'typing' | 'suggesting' | 'confirming'

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
    onPenalty('Apagou o próprio nome', OBEY_PENALTY)
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
    setStep('suggesting')
  }

  const handleAcceptSuggestion = () => {
    setName(suggestName(trimmedName))
    setStep('confirming')
    onPenalty('Aceitou o corretor automático', AUTOCORRECT_PENALTY)
  }

  const handleReportWrongName = () => {
    setName('')
    setStep('typing')
    onPenalty('Disse que o próprio nome está errado', OBEY_PENALTY)
  }

  const handleConfirm = () => {
    onPlayerNameChange(trimmedName)
    onComplete()
  }

  if (step === 'suggesting') {
    return (
      <div className="card">
        <p>
          Você quis dizer <strong>“{suggestName(trimmedName)}”</strong>?
        </p>
        <div className="actions">
          <ActionButton onClick={() => setStep('confirming')}>Não, manter</ActionButton>
          <ActionButton tone="loud" icon="next" onClick={handleAcceptSuggestion}>
            Sim, corrigir
          </ActionButton>
        </div>
      </div>
    )
  }

  if (step === 'confirming') {
    return (
      <div className="card">
        <p>
          Seu nome <strong>“{trimmedName}”</strong> está errado?
        </p>
        <div className="actions">
          <ActionButton tone="loud" icon="check" onClick={handleReportWrongName}>
            Sim
          </ActionButton>
          <ActionButton onClick={handleConfirm}>Não</ActionButton>
        </div>
      </div>
    )
  }

  const eraseButton = (
    <ActionButton key="erase" tone="loud" icon="next" onClick={handleErase}>
      Apagar
    </ActionButton>
  )
  const advanceButton = (
    <ActionButton key="advance" type="submit" onMouseEnter={handleAdvanceHover}>
      Avançar
    </ActionButton>
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
