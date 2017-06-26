import { branch, renderNothing } from 'recompose'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { metadataIsLoadedConnector } from '../connectors/metadataLoadingStateConnectors'

export const onlyWhenMetadataLoaded = compose(
  connect(metadataIsLoadedConnector),
  branch(({ loaded }) => !loaded, renderNothing)
)

export const onlyWhenMetadataNotLoaded = compose(
  connect(metadataIsLoadedConnector),
  branch(({ loaded }) => loaded, renderNothing)
)
