import { updateIn, set } from '../helpers/getset'
import { mapValues } from 'lodash/fp'
import { reduceFor, composeReducers } from './reducerHelpers'
import {
  ACCORDION_OPENED,
  ACCORDION_CLOSED,
  ACCORDION_ALL_OPENED,
  ACCORDION_ALL_CLOSED,
} from '../actions/actions'
import { DIMENSION_TOPIC } from '../config'
import { existing } from '../helpers/helpers'

const getKeyPath = ({ activeDatasetId, id, dimensionKey }) => {
  const idKeyPath = existing(id) ? [id] : []

  if (dimensionKey === DIMENSION_TOPIC) {
    return ['topicGroups', activeDatasetId, ...idKeyPath]
  }

  return ['categoryGroups', activeDatasetId, dimensionKey, ...idKeyPath]
}

const closeAccordion = set('opened', false)
const openAccordion = set('opened', true)

const updateAccordions = updater => (state, action) => {
  const keyPath = getKeyPath(action)

  return updateIn(keyPath, updater)(state)
}

const openAccordionReducer = reduceFor(ACCORDION_OPENED)(
  updateAccordions(openAccordion)
)

const closeAccordionReducer = reduceFor(ACCORDION_CLOSED)(
  updateAccordions(closeAccordion)
)

const openAllAccordionReducers = reduceFor(ACCORDION_ALL_OPENED)(
  updateAccordions(mapValues(openAccordion))
)

const closeAllAccordionReducers = reduceFor(ACCORDION_ALL_CLOSED)(
  updateAccordions(mapValues(closeAccordion))
)

export const accordionReducer = composeReducers(
  openAccordionReducer,
  closeAccordionReducer,
  openAllAccordionReducers,
  closeAllAccordionReducers
)
