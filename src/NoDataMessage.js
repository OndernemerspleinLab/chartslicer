import React from 'react'
import { onlyWhenVisibleDatasetHasNoData } from './enhancers/datasetGuardEnhancer'
import glamorous from 'glamorous'
import { fadeInAnimation, diagonalStripesFactory } from './styles'
import { nest } from 'recompose'
import { hemelblauw } from './colors'
import { mqBig } from './config'

const NoDataMessageStyled = nest(
	glamorous.div(
		{
			animation: fadeInAnimation,
			position: 'relative',
			top: 0,
			left: 0,
			right: 0,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'stretch',
			margin: '0 -1rem 2rem -1rem',
			[mqBig]: {
				marginLeft: '-3rem',
				marginRight: '-3rem',
			},
		},
		diagonalStripesFactory({
			lightColor: hemelblauw.lighter,
			darkColor: hemelblauw.default,
		}),
	),
	glamorous.div({
		backgroundColor: hemelblauw.default,
		color: hemelblauw.lighter,
		padding: '1rem 0.5rem',
		margin: '0 2.5rem',
	}),
)

const Message = glamorous.h2({
	margin: 0,
	fontSize: '1.3rem',
	lineHeight: 1.15,
	textAlign: 'center',
})

const NoDataMessageComponent = () => {
	return (
		<NoDataMessageStyled>
			<Message>Geen data beschikbaar voor deze configuratie</Message>
		</NoDataMessageStyled>
	)
}
export const NoDataMessage = onlyWhenVisibleDatasetHasNoData(
	NoDataMessageComponent,
)
