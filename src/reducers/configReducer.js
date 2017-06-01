import { CONFIG_CHANGED, DATASET_LOAD_SUCCESS } from '../actions'
import { reduceFor, reduceIn, defaultState } from './reducerHelpers'
import { compose } from 'redux'
import { reduce, first, last } from 'lodash/fp'
import { set, setIn, get, getIn, update, addDefaults } from '../getset'
import { connect } from 'react-redux'
import { defaultPeriodLength } from '../config'
import { lastChild } from 'glamor'

const configReducerSelector = compose(reduceIn('config'), defaultState({}))

const configReducer = (state = {}, { id, name, value }) =>
  setIn([id, name], value)(state)

export const reduceConfig = compose(
  configReducerSelector,
  reduceFor(CONFIG_CHANGED)
)(configReducer)

const getFirstKeyFor = subcollectionKey => getIn([subcollectionKey, 0, 'Key'])

const getLastKeyFor = subcollectionKey =>
  compose(get('Key'), last, get(subcollectionKey))

const findFirstDimension = ({ dataProperties, dimensions }) => {
  const dimensionGroupKey =
    getFirstKeyFor('Dimension')(dataProperties) ||
    getFirstKeyFor('GeoDimension')(dataProperties)

  return {
    groupKey: dimensionGroupKey,
    key: getLastKeyFor(dimensionGroupKey)(dimensions),
  }
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
    dimensionKey: findFirstDimension({ dataProperties, dimensions }),
  })(config)

const newDatasetConfigReducer = (state = {}, action) =>
  update(action.id, initConfig(action))(state)

export const reduceNewDatasetConfig = compose(
  configReducerSelector,
  reduceFor(DATASET_LOAD_SUCCESS)
)(newDatasetConfigReducer)

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
