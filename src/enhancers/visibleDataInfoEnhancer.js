import { connect } from 'react-redux'
import { first, mapValues } from 'lodash/fp'
import { get, set } from '../helpers/getset'
import {
  visibleDatasetInfoConnector,
  dataEntriesConnector,
} from '../connectors/visibleDatasetQueryConnector'
import { existing } from '../helpers/helpers'
import { DIMENSION_TOPIC, minPeriodLength } from '../config'

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
}) => {
  if (!multiDimension) {
    const topicKey = first(topicKeys)
    const categoryKeyForDimensions = mapValues(first)(categoryKeys)

    return [
      {
        multiDimension,
        topicKey,
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
      return {
        multiDimension,
        topicKey,
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

    return {
      multiDimension,
      categoryKey: multiDimensionCategoryKey,
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
    })
  )

  return {
    ...visibleDatasetInfo,
    dataGroupsList,
  }
})
