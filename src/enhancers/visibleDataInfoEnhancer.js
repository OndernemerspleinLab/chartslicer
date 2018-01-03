import { connect } from 'react-redux'
import { first, mapValues } from 'lodash/fp'
import { get, set, getIn } from '../helpers/getset'
import {
  visibleDatasetInfoConnector,
  dataEntriesConnector,
} from '../connectors/visibleDatasetQueryConnector'
import { existing } from '../helpers/helpers'
import { DIMENSION_TOPIC, minPeriodLength } from '../config'
import { topicsGetConnector } from '../connectors/topicConnectors'
import { categoriesGetInConnector } from '../connectors/categoryConnectors'
import { branch, renderNothing, compose } from 'recompose'

const dataEntryFilter = ({
  dataEntries,
  topicKey,
  categoryKeyForDimensions,
}) => dataEntryId => {
  const entry = get(dataEntryId)(dataEntries)

  return (
    existing(get(topicKey)(entry)) &&
    Object.entries(categoryKeyForDimensions).every(
      ([dimensionKey, categoryKey]) => get(dimensionKey)(entry) === categoryKey
    )
  )
}

const dataEntryMap = ({ topicKey, dataEntries }) => dataEntryId => {
  const entry = get(dataEntryId)(dataEntries) || {}
  const value = get(topicKey)(entry)
  const { id, periodDate, periodType } = entry

  return {
    id,
    periodDate,
    periodType,
    value,
  }
}

const getFilteredDataEntryList = ({
  dataList,
  dataEntries,
  topicKey,
  categoryKeyForDimensions,
}) => {
  return dataList
    .filter(
      dataEntryFilter({
        dataEntries,
        topicKey,
        categoryKeyForDimensions,
      })
    )
    .map(dataEntryMap({ topicKey, dataEntries }))
}

const arrangeDataEntries = ({
  multiDimension,
  topicKeys,
  categoryKeys,
  dataEntries,
  dataList,
  state,
}) => {
  if (!multiDimension) {
    const topicKey = first(topicKeys)
    const categoryKeyForDimensions = mapValues(first)(categoryKeys)
    const { title } = topicsGetConnector(topicKey)(state)

    return [
      {
        title,
        dataEntryList: getFilteredDataEntryList({
          dataList,
          dataEntries,
          topicKey,
          categoryKeyForDimensions,
        }),
      },
    ]
  }

  if (multiDimension === DIMENSION_TOPIC) {
    const categoryKeyForDimensions = mapValues(first)(categoryKeys)

    return topicKeys.map(topicKey => {
      const { title } = topicsGetConnector(topicKey)(state)

      return {
        title,
        dataEntryList: getFilteredDataEntryList({
          dataList,
          dataEntries,
          topicKey,
          categoryKeyForDimensions,
        }),
      }
    })
  }

  const topicKey = first(topicKeys)

  const multiDimensionCategoryKeys = categoryKeys[multiDimension] || []

  const categoryKeyForAllDimensions = mapValues(first)(categoryKeys)

  return multiDimensionCategoryKeys.map(multiDimensionCategoryKey => {
    const categoryKeyForDimensions = set(
      multiDimension,
      multiDimensionCategoryKey
    )(categoryKeyForAllDimensions)

    const { title } = categoriesGetInConnector([
      multiDimension,
      multiDimensionCategoryKey,
    ])(state)

    return {
      title,
      dataEntryList: getFilteredDataEntryList({
        dataList,
        dataEntries,
        topicKey,
        categoryKeyForDimensions,
      }),
    }
  })
}

const sortDataGroupsList = dataGroupsList => {
  return dataGroupsList.sort((list1, list2) => {
    const firstValue1 = getIn(['dataEntryList', '0', 'value'])(list1)
    const firstValue2 = getIn(['dataEntryList', '0', 'value'])(list2)

    return firstValue1 > firstValue2 ? -1 : firstValue1 < firstValue2 ? 1 : 0
  })
}
const filterDataGroupsList = dataGroupsList =>
  dataGroupsList.filter(
    ({ dataEntryList }) => dataEntryList.length >= minPeriodLength
  )

const getDataGroupsList = compose(
  sortDataGroupsList,
  filterDataGroupsList,
  arrangeDataEntries
)

export const visibleDataInfoConnector = state => {
  const visibleDatasetInfo = visibleDatasetInfoConnector(state)
  const { dataEntries } = dataEntriesConnector(state)
  const {
    multiDimension,
    topicKeys,
    categoryKeys,
    dataList,
  } = visibleDatasetInfo

  const dataGroupsList = getDataGroupsList({
    multiDimension,
    topicKeys,
    categoryKeys,
    dataEntries,
    dataList,
    state,
  })

  const { unit, decimals } = topicsGetConnector(first(topicKeys))(state)

  return {
    ...visibleDatasetInfo,
    dataGroupsList,
    unit,
    decimals,
  }
}
export const visibleDataInfoEnhancer = connect(visibleDataInfoConnector)

export const onlyWhenDataGroupsList = branch(
  ({ dataGroupsList }) => dataGroupsList.length <= 0,
  renderNothing
)
