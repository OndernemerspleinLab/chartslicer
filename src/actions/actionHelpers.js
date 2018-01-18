const plucker = source => (memo, propName) => {
	memo[propName] = source[propName]
	return memo
}

export const createSimpleAction = (type, ...propNames) => props =>
	Object.assign({ type }, propNames.reduce(plucker(props), {}))
