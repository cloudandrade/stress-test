import { useState, type UIEvent } from 'react'
import type { LevelProps } from '../game/types'

const SCROLL_TOLERANCE_PX = 4
const SKIP_PENALTY = 2

const TERMS_CLAUSES = [
  'Ao ler esta cláusula, você concorda em ter lido esta cláusula.',
  'O usuário cede ao site o direito de escolher o toque do seu despertador.',
  'Todas as segundas-feiras serão consideradas segundas-feiras, sem exceção.',
  'O site pode alterar estes termos a qualquer momento, inclusive agora.',
  'Fica proibido sentir saudade do botão “Voltar”.',
  'Em caso de dúvida, a culpa é do usuário. Em caso de certeza, também.',
  'O usuário concorda que pão de queijo não é pão nem queijo.',
  'Seus dados serão tratados com o máximo de carinho que um banco de dados consegue ter.',
  'A rolagem desta caixa conta como exercício físico para fins de declaração.',
  'Ninguém lê até aqui. Se você leu, parabéns: isso não muda nada.',
  'Esta é a penúltima cláusula. A última está logo abaixo, confia.',
  'Fim. Agora confira as caixinhas aí embaixo com muita atenção.',
]

type Requirement = { isMet: boolean; message: string }

export function TermsLevel({ onComplete, onPenalty }: LevelProps) {
  const [hasReadToEnd, setHasReadToEnd] = useState(false)
  const [doesNotDisagree, setDoesNotDisagree] = useState(false)
  const [wantsEmails, setWantsEmails] = useState(true)
  const [feedback, setFeedback] = useState('')

  const requirements: Requirement[] = [
    { isMet: hasReadToEnd, message: 'Você não leu os termos até o fim. A gente sabe.' },
    { isMet: doesNotDisagree, message: 'Você precisa não discordar dos termos.' },
    { isMet: !wantsEmails, message: 'Você ainda vai receber 37 e-mails por dia. Tem certeza?' },
  ]
  const canContinue = requirements.every((requirement) => requirement.isMet)

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget
    if (scrollTop + clientHeight >= scrollHeight - SCROLL_TOLERANCE_PX) {
      setHasReadToEnd(true)
    }
  }

  const handleContinue = () => {
    const unmetRequirement = requirements.find((requirement) => !requirement.isMet)
    if (unmetRequirement) {
      setFeedback(unmetRequirement.message)
      onPenalty('Tentou pular os termos', SKIP_PENALTY)
      return
    }
    onComplete()
  }

  return (
    <div className="card">
      <div className="terms-box" onScroll={handleScroll} data-testid="terms-box" tabIndex={0}>
        <ol>
          {TERMS_CLAUSES.map((clause) => (
            <li key={clause}>{clause}</li>
          ))}
        </ol>
      </div>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={doesNotDisagree}
          onChange={(event) => setDoesNotDisagree(event.target.checked)}
        />
        Não discordo dos termos
      </label>
      <label className="checkbox">
        <input type="checkbox" checked={wantsEmails} onChange={(event) => setWantsEmails(event.target.checked)} />
        Não quero deixar de receber 37 e-mails promocionais por dia
      </label>
      {feedback && (
        <p className="error" role="alert">
          {feedback}
        </p>
      )}
      <div className="actions">
        <button
          type="button"
          className={canContinue ? 'neutral' : 'neutral neutral--disabled'}
          aria-disabled={!canContinue}
          onClick={handleContinue}
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
