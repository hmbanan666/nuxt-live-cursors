import { names as enNames, ui as enUi } from './en'
import { names as ruNames, ui as ruUi } from './ru'

interface LocaleData {
  names: Record<string, string>
  ui: Record<string, string>
}

const fallback: LocaleData = { names: enNames, ui: enUi }

export const locales: Record<string, LocaleData> = {
  en: fallback,
  ru: { names: ruNames, ui: ruUi },
}

export function getLocale(locale: string): LocaleData {
  return locales[locale] ?? fallback
}
