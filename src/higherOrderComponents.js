import { branch, renderNothing, withHandlers } from 'recompose'
import { compose } from 'redux'
import {
  connectActiveDatasetsNetworkState,
} from './reducers/networkStateReducer'
import { connectActions } from './store'
import {
  connectActiveDataset,
  getFromActiveDataset,
} from './reducers/datasetsReducer'
import {
  connectConfigFieldValue,
  connectFullConfig,
} from './reducers/configReducer'
import { flatten, find } from 'lodash/fp'
import { existing } from './helpers'
import { connect } from 'react-redux'
import { getConfigValues } from './reducers/configReducer'

export const onlyWhenLoaded = compose(
  connectActiveDatasetsNetworkState('loaded'),
  branch(({ loaded }) => !loaded, renderNothing)
)

export const connectConfigChange = compose(
  connectActions,
  connectActiveDataset({ fieldId: ['id'] }),
  connectConfigFieldValue,
  withHandlers({
    onChange: ({ fieldId, name, configChanged, inputValue }) => event => {
      const value = existing(inputValue)
        ? inputValue
        : event.currentTarget.value
      configChanged({ name, value, id: fieldId })
    },
  })
)

const filterTakeRight = (predicate, length) => (array = []) => {
  const memo = []

  for (
    let index = array.length - 1;
    index >= 0 && memo.length < length;
    index -= 1
  ) {
    const value = array[index]
    if (predicate(value, index, array)) {
      memo.unshift(value)
    }
  }

  return memo
}

const equalsPropFrom = object => ([key, value]) => {
  return object[key] === value
}

const dataFilterPredicate = ({ topicKey, dimensionKeys = {} }) => entry => {
  const matchesTopicKey = propertyExisting(topicKey)(entry)
  const matchesDimensions = Object.entries(dimensionKeys).every(
    equalsPropFrom(entry)
  )

  return matchesTopicKey && matchesDimensions
}

const propertyExisting = key => object => existing(object[key])

const filterDataset = (
  state,
  { periodType, periodLength, topicKey, dimensionKeys }
) => {
  const { data: dataByPeriodType } = getFromActiveDataset({
    data: ['data', periodType],
  })(state) || []

  const data = filterTakeRight(
    dataFilterPredicate({ topicKey, dimensionKeys }),
    periodLength
  )(dataByPeriodType)

  return {
    data,
  }
}

export const connectFilteredDataset = compose(
  connectFullConfig,
  connect(filterDataset)
)

export const connectDataInfo = connect(state => {
  const { topicKey } = getConfigValues('topicKey')(state)
  const { topics } = getFromActiveDataset({
    topics: ['dataProperties', 'Topic'],
  })(state)
  const { periodType } = getConfigValues(['periodType'])(state)

  const findTopic = topicKey => find(({ Key }) => Key === topicKey)
  const topic = compose(findTopic(topicKey), flatten, Object.values)(
    topics
  ) || {}

  return { topic, periodType }
})
