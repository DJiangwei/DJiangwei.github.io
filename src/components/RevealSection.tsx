import type { CSSProperties, HTMLAttributes } from 'react';
import { useEffect, useRef, useState } from 'react';

interface RevealSectionProps extends HTMLAttributes<HTMLElement> {
  delay?: number;
}

export function RevealSection({
  children,
  className = '',
  delay = 0,
  style,
  ...rest
}: RevealSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const mergedStyle: CSSProperties = {
    ...style,
    transitionDelay: `${delay}ms`,
  };

  return (
    <section
      ref={sectionRef}
      className={`section reveal-section ${isVisible ? 'is-visible' : ''} ${className}`.trim()}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </section>
  );
}

