import { css } from 'glamor'
import { violet, hemelblauw } from './colors'
import Color from 'color'

const borderRadiusSize = '4px'

export const resetBorderRadius = css({
	borderRadius: 0,
})

export const borderRadius = css({
	borderRadius: borderRadiusSize,
})

export const borderRadiusLeft = css({
	borderTopLeftRadius: borderRadiusSize,
	borderBottomLeftRadius: borderRadiusSize,
})

export const borderRadiusRight = css({
	borderTopRightRadius: borderRadiusSize,
	borderBottomRightRadius: borderRadiusSize,
})

export const borderRadiusOnlyLeft = css(resetBorderRadius, borderRadiusLeft)

export const borderRadiusOnlyRight = css(resetBorderRadius, borderRadiusRight)

export const fadeInKeyframes = css.keyframes({
	from: {
		opacity: 0,
	},
})

export const fadeInAnimation = `300ms ease-in-out ${fadeInKeyframes}`

export const diagonalStripesFactory = ({
	darkColor = violet.default,
	lightColor = violet.lightest,
	stripeWidth = 6,
}) => ({
	backgroundColor: lightColor,
	backgroundImage: `repeating-linear-gradient(-45deg, ${lightColor}, ${lightColor} ${stripeWidth}px, ${darkColor} ${stripeWidth}px, ${darkColor} ${stripeWidth *
		2 +
		1}px)`,
})

export const sideScrollbarStyle = {
	'::-webkit-scrollbar': {
		width: '0.5rem',
		height: '0.5rem',
	},
	'::-webkit-scrollbar-track': {
		backgroundColor: Color(violet.lightest)
			.lighten(0.04)
			.string(),
	},

	'::-webkit-scrollbar-thumb': {
		backgroundColor: violet.darker,
		borderRadius: '999px',
		border: `1px solid ${Color(violet.lightest)
			.lighten(0.04)
			.string()}`,
	},
}

export const mainScrollbarStyle = {
	'::-webkit-scrollbar': {
		width: '0.5rem',
		height: '0.5rem',
	},
	'::-webkit-scrollbar-track': {
		backgroundColor: Color(hemelblauw.lighter)
			.lighten(0.04)
			.string(),
	},

	'::-webkit-scrollbar-thumb': {
		backgroundColor: hemelblauw.darker,
		borderRadius: '999px',
		border: `1px solid ${Color(hemelblauw.lighter)
			.lighten(0.04)
			.string()}`,
	},
}
