import { accordionFromLength } from '../config'
import { compose, withState, withHandlers, branch } from 'recompose'

export const isAccordion = ({ id, lists }) =>
  id !== 'root' &&
  lists.reduce((length, list = []) => length + list.length, 0) >=
    accordionFromLength

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
