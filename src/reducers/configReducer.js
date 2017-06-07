import { CONFIG_CHANGED, METADATA_LOAD_SUCCESS } from '../actions/actions'
import {
  reduceFor,
  reduceIn,
  defaultState,
  composeReducers,
} from './reducerHelpers'
import { compose } from 'redux'
import { defaultsDeep } from 'lodash/fp'
import { setIn, get, getIn, update, updateIn, addLast } from '../helpers/getset'
import { defaultPeriodLength } from '../config'
import { findFirstEntryInGroups } from '../helpers/findFirstEntryInGroups'

///////// Selector /////////

const configSelector = compose(reduceIn('config'), defaultState({}))

///////// Set Config Reducer /////////

const setConfigEntry = (state = {}, { activeDatasetId, keyPath, value }) =>
  setIn([activeDatasetId, ...keyPath], value)(state)

const addUniqueValue = value => (valueList = []) =>
  valueList.includes(value) ? valueList : addLast(value)(valueList)

const pushConfigEntry = (state = {}, { activeDatasetId, keyPath, value }) =>
  updateIn([activeDatasetId, ...keyPath], addUniqueValue)(state)

const replaceConfigEntry = (state = {}, { activeDatasetId, keyPath, value }) =>
  setIn([activeDatasetId, ...keyPath], [value])(state)

const setConfigMultiValueEntry = (state, action) =>
  action.replaceValue
    ? replaceConfigEntry(state, action)
    : pushConfigEntry(state, action)

const setConfig = (state, action) =>
  action.multiValue
    ? setConfigMultiValueEntry(state, action)
    : setConfigEntry(state, action)

const setConfigReducer = compose(configSelector, reduceFor(CONFIG_CHANGED))(
  setConfig
)

///////// Add initial config /////////

const initCategoryKeys = ({ dimensionList = [], categoryGroups }) => {
  return dimensionList.reduce((memo, dimensionKey) => {
    memo[dimensionKey] = findFirstEntryInGroups({
      groups: get(dimensionKey)(categoryGroups),
      groupsPropName: 'categoryGroups',
      entriesPropName: 'categories',
    })
    return memo
  }, {})
}

const initConfig = ({
  id,
  tableInfo,
  topicGroups,
  dimensions,
  categoryGroups,
}) =>
  defaultsDeep({
    id,
    periodType: getIn(['periodTypes', 0])(tableInfo),
    periodLength: defaultPeriodLength,
    topicKey: findFirstEntryInGroups({
      groups: topicGroups,
      groupsPropName: 'topicGroups',
      entriesPropName: 'topics',
    }),
    categoryKeys: initCategoryKeys({
      dimensionList: dimensions.order,
      categoryGroups,
    }),
  })

const addInitialConfig = (state = {}, action) =>
  update(action.id, initConfig(action))(state)

const initialConfigForDatasetReducer = compose(
  configSelector,
  reduceFor(METADATA_LOAD_SUCCESS)
)(addInitialConfig)

///////// Config Reducer /////////

export const configReducer = composeReducers(
  setConfigReducer,
  initialConfigForDatasetReducer
)
