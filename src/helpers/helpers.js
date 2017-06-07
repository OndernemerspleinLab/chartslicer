import { negate } from 'lodash/fp'

export const minimal = minimum => number => Math.max(minimum, number)

export const minimalZero = minimal(0)

export const existing = maybe => maybe != null
export const unexisting = negate(existing)
