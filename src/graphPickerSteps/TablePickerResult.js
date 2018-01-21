import React from 'react'
import { get } from '../helpers/getset'
import { compose, branch, renderComponent } from 'recompose'
import { existing } from '../helpers/helpers'
import {
	Message,
	StepErrorMessage,
	StepTitle,
	Paragraph,
	InlineTerm,
} from './Elements'
import { metadataErrorConnector } from '../connectors/metadataLoadingStateConnectors'
import { connect } from 'react-redux'
import { tableInfoPickConnector } from '../connectors/tableInfoConnectors'
import { composeConnectors } from '../connectors/connectorHelpers'
import { onlyWhenMetadataLoaded } from '../enhancers/metadataEnhancers'
import { MediaText, Media, MediaFigure } from '../Media'
import { TitleTooltip } from './Tooltips'

const connectMetadata = compose(
	connect(
		composeConnectors(
			metadataErrorConnector,
			tableInfoPickConnector(['title', 'id', 'description']),
		),
	),
)

const TablePickerResultContainer = ({ title, id, description }) => (
	<Message>
		<Media>
			<MediaText>
				<StepTitle>{title}</StepTitle>
			</MediaText>
			{Boolean(description) ? (
				<MediaFigure>
					<TitleTooltip title={title} description={description} />
				</MediaFigure>
			) : null}
		</Media>
		<Paragraph>
			<InlineTerm>Dataset ID:</InlineTerm> <code>{id}</code>
		</Paragraph>
	</Message>
)

const ResultError = ({ error }) => (
	<StepErrorMessage>
		<StepTitle>Het ophalen van de dataset is niet gelukt</StepTitle>
		<Paragraph>
			<InlineTerm>Foutmelding:</InlineTerm> <code>{get('message')(error)}</code>
		</Paragraph>
	</StepErrorMessage>
)

const errorEnhancer = branch(
	({ error }) => existing(error),
	renderComponent(ResultError),
)

const enhancer = compose(connectMetadata, errorEnhancer, onlyWhenMetadataLoaded)

export const TablePickerResult = enhancer(TablePickerResultContainer)
