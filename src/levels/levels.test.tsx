import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createLevelProps } from '../test/levelProps'
import { CaptchaLevel } from './CaptchaLevel'
import { CertificateLevel } from './CertificateLevel'
import { CookieLevel } from './CookieLevel'
import { FleeingButtonLevel } from './FleeingButtonLevel'
import { HOLD_DURATION_MS, LoadingLevel, TICK_MS } from './LoadingLevel'
import { NameLevel } from './NameLevel'
import { PasswordLevel } from './PasswordLevel'
import { PhoneLevel } from './PhoneLevel'
import { TermsLevel } from './TermsLevel'

const TICKS_UNTIL_STUCK = 80

describe('CookieLevel', () => {
  it('should penalize accepting and ask again', async () => {
    const props = createLevelProps()
    render(<CookieLevel {...props} />)

    await userEvent.click(screen.getByRole('button', { name: 'Aceitar tudo' }))

    expect(props.onPenalty).toHaveBeenCalledWith('Aceitou cookies sem ler', 5)
    expect(screen.getByText(/Obrigado por aceitar 1x/)).toBeInTheDocument()
    expect(props.onComplete).not.toHaveBeenCalled()
  })

  it('should penalize going back from the refusal confirmation', async () => {
    const props = createLevelProps()
    render(<CookieLevel {...props} />)

    await userEvent.click(screen.getByRole('button', { name: 'recusar' }))
    await userEvent.click(screen.getByRole('button', { name: 'Voltar e aceitar tudo' }))

    expect(props.onPenalty).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Aceitar tudo' })).toBeInTheDocument()
  })

  it('should complete when refusal is confirmed', async () => {
    const props = createLevelProps()
    render(<CookieLevel {...props} />)

    await userEvent.click(screen.getByRole('button', { name: 'recusar' }))
    await userEvent.click(screen.getByRole('button', { name: 'Tenho certeza' }))

    expect(props.onComplete).toHaveBeenCalledTimes(1)
  })
})

