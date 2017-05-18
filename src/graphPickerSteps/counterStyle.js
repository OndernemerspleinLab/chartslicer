const counterName = 'graphPicker'

export const counterResetStyle = {
  counterReset: counterName,
}

export const counterStyle = {
  ':before': {
    content: `counter(${counterName})`,
    counterIncrement: counterName,
  },
}
