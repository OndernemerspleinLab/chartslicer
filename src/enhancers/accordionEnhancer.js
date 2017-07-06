import { accordionFromLength, rootAccordionFromLength } from '../config'
import { compose, withState, withHandlers, branch } from 'recompose'

export const isAccordion = ({ id, lists }) => {
  const childrenLength = lists.reduce(
    (length, list = []) => length + list.length,
    0
  )

  return id === 'root'
    ? childrenLength >= rootAccordionFromLength
    : childrenLength >= accordionFromLength
}

export const openCloseEnhancer = compose(
  withState('opened', 'setOpened', false),
  withHandlers({
    toggle: ({ opened, setOpened }) => () => setOpened(!opened),
    open: ({ setOpened }) => () => setOpened(true),
    close: ({ setOpened }) => () => setOpened(false),
  })
)

export const accordionEnhancer = branch(
  ({ asAccordion }) => asAccordion,
  openCloseEnhancer
)
