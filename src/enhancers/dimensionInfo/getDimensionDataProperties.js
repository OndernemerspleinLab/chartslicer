import { isNumber } from '../../helpers/helpers'
import { getIn, set, update } from '../../helpers/getset'

export const getDimensionDataProperties = ({
  dimensionKey,
  valuesByDimension,
}) => {
  const valueObject = getIn([dimensionKey])(valuesByDimension)
  const valueList = Object.values(valueObject)
  const { length } = valueList

  if (length <= 0) return {}

  const dataProperties = valueList.reduce(
    (memo, value) => {
      if (!isNumber(value)) {
        return memo
      }

      const nextMemo = update('total', total => total + value)(memo)

      if (value < 0) {
        const min = Math.min(value, nextMemo.min)
        return set('min', min)(nextMemo)
      }

      const max = Math.max(value, nextMemo.max)
      return set('max', max)(nextMemo)
    },
    { min: 0, max: 0, total: 0 }
  )

  return set('average', dataProperties.total / length)(dataProperties)
}
