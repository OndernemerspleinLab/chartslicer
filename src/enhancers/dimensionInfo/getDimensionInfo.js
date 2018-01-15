import { getDimensionLabel } from './getDimensionLabel'
import { getDimensionDataProperties } from './getDimensionDataProperties'
import { chartColors } from '../../config'

export const getDimensionInfo = ({
  dimensionKeys,
  multiDimension,
  valuesByDimension,
  selectedTopics,
  selectedCategories,
  labelAliases,
}) => {
  const dimensionInfo = dimensionKeys.map((dimensionKey, index) => {
    const dimensionLabel = getDimensionLabel({
      multiDimension,
      selectedTopics,
      selectedCategories,
      labelAliases,
      dimensionKey,
    })

    const chartColor = chartColors[index]

    const dimensionDataProperties = getDimensionDataProperties({
      dimensionKey,
      valuesByDimension,
    })

    return {
      dimensionKey,
      ...dimensionLabel,
      ...dimensionDataProperties,
      chartColor,
    }
  })

  return dimensionInfo
}
