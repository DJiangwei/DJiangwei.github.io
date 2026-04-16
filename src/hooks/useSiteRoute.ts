import { useCallback, useEffect, useState } from 'react';
import { parseRoute, type AppRoute } from '../content/routes';

function getCurrentRoute(): AppRoute {
  if (typeof window === 'undefined') {
    return { kind: 'home' };
  }

  return parseRoute(window.location.pathname);
}

export function useSiteRoute() {
  const [route, setRoute] = useState<AppRoute>(getCurrentRoute);

  useEffect(() => {
    const handleLocationChange = () => {
      setRoute(getCurrentRoute());
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigate = useCallback((href: string, options?: { replace?: boolean }) => {
    if (typeof window === 'undefined') {
      return;
    }

    const target = new URL(href, window.location.origin);

    if (target.origin !== window.location.origin) {
      window.location.href = href;
      return;
    }

    if (options?.replace) {
      window.history.replaceState(null, '', `${target.pathname}${target.search}${target.hash}`);
    } else {
      window.history.pushState(null, '', `${target.pathname}${target.search}${target.hash}`);
    }

    setRoute(getCurrentRoute());

    if (!target.hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return { route, navigate };
}
