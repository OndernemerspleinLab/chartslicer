// @flow

import {
	getActiveSubstate,
	pickFromActiveSubstate,
	mapFromActiveSubstate,
} from './connectorHelpers'
import { get } from '../helpers/getset'

export const allMetadataLoadingStateConnector = get('metadataLoadingState')

export const metadataLoadingStateConnector = getActiveSubstate(
	'metadataLoadingState',
)

export const metadataLoadingStatePickConnector = pickFromActiveSubstate(
	metadataLoadingStateConnector,
)

export const metadataLoadingStateMapConnector = mapFromActiveSubstate(
	metadataLoadingStateConnector,
)

export const metadataIsLoadingConnector = pickFromActiveSubstate(
	metadataLoadingStateConnector,
)(['loading'])

export const metadataIsLoadedConnector = pickFromActiveSubstate(
	metadataLoadingStateConnector,
)(['loaded'])

export const metadataErrorConnector = pickFromActiveSubstate(
	metadataLoadingStateConnector,
)(['error'])
