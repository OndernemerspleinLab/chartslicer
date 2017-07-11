import { existing } from './../helpers/helpers'
import { getIn } from './../helpers/getset'
import { activeDatasetGetIdConnector } from './../connectors/activeDatasetIdConnector'
import { configConnector } from './../connectors/configConnectors'
import { weakMemoize } from './../helpers/weakMemoize'
import { first } from 'lodash/fp'

const getFieldFromOpener = weakMemoize(opener => {
  const getView = getIn(['$display', 'getView'])(opener)

  if (typeof getView !== 'function') {
    return
  }

  const tridionView = getView()

  const tridionFieldBuilder = getIn(['properties', 'controls', 'fieldBuilder'])(
    tridionView
  )

  if (typeof tridionFieldBuilder !== 'object' && tridionFieldBuilder !== null) {
    return
  }

  const field = tridionFieldBuilder.getField('Text')

  return field
})

const getField = () => {
  const { opener } = window

  if (typeof opener === 'object' && opener !== null) {
    return getFieldFromOpener(opener)
  }
}

const getValue = () => {
  const field = getField()

  if (
    typeof field === 'object' &&
    field !== null &&
    typeof field.getValues === 'function'
  ) {
    return first(field.getValues())
  }
}

const setValue = value => {
  const field = getField()

  if (typeof field === 'object' && typeof field.setValues === 'function') {
    field.setValues([value])
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
  const field = getField()

  return existing(field)
}

export const getPersistentData = () => {
  const tridionData = getJsonValue()

  return typeof tridionData === 'object' && existing(tridionData.id)
    ? {
        activeDatasetId: tridionData.id,
        config: {
          [tridionData.id]: tridionData,
        },
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
