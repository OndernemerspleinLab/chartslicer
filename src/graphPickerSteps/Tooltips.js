import React from 'react'
import { Tooltip } from '../Tooltip'
import glamorous from 'glamorous'
import { Hidden } from './Elements'
import { square } from '../helpers/styleHelpers'
import { violet, wit } from '../colors'
import { borderRadius } from '../styles'

const PreFormattedText = glamorous.p({
	whiteSpace: 'pre-wrap',
	margin: 0,
	fontSize: '0.8rem',
})

const Label = glamorous.label({
	flex: 'none',
})

const Button = glamorous
	.button(
		borderRadius,
		{
			display: 'block',
			border: 'none',
			padding: 0,
			marginLeft: '0.1rem',
			...square('1rem'),
			textAlign: 'center',
			':after': {
				content: '"i"',
				position: 'relative',
				fontSize: '1rem',
				fontFamily: 'monospace',
				lineHeight: 1,
				top: -1,
			},
		},
		({ color, backgroundColor }) => ({
			backgroundColor,
			color,
		}),
	)
	.withProps({ type: 'button' })

export const InputTooltip = ({
	title,
	id,
	description,
	checked,
	differentSelectionGroup,
}) => {
	const backgroundColor = differentSelectionGroup
		? violet.light
		: checked ? violet.darker : violet.default
	const color = differentSelectionGroup ? violet.darker : wit

	return Boolean(description) ? (
		<Label htmlFor={id}>
			<Tooltip
				Component={<Button color={color} backgroundColor={backgroundColor} />}
				TooltipContent={<PreFormattedText>{description}</PreFormattedText>}
			>
				<Hidden>Beschrijving ‘{title}’</Hidden>
			</Tooltip>
		</Label>
	) : null
}

export const TitleTooltip = ({ title, description }) => {
	return Boolean(description) ? (
		<Tooltip
			Component={
				<Button
					color={violet.darker}
					backgroundColor={wit}
					css={{ marginTop: '0.3rem' }}
				/>
			}
			TooltipContent={<PreFormattedText>{description}</PreFormattedText>}
		>
			<Hidden>Beschrijving ‘{title}’</Hidden>
		</Tooltip>
	) : null
}
