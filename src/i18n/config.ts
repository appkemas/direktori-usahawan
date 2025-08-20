import ms from './locales/ms.json';
import en from './locales/en.json';

export const locales = ['ms', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ms';

export const messages = {
  ms,
  en,
};

export function getLocale(pathname: string): Locale {
  const segments = pathname.split('/');
  const locale = segments[1] as Locale;
  return locales.includes(locale) ? locale : defaultLocale;
}

export function getPathnameWithoutLocale(pathname: string): string {
  const locale = getLocale(pathname);
  return pathname.replace(`/${locale}`, '') || '/';
}
