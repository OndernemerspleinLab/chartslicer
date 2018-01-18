import React from 'react'
import glamorous from 'glamorous'
import { hemelblauw } from './colors'
import { nest, compose } from 'recompose'
import { Paragraph, InlineTerm } from './graphPickerSteps/Elements'
import { onlyWhenActiveQueryError } from './enhancers/datasetEnhancer'
import { mqBig } from './config'
import { popupEnhancer } from './enhancers/popupEnhancer'
import { fadeInAnimation } from './styles'

const stripeWidth = 6

const DataQueryErrorElement = nest(
	glamorous.div({
		animation: fadeInAnimation,
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'stretch',
		backgroundColor: hemelblauw.default,
		color: hemelblauw.lighter,
		textAlign: 'center',

		backgroundImage: `repeating-linear-gradient(-45deg, ${
			hemelblauw.lighter
		}, ${hemelblauw.lighter} ${stripeWidth}px, ${
			hemelblauw.default
		} ${stripeWidth}px, ${hemelblauw.default} ${stripeWidth * 2 + 1}px)`,
	}),
	glamorous.div({
		backgroundColor: hemelblauw.default,
		padding: '0.4rem 2rem',
		margin: '0 1rem',
		[mqBig]: {
			margin: '0 3rem',
		},
	}),
)
const Message = glamorous.h2({
	margin: 0,
	fontSize: '1.3rem',
	lineHeight: 1.15,
})
const ErrorText = glamorous.code({})

const CloseButton = glamorous.button({
	background: 'none',
	border: 'none',
	color: 'inherit',
	position: 'absolute',
	left: 0,
	top: 0,
	width: '100%',
	height: '100%',
	':after': {
		content: '"×"',
		position: 'absolute',
		top: 0,
		fontSize: '2rem',
		lineHeight: 0.4,
		padding: '0.5rem',
		right: '1rem',
		cursor: 'pointer',
		[mqBig]: {
			right: '3rem',
		},
	},
})

const DataQueryErrorContainer = ({ error = {}, close }) => {
	return (
		<DataQueryErrorElement onClick={close}>
			<Message>Het ophalen van de data is niet gelukt</Message>
			<Paragraph>
				<InlineTerm>Foutmelding:</InlineTerm>{' '}
				<ErrorText>{error.message}</ErrorText>
			</Paragraph>
			<CloseButton onClick={close} />
		</DataQueryErrorElement>
	)
}

export const DataQueryError = compose(onlyWhenActiveQueryError, popupEnhancer)(
	DataQueryErrorContainer,
)
