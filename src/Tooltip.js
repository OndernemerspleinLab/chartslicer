import React from 'react'
import { Modal } from './Modal'
import glamorous, { Svg } from 'glamorous'
import { nest } from 'recompose'
import { scrollbarStyleFactory, fadeInAnimation } from './styles'
import { hemelblauw, grayBlue } from './colors'
import { unexisting, existing } from './helpers/helpers'
import Color from 'color'
import { withCloseOnEscape } from './enhancers/withCloseOnEscape'
import { tooltipZIndex } from './zIndex'
import { Frag } from './graphPickerSteps/Elements'

const getUpdatedPosition = ({ anchorDOMElement }) => {
	if (!anchorDOMElement) return {}

	const { width, height, left, top } = anchorDOMElement.getBoundingClientRect()

	const { scrollX = window.pageXOffset, scrollY = window.pageYOffset } = window
	const windowWidth = window.innerWidth
	const windowHeight = window.innerHeight

	const yTop = scrollY + top
	const yBottom = yTop + height
	const yDelta = height / 2

	const x = scrollX + left + width / 2
	const y = yTop + yDelta

	const outOfScreen =
		x < scrollX ||
		x > scrollX + windowWidth ||
		(y < scrollY || y > scrollY + windowHeight)
	const windowTop = scrollY
	const windowBottom = scrollY + windowHeight
	return {
		outOfScreen,
		x,
		y,
		yTop,
		yBottom,
		yDelta,
		scrollX,
		scrollY,
		windowTop,
		windowBottom,
		windowHeight,
		windowWidth,
		width,
		height,
		left,
		top,
	}
}

const FlyoutPlacer = glamorous.div(({ x, y }) => ({
	position: 'absolute',
	left: 0,
	top: 0,
	transform: `translate(${x}px, ${y}px)`,
	zIndex: tooltipZIndex,
	width: 0,
	height: 0,
}))

const flyoutMargin = 20
const flyoutBorderRadius = 4
const flyoutArrowSize = 10
const flyoutBorderWidth = 1

const getMaxHeight = ({
	windowHeight,
	height,
	yTop,
	windowTop,
	windowBottom,
	yBottom,
}) => {
	return Math.max(
		Math.min(
			windowHeight - height - flyoutMargin - flyoutArrowSize,
			yTop - windowTop - flyoutMargin - flyoutArrowSize,
		),
		Math.min(
			windowHeight - height - flyoutMargin - flyoutArrowSize,
			windowBottom - yBottom - flyoutMargin - flyoutArrowSize,
		),
	)
}
const getSide = ({ maxHeight, elementHeight, yBottom, windowBottom }) =>
	Math.min(maxHeight, elementHeight) +
		yBottom +
		flyoutMargin +
		flyoutArrowSize <=
	windowBottom
		? 'bottom'
		: 'top'

const getWindowOverflowLeftShift = ({ elementWidth, x, windowWidth }) => {
	if (unexisting(elementWidth) || unexisting(windowWidth)) return

	const halfWidth = elementWidth / 2
	const halfWidthWithMargin = halfWidth + flyoutMargin
	const leftOverflow = Math.max(halfWidthWithMargin - x, 0)
	const rightOverflow = Math.max(x + halfWidthWithMargin - windowWidth, 0)
	const windowOverflow = leftOverflow - rightOverflow

	return windowOverflow
}

const getLeftShift = ({ elementWidth, windowOverflow }) => {
	if (unexisting(elementWidth) || unexisting(windowOverflow)) return

	const leftShift = windowOverflow - elementWidth / 2

	return leftShift
}

const getArrowPosition = ({ elementWidth, windowOverflow }) => {
	if (unexisting(elementWidth) || unexisting(windowOverflow)) return

	const rawArrowPosition = elementWidth / 2 - windowOverflow
	const arrowMargin = flyoutBorderRadius + flyoutArrowSize / 2

	const arrowPosition = Math.min(
		elementWidth - arrowMargin,
		Math.max(arrowMargin, rawArrowPosition),
	)

	return arrowPosition
}
const getMaxWidth = ({ windowWidth }) => {
	const maxWidth = existing(windowWidth)
		? Math.min(windowWidth - 2 * flyoutMargin, 480)
		: undefined
	return maxWidth
}

const addFlyoutProps = props => {
	const maxHeight = getMaxHeight(props)
	const maxWidth = getMaxWidth(props)
	const side = getSide({ ...props, maxHeight })
	const windowOverflow = getWindowOverflowLeftShift(props)
	const leftShift = getLeftShift({ ...props, windowOverflow })
	const arrowPosition = getArrowPosition({ ...props, windowOverflow })

	return { ...props, maxHeight, maxWidth, side, leftShift, arrowPosition }
}

