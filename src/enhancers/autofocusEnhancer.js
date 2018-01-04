import React from 'react'

export const autofocusEnhancer = Element =>
  class Autofocus extends React.Component {
    constructor(props) {
      super(props)
      this.refInputDomElement = inputDomElement => {
        console.log('ref', inputDomElement)
        this.inputDomElement = inputDomElement
      }
    }
    componentDidMount() {
      console.log('mount', this.inputDomElement)

      if (this.inputDomElement) {
        requestAnimationFrame(() => this.inputDomElement.focus())
      }
    }

    render() {
      return <Element {...this.props} innerRef={this.refInputDomElement} />
    }
  }
