import { unexisting } from './helpers/helpers'
import { hemelblauw } from './colors'
import { withState, withHandlers, compose } from 'recompose'
import { get } from './helpers/getset'

import glamorous from 'glamorous'

const Textarea = glamorous.textarea(
  {
    resize: 'none',
    overflow: 'hidden',
    border: 'none',
    background: 'none',
    padding: 0,
    color: 'inherit',
    font: 'inherit',
    width: '100%',
    '::placeholder': {
      color: 'inherit',
      opacity: 0.3,
    },
  },
  ({ height, inline }) => ({
    height,
  })
)

const resize = ({ setHeight }) => element => {
  if (unexisting(element)) {
    return
  }
  element.style.height = 0

  const { offsetHeight } = element

  setHeight(element.scrollHeight + offsetHeight)

  element.style.height = ''
}

export const SeamlessTextarea = compose(
  withState('height', 'setHeight'),
  withHandlers({
    onChange: props => event => {
      resize(props)(event.currentTarget)

      if (typeof props.onChange === 'function') {
        props.onChange(event)
      }
    },
    innerRef: resize,
  })
)(Textarea)