const FlyoutContentStyled = glamorous
	.div(
		({
			yDelta,
			yTop,
			yBottom,
			elementHeight,
			elementWidth,
			x,
			y,
			windowTop,
			windowBottom,
			windowHeight,
			windowWidth,
			height,
			maxHeight,
			maxWidth,
			side,
			leftShift,
			flyoutBorderColor,
		}) => {
			const absoluteTopShift = flyoutArrowSize + yDelta
			const directionalTopShift =
				side === 'bottom' ? absoluteTopShift : -absoluteTopShift
			return {
				display: 'inline-block',
				position: 'absolute',
				[side === 'bottom' ? 'top' : 'bottom']: 0,
				left: 0,
				maxWidth,
				maxHeight: !isNaN(maxHeight) ? maxHeight : undefined,
				animation: fadeInAnimation,
				transform: `translate(${leftShift}px, ${directionalTopShift}px)`,
				':focus': {
					outline: 'none',
					filter: `drop-shadow(2px 2px 2px hsla(0, 0%, 20%, 0.08))`,
				},
			}
		},
	)
	.withProps({
		tabIndex: '-1',
	})

const FlyoutContentWrapper = glamorous.div(
	({
		scrollbarStyle,
		flyoutBorderColor,
		flyoutBackgroundColor,
		flyoutColor,
		elementHeight,
		elementWidth,
		x,
		yBottom,
		windowBottom,
		windowHeight,
		windowWidth,
		height,
		yTop,
		windowTop,
		heightPadding,
		maxHeight,
		maxWidth,
		side,
		arrowPosition,
	}) => {
		return {
			display: 'block',
			position: 'relative',
			// Fallback for IE11, tooltips will always have the maxWidth in this browser
			width: [`${maxWidth}px`, 'max-content'],
			maxWidth: '100%',
			maxHeight,
			border: `${flyoutBorderWidth}px solid ${flyoutBorderColor}`,
			borderRadius: flyoutBorderRadius,
			backgroundColor: flyoutBackgroundColor,
			color: flyoutColor,
		}
	},
)

const FlyoutArrowSvg = ({ flyoutBackgroundColor, flyoutBorderColor }) => {
	const halfBorderWidth = flyoutBorderWidth / 2
	const halfArrowSize = flyoutArrowSize / 2
	const insideArrowSize = flyoutArrowSize - halfBorderWidth

	const pathArray = [
		`M${halfBorderWidth},${0}`,
		`L${halfBorderWidth},${halfBorderWidth}`,
		`L${halfArrowSize},${insideArrowSize}`,
		`L${insideArrowSize},${halfBorderWidth}`,
		`L${insideArrowSize},${0}`,
	]
	const path = pathArray.join(' ')
	return (
		<Svg
			css={{
				display: 'block',
				width: flyoutArrowSize,
				height: flyoutArrowSize,
			}}
			viewBox={`0 0 ${flyoutArrowSize} ${flyoutArrowSize}`}
			xmlns="http://www.w3.org/2000/svg"
			version="1.1"
		>
			<path
				d={path}
				strokeWidth={flyoutBorderWidth}
				stroke={flyoutBorderColor}
				fill={flyoutBackgroundColor}
			/>
		</Svg>
	)
}

const FlyoutArrowStyled = glamorous.div(({ side, arrowPosition }) => {
	return {
		position: 'absolute',
		[side]: '100%',
		transform: side === 'bottom' ? 'rotate(180deg)' : 'none',
		left: existing(arrowPosition) ? arrowPosition - flyoutArrowSize / 2 : 0,
		width: flyoutArrowSize,
		height: flyoutArrowSize,
	}
})

const FlyoutArrow = nest(FlyoutArrowStyled, FlyoutArrowSvg)

const FlyoutScrollArea = glamorous.div(({ scrollbarStyle, maxHeight }) => {
	return {
		...scrollbarStyle,
		overflowX: 'hidden',
		overflowY: 'auto',
		padding: '0.6rem 1rem',
		margin: '1px',
		maxHeight,
	}
})

