import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { LEVELS } from './levels'

const totalPoints = () => screen.getByLabelText('Total de pontos')

describe('Game', () => {
  it('should apply penalties to the scoreboard', async () => {
    render(<App />)

    await userEvent.click(screen.getByRole('button', { name: 'Aceitar tudo' }))

    expect(totalPoints()).toHaveTextContent('-5')
  })

  it('should award points, advance and move the scoreboard to another corner', async () => {
    render(<App />)
    expect(screen.getByText('Fase 1 de 2')).toBeInTheDocument()
    expect(screen.getByLabelText('Placar')).toHaveClass('scoreboard--top-right')

    await userEvent.click(screen.getByRole('button', { name: 'recusar' }))
    await userEvent.click(screen.getByRole('button', { name: 'Tenho certeza' }))

    expect(totalPoints()).toHaveTextContent(String(LEVELS[0].reward))
    expect(screen.getByRole('heading', { name: LEVELS[1].title })).toBeInTheDocument()
    expect(screen.getByText('Fase 2 de 3')).toBeInTheDocument()
    expect(screen.getByLabelText('Placar')).toHaveClass('scoreboard--bottom-left')
  })
})
