import { branch, renderNothing } from 'recompose'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { visibleDatasetQueryConnector } from '../connectors/visibleDatasetQueryConnector'
import { unexisting, existing } from '../helpers/helpers'
import { dataQueryLoadingStateConnector } from '../connectors/datasetsLoadingStateConnectors'
import { visibleDatasetEnhancer } from './visibleDatasetEnhancer'

export const onlyWhenVisibleDataset = compose(
	connect(visibleDatasetQueryConnector),
	branch(
		({ visibleDatasetQuery }) => unexisting(visibleDatasetQuery),
		renderNothing,
	),
)

export const onlyWhenNoVisibleDataset = compose(
	connect(visibleDatasetQueryConnector),
	branch(
		({ visibleDatasetQuery }) => existing(visibleDatasetQuery),
		renderNothing,
	),
)

export const onlyWhenActiveQueryLoading = compose(
	connect(dataQueryLoadingStateConnector),
	branch(({ loading } = {}) => !loading, renderNothing),
)

export const onlyWhenActiveQueryError = compose(
	connect(dataQueryLoadingStateConnector),
	branch(({ error } = {}) => unexisting(error), renderNothing),
)

export const onlyWhenDataAvailable = branch(
	({ dimensionInfo = [] }) => dimensionInfo.length <= 0,
	renderNothing,
)

export const onlyWhenVisibleDatasetHasNoData = compose(
	onlyWhenVisibleDataset,
	visibleDatasetEnhancer,
	branch(({ dimensionInfo = [] }) => dimensionInfo.length > 0, renderNothing),
)
