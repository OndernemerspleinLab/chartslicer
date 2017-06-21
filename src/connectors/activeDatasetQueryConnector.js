import { getIn } from '../helpers/getset'
import { activeDatasetGetIdConnector } from './activeDatasetIdConnector'

export const activeDatasetGetQueryConnector = state => {
  const activeDatasetId = activeDatasetGetIdConnector(state)
  return getIn(['activeDatasetQueries', activeDatasetId])(state)
}
export const activeDatasetQueryConnector = state => {
  return { activeDatasetQuery: activeDatasetGetQueryConnector(state) }
}
