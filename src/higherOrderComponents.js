import { branch, renderNothing, withHandlers } from 'recompose'
import { compose } from 'redux'
import {
  connectActiveDatasetsNetworkState,
} from './reducers/networkStateReducer'
import { connectActions } from './store'
import { connectActiveDataset } from './reducers/datasetsReducer'
import { connectConfigFieldValue } from './reducers/configReducer'

export const onlyWhenLoaded = compose(
  connectActiveDatasetsNetworkState('loaded'),
  branch(({ loaded }) => !loaded, renderNothing)
)

export const connectConfigChange = compose(
  connectActions,
  connectActiveDataset({ id: ['id'] }),
  connectConfigFieldValue,
  withHandlers({
    onChange: ({ id, configChanged }) => event => {
      const { name, value } = event.currentTarget
      configChanged({ name, value, id })
    },
  })
)
