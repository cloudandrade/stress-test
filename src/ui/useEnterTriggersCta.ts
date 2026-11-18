import { useEffect, type RefObject } from 'react'

const CTA_SELECTOR = '[data-cta]'

export function useEnterTriggersCta(containerRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' || event.isComposing || event.repeat) {
        return
      }
      const ctaButton = containerRef.current?.querySelector<HTMLButtonElement>(CTA_SELECTOR)
      if (!ctaButton) {
        return
      }
      event.preventDefault()
      ctaButton.click()
    }

    document.addEventListener('keydown', handleKeyDown, true)
    return () => document.removeEventListener('keydown', handleKeyDown, true)
  }, [containerRef])
}
