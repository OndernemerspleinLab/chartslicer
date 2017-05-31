import { branch, renderNothing, withHandlers } from 'recompose'
import { compose } from 'redux'
import {
  connectActiveDatasetsNetworkState,
} from './reducers/networkStateReducer'
import { connectActions } from './store'
import { connectActiveDataset } from './reducers/datasetsReducer'
import { connectConfigFieldValue } from './reducers/configReducer'
import { existing } from './helpers'

export const onlyWhenLoaded = compose(
  connectActiveDatasetsNetworkState('loaded'),
  branch(({ loaded }) => !loaded, renderNothing)
)

export const connectConfigChange = compose(
  connectActions,
  connectActiveDataset({ id: ['id'] }),
  connectConfigFieldValue,
  withHandlers({
    onChange: ({ id, name, configChanged, inputValue }) => event => {
      const value = existing(inputValue)
        ? inputValue
        : event.currentTarget.value
      configChanged({ name, value, id })
    },
  })
)
