import React from 'react'
import glamorous from 'glamorous'
import { diagonalStripesFactory } from './styles'
import { hemelblauw, wit } from './colors'
import { compose, branch, renderNothing, withProps } from 'recompose'
import { visibleDatasetEnhancer } from './enhancers/visibleDatasetEnhancer'
import {
	onlyWhenVisibleDataset,
	onlyWhenDataAvailable,
} from './enhancers/datasetGuardEnhancer'
import { existing } from './helpers/helpers'
import { Paragraph, labelStyle, AlignRight } from './graphPickerSteps/Elements'
import { configChangeEnhancer } from './enhancers/configEnhancers'
import { maxDimensions } from './config'

const NoDataForDimensionStyled = glamorous.div({
	position: 'relative',
	background: hemelblauw.default,
	padding: '0.4rem 0.5rem 0.4rem 3rem',
	maxWidth: `20rem`,
	marginRight: '1rem',
	marginTop: '1rem',
	lineHeight: 1.2,
	color: wit,
	':after': {
		content: '""',
		position: 'absolute',
		left: 0,
		top: 0,
		height: '100%',
		width: '2.5rem',
		...diagonalStripesFactory({
			lightColor: hemelblauw.lighter,
			darkColor: hemelblauw.default,
		}),
	},
})

const NoDataForDimensionHeading = glamorous.h2(labelStyle, {
	margin: '0 0 0.3rem 0',
})

const DeselectButtonStyled = glamorous
	.button({
		background: 'none',
		border: 'none',
		padding: 0,
		color: 'inherit',
		textDecoration: 'underline',
		fontSize: '0.8rem',
		marginTop: '0.4rem',
		cursor: 'pointer',
	})
	.withProps({ type: 'button' })

const DeselectButtonComp = ({ onChange, children }) => {
	return (
		<DeselectButtonStyled onClick={onChange}>{children}</DeselectButtonStyled>
	)
}

const addCategoryPropsEnhancer = withProps(
	({ inputValue, dimensionKey, multiDimension }) => {
		return {
			multiValue: true,
			replaceValue: false,
			keyPath: ['categoryKeys', dimensionKey],
			inputValue,
			maxLength: maxDimensions,
		}
	},
)

const deleteCategoryEnhancer = compose(
	addCategoryPropsEnhancer,
	configChangeEnhancer,
)

const addTopicPropsEnhancer = withProps(({ inputValue, multiDimension }) => {
	return {
		multiValue: true,
		replaceValue: false,
		keyPath: ['topicKeys'],
		inputValue,
		maxLength: maxDimensions,
	}
})

const deleteTopicEnhancer = compose(addTopicPropsEnhancer, configChangeEnhancer)

const DeselectButton = branch(
	({ dimensionType }) => dimensionType === 'category',
	deleteCategoryEnhancer,
	deleteTopicEnhancer,
)(DeselectButtonComp)

const NoDataForDimensionMessage = ({
	info: { title, key, dimensionKey },
	dimensionLabelAlias,
	dimensionType,
	multiDimension,
}) => {
	return (
		<NoDataForDimensionStyled>
			<NoDataForDimensionHeading>
				In deze configuratie is geen data beschikbaar voor:
			</NoDataForDimensionHeading>
			<Paragraph>
				‘{title}’
				{existing(dimensionLabelAlias)
					? ` (alias: ‘${dimensionLabelAlias}’)`
					: null}
			</Paragraph>
			<AlignRight>
				<DeselectButton
					dimensionType={dimensionType}
					multiDimension={multiDimension}
					inputValue={key}
					dimensionKey={dimensionKey}
				>
					Deselecteren
				</DeselectButton>
			</AlignRight>
		</NoDataForDimensionStyled>
	)
}

const NoDataForDimensionMessageListStyled = glamorous.div({
	marginTop: '1rem',
	display: 'flex',
	flexWrap: 'wrap',
})

const NoDataForDimensionMessageListComp = ({
	multiDimension,
	rejectedDimensionInfo = [],
}) => {
	return (
		<NoDataForDimensionMessageListStyled>
			{rejectedDimensionInfo.map(rejectedSingleDimensionInfo => {
				return (
					<NoDataForDimensionMessage
						multiDimension={multiDimension}
						{...rejectedSingleDimensionInfo}
						key={rejectedSingleDimensionInfo.dimensionKey}
					/>
				)
			})}
		</NoDataForDimensionMessageListStyled>
	)
}

export const NoDataForDimensionMessageList = compose(
	onlyWhenVisibleDataset,
	visibleDatasetEnhancer,
	onlyWhenDataAvailable,
	branch(
		({ rejectedDimensionInfo = [] }) => rejectedDimensionInfo.length <= 0,
		renderNothing,
	),
)(NoDataForDimensionMessageListComp)
