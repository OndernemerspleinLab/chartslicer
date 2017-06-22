import { branch, renderNothing } from 'recompose'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { visibleDatasetQueryConnector } from '../connectors/visibleDatasetQueryConnector'
import { unexisting, existing } from '../helpers/helpers'

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
