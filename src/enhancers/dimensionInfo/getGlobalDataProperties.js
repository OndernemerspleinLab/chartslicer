export const getGlobalDataProperties = (dimensionInfo = []) => {
	if (dimensionInfo.length <= 0) {
		return {}
	}

	const { min: globalMin, max: globalMax } = dimensionInfo.reduce(
		({ min: globalMin, max: globalMax }, { min, max }) => {
			return {
				min: Math.min(globalMin, min),
				max: Math.max(globalMax, max),
			}
		},
	)

	const globalMiddle = (globalMin + globalMax) / 2

	return {
		globalMin,
		globalMax,
		globalMiddle,
	}
}
