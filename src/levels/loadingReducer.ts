export const PROGRESS_STEP = 3
export const STUCK_PROGRESS = 99
export const RESET_PROGRESS = 12
export const MAX_RESETS = 1

export type LoadingPhase = 'loading' | 'stuck'

export type LoadingState = {
  progress: number
  resetCount: number
  phase: LoadingPhase
}

export type LoadingAction = { type: 'tick' } | { type: 'restart' }

export const initialLoadingState: LoadingState = {
  progress: 0,
  resetCount: 0,
  phase: 'loading',
}

export function loadingReducer(state: LoadingState, action: LoadingAction): LoadingState {
  if (action.type === 'restart') {
    return initialLoadingState
  }
  if (state.phase === 'stuck') {
    return state
  }
  const nextProgress = state.progress + PROGRESS_STEP
  if (nextProgress < STUCK_PROGRESS) {
    return { ...state, progress: nextProgress }
  }
  if (state.resetCount < MAX_RESETS) {
    return { ...state, progress: RESET_PROGRESS, resetCount: state.resetCount + 1 }
  }
  return { ...state, progress: STUCK_PROGRESS, phase: 'stuck' }
}
