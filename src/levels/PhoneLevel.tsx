import { useState } from 'react'
import type { LevelProps } from '../game/types'
import { PHONE_MAX, PHONE_MIN, formatPhone, isMobilePhone, randomPhone } from './phone'

const NO_PHONE_PENALTY = 4
const WRONG_PHONE_PENALTY = 1

export function PhoneLevel({ onComplete, onPenalty }: LevelProps) {
  const [phone, setPhone] = useState(PHONE_MIN)
  const [error, setError] = useState('')

  const handleConfirm = () => {
    if (!isMobilePhone(phone)) {
      setError('Isso não é celular. Depois do DDD tem que vir um 9.')
      onPenalty('Informou um telefone fixo em pleno século XXI', WRONG_PHONE_PENALTY)
      return
    }
    onComplete()
  }

  return (
    <div className="card">
      <p>Por segurança, ajuste seu número no controle deslizante. Use as setas do teclado para o ajuste fino.</p>
      <output className="phone-display" aria-label="Telefone selecionado">
        {formatPhone(phone)}
      </output>
      <input
        type="range"
        className="phone-slider"
        aria-label="Número de telefone"
        min={PHONE_MIN}
        max={PHONE_MAX}
        step={1}
        value={phone}
        onChange={(event) => setPhone(Number(event.target.value))}
      />
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="actions">
        <button type="button" className="cta" onClick={() => onPenalty('Disse que não tem telefone', NO_PHONE_PENALTY)}>
          Não tenho telefone
        </button>
        <button type="button" className="neutral" onClick={() => setPhone(randomPhone())}>
          🎲 Sortear
        </button>
        <button type="button" className="neutral" onClick={handleConfirm}>
          Confirmar
        </button>
      </div>
    </div>
  )
}
