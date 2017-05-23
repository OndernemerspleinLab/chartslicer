const counterName = 'graphPicker'

export const counterResetStyle = {
  counterReset: counterName,
}

export const getCounterStyle = (...styles) => ({
  ':before': Object.assign(
    {
      content: `counter(${counterName})`,
      counterIncrement: counterName,
    },
    ...styles
  ),
})
