import { branch, renderNothing } from 'recompose'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { visibleDatasetQueryConnector } from '../connectors/visibleDatasetQueryConnector'
import { unexisting, existing } from '../helpers/helpers'
import { dataQueryLoadingStateConnector } from '../connectors/datasetsLoadingStateConnectors'

export const onlyWhenVisibleDataset = compose(
  connect(visibleDatasetQueryConnector),
  branch(
    ({ visibleDatasetQuery }) => unexisting(visibleDatasetQuery),
    renderNothing
  )
)

export const onlyWhenNoVisibleDataset = compose(
  connect(visibleDatasetQueryConnector),
  branch(
    ({ visibleDatasetQuery }) => existing(visibleDatasetQuery),
    renderNothing
  )
)

export const onlyWhenActiveQueryLoading = compose(
  connect(dataQueryLoadingStateConnector),
  branch(({ loading } = {}) => !loading, renderNothing)
)