const FlyoutContent = class FlyoutContent extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			DOMElement: undefined,
			elementWidth: undefined,
			elementHeight: undefined,
		}
		this.getUpdatedPosition = DOMElement => {
			if (!DOMElement) return {}

			const {
				width: elementWidth,
				height: elementHeight,
			} = DOMElement.getBoundingClientRect()

			return { elementWidth, elementHeight }
		}
		this.saveRef = ref => {
			if (ref) {
				requestAnimationFrame(() => {
					const updatedPosition = this.getUpdatedPosition(ref)
					this.setState({ DOMElement: ref, ...updatedPosition })
					ref.focus()
				})
			}
		}

		this.handleOutsideClick = ({ target }) => {
			const { DOMElement } = this.state

			if (DOMElement && DOMElement.contains(target)) return

			if (this.props.close) this.props.close()
		}
	}
	componentDidMount() {
		document.addEventListener('click', this.handleOutsideClick)
	}
	componentWillUnmount() {
		document.removeEventListener('click', this.handleOutsideClick)
	}

	componentWillReceiveProps() {
		this.setState(this.getUpdatedPosition(this.state.DOMElement))
	}

	render() {
		const { children, ...restProps } = this.props
		const propsAndState = { ...restProps, ...this.state }
		const childProps = addFlyoutProps(propsAndState)

		return (
			<FlyoutContentStyled innerRef={this.saveRef} {...childProps}>
				<FlyoutContentWrapper {...childProps}>
					<FlyoutScrollArea {...childProps}>{children}</FlyoutScrollArea>
					<FlyoutArrow {...childProps} />
				</FlyoutContentWrapper>
			</FlyoutContentStyled>
		)
	}
}

const FlyoutElement = nest(FlyoutPlacer, withCloseOnEscape(FlyoutContent))

const Flyout = class Flyout extends React.PureComponent {
	constructor(props) {
		super(props)

		this.state = getUpdatedPosition(this.props)

		this.updatePosition = () => {
			this.setState(getUpdatedPosition(this.props))
		}
		this.handlePositionUpdate = () => {
			window.requestAnimationFrame(this.updatePosition)
		}

		this.mutationObserver = new window.MutationObserver(
			this.handlePositionUpdate,
		)
	}

	componentDidMount() {
		document.addEventListener('scroll', this.handlePositionUpdate, true)
		window.addEventListener('resize', this.handlePositionUpdate)
		const { rootId = 'root' } = this.props
		const rootElement = document.getElementById(rootId)
		if (rootElement) {
			this.mutationObserver.observe(rootElement, {
				childList: true,
				attributes: true,
				characterData: true,
				subtree: true,
			})
		}
	}

	componentWillUnmount() {
		document.removeEventListener('scroll', this.handlePositionUpdate, true)
		window.removeEventListener('resize', this.handlePositionUpdate)
		this.mutationObserver.disconnect()
	}

	componentWillReceiveProps() {
		this.updatePosition()
	}

	render() {
		const { children, ...restProps } = this.props
		return (
			<FlyoutElement {...this.state} {...restProps}>
				{children}
			</FlyoutElement>
		)
	}
}

const ComponentElement = glamorous.button({
	color: 'blue',
})

export const Tooltip = class Tooltip extends React.PureComponent {
	constructor(props) {
		super(props)

		this.state = {
			opened: false,
			DOMElement: undefined,
		}
		this.saveRef = ref => {
			if (ref) {
				this.setState({ DOMElement: ref })
			}
		}
		this.close = () => {
			this.setState({ opened: false })
		}
		this.handleClick = event => {
			event.preventDefault()

			this.setState(({ opened }) => ({ opened: !opened }))
		}
	}

	render() {
		const { opened } = this.state
		const {
			Component = <ComponentElement />,
			flyoutBorderColor = Color(hemelblauw.lighter)
				.darken(0.1)
				.desaturate(0.5)
				.string(),
			flyoutBackgroundColor = hemelblauw.lightest,
			flyoutColor = grayBlue,
			scrollbarStyle = scrollbarStyleFactory({
				trackBorderRadius: `0 2px 2px 0`,
				trackColor: Color(flyoutBackgroundColor)
					.lighten(0.01)
					.string(),
				thumbColor: flyoutBorderColor,
			}),
			TooltipContent,
			children,
		} = this.props

		const refPropertyName =
			typeof Component.type === 'string' ? 'ref' : 'innerRef'

		return (
			<Frag>
				{React.cloneElement(
					Component,
					{ [refPropertyName]: this.saveRef, onClick: this.handleClick },
					children,
				)}
				{TooltipContent && opened ? (
					<Modal
						ModalContent={
							<Flyout
								anchorDOMElement={this.state.DOMElement}
								flyoutBorderColor={flyoutBorderColor}
								flyoutBackgroundColor={flyoutBackgroundColor}
								flyoutColor={flyoutColor}
								scrollbarStyle={scrollbarStyle}
								close={this.close}
							/>
						}
					>
						{React.cloneElement(TooltipContent)}
					</Modal>
				) : (
					undefined
				)}
			</Frag>
		)
	}
}
