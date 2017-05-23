import { getTableInfoUrl } from './config'
import { TABLE_ID_SELECTING } from './actions'
import { cbsIdExtractor } from './cbsIdExtractor'
import { makeFetchLatest } from './fetchLatest'

const plucker = source => (memo, propName) => {
  memo[propName] = source[propName]
  return memo
}
const createSimpleAction = (type, ...propNames) => props =>
  Object.assign({ type }, propNames.reduce(plucker(props), {}))

export const tableIdSelecting = createSimpleAction(
  TABLE_ID_SELECTING,
  'id',
  'url'
)

const fetchLatestTableInfo = makeFetchLatest()

export const tableSelectionChanged = input => dispatch => {
  const maybeExtracted = cbsIdExtractor(input)

  if (!maybeExtracted) {
    return
  }
  dispatch(tableIdSelecting(maybeExtracted))
  fetchLatestTableInfo(getTableInfoUrl(maybeExtracted.id))
    .then(r => console.log('S', r))
    .catch(e => console.log('E', e))
}
