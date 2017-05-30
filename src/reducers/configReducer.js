import { CONFIG_CHANGED } from '../actions'
import { reduceFor, reduceIn, defaultState } from './reducerHelpers'
import { compose } from 'redux'
import { reduce } from 'lodash/fp'
import { set, setIn, get } from '../getset'
import { connect } from 'react-redux'

const configReducerSelector = compose(reduceIn('config'), defaultState({}))

const configReducer = (state = {}, { id, name, value }) =>
  setIn([id, name], value)(state)

export const reduceConfig = compose(
  configReducerSelector,
  reduceFor(CONFIG_CHANGED)
)(configReducer)

const addValue = config => (memo, name) => set(name, get(name)(config))(memo)

const getValues = config => reduce(addValue(config), {})

export const getConfigValues = (...names) => ({ activeDatasetId, config }) => {
  const activeConfig = get(activeDatasetId)(config)
  const values = getValues(activeConfig)(names) || {}

  return values
}

export const connectConfigValues = (...names) => connect(getConfigValues(names))

export const connectConfigFieldValue = connect(
  ({ activeDatasetId, config }, { name }) => {
    const activeConfig = get(activeDatasetId)(config)

    return { value: get(name)(activeConfig) || '' }
  }
)
