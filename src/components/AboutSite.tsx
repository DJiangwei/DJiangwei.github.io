import type { AboutContent } from '../types';
import { AboutMethod } from './AboutMethod';

interface AboutSiteProps {
  content: AboutContent;
}

export function AboutSite({ content }: AboutSiteProps) {
  return <AboutMethod content={content} />;
}
