import { existing } from './../helpers/helpers'
import { getIn } from './../helpers/getset'
import { activeDatasetGetIdConnector } from './../connectors/activeDatasetIdConnector'
import { configConnector } from './../connectors/configConnectors'
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

export const shouldPersist = ({ activeDatasetId, activeConfig }) => {
  const field = getField()

  return (
    existing(field) &&
    !field.getReadOnly() &&
    existing(activeDatasetId) &&
    existing(activeConfig)
  )
}

export const canPersist = () => {
  const tridion = getIn(['opener', 'Tridion'])(window)

  return existing(tridion)
}

export const getPersistentData = () => {
  const tridionData = getJsonValue()

  return typeof tridionData === 'object' && existing(tridionData.id)
    ? {
        activeDatasetId: tridionData.id,
        [tridionData.id]: tridionData,
      }
    : {}
}

export const setPersistentData = state => {
  const activeDatasetId = activeDatasetGetIdConnector(state)
  const activeConfig = configConnector(state)

  if (
    !shouldPersist({
      activeDatasetId,
      activeConfig,
    })
  ) {
    return
  }

  setJsonValue(activeConfig)
}
