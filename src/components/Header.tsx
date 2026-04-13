import { LanguageToggle } from './LanguageToggle';
import type { Locale, SiteLocaleContent } from '../types';

interface HeaderProps {
  brand: string;
  subtitle: string;
  nav: SiteLocaleContent['nav'];
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  languageToggleLabel: string;
}

export function Header({
  brand,
  subtitle,
  nav,
  locale,
  onLocaleChange,
  languageToggleLabel,
}: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand-mark" href="#top" aria-label={brand}>
          <span className="brand-title">{brand}</span>
          <span className="brand-subtitle">{subtitle}</span>
        </a>

        <nav className="header-nav" aria-label="Primary">
          <a className="nav-link" href="#about">
            {nav.about}
          </a>
          <a className="nav-link" href="#market-sources">
            {nav.marketSources}
          </a>
          <a className="nav-link" href="#beyond-markets">
            {nav.beyondMarkets}
          </a>
          <a className="nav-link" href="#method">
            {nav.method}
          </a>
        </nav>

        <div className="header-tools">
          <LanguageToggle locale={locale} onChange={onLocaleChange} label={languageToggleLabel} />
        </div>
      </div>
    </header>
  );
}
