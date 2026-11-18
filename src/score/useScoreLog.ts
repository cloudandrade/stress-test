import { useEffect, useRef } from 'react'
import type { ScoreState } from './scoreReducer'

const LOG_PREFIX = '[stress-test]'
const NO_EVENT_ID = 0

function formatPoints(points: number): string {
  return points > 0 ? `+${points}` : String(points)
}

export function useScoreLog(score: ScoreState): void {
  const lastLoggedIdRef = useRef(NO_EVENT_ID)

  useEffect(() => {
    if (score.events.length === 0) {
      lastLoggedIdRef.current = NO_EVENT_ID
      return
    }
    const unloggedEvents = score.events.filter((event) => event.id > lastLoggedIdRef.current).reverse()
    let runningTotal = score.total - unloggedEvents.reduce((sum, event) => sum + event.points, 0)
    for (const event of unloggedEvents) {
      runningTotal += event.points
      console.info(`${LOG_PREFIX} ${formatPoints(event.points)} ${event.reason} | total: ${runningTotal}`)
    }
    lastLoggedIdRef.current = score.events[0].id
  }, [score])
}
