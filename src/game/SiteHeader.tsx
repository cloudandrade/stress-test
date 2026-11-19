type SiteHeaderProps = {
  onBack?: () => void
  onHome: () => void
}

export function SiteHeader({ onBack, onHome }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <span className="site-brand">StressTest™</span>
      <nav className="site-nav" aria-label="Navegação principal">
        {onBack && (
          <button type="button" className="site-nav-link" onClick={onBack}>
            ← Voltar
          </button>
        )}
        <button type="button" className="site-nav-link" onClick={onHome}>
          Início
        </button>
      </nav>
    </header>
  )
}
