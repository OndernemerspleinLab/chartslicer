import { DATASET_LOAD_SUCCESS } from '../actions'
import { reduceFor, reduceIn, defaultState } from './reducerHelpers'
import { compose } from 'redux'
import { mapValues } from 'lodash/fp'
import { update, merge, get, getIn } from '../getset'
import { connect } from 'react-redux'

const datasetsReducerSelector = compose(reduceIn('datasets'), defaultState({}))

const datasetsReducer = (
  state = {},
  { id, url, dataProperties, tableInfo, data }
) =>
  update(
    id,
    merge({
      id,
      url,
      dataProperties,
      tableInfo,
      data,
    })
  )(state)

export const reduceDatasets = compose(
  datasetsReducerSelector,
  reduceFor(DATASET_LOAD_SUCCESS)
)(datasetsReducer)

const getValue = dataset => keyPath => getIn(keyPath)(dataset)

const getFromActiveDataset = keyPathMap => ({ activeDatasetId, datasets }) => {
  const activeDataset = get(activeDatasetId)(datasets) || {}

  return mapValues(getValue(activeDataset))(keyPathMap)
}

export const connectPeriodTypes = connect(state => {
  const { data = {} } = getFromActiveDataset({ data: ['data'] })(state)

  return {
    periodTypes: Object.keys(data),
  }
})

export const connectActiveDataset = keyPathMap =>
  connect(getFromActiveDataset(keyPathMap))
