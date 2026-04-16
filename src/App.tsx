import { useEffect } from 'react';
import { AboutSite } from './components/AboutSite';
import { ArticlePage } from './components/ArticlePage';
import { BeyondMarkets } from './components/BeyondMarkets';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MarketLens } from './components/MarketLens';
import { SourceLibrary } from './components/SourceLibrary';
import { WritingShelf } from './components/WritingShelf';
import { getFeaturedPost, getPostBySlug, getPostTranslation, getRecentPosts } from './content/posts';
import { getHomeHref, getPostHref, getSectionHref } from './content/routes';
import { getSourcesByDomain, siteContent } from './content/siteContent';
import { useLocale } from './hooks/useLocale';
import { useSiteRoute } from './hooks/useSiteRoute';
import type { Locale } from './types';

function App() {
  const { route, navigate } = useSiteRoute();
  const { locale: storedLocale, setLocale } = useLocale();
  const routedLocale = route.kind === 'home' ? route.locale : route.locale;
  const locale = routedLocale ?? storedLocale;
  const content = siteContent[locale];
  const marketSources = getSourcesByDomain('markets');
  const broaderSources = getSourcesByDomain('beyondMarkets');
  const featuredPost = getFeaturedPost(locale);
  const recentPosts = getRecentPosts(locale, featuredPost?.id);
  const currentPost =
    route.kind === 'post' ? getPostBySlug(route.locale, route.slug) : undefined;
  const oppositeLocale: Locale = locale === 'zh' ? 'en' : 'zh';
  const translatedPost = currentPost
    ? getPostTranslation(currentPost, oppositeLocale)
    : undefined;
  const homeHref = getHomeHref(locale);
  const sectionHrefs = {
    about: getSectionHref(locale, 'about'),
    writing: getSectionHref(locale, 'writing'),
    marketSources: getSectionHref(locale, 'market-sources'),
    beyondMarkets: getSectionHref(locale, 'beyond-markets'),
    method: getSectionHref(locale, 'method'),
  };

  useEffect(() => {
    if (routedLocale && routedLocale !== storedLocale) {
      setLocale(routedLocale);
    }
  }, [routedLocale, setLocale, storedLocale]);

  useEffect(() => {
    if (currentPost) {
      document.title = `${currentPost.title} | ${content.brand}`;
      return;
    }

    document.title = locale === 'zh' ? '东望子午 | 宏观笔记' : 'East Meridian | Macro Notebook';
  }, [content.brand, currentPost, locale]);

  const handleLocaleChange = (nextLocale: Locale) => {
    if (nextLocale === locale) {
      return;
    }

    setLocale(nextLocale);

    if (route.kind === 'post' && currentPost) {
      const nextPost = getPostTranslation(currentPost, nextLocale);
      navigate(nextPost ? getPostHref(nextLocale, nextPost.slug) : getHomeHref(nextLocale));
      return;
    }

    navigate(getHomeHref(nextLocale), { replace: route.kind === 'home' });
  };

  const isArticleRoute = route.kind === 'post' || route.kind === 'notFound';

  return (
    <div className="page-shell">
      <Header
        brand={content.brand}
        subtitle={content.subtitle}
        nav={content.nav}
        homeHref={homeHref}
        sectionHrefs={sectionHrefs}
        locale={locale}
        onLocaleChange={handleLocaleChange}
        languageToggleLabel={content.languageToggleLabel}
      />

      <main>
        {isArticleRoute ? (
          <ArticlePage
            post={currentPost}
            locale={locale}
            labels={content.articleLabels}
            translation={translatedPost}
            writingHref={sectionHrefs.writing}
            homeHref={homeHref}
            onNavigate={navigate}
          />
        ) : (
          <>
            <Hero content={content.hero} ctaHref={sectionHrefs.writing} />
            <AboutSite content={content.about} />
            <WritingShelf
              content={content.writing}
              labels={content.articleLabels}
              locale={locale}
              featuredPost={featuredPost}
              recentPosts={recentPosts}
              onNavigate={navigate}
            />
            <SourceLibrary
              content={content.marketSources}
              locale={locale}
              mediumLabels={content.mediumLabels}
              actionLabel={content.sourceAction}
              trackingLabels={content.trackingLabels}
              sources={marketSources}
            />
            <BeyondMarkets
              content={content.beyondMarkets}
              locale={locale}
              mediumLabels={content.mediumLabels}
              actionLabel={content.sourceAction}
              trackingLabels={content.trackingLabels}
              sources={broaderSources}
            />
            <MarketLens content={content.marketLens} />
          </>
        )}
      </main>

      <Footer content={content.footer} />
    </div>
  );
}

export default App;
