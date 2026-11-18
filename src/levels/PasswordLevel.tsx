import { useState, type ClipboardEvent, type FormEvent } from 'react'
import type { LevelProps } from '../game/types'
import { ActionButton } from '../ui/ActionButton'
import { countRulesToReveal, evaluateRules, isPasswordValid } from './passwordRules'

const GENERATE_PENALTY = 4
const PASTE_PENALTY = 1
const INITIAL_REVEALED_RULES = 1
const GENERATED_PASSWORD = 'SenhaForte123!'

export function PasswordLevel({ playerName, onComplete, onPenalty }: LevelProps) {
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [isRevealing, setIsRevealing] = useState(false)
  const [revealedCount, setRevealedCount] = useState(INITIAL_REVEALED_RULES)
  const [error, setError] = useState('')

  const evaluatedRules = evaluateRules(password, playerName, revealedCount)
  const inputType = isRevealing ? 'text' : 'password'

  const updatePassword = (value: string) => {
    setPassword(value)
    setRevealedCount(Math.max(revealedCount, countRulesToReveal(value, playerName)))
  }

  const handleConfirmationPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    setError('Colar é coisa de robô. Digite.')
    onPenalty('Tentou colar a senha', PASTE_PENALTY)
  }

  const handleGenerate = () => {
    updatePassword(GENERATED_PASSWORD)
    setConfirmation(GENERATED_PASSWORD)
    setError('')
    onPenalty('Confiou no gerador de senha forte', GENERATE_PENALTY)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isPasswordValid(password, playerName)) {
      setError('Senha fraca. Igual à sua paciência, imagino.')
      return
    }
    if (password !== confirmation) {
      setError('As senhas não conferem. Uma delas está mentindo.')
      return
    }
    onComplete()
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <label className="field">
        <span>Senha</span>
        <span className="field-row">
          <input
            type={inputType}
            value={password}
            onChange={(event) => updatePassword(event.target.value)}
            autoComplete="off"
          />
          <ActionButton
            aria-label="Segure para ver a senha"
            className="hold-button"
            onPointerDown={() => setIsRevealing(true)}
            onPointerUp={() => setIsRevealing(false)}
            onPointerLeave={() => setIsRevealing(false)}
            onPointerCancel={() => setIsRevealing(false)}
            onContextMenu={(event) => event.preventDefault()}
          >
            👁
          </ActionButton>
        </span>
      </label>
      <label className="field">
        <span>Confirme a senha</span>
        <input
          type={inputType}
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          onPaste={handleConfirmationPaste}
          autoComplete="off"
        />
      </label>
      <ul className="rules" aria-label="Regras da senha">
        {evaluatedRules.map(({ rule, isSatisfied }) => (
          <li key={rule.id} className={isSatisfied ? 'rule rule--ok' : 'rule rule--fail'}>
            {isSatisfied ? '✅' : '❌'} {rule.description}
          </li>
        ))}
      </ul>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="actions">
        <ActionButton tone="loud" icon="sparkle" onClick={handleGenerate}>
          Gerar senha forte
        </ActionButton>
        <ActionButton tone="loud" icon="next" type="submit">
          Criar senha
        </ActionButton>
      </div>
    </form>
  )
}
