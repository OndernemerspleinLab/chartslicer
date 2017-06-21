// @flow

import { get, getIn } from '../helpers/getset'
import { compose } from 'recompose'
import type { Id, DatasetQuery, State } from '../store/stateShape'
import { activeDatasetIdConnector } from './activeDatasetIdConnector'
import { activeDatasetQueryConnector } from './activeDatasetQueryConnector'

export const allDatasetLoadingStateConnector = get('datasetLoadingState')

export const datasetLoadingStateConnectorFor = ({
  id,
  query,
}: {
  id: Id,
  query: DatasetQuery,
}) => (state: State) =>
  compose(getIn([id, query]), allDatasetLoadingStateConnector(state))

export const datasetLoadingStateConnector = (state: State) => {
  const id = activeDatasetIdConnector(state)
  const query = activeDatasetQueryConnector(state)

  return datasetLoadingStateConnectorFor({ id, query })(state)
}
