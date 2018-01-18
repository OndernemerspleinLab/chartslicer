import { trim, toUpper } from 'lodash/fp'

export const parseUrl = maybeUrl => {
	try {
		return new URL(maybeUrl)
	} catch (error) {
		return false
	}
}

const isValidId = maybeId => /^[a-zA-Z0-9\-_]+$/.test(maybeId)

const extractFromUrl = parsedUrl => {
	const pathComponents = parsedUrl.hash.split('/')

	const index = pathComponents.findIndex(
		pathComponent => pathComponent === 'dataset',
	)

	const id = pathComponents[index + 1]

	return isValidId(id) ? toUpper(id) : false
}

const extractFromId = input => toUpper(input)

export const cbsIdExtractor = input => {
	const trimmedInput = trim(input)

	if (isValidId(trimmedInput)) {
		return extractFromId(trimmedInput)
	}

	const maybeParsedUrl = parseUrl(trimmedInput)

	if (maybeParsedUrl) {
		return extractFromUrl(maybeParsedUrl)
	}

	return false
}
