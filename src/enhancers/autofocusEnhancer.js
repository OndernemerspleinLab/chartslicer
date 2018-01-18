import React from 'react'

export const autofocusEnhancer = Element =>
	class Autofocus extends React.Component {
		constructor(props) {
			super(props)
			this.refInputDomElement = inputDomElement => {
				this.inputDomElement = inputDomElement
			}
		}
		componentDidMount() {
			if (this.inputDomElement) {
				requestAnimationFrame(() => this.inputDomElement.focus())
			}
		}

		render() {
			return <Element {...this.props} innerRef={this.refInputDomElement} />
		}
	}
