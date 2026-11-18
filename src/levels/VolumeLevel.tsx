import { useState } from 'react'
import type { LevelProps } from '../game/types'
import { ActionButton } from '../ui/ActionButton'

const MAX_VOLUME = 100
const TARGET_VOLUME = 73
const INITIAL_SLIDER_POSITION = 0
const WRONG_VOLUME_PENALTY = 1
const MUTE_PENALTY = 3

function toVolume(sliderPosition: number): number {
  return MAX_VOLUME - sliderPosition
}

export function VolumeLevel({ onComplete, onPenalty }: LevelProps) {
  const [sliderPosition, setSliderPosition] = useState(INITIAL_SLIDER_POSITION)
  const [shownVolume, setShownVolume] = useState(toVolume(INITIAL_SLIDER_POSITION))
  const [error, setError] = useState('')

  const commitVolume = () => {
    setShownVolume(toVolume(sliderPosition))
  }

  const handleConfirm = () => {
    if (shownVolume !== TARGET_VOLUME) {
      setError(`Está em ${shownVolume}%. Eu pedi ${TARGET_VOLUME}%, não ${shownVolume}%.`)
      onPenalty('Errou o volume', WRONG_VOLUME_PENALTY)
      return
    }
    onComplete()
  }

  const handleMute = () => {
    setSliderPosition(MAX_VOLUME)
    setShownVolume(0)
    setError('')
    onPenalty('Silenciou o site', MUTE_PENALTY)
  }

  return (
    <div className="card">
      <p>Deixe o volume em exatamente {TARGET_VOLUME}%. O valor só atualiza quando você solta.</p>
      <output className="big-display" aria-label="Volume atual">
        🔈 {shownVolume}%
      </output>
      <input
        type="range"
        className="full-slider"
        aria-label="Volume"
        min={0}
        max={MAX_VOLUME}
        step={1}
        value={sliderPosition}
        onChange={(event) => setSliderPosition(Number(event.target.value))}
        onPointerUp={commitVolume}
        onKeyUp={commitVolume}
        onBlur={commitVolume}
      />
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="actions">
        <ActionButton tone="loud" icon="check" onClick={handleMute}>
          Aplicar
        </ActionButton>
        <ActionButton onClick={handleConfirm}>Confirmar</ActionButton>
      </div>
    </div>
  )
}
