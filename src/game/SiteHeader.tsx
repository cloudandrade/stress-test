const SKIP_PENALTY = 3
const HOME_PENALTY = 1

type SiteHeaderProps = {
  onPenalty: (reason: string, points: number) => void
  onHelp: () => void
}

export function SiteHeader({ onPenalty, onHelp }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <span className="site-brand">StressTest™</span>
      <nav className="site-nav" aria-label="Navegação principal">
        <button type="button" className="site-nav-link" onClick={() => onPenalty('Clicou em Início e nada aconteceu', HOME_PENALTY)}>
          Início
        </button>
        <button type="button" className="site-nav-link" onClick={onHelp}>
          Ajuda
        </button>
        <button type="button" className="site-nav-link" onClick={() => onPenalty('Tentou pular a fase', SKIP_PENALTY)}>
          Pular fase →
        </button>
      </nav>
    </header>
  )
}
