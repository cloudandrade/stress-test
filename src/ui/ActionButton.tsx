import type { ButtonHTMLAttributes } from 'react'

const ICONS = {
  next: '→',
  back: '←',
  check: '✓',
  sparkle: '✨',
} as const

type ActionButtonIcon = keyof typeof ICONS

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: 'loud' | 'quiet'
  icon?: ActionButtonIcon
}

export function ActionButton({
  tone = 'quiet',
  icon,
  className = '',
  type = 'button',
  children,
  ...buttonProps
}: ActionButtonProps) {
  return (
    <button
      type={type}
      className={`btn btn--${tone} ${className}`.trim()}
      data-cta={tone === 'loud' ? '' : undefined}
      {...buttonProps}
    >
      {children}
      {icon && (
        <span className="btn-icon" aria-hidden="true">
          {ICONS[icon]}
        </span>
      )}
    </button>
  )
}
