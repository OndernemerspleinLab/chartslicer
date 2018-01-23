import React from 'react'
import glamorous from 'glamorous'
import { Modal } from './Modal'
import {
	withProps,
	withStateHandlers,
	compose,
	withHandlers,
	nest,
	branch,
	renderNothing,
} from 'recompose'
import { connectActions } from './connectors/actionConnectors'
import { violet } from './colors'
import {
	borderRadius,
	borderRadiusOnlyLeft,
	sideScrollbarStyle,
} from './styles'
import {
	Label,
	Input,
	Hidden,
	AlignRight,
	Paragraph,
	FlexIEMinMaxHeightFix,
	labelStyle,
} from './graphPickerSteps/Elements'
import { css } from 'glamor'
import { Submit } from './CallToAction'
import { Media, MediaText, MediaFigure } from './Media'
import { autofocusEnhancer } from './enhancers/autofocusEnhancer'
import { onlyWhenChildren } from './enhancers/onlyWhenChildren'
import { withCloseOnEscape } from './enhancers/withCloseOnEscape'

const Form = glamorous.form(borderRadius, {
	display: 'flex',
	flexDirection: 'column',
	maxHeight: '90vh',
	position: 'relative',
	flex: 'none',
	backgroundColor: violet.lightest,
	color: violet.default,
	border: `2px solid ${violet.default}`,
	width: '30rem',
	maxWidth: '90vw',
	padding: '0.8rem 1rem 0.5rem 1rem',
	transform: 'translate(-50%, -50%)',
})

const FieldContainer = glamorous.div({
	flex: 'none',
})

const LabelAliasInput = withProps({
	type: 'text',
	css: css(borderRadiusOnlyLeft),
})(autofocusEnhancer(Input))

const LabelAliasLabel = withProps({
	css: css({
		marginBottom: '0.8rem',
		paddingRight: '1rem',
	}),
})(Label)

const CloseButtonElement = glamorous.button({
	position: 'absolute',
	border: 'none',
	background: 'none',
	padding: 0,
	borderRadius: 0,
	top: '0.4rem',
	right: '0.4rem',
	fontSize: '1.8rem',
	color: violet.darker,
	width: '1em',
	height: '1em',
	cursor: 'pointer',

	':after': {
		content: '"×"',
		display: 'block',
		width: '100%',
		height: '100%',
		fontWeight: 'normal',
		lineHeight: '1em',
		fontSize: '1em',
	},
})
const CloseButton = nest(
	withProps({ type: 'button' })(CloseButtonElement),
	Hidden,
)
const ResetButtonElement = glamorous.button({
	border: 'none',
	background: 'none',
	padding: 0,
	borderRadius: 0,
	color: 'inherit',
	textDecoration: 'underline',
	fontSize: '0.8rem',
	marginTop: '0.5rem',
	cursor: 'pointer',
})
const ResetButton = withProps({ type: 'button' })(ResetButtonElement)

const CopyButtonElement = glamorous.button({
	border: 'none',
	background: 'none',
	padding: 0,
	borderRadius: 0,
	color: 'inherit',
	textDecoration: 'underline',
	cursor: 'pointer',
})
const CopyButton = withProps({ type: 'button' })(CopyButtonElement)

const ClearButtonElement = glamorous.button({
	position: 'absolute',
	border: 'none',
	background: 'none',
	padding: 0,
	borderRadius: 0,
	top: '0.4rem',
	right: '0.4rem',
	fontSize: '1.4rem',
	color: violet.darker,
	width: '1em',
	height: '1em',

	':after': {
		content: '"×"',
		display: 'block',
		width: '100%',
		height: '100%',
		fontWeight: 'normal',
		lineHeight: '1em',
		fontSize: '1em',
	},
})
const ClearButton = nest(
	compose(
		branch(({ value }) => value.length <= 0, renderNothing),
		withProps({ type: 'button' }),
	)(ClearButtonElement),
	Hidden,
)

const DescriptionStyled = glamorous.div(sideScrollbarStyle, {
	overflowX: 'hidden',
	overflowY: 'auto',
	marginTop: '0.5rem',
	marginLeft: '-1rem',
	marginRight: '-1rem',
	marginBottom: '-0.5rem',
	paddingLeft: '1rem',
	paddingRight: '1rem',
	paddingBottom: '0.5rem',
	fontSize: '0.8rem',
	flex: 'auto',
})
const DescriptionTitle = glamorous.h2(labelStyle, {
	margin: '0 0 0.1rem 0',
})

const DescriptionComp = ({ children }) => {
	return (
		<DescriptionStyled>
			<DescriptionTitle>Beschrijving</DescriptionTitle>
			<Paragraph
				css={{
					whiteSpace: 'pre-wrap',
				}}
			>
				{children}
			</Paragraph>
		</DescriptionStyled>
	)
}

const Description = onlyWhenChildren(DescriptionComp)

const LabelEditorElement = ({
	info: { title, description },
	value,
	close,
	setValue,
	clearValue,
	setTitleAsValue,
	onSubmit,
	onReset,
	index,
	refInputDomElement,
}) => {
	const id = `labelAliasInput${index}`
	return (
		<Modal>
			<FlexIEMinMaxHeightFix>
				<Form onSubmit={onSubmit}>
					<FieldContainer>
						<LabelAliasLabel htmlFor={id}>
							Overschrijf label voor ‘<CopyButton onClick={setTitleAsValue}>
								{title}
							</CopyButton>’
						</LabelAliasLabel>

						<Media>
							<MediaText css={{ position: 'relative' }}>
								<LabelAliasInput
									id={id}
									value={value}
									onChange={setValue}
									innerRef={refInputDomElement}
								/>
								<ClearButton value={value} onClick={clearValue}>
									Veld leegmaken
								</ClearButton>
							</MediaText>
							<MediaFigure>
								<Submit>Opslaan</Submit>
							</MediaFigure>
						</Media>
						<AlignRight>
							<ResetButton onClick={onReset}>
								Resetten &amp; sluiten
							</ResetButton>
						</AlignRight>
					</FieldContainer>
					<Description>{description}</Description>
					<CloseButton onClick={close}>Sluiten</CloseButton>
				</Form>
			</FlexIEMinMaxHeightFix>
		</Modal>
	)
}

export const LabelEditor = compose(
	connectActions,
	withCloseOnEscape,
	withStateHandlers(({ alias }) => ({ value: alias || '' }), {
		setValue: () => event => ({ value: event.target.value }),
		clearValue: () => () => ({ value: '' }),
		setTitleAsValue: (_, { info: { title } }) => () => ({ value: title }),
		refInputDomElement: () => inputDomElement => ({ inputDomElement }),
	}),
	withHandlers({
		onReset: ({
			labelAliasChanged,
			info: { key, dimensionKey },
			dimensionType,
			close,
			activeDatasetId,
		}) => event => {
			event.preventDefault()
			labelAliasChanged({
				activeDatasetId,
				value: undefined,
				key,
				dimensionKey,
				aliasType: dimensionType,
			})
			close()
		},
		onSubmit: ({
			labelAliasChanged,
			value,
			info: { key, dimensionKey },
			dimensionType,
			close,
			activeDatasetId,
		}) => event => {
			event.preventDefault()
			labelAliasChanged({
				activeDatasetId,
				value,
				key,
				dimensionKey,
				aliasType: dimensionType,
			})
			close()
		},
	}),
)(LabelEditorElement)
