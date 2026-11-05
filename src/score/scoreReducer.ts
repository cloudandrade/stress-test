export const MAX_VISIBLE_EVENTS = 5

export type ScoreEvent = {
  id: number
  points: number
  reason: string
}

export type ScoreState = {
  total: number
  events: ScoreEvent[]
  nextEventId: number
}

export type ScoreAction =
  | { type: 'award'; points: number; reason: string }
  | { type: 'penalize'; points: number; reason: string }
  | { type: 'reset' }

export const initialScoreState: ScoreState = {
  total: 0,
  events: [],
  nextEventId: 1,
}

function addEvent(state: ScoreState, points: number, reason: string): ScoreState {
  const event: ScoreEvent = { id: state.nextEventId, points, reason }
  return {
    total: state.total + points,
    events: [event, ...state.events].slice(0, MAX_VISIBLE_EVENTS),
    nextEventId: state.nextEventId + 1,
  }
}

export function scoreReducer(state: ScoreState, action: ScoreAction): ScoreState {
  switch (action.type) {
    case 'award':
      return addEvent(state, Math.abs(action.points), action.reason)
    case 'penalize':
      return addEvent(state, -Math.abs(action.points), action.reason)
    case 'reset':
      return initialScoreState
  }
}
