import type { ScoreState } from './scoreReducer'

export type ScoreBoardCorner = 'top-right' | 'bottom-left' | 'top-left' | 'bottom-right'

type ScoreBoardProps = {
  score: ScoreState
  corner: ScoreBoardCorner
}

function formatPoints(points: number): string {
  return points > 0 ? `+${points}` : String(points)
}

export function ScoreBoard({ score, corner }: ScoreBoardProps) {
  return (
    <aside className={`scoreboard scoreboard--${corner}`} aria-label="Placar">
      <span className="scoreboard-label">Pontos</span>
      <strong className="scoreboard-total" aria-label="Total de pontos">
        {score.total}
      </strong>
      <ul className="scoreboard-events">
        {score.events.map((event) => (
          <li key={event.id} className={event.points >= 0 ? 'gain' : 'loss'}>
            {formatPoints(event.points)} {event.reason}
          </li>
        ))}
      </ul>
    </aside>
  )
}
