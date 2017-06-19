//@flow

import { negate } from 'lodash/fp'

export const minimal = (minimum: number) => (number: number): number =>
  Math.max(minimum, number)

export const minimalZero: number => number = minimal(0)

export const existing = (maybe: mixed): boolean => maybe != null
export const unexisting: mixed => boolean = negate(existing)

export const bracketize = (string: string): string => `(${string})`
