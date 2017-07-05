import { existing } from '../helpers/helpers'
import { get } from '../helpers/getset'
import { datasetSelectionChanged } from '../actions/actionCreators'
import { listenOn } from '../helpers/domHelpers'
import * as persistLocalStorage from './persistLocalStorage'
import * as persistTridion from './persistTridion'

const getLocationHash = () => window.location.hash.replace(/^#/, '')

const getUrlSearchParams = () => new URLSearchParams(getLocationHash())

const getUrlSearchParamDatasetId = () => getUrlSearchParams().get('datasetId')

const setActiveDatasetId = activeDatasetId => {
  const searchParams = getUrlSearchParams()

  searchParams.set('datasetId', activeDatasetId)

  const newHash = searchParams.toString()

  window.location.hash = newHash
}

const persist = persistTridion.canPersist()
  ? persistTridion
  : persistLocalStorage.canPersist() ? persistLocalStorage : undefined

const manageUrl = ({ getState }) => () => {
  const activeDatasetId = get('activeDatasetId')(getState())

  if (existing(activeDatasetId)) {
    setActiveDatasetId(activeDatasetId)
  }
}

export const persistState = ({ getState, setPersistentData }) => () => {
  const stateWithConfig = { config: get('config')(getState()) }

  setPersistentData(stateWithConfig)
}

export const rehydrateState = () => {
  const now = new Date()
  if (!persist) {
    return { now }
  }

  const localStorageData = persist.getPersistentData()

  return typeof localStorageData === 'object'
    ? {
        now,
        ...localStorageData,
      }
    : { now }
}

const handleUrlChange = ({ dispatch, getState }) => () => {
  const activeDatasetId = get('activeDatasetId')(getState())
  const locationActiveDatasetId = getUrlSearchParamDatasetId()

  if (locationActiveDatasetId !== activeDatasetId) {
    dispatch(
      datasetSelectionChanged({
        input: locationActiveDatasetId,
      })
    )
  }
}

export const managePersistence = store => {
  if (!persist) {
    return
  }

  store.subscribe(persistState({ ...store, ...persist }))
  store.subscribe(manageUrl({ ...store, ...persist }))
  listenOn('hashchange', handleUrlChange(store))(window)
  handleUrlChange(store)()
}
