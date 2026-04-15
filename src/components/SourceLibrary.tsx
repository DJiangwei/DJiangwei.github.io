import { SourceColumns } from './SourceColumns';
import type {
  Locale,
  SiteLocaleContent,
  SourceItem,
  SourceMedium,
  SourceSectionContent,
} from '../types';

interface SourceLibraryProps {
  content: SourceSectionContent;
  locale: Locale;
  mediumLabels: Record<SourceMedium, string>;
  actionLabel: string;
  trackingLabels: SiteLocaleContent['trackingLabels'];
  sources: Record<SourceMedium, SourceItem[]>;
}

export function SourceLibrary(props: SourceLibraryProps) {
  return <SourceColumns id="market-sources" {...props} />;
}
