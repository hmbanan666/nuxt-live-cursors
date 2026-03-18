import { names as enNames, ui as enUi } from './en'
import { names as ruNames, ui as ruUi } from './ru'

export const locales: Record<string, { names: Record<string, string>, ui: Record<string, string> }> = {
  en: { names: enNames, ui: enUi },
  ru: { names: ruNames, ui: ruUi },
}

export function getLocale(locale: string) {
  return locales[locale] || locales.en
}
