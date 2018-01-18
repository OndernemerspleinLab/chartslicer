import { getIn } from '../../helpers/getset'
import { existing } from '../../helpers/helpers'

const getValue = ({ dimensionKey, valuesByDimension, periodDate }) => {
	const value = getIn([dimensionKey, periodDate])(valuesByDimension)

	return existing(value) ? value : null
}

export const getDimensionData = ({
	periodDatesInRange,
	dimensionKey,
	valuesByDimension,
}) => {
	const dimensionData = periodDatesInRange.map(periodDate => {
		return {
			x: periodDate,
			y: getValue({ dimensionKey, valuesByDimension, periodDate }),
		}
	})

	const filteredDimensionData = dimensionData.filter(({ y }) => existing(y))

	return {
		dimensionData,
		filteredDimensionData,
	}
}
