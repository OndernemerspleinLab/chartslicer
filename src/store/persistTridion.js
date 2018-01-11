import { selectedTopicsConnector } from '../connectors/topicConnectors'
import { existing, unexisting } from './../helpers/helpers'
import { getIn, omit } from './../helpers/getset'
import { activeDatasetGetIdConnector } from './../connectors/activeDatasetIdConnector'
import { configConnector } from './../connectors/configConnectors'
import { first } from 'lodash/fp'
import { tableLanguageGetter } from '../connectors/tableInfoConnectors'
import { allSelectedCategoriesConnector } from '../connectors/categoryConnectors'
import { metadataIsLoadedConnector } from '../connectors/metadataLoadingStateConnectors'

const getFieldFromOpener = opener => {
  const getView = getIn(['$display', 'getView'])(opener)

  if (unexisting(getView)) {
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
}

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
    existing(field.getValues)
  ) {
    return first(field.getValues())
  }
}

const setValue = value => {
  const field = getField()

  if (typeof field === 'object' && existing(field.setValues)) {
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
    const value = JSON.stringify(jsValue, null, '  ')

    setValue(value)

    return true
  } catch (e) {
    return false
  }
}

export const isWritable = () => {
  const field = getField()

  return existing(field) && !field.getReadOnly()
}

export const shouldPersist = ({
  activeDatasetId,
  activeConfig,
  loadedMetadata,
}) => {
  return (
    isWritable() &&
    loadedMetadata &&
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
          [tridionData.id]: omit([
            'selectedTopics',
            'selectedCategories',
            'language',
          ])(tridionData),
        },
      }
    : {}
}

export const gatherPersistentData = state => {
  const activeConfig = configConnector(state)
  const language = tableLanguageGetter(state)
  const { selectedTopics } = selectedTopicsConnector(state)
  const { selectedCategories } = allSelectedCategoriesConnector(state)

  return {
    language,
    selectedTopics,
    selectedCategories,
    ...activeConfig,
  }
}

export const setPersistentData = state => {
  const activeDatasetId = activeDatasetGetIdConnector(state)
  const activeConfig = configConnector(state)
  const loadedMetadata = metadataIsLoadedConnector(state)

  if (
    !shouldPersist({
      activeDatasetId,
      activeConfig,
      loadedMetadata,
    })
  ) {
    return
  }
  const data = gatherPersistentData(state)

  setJsonValue(data)
}
