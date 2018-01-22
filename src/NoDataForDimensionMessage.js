import React from 'react'
import glamorous from 'glamorous'
import { diagonalStripesFactory } from './styles'
import { hemelblauw, wit } from './colors'
import { compose, branch, renderNothing } from 'recompose'
import { visibleDatasetEnhancer } from './enhancers/visibleDatasetEnhancer'
import {
	onlyWhenVisibleDataset,
	onlyWhenDataAvailable,
} from './enhancers/datasetGuardEnhancer'
import { existing } from './helpers/helpers'
import { Paragraph } from './graphPickerSteps/Elements'

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

const NoDataForDimensionHeading = glamorous.h2({
	fontSize: 'inherit',
	fontWeight: 'bold',
	margin: '0 0 0.2rem 0',
})

const NoDataForDimensionMessage = ({
	info: { title },
	dimensionLabelAlias,
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
		</NoDataForDimensionStyled>
	)
}

const NoDataForDimensionMessageListStyled = glamorous.div({
	marginTop: '1rem',
	display: 'flex',
	flexWrap: 'wrap',
})

const NoDataForDimensionMessageListComp = ({ rejectedDimensionInfo = [] }) => {
	return (
		<NoDataForDimensionMessageListStyled>
			{rejectedDimensionInfo.map(rejectedSingleDimensionInfo => {
				return (
					<NoDataForDimensionMessage
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
