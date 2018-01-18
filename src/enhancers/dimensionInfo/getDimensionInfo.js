import { sortBy } from 'lodash/fp'
import { getDimensionLabel } from './getDimensionLabel'
import { getDimensionDataProperties } from './getDimensionDataProperties'
import { chartColors } from '../../config'
import { set } from '../../helpers/getset'

export const getDimensionInfo = ({
	dimensionKeys,
	multiDimension,
	valuesByDimension,
	selectedTopics,
	selectedCategories,
	labelAliases,
}) => {
	const dimensionInfo = dimensionKeys.map(dimensionKey => {
		const dimensionLabel = getDimensionLabel({
			multiDimension,
			selectedTopics,
			selectedCategories,
			labelAliases,
			dimensionKey,
		})

		const dimensionDataProperties = getDimensionDataProperties({
			dimensionKey,
			valuesByDimension,
		})

		return {
			dimensionKey,
			...dimensionLabel,
			...dimensionDataProperties,
		}
	})

	const sortedDimensionInfo = sortBy(({ average }) => -average)(dimensionInfo)

	const sortedDimensionInfoWithChartColors = sortedDimensionInfo.map(
		(singleDimensionInfo, index) =>
			set('chartColor', chartColors[index])(singleDimensionInfo),
	)

	return sortedDimensionInfoWithChartColors
}
