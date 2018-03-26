import { pick } from 'lodash/fp'
import { get } from '../helpers/getset'

export const environmentLanguageConnector = pick(['environmentLanguage'])
export const environmentLanguageGetter = get('environmentLanguage')
