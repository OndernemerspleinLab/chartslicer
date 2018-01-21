import React from 'react'
import {
	Step,
	StepTitle,
	GroupLabel,
	Radio,
	Form,
	FormRow,
	AccordionButton,
	CloseAccordion,
	Checkbox,
	Alias,
	Sticky,
} from './Elements'
import glamorous from 'glamorous'
import { violet } from '../colors'
import { configChangeEnhancer } from '../enhancers/configEnhancers'
import { onlyWhenMetadataLoaded } from '../enhancers/metadataEnhancers'
import { compose, branch, renderNothing } from 'recompose'
import { topicEnhancer, topicGroupEnhancer } from '../enhancers/topicEnhancers'
import { unexisting } from '../helpers/helpers'
import { fadeInAnimation } from '../styles'
import { MultiDimensionOption } from './MultiDimensionPicker'
import { first } from 'lodash/fp'
import { maxDimensions, DIMENSION_TOPIC } from '../config'
import { MediaText, MediaFigure, Media } from '../Media'
import { OpenCloseAll } from './OpenCloseAll'
import { InputTooltip } from './Tooltips'

const RadioTopicUnit = compose(
	branch(({ children }) => unexisting(children), renderNothing),
)(
	glamorous.span({
		fontSize: '0.8rem',
		':before': {
			content: '"("',
		},
		':after': {
			content: '")"',
		},
	}),
)

const TopicRadioComp = ({
	title,
	description,
	unit,
	inputValue,
	onChange,
	name,
	value,
	isMultiDimension,
	differentSelectionGroup,
	alias,
}) => {
	const id = `topic-${inputValue}`
	const checked = isMultiDimension
		? value.includes(inputValue)
		: first(value) === inputValue
	const commonProps = {
		id,
		name,
		value: inputValue,
		onChange,
		differentSelectionGroup,
		checked,
		afterChildren: (
			<InputTooltip
				checked={checked}
				differentSelectionGroup={differentSelectionGroup}
				id={id}
				title={title}
				description={description}
			/>
		),
		children: (
			<React.Fragment>
				{title} <RadioTopicUnit>{unit}</RadioTopicUnit>
				<Alias>{alias}</Alias>
			</React.Fragment>
		),
	}
	return isMultiDimension ? (
		<Checkbox {...commonProps} />
	) : (
		<Radio {...commonProps} />
	)
}
const TopicRadio = compose(topicEnhancer, configChangeEnhancer)(TopicRadioComp)

const TopicGroupComp = glamorous.div(
	{
		animation: fadeInAnimation,
	},
	({ topicGroupId }) =>
		topicGroupId === 'root'
			? null
			: {
					paddingLeft: '0.3rem',
					borderLeft: `2px solid ${violet.default}`,
					marginBottom: '1rem',
				},
)

const TopicGroupContainer = ({
	title,
	topics = [],
	topicGroups = [],
	topicGroupId,
	asAccordion,
	includesSelection,
	toggle,
	close,
	opened,
}) => {
	const topicGroupHtmlId = `topicGroupLabel-${topicGroupId}`
	return (
		<TopicGroupComp
			topicGroupId={topicGroupId}
			aria-labelledby={topicGroupHtmlId}
			role={topicGroupId === 'root' ? 'radiogroup' : 'group'}
		>
			<GroupLabel id={topicGroupHtmlId}>
				{asAccordion ? (
					<AccordionButton
						onClick={toggle}
						opened={opened}
						includesSelection={includesSelection}
					>
						{title}
					</AccordionButton>
				) : (
					title
				)}
			</GroupLabel>
			{opened || !asAccordion ? (
				<FormRow css={{ animation: fadeInAnimation }}>
					{topics.map(topicKey => (
						<TopicRadio key={topicKey} topicKey={topicKey} />
					))}
				</FormRow>
			) : null}
			{opened || !asAccordion
				? topicGroups.map(topicGroupId => (
						<TopicGroup key={topicGroupId} topicGroupId={topicGroupId} />
					))
				: null}
			{asAccordion && opened ? (
				<CloseAccordion onClick={close}>Sluit {title}</CloseAccordion>
			) : null}
		</TopicGroupComp>
	)
}

const TopicGroup = topicGroupEnhancer(TopicGroupContainer)

export const TopicPicker = onlyWhenMetadataLoaded(() => (
	<Step>
		<Sticky>
			<Media>
				<MediaText>
					<StepTitle>Kies het onderwerp</StepTitle>
				</MediaText>
				<MediaFigure>
					<OpenCloseAll dimensionKey={DIMENSION_TOPIC} />
				</MediaFigure>
			</Media>
		</Sticky>
		<MultiDimensionOption inputValue={DIMENSION_TOPIC}>
			Meerdere onderwerpen selecteren (maximaal {maxDimensions})
		</MultiDimensionOption>
		<Form>
			<TopicGroup topicGroupId={'root'} title={'Onderwerpen'} />
		</Form>
	</Step>
))
