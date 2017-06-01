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
import { existing } from './helpers'
import { connect } from 'react-redux'

export const onlyWhenLoaded = compose(
  connectActiveDatasetsNetworkState('loaded'),
  branch(({ loaded }) => !loaded, renderNothing)
)

export const connectConfigChange = compose(
  connectActions,
  connectActiveDataset({ id: ['id'] }),
  connectConfigFieldValue,
  withHandlers({
    onChange: ({ id, name, configChanged, inputValue }) => event => {
      const value = existing(inputValue)
        ? inputValue
        : event.currentTarget.value
      configChanged({ name, value, id })
    },
  })
)

const filterTakeRight = (predicate, length) => array => {
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

const dataFilterPredicate = ({
  topicKey,
  dimensionKey: { groupKey, key } = {},
}) => object => propertyExisting(topicKey)(object) && object[groupKey] === key

const propertyExisting = key => object => existing(object[key])

const filterDataset = (
  state,
  { periodType, periodLength, topicKey, dimensionKey }
) => {
  const { data: dataByPeriodType } = getFromActiveDataset({
    data: ['data', periodType],
  })(state) || []

  const data = filterTakeRight(
    dataFilterPredicate({ topicKey, dimensionKey }),
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
