import { useState } from 'react'
import type { LevelProps } from '../game/types'
import { ActionButton } from '../ui/ActionButton'
import {
  AREA_CODE_OPTIONS,
  LOCAL_NUMBER_MAX,
  LOCAL_NUMBER_MIN,
  formatLocalNumber,
  isMobileNumber,
  randomLocalNumber,
} from './phone'

const SKIP_PENALTY = 4
const WRONG_PHONE_PENALTY = 1

export function PhoneLevel({ onComplete, onPenalty }: LevelProps) {
  const [areaCode, setAreaCode] = useState('')
  const [localNumber, setLocalNumber] = useState(LOCAL_NUMBER_MIN)
  const [error, setError] = useState('')

  const handleConfirm = () => {
    if (areaCode === '') {
      setError('Escolha o DDD. Por extenso, como manda a tradição.')
      onPenalty('Esqueceu o DDD', WRONG_PHONE_PENALTY)
      return
    }
    if (!isMobileNumber(localNumber)) {
      setError('Isso não é celular. O número tem que começar com 9.')
      onPenalty('Informou um telefone fixo em pleno século XXI', WRONG_PHONE_PENALTY)
      return
    }
    onComplete()
  }

  return (
    <div className="card">
      <p>Por segurança, escolha o DDD por extenso e ajuste o número no controle deslizante.</p>
      <label className="field">
        <span>DDD</span>
        <select value={areaCode} onChange={(event) => setAreaCode(event.target.value)}>
          <option value="">Selecione...</option>
          {AREA_CODE_OPTIONS.map((option) => (
            <option key={option.code} value={String(option.code)}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <output className="big-display" aria-label="Telefone selecionado">
        ({areaCode || '??'}) {formatLocalNumber(localNumber)}
      </output>
      <input
        type="range"
        className="full-slider"
        aria-label="Número de telefone"
        min={LOCAL_NUMBER_MIN}
        max={LOCAL_NUMBER_MAX}
        step={1}
        value={localNumber}
        onChange={(event) => setLocalNumber(Number(event.target.value))}
      />
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="actions">
        <ActionButton onClick={() => setLocalNumber(randomLocalNumber())}>🎲 Sortear</ActionButton>
        <ActionButton tone="loud" icon="next" onClick={() => onPenalty('Tentou pular o telefone', SKIP_PENALTY)}>
          Próximo
        </ActionButton>
        <ActionButton onClick={handleConfirm}>Confirmar</ActionButton>
      </div>
    </div>
  )
}
