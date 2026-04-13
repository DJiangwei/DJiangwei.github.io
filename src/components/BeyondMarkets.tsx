import { SourceColumns } from './SourceColumns';
import type { Locale, SourceItem, SourceMedium, SourceSectionContent } from '../types';

interface BeyondMarketsProps {
  content: SourceSectionContent;
  locale: Locale;
  mediumLabels: Record<SourceMedium, string>;
  actionLabel: string;
  sources: Record<SourceMedium, SourceItem[]>;
}

export function BeyondMarkets(props: BeyondMarketsProps) {
  return <SourceColumns id="beyond-markets" {...props} />;
}

