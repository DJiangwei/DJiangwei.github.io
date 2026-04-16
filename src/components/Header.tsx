import { LanguageToggle } from './LanguageToggle';
import type { Locale, SiteLocaleContent } from '../types';

interface HeaderProps {
  brand: string;
  subtitle: string;
  nav: SiteLocaleContent['nav'];
  homeHref: string;
  sectionHrefs: {
    about: string;
    writing: string;
    marketSources: string;
    beyondMarkets: string;
    method: string;
  };
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  languageToggleLabel: string;
}

export function Header({
  brand,
  subtitle,
  nav,
  homeHref,
  sectionHrefs,
  locale,
  onLocaleChange,
  languageToggleLabel,
}: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand-mark" href={homeHref} aria-label={brand}>
          <span className="brand-title">{brand}</span>
          <span className="brand-subtitle">{subtitle}</span>
        </a>

        <nav className="header-nav" aria-label="Primary">
          <a className="nav-link" href={sectionHrefs.about}>
            {nav.about}
          </a>
          <a className="nav-link" href={sectionHrefs.writing}>
            {nav.writing}
          </a>
          <a className="nav-link" href={sectionHrefs.marketSources}>
            {nav.marketSources}
          </a>
          <a className="nav-link" href={sectionHrefs.beyondMarkets}>
            {nav.beyondMarkets}
          </a>
          <a className="nav-link" href={sectionHrefs.method}>
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
