import { useState, type FormEvent } from 'react'
import type { LevelProps } from '../game/types'
import { ActionButton } from '../ui/ActionButton'
import { garbleName } from './name'

const MIN_NAME_LENGTH = 2
const ERASE_PENALTY = 3
const WRONG_NAME_PENALTY = 5

type TypingStep = 'pet' | 'firstName' | 'lastName'

type TypingStepConfig = {
  prompt: string
  finePrint?: string
  next: TypingStep | 'confirming'
}

const TYPING_STEPS: Record<TypingStep, TypingStepConfig> = {
  pet: { prompt: 'Digite o nome', finePrint: 'do seu animal de estimação', next: 'firstName' },
  firstName: { prompt: 'Agora digite o seu nome', next: 'lastName' },
  lastName: { prompt: 'Agora digite o seu sobrenome', next: 'confirming' },
}

type NameAnswers = Record<TypingStep, string>

const EMPTY_ANSWERS: NameAnswers = { pet: '', firstName: '', lastName: '' }

export function NameLevel({ onComplete, onPenalty, onPlayerNameChange }: LevelProps) {
  const [step, setStep] = useState<TypingStep | 'confirming'>('pet')
  const [answers, setAnswers] = useState(EMPTY_ANSWERS)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')

  if (step === 'confirming') {
    const garbledName = garbleName(answers.firstName, answers.pet, answers.lastName)

    const handleProceed = () => {
      onPenalty('Aceitou um nome que não é seu', WRONG_NAME_PENALTY)
      onPlayerNameChange(garbledName)
      onComplete()
    }

    const handleFix = () => {
      onPlayerNameChange(answers.firstName)
      onComplete()
    }

    return (
      <div className="card">
        <p className="step-prompt">
          Seu nome é <strong>{garbledName}</strong>?
        </p>
        <div className="actions actions--stacked">
          <ActionButton tone="loud" icon="next" onClick={handleProceed}>
            Não gostaria de corrigir
          </ActionButton>
          <ActionButton onClick={handleFix}>Não, gostaria de corrigir</ActionButton>
          <ActionButton onClick={handleProceed}>Não, gostaria de prosseguir</ActionButton>
        </div>
      </div>
    )
  }

  const stepConfig = TYPING_STEPS[step]
  const trimmedDraft = draft.trim()

  const handleErase = () => {
    setDraft('')
    setError('')
    onPenalty('Apagou o que tinha digitado', ERASE_PENALTY)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (trimmedDraft.length < MIN_NAME_LENGTH) {
      setError('Isso não é um nome, é uma inicial.')
      return
    }
    setAnswers({ ...answers, [step]: trimmedDraft })
    setDraft('')
    setError('')
    setStep(stepConfig.next)
  }

  return (
    <form key={step} className="card" onSubmit={handleSubmit}>
      <div>
        <p className="step-prompt">{stepConfig.prompt}</p>
        {stepConfig.finePrint && <p className="fine-print">{stepConfig.finePrint}</p>}
      </div>
      <input
        className="text-input"
        aria-label={stepConfig.finePrint ? `${stepConfig.prompt} ${stepConfig.finePrint}` : stepConfig.prompt}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        autoComplete="off"
        autoFocus
      />
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="actions">
        <ActionButton type="submit">Avançar</ActionButton>
        <ActionButton tone="loud" icon="next" onClick={handleErase}>
          Apagar
        </ActionButton>
      </div>
    </form>
  )
}
