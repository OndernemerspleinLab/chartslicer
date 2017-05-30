import { DATASET_LOAD_SUCCESS } from '../actions'
import { reduceFor, reduceIn, defaultState } from './reducerHelpers'
import { compose } from 'redux'
import { last, mapValues } from 'lodash/fp'
import { update, merge, set, get, getIn } from '../getset'
import { connect } from 'react-redux'

const datasetsReducerSelector = compose(reduceIn('datasets'), defaultState({}))

const datasetsReducer = (
  state = {},
  { id, url, dataProperties, tableInfo, dataset }
) => update(id, merge({ id, url, dataProperties, tableInfo, dataset }))(state)

export const reduceDatasets = compose(
  datasetsReducerSelector,
  reduceFor(DATASET_LOAD_SUCCESS)
)(datasetsReducer)

const getValue = dataset => keyPath => getIn(keyPath)(dataset)

export const connectActiveDataset = keyPathMap =>
  connect(({ activeDatasetId, datasets }) => {
    const activeDataset = get(activeDatasetId)(datasets)

    return mapValues(getValue(activeDataset))(keyPathMap)
  })
