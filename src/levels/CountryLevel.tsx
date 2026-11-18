import { useState } from 'react'
import type { LevelProps } from '../game/types'
import { ActionButton } from '../ui/ActionButton'
import { AUTO_DETECTED_COUNTRY, COUNTRY_GROUPS, TARGET_COUNTRY } from './countries'

const WRONG_COUNTRY_PENALTY = 2
const AUTO_DETECT_PENALTY = 3

export function CountryLevel({ onComplete, onPenalty }: LevelProps) {
  const [country, setCountry] = useState('')
  const [error, setError] = useState('')

  const handleConfirm = () => {
    if (country !== TARGET_COUNTRY) {
      setError('Esse não é o Brasil. Confere de novo.')
      onPenalty('Errou o próprio país', WRONG_COUNTRY_PENALTY)
      return
    }
    onComplete()
  }

  const handleAutoDetect = () => {
    setCountry(AUTO_DETECTED_COUNTRY)
    setError('')
    onPenalty('Confiou na detecção automática', AUTO_DETECT_PENALTY)
  }

  return (
    <div className="card">
      <p>Selecione o seu país: Brasil.</p>
      <label className="field">
        <span>País</span>
        <select value={country} onChange={(event) => setCountry(event.target.value)}>
          <option value="">Selecione...</option>
          {COUNTRY_GROUPS.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.countries.map((countryName) => (
                <option key={countryName} value={countryName}>
                  {countryName}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="actions">
        <ActionButton tone="loud" icon="next" onClick={handleAutoDetect}>
          Detectar automaticamente
        </ActionButton>
        <ActionButton onClick={handleConfirm}>Confirmar país</ActionButton>
      </div>
    </div>
  )
}
