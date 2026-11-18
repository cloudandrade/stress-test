import { useState } from 'react'
import type { LevelProps } from '../game/types'
import { ActionButton } from '../ui/ActionButton'
import { misspellName, rankFor } from './certificate'

const SHARE_PENALTY = 1

export function CertificateLevel({ playerName, score, onComplete, onPenalty }: LevelProps) {
  const [hasReportedName, setHasReportedName] = useState(false)

  return (
    <div className="card certificate">
      <p className="certificate-heading">Certificado de Paciência Infinita</p>
      <p>Certificamos que</p>
      <p className="certificate-name">{misspellName(playerName)}</p>
      <p>
        sobreviveu ao Stress Test com <strong>{score} pontos</strong> e recebe o título de{' '}
        <strong>{rankFor(score)}</strong>.
      </p>
      {hasReportedName && <p className="hint">Erro registrado. Prazo para correção: 180 dias úteis.</p>}
      <div className="actions">
        <ActionButton onClick={() => setHasReportedName(true)}>Meu nome está errado</ActionButton>
        <ActionButton onClick={onComplete}>Jogar de novo</ActionButton>
        <ActionButton tone="loud" icon="next" onClick={() => onPenalty('Quase postou isso no LinkedIn', SHARE_PENALTY)}>
          Compartilhar
        </ActionButton>
      </div>
    </div>
  )
}