describe('NameLevel', () => {
  it('should reject names shorter than two characters', async () => {
    const props = createLevelProps()
    render(<NameLevel {...props} />)

    await userEvent.type(screen.getByRole('textbox'), 'J')
    fireEvent.submit(screen.getByRole('textbox'))

    expect(screen.getByRole('alert')).toHaveTextContent('inicial')
  })

  it('should clear the name and penalize when erasing', async () => {
    const props = createLevelProps()
    render(<NameLevel {...props} />)

    await userEvent.type(screen.getByRole('textbox'), 'Jan')
    await userEvent.click(screen.getByRole('button', { name: 'Apagar' }))

    expect(screen.getByRole('textbox')).toHaveValue('')
    expect(props.onPenalty).toHaveBeenCalledWith('Obedeceu ao botão bonito', 3)
  })

  it('should swap the buttons when hovering advance, up to a limit', () => {
    render(<NameLevel {...createLevelProps()} />)
    const advance = screen.getByRole('button', { name: 'Avançar' })
    const buttonLabels = () => screen.getAllByRole('button').map((button) => button.textContent)

    fireEvent.mouseEnter(advance)
    expect(buttonLabels()).toEqual(['Avançar', 'Apagar'])

    for (let hover = 0; hover < 5; hover++) {
      fireEvent.mouseEnter(screen.getByRole('button', { name: 'Avançar' }))
    }
    expect(buttonLabels()).toEqual(['Avançar', 'Apagar'])
  })

  it('should penalize denying the confirmation and go back to typing', async () => {
    const props = createLevelProps()
    render(<NameLevel {...props} />)

    await userEvent.type(screen.getByRole('textbox'), 'Jan')
    fireEvent.submit(screen.getByRole('textbox'))
    await userEvent.click(screen.getByRole('button', { name: 'Não, errei' }))

    expect(props.onPenalty).toHaveBeenCalledWith('Errou o próprio nome', 3)
    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('should store the trimmed name and complete after confirmation', async () => {
    const props = createLevelProps()
    render(<NameLevel {...props} />)

    await userEvent.type(screen.getByRole('textbox'), '  Jan  ')
    fireEvent.submit(screen.getByRole('textbox'))
    await userEvent.click(screen.getByRole('button', { name: 'Sim, é esse' }))

    expect(props.onPlayerNameChange).toHaveBeenCalledWith('Jan')
    expect(props.onComplete).toHaveBeenCalledTimes(1)
  })
})

describe('TermsLevel', () => {
  const scrollToBottom = () => {
    const box = screen.getByTestId('terms-box')
    Object.defineProperty(box, 'scrollHeight', { value: 500 })
    Object.defineProperty(box, 'clientHeight', { value: 140 })
    Object.defineProperty(box, 'scrollTop', { value: 360 })
    fireEvent.scroll(box)
  }

  it('should penalize continuing without reading', async () => {
    const props = createLevelProps()
    render(<TermsLevel {...props} />)

    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(screen.getByRole('alert')).toHaveTextContent('não leu')
    expect(props.onPenalty).toHaveBeenCalledWith('Tentou pular os termos', 2)
  })

  it('should demand opting out of the emails', async () => {
    const props = createLevelProps()
    render(<TermsLevel {...props} />)

    scrollToBottom()
    await userEvent.click(screen.getByLabelText('Não discordo dos termos'))
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(screen.getByRole('alert')).toHaveTextContent('37 e-mails')
    expect(props.onComplete).not.toHaveBeenCalled()
  })

  it('should complete when every requirement is met', async () => {
    const props = createLevelProps()
    render(<TermsLevel {...props} />)

    scrollToBottom()
    await userEvent.click(screen.getByLabelText('Não discordo dos termos'))
    await userEvent.click(screen.getByLabelText(/37 e-mails/))
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(props.onComplete).toHaveBeenCalledTimes(1)
  })
})

describe('PasswordLevel', () => {
  it('should refuse a weak password', async () => {
    const props = createLevelProps()
    render(<PasswordLevel {...props} />)

    await userEvent.type(screen.getByRole('textbox'), 'abc')
    await userEvent.click(screen.getByRole('button', { name: 'Criar senha' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Senha fraca')
    expect(props.onComplete).not.toHaveBeenCalled()
  })

  it('should keep revealed rules visible after the password gets shorter', async () => {
    render(<PasswordLevel {...createLevelProps()} />)
    const input = screen.getByRole('textbox')

    await userEvent.type(input, 'Abcdefgh1')
    const revealedCount = screen.getAllByRole('listitem').length
    await userEvent.clear(input)

    expect(revealedCount).toBeGreaterThan(1)
    expect(screen.getAllByRole('listitem')).toHaveLength(revealedCount)
  })

  it('should penalize forgetting the password', async () => {
    const props = createLevelProps()
    render(<PasswordLevel {...props} />)

    await userEvent.type(screen.getByRole('textbox'), 'abc')
    await userEvent.click(screen.getByRole('button', { name: 'Esqueci minha senha' }))

    expect(screen.getByRole('textbox')).toHaveValue('')
    expect(props.onPenalty).toHaveBeenCalledWith('Esqueceu uma senha que nem existia', 4)
  })

  it('should complete with a valid password', async () => {
    const props = createLevelProps({ playerName: 'Jan' })
    render(<PasswordLevel {...props} />)

    await userEvent.type(screen.getByRole('textbox'), 'Maio#96!xyz')
    await userEvent.click(screen.getByRole('button', { name: 'Criar senha' }))

    expect(props.onComplete).toHaveBeenCalledTimes(1)
  })
})

describe('FleeingButtonLevel', () => {
  it('should penalize giving up', async () => {
    const props = createLevelProps()
    render(<FleeingButtonLevel {...props} />)

    await userEvent.click(screen.getByRole('button', { name: 'Desistir' }))

    expect(props.onPenalty).toHaveBeenCalledWith('Pensou em desistir', 5)
  })

  it('should flee until tired and then allow the click', () => {
    const props = createLevelProps()
    render(<FleeingButtonLevel {...props} />)
    const fleeingButton = () => screen.getAllByRole('button')[0]

    for (let attempt = 0; attempt < 7; attempt++) {
      fireEvent.click(fleeingButton())
    }
    expect(props.onComplete).not.toHaveBeenCalled()
    fireEvent.mouseEnter(fleeingButton())
    expect(fleeingButton()).toHaveTextContent('pode clicar')

    fireEvent.click(fleeingButton())
    expect(props.onComplete).toHaveBeenCalledTimes(1)
  })
})

describe('PhoneLevel', () => {
  it('should penalize claiming not to have a phone', async () => {
    const props = createLevelProps()
    render(<PhoneLevel {...props} />)

    await userEvent.click(screen.getByRole('button', { name: 'Não tenho telefone' }))

    expect(props.onPenalty).toHaveBeenCalledWith('Disse que não tem telefone', 4)
  })

  it('should reject landline numbers', async () => {
    const props = createLevelProps()
    render(<PhoneLevel {...props} />)

    await userEvent.click(screen.getByRole('button', { name: 'Confirmar' }))

    expect(screen.getByRole('alert')).toHaveTextContent('tem que vir um 9')
    expect(props.onComplete).not.toHaveBeenCalled()
  })

  it('should complete with a mobile number chosen on the slider', async () => {
    const props = createLevelProps()
    render(<PhoneLevel {...props} />)

    fireEvent.change(screen.getByRole('slider'), { target: { value: '11987654321' } })
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar' }))

    expect(screen.getByLabelText('Telefone selecionado')).toHaveTextContent('(11) 98765-4321')
    expect(props.onComplete).toHaveBeenCalledTimes(1)
  })

  it('should draw a random number', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    render(<PhoneLevel {...createLevelProps()} />)

    await userEvent.click(screen.getByRole('button', { name: '🎲 Sortear' }))

    expect(screen.getByLabelText('Telefone selecionado')).toHaveTextContent('(10) 00000-0000')
    vi.restoreAllMocks()
  })
})

describe('CaptchaLevel', () => {
  const selectTiles = async (indexes: number[]) => {
    for (const index of indexes) {
      await userEvent.click(screen.getByRole('button', { name: new RegExp(`^Quadrado ${index}:`) }))
    }
  }

  it('should penalize a wrong selection and clear it', async () => {
    const props = createLevelProps()
    render(<CaptchaLevel {...props} />)

    await selectTiles([2])
    await userEvent.click(screen.getByRole('button', { name: 'Verificar' }))

    expect(props.onPenalty).toHaveBeenCalledWith('Falhou no captcha', 2)
    expect(screen.getByRole('button', { name: /^Quadrado 2:/ })).toHaveAttribute('aria-pressed', 'false')
  })

  it('should unselect a tile when clicked twice', async () => {
    render(<CaptchaLevel {...createLevelProps()} />)

    await selectTiles([1, 1])

    expect(screen.getByRole('button', { name: /^Quadrado 1:/ })).toHaveAttribute('aria-pressed', 'false')
  })

  it('should complete after the three rounds', async () => {
    const props = createLevelProps()
    render(<CaptchaLevel {...props} />)

    await selectTiles([1, 4, 8])
    await userEvent.click(screen.getByRole('button', { name: 'Verificar' }))
    await selectTiles([1, 3, 5, 6, 8, 9])
    await userEvent.click(screen.getByRole('button', { name: 'Verificar' }))
    await selectTiles([1, 2, 3, 4, 5, 6, 7, 8, 9])
    await userEvent.click(screen.getByRole('button', { name: 'Verificar' }))

    expect(props.onPenalty).not.toHaveBeenCalled()
    expect(props.onComplete).toHaveBeenCalledTimes(1)
  })
})

describe('LoadingLevel', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  const advance = (milliseconds: number) => {
    act(() => {
      vi.advanceTimersByTime(milliseconds)
    })
  }

  it('should restart and penalize on cancel', () => {
    vi.useFakeTimers()
    const props = createLevelProps()
    render(<LoadingLevel {...props} />)

    advance(TICK_MS * 5)
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
    expect(props.onPenalty).toHaveBeenCalledWith('Cancelou o salvamento', 6)
  })

  it('should reset early release and complete after a full hold', () => {
    vi.useFakeTimers()
    const props = createLevelProps()
    render(<LoadingLevel {...props} />)

    advance(TICK_MS * TICKS_UNTIL_STUCK)
    const holdButton = screen.getByRole('button', { name: /Segure para empurrar/ })

    fireEvent.pointerDown(holdButton)
    advance(HOLD_DURATION_MS / 2)
    fireEvent.pointerUp(holdButton)
    expect(screen.getByText(/Soltou cedo demais/)).toBeInTheDocument()

    fireEvent.keyDown(holdButton, { key: ' ' })
    advance(HOLD_DURATION_MS)

    expect(props.onComplete).toHaveBeenCalled()
  })

  it('should stop holding when the key is released', () => {
    vi.useFakeTimers()
    const props = createLevelProps()
    render(<LoadingLevel {...props} />)

    advance(TICK_MS * TICKS_UNTIL_STUCK)
    const holdButton = screen.getByRole('button', { name: /Segure para empurrar/ })
    fireEvent.keyDown(holdButton, { key: 'Enter' })
    fireEvent.keyUp(holdButton, { key: 'Enter' })
    fireEvent.pointerLeave(holdButton)
    advance(HOLD_DURATION_MS)

    expect(props.onComplete).not.toHaveBeenCalled()
  })
})

describe('CertificateLevel', () => {
  it('should misspell the name and acknowledge the complaint', async () => {
    const props = createLevelProps({ playerName: 'Jan', score: 120 })
    render(<CertificateLevel {...props} />)

    await userEvent.click(screen.getByRole('button', { name: 'Meu nome está errado' }))

    expect(screen.getByText('naJ')).toBeInTheDocument()
    expect(screen.getByText('Mestre Zen da UX Hostil')).toBeInTheDocument()
    expect(screen.getByText(/180 dias úteis/)).toBeInTheDocument()
  })

  it('should penalize sharing and restart on play again', async () => {
    const props = createLevelProps()
    render(<CertificateLevel {...props} />)

    await userEvent.click(screen.getByRole('button', { name: 'Compartilhar no LinkedIn' }))
    await userEvent.click(screen.getByRole('button', { name: 'Jogar de novo' }))

    expect(props.onPenalty).toHaveBeenCalledWith('Quase postou isso no LinkedIn', 1)
    expect(props.onComplete).toHaveBeenCalledTimes(1)
  })
})
