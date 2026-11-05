import { useState } from 'react'
import type { LevelProps } from '../game/types'

const ACCEPT_PENALTY = 5

type CookieStep = 'banner' | 'confirm'

export function CookieLevel({ onComplete, onPenalty }: LevelProps) {
  const [step, setStep] = useState<CookieStep>('banner')
  const [acceptCount, setAcceptCount] = useState(0)

  const handleAccept = () => {
    setAcceptCount(acceptCount + 1)
    setStep('banner')
    onPenalty('Aceitou cookies sem ler', ACCEPT_PENALTY)
  }

  if (step === 'confirm') {
    return (
      <div className="card">
        <p>Tem certeza? Sem cookies, nossos 1.337 parceiros vão ficar muito tristes. 😢</p>
        <div className="actions">
          <button type="button" className="cta" onClick={handleAccept}>
            Voltar e aceitar tudo
          </button>
          <button type="button" className="neutral" onClick={onComplete}>
            Tenho certeza
          </button>
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
      <button type="button" className="cta cta--huge" onClick={handleAccept}>
        Aceitar tudo
      </button>
      <button type="button" className="tiny-link" onClick={() => setStep('confirm')}>
        recusar
      </button>
    </div>
  )
}
