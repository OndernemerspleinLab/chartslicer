import { isNumber } from '../helpers/helpers'
import { set } from '../helpers/getset'

export const getDataEntryListProperties = dataEntryList => {
  return dataEntryList.reduce(
    (memo, dataEntry) => {
      const { value } = dataEntry

      if (!isNumber(value)) {
        return memo
      }

      if (value < 0) {
        const min = Math.min(value, memo.min)
        return set('min', min)(memo)
      }

      const max = Math.max(value, memo.max)
      return set('max', max)(memo)
    },
    { min: 0, max: 0 }
  )
}
