import { useEffect } from 'react';
import { AboutSite } from './components/AboutSite';
import { BeyondMarkets } from './components/BeyondMarkets';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MarketLens } from './components/MarketLens';
import { SourceLibrary } from './components/SourceLibrary';
import { getSourcesByDomain, siteContent } from './content/siteContent';
import { useLocale } from './hooks/useLocale';

function App() {
  const { locale, setLocale } = useLocale();
  const content = siteContent[locale];
  const marketSources = getSourcesByDomain('markets');
  const broaderSources = getSourcesByDomain('beyondMarkets');

  useEffect(() => {
    document.title =
      locale === 'zh' ? '东望子午 | 宏观笔记' : 'East Meridian | Macro Notebook';
  }, [locale]);

  return (
    <div className="page-shell">
      <Header
        brand={content.brand}
        subtitle={content.subtitle}
        nav={content.nav}
        locale={locale}
        onLocaleChange={setLocale}
        languageToggleLabel={content.languageToggleLabel}
      />

      <main>
        <Hero content={content.hero} />
        <AboutSite content={content.about} />
        <SourceLibrary
          content={content.marketSources}
          locale={locale}
          mediumLabels={content.mediumLabels}
          actionLabel={content.sourceAction}
          sources={marketSources}
        />
        <BeyondMarkets
          content={content.beyondMarkets}
          locale={locale}
          mediumLabels={content.mediumLabels}
          actionLabel={content.sourceAction}
          sources={broaderSources}
        />
        <MarketLens content={content.marketLens} />
      </main>

      <Footer content={content.footer} />
    </div>
  );
}

export default App;
