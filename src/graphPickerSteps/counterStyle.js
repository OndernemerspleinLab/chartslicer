import { css } from 'glamor'
const counterName = 'graphPicker'

export const counterResetStyle = {
  counterReset: counterName,
}

export const getCounterStyle = (...styles) => ({
  ':before': css(
    {
      content: `counter(${counterName})`,
      counterIncrement: counterName,
    },
    ...styles
  ),
})
