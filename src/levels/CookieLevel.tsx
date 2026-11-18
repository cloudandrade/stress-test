import { useState } from 'react'
import type { LevelProps } from '../game/types'
import { ActionButton } from '../ui/ActionButton'

const ACCEPT_PENALTY = 5
const MAX_CONTINUE_CLICKS = 5

type CookieStep = 'banner' | 'confirm' | 'surrender'

export function CookieLevel({ onComplete, onPenalty }: LevelProps) {
  const [step, setStep] = useState<CookieStep>('banner')
  const [continueCount, setContinueCount] = useState(0)
  const [notice, setNotice] = useState('')

  const returnToBanner = (message: string) => {
    setNotice(message)
    setStep('banner')
    onPenalty('Aceitou cookies sem ler', ACCEPT_PENALTY)
  }

  const handleContinue = () => {
    const nextContinueCount = continueCount + 1
    setContinueCount(nextContinueCount)
    if (nextContinueCount > MAX_CONTINUE_CLICKS) {
      onPenalty('Venceu os cookies pelo cansaço', ACCEPT_PENALTY)
      setStep('surrender')
      return
    }
    returnToBanner(`Obrigado por aceitar ${nextContinueCount}x! Infelizmente esquecemos. Aceita de novo?`)
  }

  if (step === 'surrender') {
    return (
      <div className="card">
        <p className="step-prompt">Ok, você me venceu pelo cansaço, vamos prosseguir.</p>
        <div className="actions actions--stacked-mobile">
          <ActionButton onClick={onComplete}>Prosseguir</ActionButton>
        </div>
      </div>
    )
  }

  if (step === 'confirm') {
    return (
      <div className="card">
        <p className="step-prompt">Deseja anular o cancelamento do uso dos cookies?</p>
        <div className="actions actions--stacked-mobile">
          <ActionButton onClick={onComplete}>Não</ActionButton>
          <ActionButton
            tone="loud"
            icon="check"
            onClick={() => returnToBanner('Obrigado por desistir de não utilizar os cookies.')}
          >
            Sim
          </ActionButton>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <p>🍪 Este site usa cookies, biscoitos, bolachas e outras guloseimas para “melhorar sua experiência”.</p>
      {notice && <p className="hint">{notice}</p>}
      <div className="actions actions--stacked-mobile">
        <ActionButton onClick={() => setStep('confirm')}>Rejeitar tudo</ActionButton>
        <ActionButton tone="loud" icon="next" onClick={handleContinue}>
          Continuar
        </ActionButton>
      </div>
    </div>
  )
}
