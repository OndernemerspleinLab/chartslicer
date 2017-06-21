import { pick } from 'lodash/fp'
import { get } from '../helpers/getset'

export const activeDatasetQueryConnector = pick(['activeDatasetQuery'])
export const activeDatasetGetQueryConnector = get('activeDatasetQuery')
