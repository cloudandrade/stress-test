import { useState } from 'react'
import { ActionButton } from '../ui/ActionButton'

const HELP_PENALTY = 2

const AGENT_REPLIES = [
  'Oi! Sou a Clarice, do suporte. Posso ajudar? 😊',
  'Já tentou desligar e ligar de novo?',
  'Seu chamado é o número 4.815.162.342 na fila. Aguarde.',
  'Entendi! Vou transferir para o setor responsável... que sou eu.',
  'Posso ajudar em mais alguma coisa?',
]

type SupportChatProps = {
  onClose: () => void
  onPenalty: (reason: string, points: number) => void
}

export function SupportChat({ onClose, onPenalty }: SupportChatProps) {
  const [replyIndex, setReplyIndex] = useState(0)

  const handleAskForHelp = () => {
    setReplyIndex((replyIndex + 1) % AGENT_REPLIES.length)
    onPenalty('Pediu ajuda ao suporte', HELP_PENALTY)
  }

  return (
    <aside className="support-chat" aria-label="Chat de suporte">
      <span className="support-chat-agent">Clarice • online agora</span>
      <p>{AGENT_REPLIES[replyIndex]}</p>
      <div className="actions">
        <ActionButton tone="loud" icon="next" onClick={handleAskForHelp}>
          Sim, quero ajuda
        </ActionButton>
        <ActionButton onClick={onClose}>Agora não</ActionButton>
      </div>
    </aside>
  )
}
