import { describe, expect, it } from 'vitest'
import { locales } from '../src/runtime/locales'

describe('locales', () => {
  it('all locales have the same name keys', () => {
    const keys = Object.keys(locales)
    const referenceNames = Object.keys(locales[keys[0]!]!.names).sort()

    for (const key of keys.slice(1)) {
      expect(Object.keys(locales[key]!.names).sort(), `locale "${key}" has mismatched name keys`).toEqual(referenceNames)
    }
  })

  it('all locales have the same ui keys', () => {
    const keys = Object.keys(locales)
    const referenceUi = Object.keys(locales[keys[0]!]!.ui).sort()

    for (const key of keys.slice(1)) {
      expect(Object.keys(locales[key]!.ui).sort(), `locale "${key}" has mismatched ui keys`).toEqual(referenceUi)
    }
  })
})
