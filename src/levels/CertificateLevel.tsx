import { useState } from 'react'
import type { LevelProps } from '../game/types'
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
        <button type="button" className="cta" onClick={() => onPenalty('Quase postou isso no LinkedIn', SHARE_PENALTY)}>
          Compartilhar no LinkedIn
        </button>
        <button type="button" className="neutral" onClick={() => setHasReportedName(true)}>
          Meu nome está errado
        </button>
        <button type="button" className="neutral" onClick={onComplete}>
          Jogar de novo
        </button>
      </div>
    </div>
  )
}
