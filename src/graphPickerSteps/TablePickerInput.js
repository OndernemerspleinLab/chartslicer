import { compose, withHandlers, withState } from 'recompose'
import React from 'react'
import { Label, Input } from './Elements'
import { Submit } from '../CallToAction'
import { Media, MediaText, MediaFigure } from '../Media'
import { marginBottomHalfStyle } from '../marginStyle'
import { afterPaste } from '../helpers/domHelpers'
import { borderRadiusOnlyLeft } from '../styles'
import { connectActions } from '../connectors/actionConnectors'
import { metadataIsLoadingConnector } from '../connectors/metadataLoadingStateConnectors'
import { connect } from 'react-redux'

const enhancer = compose(
	connectActions,
	connect(metadataIsLoadingConnector),
	withState('value', 'updateValue', ''),
	withHandlers({
		onChange: ({ updateValue }) => event =>
			updateValue(event.currentTarget.value),
		onSubmit: ({ datasetSelectionChanged, value }) => event => {
			event.preventDefault()
			datasetSelectionChanged({ input: value })
		},
		onPaste: ({ datasetSelectionChanged }) =>
			afterPaste(event => {
				datasetSelectionChanged({
					input: event.currentTarget.value,
				})
			}),
	}),
)
export const TablePickerInput = enhancer(
	({ onChange, onSubmit, onPaste, updateValue, loading }) => (
		<form onSubmit={onSubmit}>
			<Label htmlFor="tableIdInput" css={marginBottomHalfStyle}>
				Dataset URL of ID
			</Label>
			<Media>
				<MediaText>
					<Input
						type="text"
						id="tableIdInput"
						css={borderRadiusOnlyLeft}
						onPaste={onPaste}
						onChange={onChange}
					/>
				</MediaText>
				<MediaFigure>
					<Submit loading={loading}>{'Kies'}</Submit>
				</MediaFigure>
			</Media>
		</form>
	),
)
