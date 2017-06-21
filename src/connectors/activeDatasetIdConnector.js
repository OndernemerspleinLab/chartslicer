import { pick } from 'lodash/fp'
import { get } from '../helpers/getset'

export const activeDatasetIdConnector = pick(['activeDatasetId'])
export const activeDatasetGetIdConnector = get('activeDatasetId')
