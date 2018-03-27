import React from 'react'
import { Pencil } from './svg/Pencil'
import glamorous from 'glamorous'
import { wit } from './colors'
import { withStateHandlers } from 'recompose'
import { LabelEditor } from './LabelEditor'
import { Media, MediaFigure, MediaText } from './Media'
import { Frag } from './graphPickerSteps/Elements'

const EditButton = glamorous.button({
	display: 'inline-block',
	verticalAlign: 'middle',
	background: 'none',
	border: 'none',
	borderRadius: 0,
	color: wit,
	fill: 'currentColor',
	cursor: 'pointer',
	padding: 0,
})

const LabelEditButtonElement = ({
	children,
	dimensionType,
	info,
	alias,
	editorOpened,
	activeDatasetId,
	toggle,
	close,
	index,
	css,
}) => {
	return (
		<Frag>
			<EditButton onClick={toggle} css={css}>
				<Media alignItems="center">
					<MediaFigure>
						<Pencil css={{ marginRight: '0.3rem' }} />
					</MediaFigure>
					<MediaText>{children}</MediaText>
				</Media>
			</EditButton>
			{editorOpened ? (
				<LabelEditor
					info={info}
					dimensionType={dimensionType}
					alias={alias}
					activeDatasetId={activeDatasetId}
					close={close}
					index={index}
				/>
			) : null}
		</Frag>
	)
}

export const LabelEditButton = withStateHandlers(
	{ editorOpened: false },
	{
		open: () => () => ({ editorOpened: true }),
		close: () => () => ({ editorOpened: false }),
		toggle: ({ editorOpened }) => () => ({ editorOpened: !editorOpened }),
	},
)(LabelEditButtonElement)
