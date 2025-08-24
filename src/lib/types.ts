export type SeoStatus = 'good' | 'improvement' | 'error';

export interface SeoCheck<T> {
  value: T;
  status: SeoStatus;
  message: string;
  details: string;
}

export interface OnPageData {
  title: SeoCheck<string>;
  metaDescription: SeoCheck<string>;
  headings: {
    h1: SeoCheck<string[]>;
    h2: SeoCheck<string[]>;
  };
  imageAlts: SeoCheck<{ count: number; missing: number }>;
  keywordDensity: SeoCheck<{ keyword: string; density: number }>;
  contentLength: SeoCheck<number>;
  links: SeoCheck<{ internal: number; external: number; broken: number }>;
}

export interface TechnicalData {
  pageSpeed: {
    mobile: SeoCheck<number>;
    desktop: SeoCheck<number>;
  };
  coreWebVitals: {
    lcp: SeoCheck<number>;
    inp: SeoCheck<number>;
    cls: SeoCheck<number>;
  }
  ssl: SeoCheck<boolean>;
  robotsTxt: SeoCheck<boolean>;
  sitemap: SeoCheck<boolean>;
  mobileFriendly: SeoCheck<boolean>;
  structuredData: SeoCheck<string[]>;
  canonicalUrl: SeoCheck<string | null>;
}

export interface SeoData {
  url: string;
  onPage: OnPageData;
  technical: TechnicalData;
  score: number;
}
