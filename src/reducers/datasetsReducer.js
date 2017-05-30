import { DATASET_LOAD_SUCCESS } from '../actions'
import { reduceFor, reduceIn, defaultState } from './reducerHelpers'
import { compose } from 'redux'
import { mapValues, groupBy } from 'lodash/fp'
import { update, merge, get, getIn } from '../getset'
import { connect } from 'react-redux'
import { getCbsPeriodType } from '../cbsPeriod'

const datasetsReducerSelector = compose(reduceIn('datasets'), defaultState({}))

const groupByPeriodType = groupBy(({ Perioden }) => getCbsPeriodType(Perioden))

const datasetsReducer = (
  state = {},
  { id, url, dataProperties, tableInfo, dataset }
) =>
  update(
    id,
    merge({
      id,
      url,
      dataProperties,
      tableInfo,
      data: groupByPeriodType(dataset),
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
