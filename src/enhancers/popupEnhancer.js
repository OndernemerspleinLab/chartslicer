import {
  compose,
  lifecycle,
  shallowEqual,
  withState,
  withHandlers,
  renderNothing,
  branch,
} from 'recompose'
import { omit } from '../helpers/getset'

const omitOpened = omit('opened')

export const popupEnhancer = compose(
  withState('opened', 'setOpened', true),
  withHandlers({
    close: ({ setOpened }) => () => setOpened(false),
    open: ({ setOpened }) => () => setOpened(true),
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (!shallowEqual(omitOpened(nextProps), omitOpened(this.props))) {
        this.props.open()
      }
    },
  }),
  branch(({ opened }) => !opened, renderNothing)
)
