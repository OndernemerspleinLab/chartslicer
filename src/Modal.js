import ReactDOM from 'react-dom'
import React from 'react'
import glamorous from 'glamorous'

const modalRoot = document.getElementById('modalRoot')

const ModalContent = glamorous.div({
	position: 'fixed',
	display: 'flex',
	height: 0,
	width: 0,
	left: '50%',
	top: '50%',
	alignItems: 'center',
	justifyContent: 'center',
	zIndex: 200,
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
		return ReactDOM.createPortal(
			<ModalContent>{this.props.children}</ModalContent>,
			this.el,
		)
	}
}
