export const first = (iterable = []) => iterable[0]
export const last = (iterable = []) => iterable[iterable.length - 1]
export const getOffset = offset => index => (iterable = []) => {
  const offsetIndex = index + offset

  if (offsetIndex < 0 || offsetIndex >= iterable.length) {
    return undefined
  }

  return iterable[offsetIndex]
}
export const next = getOffset(1)
export const previous = getOffset(-1)

export const push = value => (iterable = []) => iterable.concat([value])
