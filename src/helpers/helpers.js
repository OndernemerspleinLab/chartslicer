//@flow

import { negate } from 'lodash/fp'
import { thousandsSeperator, numberSeperator } from '../config'

export const minimal = (minimum: number) => (number: number): number =>
  Math.max(minimum, number)

export const minimalZero: number => number = minimal(0)

export const existing = (maybe: mixed): boolean => maybe != null
export const unexisting: mixed => boolean = negate(existing)

export const bracketize = (string: string): string => `(${string})`

export const chunkNumberString = (chunkSize: number) => (
  string: string
): string[] => {
  const memo = []

  for (
    let restString = string;
    restString.length > 0;
    restString = restString.slice(0, -3)
  ) {
    memo.unshift(restString.slice(-3))
  }

  return memo
}

export const formatNumber = (decimals: number = 0) => (
  number: ?number
): ?string => {
  if (typeof number !== 'number') {
    return number
  }

  const numberString = String(number)

  const [integerString, decimalString = ''] = numberString.split('.')

  const formattedDecimals = decimalString
    .slice(0, decimals)
    .padEnd(decimals, '0')

  const formattedIntegers = integerString.length <= 4
    ? integerString
    : chunkNumberString(3)(integerString).join(thousandsSeperator)

  return formattedDecimals.length > 0
    ? `${formattedIntegers}${numberSeperator}${formattedDecimals}`
    : formattedIntegers
}