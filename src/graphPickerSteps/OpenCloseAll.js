import React from 'react'
import { AccordionButton, Hidden } from './Elements'
import { openCloseEnhancer } from '../enhancers/accordionEnhancer'
import glamorous from 'glamorous'

const OpenCloseAllStyled = glamorous.div({
	display: 'flex',
	padding: '0.5rem 0 0.5rem 0.5rem',
})

const OpenCloseAllComponent = ({ openAll, closeAll }) => {
	return (
		<OpenCloseAllStyled>
			<AccordionButton onClick={openAll}>
				<Hidden>Alles openen</Hidden>
			</AccordionButton>
			<AccordionButton opened={true} onClick={closeAll}>
				<Hidden>Alles sluiten</Hidden>
			</AccordionButton>
		</OpenCloseAllStyled>
	)
}

export const OpenCloseAll = openCloseEnhancer(OpenCloseAllComponent)
