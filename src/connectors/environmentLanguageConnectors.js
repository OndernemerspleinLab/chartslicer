import { pick } from 'lodash/fp'
import { get } from '../helpers/getset'

export const environmentLanguageConnector = pick(['environmentLanguage'])
export const environmentLanguageGetter = get('environmentLanguage')

export const getEvironmentLanguageLabel = lang => {
  switch (lang) {
    case 'en':
      return 'Engels'
    case 'nl':
    default:
      return ''
  }
}
