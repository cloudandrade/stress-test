import { useState } from 'react'
import type { LevelProps } from '../game/types'
import { ActionButton } from '../ui/ActionButton'

const ACCEPT_PENALTY = 5
const WRONG_PREFERENCES_PENALTY = 2

type CookieStep = 'banner' | 'preferences' | 'confirm'

type CookiePreferences = {
  blocksMarketing: boolean
  allowsMoodTracking: boolean
  keepsSoul: boolean
}

const INITIAL_PREFERENCES: CookiePreferences = {
  blocksMarketing: false,
  allowsMoodTracking: true,
  keepsSoul: false,
}

function arePreferencesPrivate(preferences: CookiePreferences): boolean {
  return preferences.blocksMarketing && !preferences.allowsMoodTracking && preferences.keepsSoul
}

export function CookieLevel({ onComplete, onPenalty }: LevelProps) {
  const [step, setStep] = useState<CookieStep>('banner')
  const [acceptCount, setAcceptCount] = useState(0)
  const [preferences, setPreferences] = useState(INITIAL_PREFERENCES)
  const [error, setError] = useState('')

  const handleAccept = () => {
    setAcceptCount(acceptCount + 1)
    setPreferences(INITIAL_PREFERENCES)
    setError('')
    setStep('banner')
    onPenalty('Aceitou cookies sem ler', ACCEPT_PENALTY)
  }

  const togglePreference = (key: keyof CookiePreferences) => {
    setPreferences({ ...preferences, [key]: !preferences[key] })
  }

  const handleSaveSelection = () => {
    if (!arePreferencesPrivate(preferences)) {
      setError('Sua seleção ainda compartilha coisas. Leia as caixinhas com calma.')
      onPenalty('Salvou cookies que não queria', WRONG_PREFERENCES_PENALTY)
      return
    }
    onComplete()
  }

  if (step === 'confirm') {
    return (
      <div className="card">
        <p>Deseja cancelar a recusa dos cookies?</p>
        <div className="actions">
          <ActionButton tone="loud" icon="check" onClick={handleAccept}>
            OK
          </ActionButton>
          <ActionButton onClick={onComplete}>Cancelar</ActionButton>
        </div>
      </div>
    )
  }

  if (step === 'preferences') {
    return (
      <div className="card">
        <p>Personalize sua experiência (de ser rastreado).</p>
        <label className="checkbox">
          <input type="checkbox" checked disabled />
          Cookies essenciais (obrigatórios, gostosos)
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={preferences.blocksMarketing}
            onChange={() => togglePreference('blocksMarketing')}
          />
          Bloquear cookies de marketing
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={preferences.allowsMoodTracking}
            onChange={() => togglePreference('allowsMoodTracking')}
          />
          Permitir rastreamento do seu humor
        </label>
        <label className="checkbox">
          <input type="checkbox" checked={preferences.keepsSoul} onChange={() => togglePreference('keepsSoul')} />
          Não vender minha alma para parceiros
        </label>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <div className="actions">
          <ActionButton tone="loud" icon="next" onClick={handleAccept}>
            Aceitar tudo e salvar
          </ActionButton>
          <ActionButton onClick={handleSaveSelection}>Salvar seleção</ActionButton>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <p>🍪 Este site usa cookies, biscoitos, bolachas e outras guloseimas para “melhorar sua experiência”.</p>
      {acceptCount > 0 && (
        <p className="hint">Obrigado por aceitar {acceptCount}x! Infelizmente esquecemos. Aceita de novo?</p>
      )}
      <div className="actions">
        <ActionButton onClick={() => setStep('confirm')}>Rejeitar tudo</ActionButton>
        <ActionButton tone="loud" icon="next" onClick={handleAccept}>
          Continuar
        </ActionButton>
        <ActionButton onClick={() => setStep('preferences')}>Preferências</ActionButton>
      </div>
    </div>
  )
}
