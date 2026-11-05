import { useState, type FormEvent } from 'react'
import type { LevelProps } from '../game/types'
import { countRulesToReveal, evaluateRules, isPasswordValid } from './passwordRules'

const FORGOT_PENALTY = 4
const INITIAL_REVEALED_RULES = 1

export function PasswordLevel({ playerName, onComplete, onPenalty }: LevelProps) {
  const [password, setPassword] = useState('')
  const [revealedCount, setRevealedCount] = useState(INITIAL_REVEALED_RULES)
  const [error, setError] = useState('')

  const evaluatedRules = evaluateRules(password, playerName, revealedCount)

  const handleChange = (value: string) => {
    setPassword(value)
    setRevealedCount(Math.max(revealedCount, countRulesToReveal(value, playerName)))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isPasswordValid(password, playerName)) {
      setError('Senha fraca. Igual à sua paciência, imagino.')
      return
    }
    onComplete()
  }

  const handleForgot = () => {
    setPassword('')
    setError('')
    onPenalty('Esqueceu uma senha que nem existia', FORGOT_PENALTY)
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <label className="field">
        <span>Senha</span>
        <input value={password} onChange={(event) => handleChange(event.target.value)} autoComplete="off" />
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
        <button type="button" className="cta" onClick={handleForgot}>
          Esqueci minha senha
        </button>
        <button type="submit" className="neutral">
          Criar senha
        </button>
      </div>
    </form>
  )
}
