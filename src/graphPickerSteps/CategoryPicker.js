import React from 'react'
import {
	Step,
	StepTitle,
	GroupLabel,
	Checkbox,
	Radio,
	Form,
	FormRow,
	AccordionButton,
	CloseAccordion,
	Alias,
	Sticky,
	Frag,
} from './Elements'
import glamorous from 'glamorous'
import { violet } from '../colors'
import { configChangeEnhancer } from '../enhancers/configEnhancers'
import { onlyWhenMetadataLoaded } from '../enhancers/metadataEnhancers'
import { compose, pure } from 'recompose'
import {
	categoryEnhancer,
	categoryGroupEnhancer,
} from '../enhancers/categoryEnhancers'
import { dimensionForKeyEnhancer } from '../enhancers/dimensionEnhancers'
import { fadeInAnimation } from '../styles'
import { MultiDimensionOption } from './MultiDimensionPicker'
import { first } from 'lodash/fp'
import { maxDimensions } from '../config'
import { OpenCloseAll } from './OpenCloseAll'
import { Media, MediaText, MediaFigure } from '../Media'
import { InputTooltip } from './Tooltips'

const CategoryRadioComp = ({
	title,
	description,
	dimensionKey,
	inputValue,
	onChange,
	name,
	value = [],
	isMultiDimension,
	alias,
}) => {
	const id = `category-${dimensionKey}-${inputValue}`
	const checked = isMultiDimension
		? value.includes(inputValue)
		: first(value) === inputValue
	const commonProps = {
		id,
		name,
		value: inputValue,
		onChange,
		checked,
		afterChildren: (
			<InputTooltip
				checked={checked}
				id={id}
				title={title}
				description={description}
			/>
		),
		children: (
			<Frag>
				{title} <Alias>{alias}</Alias>
			</Frag>
		),
	}
	return isMultiDimension ? (
		<Checkbox {...commonProps} />
	) : (
		<Radio {...commonProps} />
	)
}
const CategoryRadio = compose(categoryEnhancer, configChangeEnhancer)(
	CategoryRadioComp,
)

const CategoryGroupComp = glamorous.div(
	{
		animation: fadeInAnimation,
	},
	({ categoryGroupId }) =>
		categoryGroupId === 'root'
			? null
			: {
					paddingLeft: '0.3rem',
					borderLeft: `2px solid ${violet.default}`,
					marginBottom: '1rem',
				},
)

const CategoryGroupContainer = pure(
	({
		title,
		dimensionKey,
		categories = [],
		categoryGroups = [],
		categoryGroupId,
		asAccordion,
		includesSelection,
		toggle,
		close,
		opened,
	}) => {
		const categoryGroupHtmlId = `categoryGroup-${categoryGroupId}`

		return (
			<CategoryGroupComp
				categoryGroupId={categoryGroupId}
				aria-labelledby={categoryGroupHtmlId}
				role={categoryGroupId === 'root' ? 'radiogroup' : 'group'}
			>
				<GroupLabel id={categoryGroupHtmlId}>
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
						{categories.map(categoryKey => (
							<CategoryRadio
								key={categoryKey}
								categoryKey={categoryKey}
								dimensionKey={dimensionKey}
							/>
						))}
					</FormRow>
				) : null}
				{opened || !asAccordion
					? categoryGroups.map(categoryGroupId => (
							<CategoryGroup
								key={categoryGroupId}
								categoryGroupId={categoryGroupId}
								dimensionKey={dimensionKey}
							/>
						))
					: null}
				{asAccordion && opened ? (
					<CloseAccordion onClick={close}>Sluit {title}</CloseAccordion>
				) : null}
			</CategoryGroupComp>
		)
	},
)

const CategoryGroup = categoryGroupEnhancer(CategoryGroupContainer)

export const CategoryPicker = compose(
	pure,
	onlyWhenMetadataLoaded,
	dimensionForKeyEnhancer,
)(({ dimensionKey, title }) => (
	<Step>
		<Sticky>
			<Media>
				<MediaText>
					<StepTitle sticky>Filter op ‘{title}’</StepTitle>
				</MediaText>
				<MediaFigure>
					<OpenCloseAll dimensionKey={dimensionKey} />
				</MediaFigure>
			</Media>
		</Sticky>
		<MultiDimensionOption inputValue={dimensionKey}>
			Meerdere ‘{title}’ selecteren (maximaal {maxDimensions})
		</MultiDimensionOption>
		<Form>
			<CategoryGroup
				categoryGroupId={'root'}
				dimensionKey={dimensionKey}
				title={'Categorieën'}
			/>
		</Form>
	</Step>
))
