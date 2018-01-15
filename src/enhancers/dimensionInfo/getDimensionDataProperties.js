import { isNumber } from '../../helpers/helpers'
import { getIn, set, update } from '../../helpers/getset'
import { compose } from 'recompose'

export const getDimensionDataProperties = ({
  dimensionKey,
  valuesByDimension,
}) => {
  const valueObject = getIn([dimensionKey])(valuesByDimension)
  const valueList = Object.values(valueObject)

  if (valueList.length <= 0) return {}

  const dataProperties = valueList.reduce(
    (memo, value) => {
      if (!isNumber(value)) {
        return memo
      }

      const nextMemo = compose(
        update('total', total => total + value),
        update('length', length => length + 1)
      )(memo)

      if (value < 0) {
        const min = Math.min(value, nextMemo.min)
        return set('min', min)(nextMemo)
      }

      const max = Math.max(value, nextMemo.max)
      return set('max', max)(nextMemo)
    },
    { min: 0, max: 0, total: 0, length: 0 }
  )

  const { total, length } = dataProperties

  return length > 0
    ? set('average', total / length)(dataProperties)
    : dataProperties
}
