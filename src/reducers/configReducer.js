import { CONFIG_CHANGED, DATASET_LOAD_SUCCESS } from '../actions/actions'
import {
  reduceFor,
  reduceIn,
  defaultState,
  composeReducers,
} from './reducerHelpers'
import { compose } from 'redux'
import { reduce, first, mapValues } from 'lodash/fp'
import {
  set,
  setIn,
  get,
  getIn,
  update,
  addDefaults,
  updateIn,
  addLast,
} from '../getset'
import { connect } from 'react-redux'
import { defaultPeriodLength } from '../config'
import { existing } from '../helpers'

///////// Selector /////////

const configSelector = compose(reduceIn('config'), defaultState({}))

///////// Set Config Reducer /////////

const setConfigEntry = (state = {}, { id, keyPath, value }) =>
  setIn([id, ...keyPath], value)(state)

const addUniqueValue = value => (valueList = []) =>
  valueList.includes(value) ? valueList : addLast(value)(valueList)

const pushConfigEntry = (state = {}, { id, keyPath, value }) =>
  updateIn([id, ...keyPath], addUniqueValue)(state)

const replaceConfigEntry = (state = {}, { id, keyPath, value }) =>
  setIn([id, ...keyPath], [value])(state)

const setConfigMultiValueEntry = (state, action) =>
  action.replaceValue
    ? replaceConfigEntry(state, action)
    : pushConfigEntry(state, action)

const addKeyPath = (state, action) =>
  existing(action.keyPath) ? action : set('keyPath', action.name)(action)

const setConfig = (state, action) =>
  action.multiValue
    ? setConfigMultiValueEntry(state, action)
    : setConfigEntry(state, action)

export const setConfigReducer = compose(
  configSelector,
  reduceFor(CONFIG_CHANGED)
)(compose(setConfig, addKeyPath))

///////// Add initial config /////////

const getFirstKey = getIn([0, 'Key'])

const findDefaultDimensions = ({ dataProperties, dimensions }) => {
  return mapValues(getFirstKey)(dimensions)
}

const findFirstTopicInGroup = ({ Topic = {}, groupId }) => {
  const group = Topic[groupId]
  const firstTopic = first(group)

  if (firstTopic) {
    return firstTopic.Key
  }
}

const findFirstTopicInGroups = ({ Topic, TopicGroup = {}, groupId }) => {
  const topicGroups = TopicGroup[groupId]

  if (!topicGroups) {
    return
  }

  for (let topicGroup of topicGroups) {
    const firstKey = findFirstTopicInGroup({ Topic, groupId: topicGroup.ID })

    if (firstKey) {
      return firstKey
    }

    return findFirstTopicInGroups({ Topic, TopicGroup, groupId: topicGroup.ID })
  }
}

const findFirstTopic = ({ Topic, TopicGroup }) => {
  const firstKey = findFirstTopicInGroup({ Topic, groupId: 'root' })

  if (firstKey) {
    return firstKey
  }

  return findFirstTopicInGroups({ Topic, TopicGroup, groupId: 'root' })
}

const initConfig = ({ id, data, dataProperties, dimensions }) => (
  config = {}
) =>
  addDefaults({
    id,
    periodType: first(Object.keys(data)),
    periodLength: defaultPeriodLength,
    topicKey: findFirstTopic(dataProperties),
    dimensionKeys: findDefaultDimensions({ dataProperties, dimensions }),
  })(config)

const addInitialConfig = (state = {}, action) =>
  update(action.id, initConfig(action))(state)

const initialConfigForDatasetReducer = compose(
  configSelector,
  reduceFor(DATASET_LOAD_SUCCESS)
)(addInitialConfig)

///////// Config Reducer /////////

export const configReducer = composeReducers(initialConfigForDatasetReducer)

// GETTERS

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

export const connectFullConfig = connect(
  ({ activeDatasetId, config }) => get(activeDatasetId)(config) || {}
)
