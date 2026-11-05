import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ScoreBoard } from './ScoreBoard'
import { MAX_VISIBLE_EVENTS, initialScoreState, scoreReducer, type ScoreState } from './scoreReducer'

describe('scoreReducer', () => {
  it('should subtract points on penalty even when given a positive value', () => {
    const state = scoreReducer(initialScoreState, { type: 'penalize', points: 5, reason: 'x' })

    expect(state.total).toBe(-5)
    expect(state.events[0]).toEqual({ id: 1, points: -5, reason: 'x' })
  })

  it('should reset to the initial state', () => {
    const awarded = scoreReducer(initialScoreState, { type: 'award', points: 10, reason: 'x' })

    expect(scoreReducer(awarded, { type: 'reset' })).toEqual(initialScoreState)
  })

  it('should keep only the most recent events', () => {
    let state = initialScoreState
    for (let index = 0; index <= MAX_VISIBLE_EVENTS; index++) {
      state = scoreReducer(state, { type: 'award', points: -2, reason: `event ${index}` })
    }

    expect(state.total).toBe(2 * (MAX_VISIBLE_EVENTS + 1))
    expect(state.events).toHaveLength(MAX_VISIBLE_EVENTS)
    expect(state.events[0].reason).toBe(`event ${MAX_VISIBLE_EVENTS}`)
  })
})

describe('ScoreBoard', () => {
  it('should render total, signed events and corner', () => {
    const score: ScoreState = {
      total: 7,
      nextEventId: 3,
      events: [
        { id: 2, points: -3, reason: 'Obedeceu' },
        { id: 1, points: 10, reason: 'Cookies' },
      ],
    }

    render(<ScoreBoard score={score} corner="bottom-left" />)

    expect(screen.getByLabelText('Total de pontos')).toHaveTextContent('7')
    expect(screen.getByText('-3 Obedeceu')).toHaveClass('loss')
    expect(screen.getByText('+10 Cookies')).toHaveClass('gain')
    expect(screen.getByLabelText('Placar')).toHaveClass('scoreboard--bottom-left')
  })
})
