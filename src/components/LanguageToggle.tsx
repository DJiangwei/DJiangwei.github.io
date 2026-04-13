import type { Locale } from '../types';

interface LanguageToggleProps {
  locale: Locale;
  onChange: (locale: Locale) => void;
  label: string;
}

export function LanguageToggle({ locale, onChange, label }: LanguageToggleProps) {
  return (
    <div className="language-toggle" role="group" aria-label={label}>
      <button
        type="button"
        className={`language-button ${locale === 'en' ? 'is-active' : ''}`}
        onClick={() => onChange('en')}
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
      <button
        type="button"
        className={`language-button ${locale === 'zh' ? 'is-active' : ''}`}
        onClick={() => onChange('zh')}
        aria-pressed={locale === 'zh'}
      >
        中文
      </button>
    </div>
  );
}

