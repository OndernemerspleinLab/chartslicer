import { connect } from 'react-redux'
import { first, mapValues } from 'lodash/fp'
import { get, set } from '../helpers/getset'
import {
  visibleDatasetInfoConnector,
  dataEntriesConnector,
} from '../connectors/visibleDatasetQueryConnector'
import { existing } from '../helpers/helpers'
import { DIMENSION_TOPIC, minPeriodLength } from '../config'
import { topicsGetConnector } from '../connectors/topicConnectors'
import { categoriesGetInConnector } from '../connectors/categoryConnectors'
import { branch, renderNothing } from 'recompose'

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

const filterDataGroupsList = dataGroupsList =>
  dataGroupsList.filter(
    ({ dataEntryList }) => dataEntryList.length >= minPeriodLength
  )

export const visibleDataInfoEnhancer = connect(state => {
  const visibleDatasetInfo = visibleDatasetInfoConnector(state)
  const { dataEntries } = dataEntriesConnector(state)
  const {
    multiDimension,
    topicKeys,
    categoryKeys,
    dataList,
  } = visibleDatasetInfo

  const dataGroupsList = filterDataGroupsList(
    arrangeDataEntries({
      multiDimension,
      topicKeys,
      categoryKeys,
      dataEntries,
      dataList,
      state,
    })
  )

  return {
    ...visibleDatasetInfo,
    dataGroupsList,
  }
})

export const onlyWhenDataGroupsList = branch(
  ({ dataGroupsList }) => dataGroupsList.length <= 0,
  renderNothing
)
