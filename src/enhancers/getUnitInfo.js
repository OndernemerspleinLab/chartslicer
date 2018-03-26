import { getIn } from '../helpers/getset'

export const getUnitInfo = ({ unit, decimals, labelAliases }) => {
	const unitAlias = getIn([`unit/${unit}`])(labelAliases)
	const unitLabel = unitAlias || unit

	return {
		title: unitLabel,
		alias: unitAlias,
		key: unit,
		decimals,
	}
}
