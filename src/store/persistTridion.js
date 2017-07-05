import { weakMemoize } from './../helpers/weakMemoize'
import { first } from 'lodash/fp'

const getFieldFromWindow = weakMemoize(dialogArguments => {
  if (typeof dialogArguments.getFields === 'function') {
    const fields = dialogArguments.getFields()

    return fields[0]
  }
})

const getField = () => {
  if (typeof window.dialogArguments !== 'object') {
    return undefined
  }

  return getFieldFromWindow(window.dialogArguments)
}

const getValue = () => {
  const field = getField()

  if (typeof field === 'object' && typeof field.getValues === 'function') {
    return first(field.getValues())
  }
}

const setValue = value => {
  const field = getField()

  if (typeof field === 'object' && typeof field.setValues === 'function') {
    return first(field.setValues([value]))
  }
}

const getJsonValue = () => {
  try {
    const rawValue = getValue()

    const value = JSON.parse(rawValue)

    return value
  } catch (e) {}
}

const setJsonValue = jsValue => {
  try {
    const value = JSON.stringify(jsValue)

    setValue(value)

    return true
  } catch (e) {
    return false
  }
}

export const canPersist = () => {
  const field = getField()

  return typeof field === 'object'
}

export const getPersistentData = () => {
  const tridionData = getJsonValue()

  return typeof tridionData === 'object' ? tridionData : {}
}

export const setPersistentData = state => {
  setJsonValue(state)
}
