import ReactDOM from 'react-dom'
import React from 'react'
import glamorous from 'glamorous'
import { modalZIndex } from './zIndex'

const modalRoot = document.getElementById('modalRoot')

const ModalContentStyled = glamorous.div({
	position: 'fixed',
	height: 0,
	width: 0,
	left: '50%',
	top: '50%',
	zIndex: modalZIndex,
})

export class Modal extends React.Component {
	constructor(props) {
		super(props)
		this.el = document.createElement('div')
	}

	componentDidMount() {
		modalRoot.appendChild(this.el)
	}

	componentWillUnmount() {
		modalRoot.removeChild(this.el)
	}

	render() {
		const { children, ModalContent = <ModalContentStyled /> } = this.props
		return ReactDOM.createPortal(
			React.cloneElement(ModalContent, null, children),
			this.el,
		)
	}
}
