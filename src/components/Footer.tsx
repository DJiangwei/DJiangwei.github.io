import type { FooterContent } from '../types';

interface FooterProps {
  content: FooterContent;
}

export function Footer({ content }: FooterProps) {
  return (
    <footer className="site-footer">
      <p className="footer-note">{content.note}</p>
      <div className="footer-links">
        {content.links.map((link) => (
          <a
            className="footer-link"
            href={link.href}
            key={link.label}
            target="_blank"
            rel="noreferrer"
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}

