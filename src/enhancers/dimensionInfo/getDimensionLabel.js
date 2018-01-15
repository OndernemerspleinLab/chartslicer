import { DIMENSION_TOPIC } from '../../config'
import { getIn } from '../../helpers/getset'

export const getDimensionLabel = ({
  multiDimension,
  selectedTopics,
  selectedCategories,
  labelAliases,
  dimensionKey,
}) => {
  if (!multiDimension || multiDimension === DIMENSION_TOPIC) {
    const dimensionLabelAlias = getIn([`topic/${dimensionKey}`])(labelAliases)
    const info = getIn([dimensionKey])(selectedTopics)

    const dimensionLabel = dimensionLabelAlias || getIn(['title'])(info)

    return { dimensionLabel, dimensionLabelAlias, info, dimensionType: 'topic' }
  }

  const dimensionLabelAlias = getIn([
    `category/${multiDimension}/${dimensionKey}`,
  ])(labelAliases)
  const info = getIn([multiDimension, dimensionKey])(selectedCategories)

  const dimensionLabel = dimensionLabelAlias || getIn(['title'])(info)

  return {
    dimensionLabel,
    dimensionLabelAlias,
    info,
    dimensionType: 'category',
  }
}
