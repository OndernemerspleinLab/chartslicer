// @flow

import { get, getIn } from '../helpers/getset'
import { compose } from 'recompose'
import type { Id, DatasetQuery, State } from '../store/stateShape'
import { activeDatasetGetIdConnector } from './activeDatasetIdConnector'
import { activeDatasetGetQueryConnector } from './activeDatasetQueryConnector'

export const allDataQueryLoadingStateConnector = get('dataQueryLoadingState')

export const dataQueryLoadingStateConnectorFor = ({
  id,
  query,
}: {
  id: Id,
  query: DatasetQuery,
}) => (state: State) =>
  compose(getIn([id, query]), allDataQueryLoadingStateConnector(state))

export const dataQueryLoadingStateConnector = (state: State) => {
  const id = activeDatasetGetIdConnector(state)
  const query = activeDatasetGetQueryConnector(state)

  return dataQueryLoadingStateConnectorFor({ id, query })(state)
}
