import { existing } from '../helpers/helpers'
import { get } from '../helpers/getset'
import { datasetSelectionChanged } from '../actions/actionCreators'
import { listenOn } from '../helpers/domHelpers'

export const localStorageKey = 'redux/chartslicer'

const manageUrl = ({ getState }) => () => {
  const activeDatasetId = get('activeDatasetId')(getState())

  if (existing(activeDatasetId)) {
    window.location.hash = activeDatasetId
  }
}

export const persistState = ({ getState }) => () => {
  const stateWithConfig = { config: get('config')(getState()) }
  const json = JSON.stringify(stateWithConfig)

  try {
    localStorage.setItem(localStorageKey, json)
  } catch (error) {}
}

export const rehydrateState = () => {
  try {
    return JSON.parse(localStorage.getItem(localStorageKey))
  } catch (error) {}
}

const handleUrlChange = ({ dispatch, getState }) => () => {
  const activeDatasetId = get('activeDatasetId')(getState())
  const locationActiveDatasetId = window.location.hash.replace(/^#/, '')

  if (locationActiveDatasetId !== activeDatasetId) {
    dispatch(
      datasetSelectionChanged({
        input: locationActiveDatasetId,
      })
    )
  }
}

export const managePersistence = store => {
  store.subscribe(persistState(store))
  store.subscribe(manageUrl(store))
  listenOn('hashchange', handleUrlChange(store))(window)
  handleUrlChange(store)()
}
