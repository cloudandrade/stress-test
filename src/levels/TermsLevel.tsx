import { useRef, useState, type UIEvent } from 'react'
import type { LevelProps } from '../game/types'
import { ActionButton } from '../ui/ActionButton'
import { TERMS_CLAUSES } from './termsClauses'

const SCROLL_TOLERANCE_PX = 4
const SKIP_PENALTY = 2
const KEEP_READING_PENALTY = 1

type ReadingProgress = 'unread' | 'reachedBottom' | 'returnedToTop'

type AgreementOption = 'readAndDisagree' | 'readButNotAgree' | 'readAndAgree'

const AGREEMENT_OPTIONS: { value: AgreementOption; label: string }[] = [
  { value: 'readAndDisagree', label: 'Li e discordo' },
  { value: 'readButNotAgree', label: 'Li mas não concordo' },
  { value: 'readAndAgree', label: 'Li e concordo' },
]

const INITIAL_AGREEMENTS: ReadonlySet<AgreementOption> = new Set(['readAndDisagree'])

function findAgreementError(agreements: ReadonlySet<AgreementOption>): string {
  if (!agreements.has('readAndAgree')) {
    return 'Você ainda não concordou com os termos.'
  }
  if (agreements.size > 1) {
    return 'Você não pode concordar e discordar ao mesmo tempo. Decida-se.'
  }
  return ''
}

function findReadingError(progress: ReadingProgress): string {
  if (progress === 'unread') {
    return 'Você não leu os termos até o fim. A gente sabe.'
  }
  if (progress === 'reachedBottom') {
    return 'Agora volte ao topo dos termos para provar que leu tudo de novo.'
  }
  return ''
}

export function TermsLevel({ onComplete, onPenalty }: LevelProps) {
  const termsBoxRef = useRef<HTMLDivElement>(null)
  const [readingProgress, setReadingProgress] = useState<ReadingProgress>('unread')
  const [agreements, setAgreements] = useState(INITIAL_AGREEMENTS)
  const [feedback, setFeedback] = useState('')

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - SCROLL_TOLERANCE_PX
    const isAtTop = scrollTop <= SCROLL_TOLERANCE_PX
    if (isAtBottom) {
      setReadingProgress((progress) => (progress === 'unread' ? 'reachedBottom' : progress))
    }
    if (isAtTop) {
      setReadingProgress((progress) => (progress === 'reachedBottom' ? 'returnedToTop' : progress))
    }
  }

  const toggleAgreement = (option: AgreementOption) => {
    const nextAgreements = new Set(agreements)
    if (nextAgreements.has(option)) {
      nextAgreements.delete(option)
    } else {
      nextAgreements.add(option)
    }
    setAgreements(nextAgreements)
  }

  const handleKeepReading = () => {
    setReadingProgress('unread')
    termsBoxRef.current?.scrollTo({ top: 0 })
    setFeedback('Voltamos ao topo para você ler tudo com mais carinho.')
    onPenalty('Pediu para continuar lendo', KEEP_READING_PENALTY)
  }

  const handleContinue = () => {
    const error = findReadingError(readingProgress) || findAgreementError(agreements)
    if (error) {
      setFeedback(error)
      onPenalty('Tentou pular os termos', SKIP_PENALTY)
      return
    }
    onComplete()
  }

  return (
    <div className="card">
      <div ref={termsBoxRef} className="terms-box" onScroll={handleScroll} tabIndex={0}>
        <ol>
          {TERMS_CLAUSES.map((clause) => (
            <li key={clause}>{clause}</li>
          ))}
        </ol>
      </div>
      {AGREEMENT_OPTIONS.map((option) => (
        <label key={option.value} className="checkbox">
          <input
            type="checkbox"
            checked={agreements.has(option.value)}
            onChange={() => toggleAgreement(option.value)}
          />
          {option.label}
        </label>
      ))}
      {feedback && (
        <p className="error" role="alert">
          {feedback}
        </p>
      )}
      <div className="actions">
        <ActionButton onClick={handleContinue}>Continuar</ActionButton>
        <ActionButton tone="loud" icon="next" onClick={handleKeepReading}>
          Continuar lendo
        </ActionButton>
      </div>
    </div>
  )
}
