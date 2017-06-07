import { branch, renderNothing } from 'recompose'
import { compose } from 'redux'
import { connect } from 'react-redux'
import {
  metadataIsLoadedConnector,
  metadataIsLoadingConnector,
} from '../connectors/metadataLoadingStateConnectors'

export const onlyWhenMetadataLoaded = compose(
  connect(metadataIsLoadedConnector),
  branch(({ loaded }) => !loaded, renderNothing)
)

export const onlyWhenMetadataNotLoaded = compose(
  connect(metadataIsLoadingConnector),
  branch(({ loaded }) => loaded, renderNothing)
)
