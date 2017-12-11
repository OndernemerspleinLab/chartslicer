import {
  CONFIG_CHANGED,
  METADATA_LOAD_SUCCESS,
  MULTI_DIMENSION_CHANGED,
} from '../actions/actions'
import {
  reduceFor,
  reduceIn,
  defaultState,
  composeReducers,
} from './reducerHelpers'
import { compose } from 'redux'
import { defaultsDeep } from 'lodash/fp'
import {
  setIn,
  set,
  get,
  getIn,
  update,
  updateIn,
  addLast,
  omitFromArray,
} from '../helpers/getset'
import { defaultPeriodLength } from '../config'
import { findFirstEntryInGroups } from '../helpers/findFirstEntryInGroups'
import { existing } from '../helpers/helpers'

///////// Selector /////////

const configSelector = compose(reduceIn('config'), defaultState({}))

///////// Set Config Reducer /////////

const setConfigEntry = (state = {}, { activeDatasetId, keyPath, value }) =>
  setIn([activeDatasetId, ...keyPath], value)(state)

const removeValue = value => valueList =>
  valueList.length > 1 ? omitFromArray(value)(valueList) : valueList

const toggleUniqueValue = value => (valueList = []) => {
  return valueList.includes(value)
    ? removeValue(value)(valueList)
    : addLast(value)(valueList)
}

const sliceValueList = maxLength => valueList => {
  return existing(maxLength) ? valueList.slice(-maxLength) : valueList
}

const toggleConfigEntry = (
  state = {},
  { activeDatasetId, keyPath, value, maxLength }
) => {
  return updateIn(
    [activeDatasetId, ...keyPath],
    compose(sliceValueList(maxLength), toggleUniqueValue(value))
  )(state)
}

const replaceConfigEntry = (
  state = {},
  { activeDatasetId, keyPath, value }
) => {
  return setIn([activeDatasetId, ...keyPath], [value])(state)
}

const setConfigMultiValueEntry = (state, action) => {
  return action.replaceValue
    ? replaceConfigEntry(state, action)
    : toggleConfigEntry(state, action)
}
const setConfig = (state, action) => {
  return action.multiValue
    ? setConfigMultiValueEntry(state, action)
    : setConfigEntry(state, action)
}

const makeSingleDimension = (valueList = []) => {
  if (valueList.length > 1) {
    return valueList.slice(-1)
  }

  return valueList
}

const resolveMultiDimensionChangeForTopics = multiDimension => topicKeys => {
  return multiDimension === 'topic' ? topicKeys : makeSingleDimension(topicKeys)
}

const resolveMultiDimensionChangeForCategory = multiDimension => (
  memo,
  [dimensionKey, categoryKeys]
) => {
  return multiDimension === dimensionKey
    ? memo
    : set(dimensionKey, makeSingleDimension(categoryKeys))(memo)
}

const resolveMultiDimensionChangeForCategories = multiDimension => (
  categories = {}
) => {
  return Object.entries(categories).reduce(
    resolveMultiDimensionChangeForCategory(multiDimension),
    categories
  )
}

const resolveMultiDimensionChange = (
  state,
  { activeDatasetId, multiDimension }
) => {
  if (!activeDatasetId) {
    return state
  }

  return compose(
    updateIn(
      [activeDatasetId, 'topicKeys'],
      resolveMultiDimensionChangeForTopics(multiDimension)
    ),
    updateIn(
      [activeDatasetId, 'categoryKeys'],
      resolveMultiDimensionChangeForCategories(multiDimension)
    )
  )(state)
}

const setConfigReducer = compose(configSelector, reduceFor(CONFIG_CHANGED))(
  setConfig
)

const setMultiDimension = (state, { activeDatasetId, multiDimension }) => {
  return setIn([activeDatasetId, 'multiDimension'], multiDimension)(state)
}

const setMultiDimensionReducer = compose(
  configSelector,
  reduceFor(MULTI_DIMENSION_CHANGED)
)(composeReducers(resolveMultiDimensionChange, setMultiDimension))

///////// Add initial config /////////

const initCategoryKeys = ({ dimensionList = [], categoryGroups }) => {
  return dimensionList.reduce((memo, dimensionKey) => {
    memo[dimensionKey] = [
      findFirstEntryInGroups({
        groups: get(dimensionKey)(categoryGroups),
        groupsPropName: 'categoryGroups',
        entriesPropName: 'categories',
      }),
    ]
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
    title: '',
    description: '',
    multiDimension: false,
    topicKeys: [
      findFirstEntryInGroups({
        groups: topicGroups,
        groupsPropName: 'topicGroups',
        entriesPropName: 'topics',
      }),
    ],
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
  setMultiDimensionReducer,
  initialConfigForDatasetReducer
)
