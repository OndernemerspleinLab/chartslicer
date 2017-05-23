import { getStatlineUrl } from './config'
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
    pathComponent => pathComponent === 'dataset'
  )

  const id = pathComponents[index + 1]

  return isValidId(id)
    ? {
        id: pathComponents[index + 1],
        url: parsedUrl.href,
      }
    : false
}

const extractFromId = input =>
  isValidId(input)
    ? {
        id: input,
        url: getStatlineUrl(input),
      }
    : false

export const cbsIdExtractor = input => {
  const maybeParsedUrl = parseUrl(input)

  if (maybeParsedUrl) {
    return extractFromUrl(maybeParsedUrl)
  }

  return extractFromId(input)
}
