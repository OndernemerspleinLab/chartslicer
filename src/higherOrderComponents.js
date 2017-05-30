import { branch, renderNothing } from 'recompose'
import { compose } from 'redux'
import {
  connectActiveDatasetsNetworkState,
} from './reducers/networkStateReducer'

export const onlyWhenLoaded = compose(
  connectActiveDatasetsNetworkState('loaded'),
  branch(({ loaded }) => !loaded, renderNothing)
)
