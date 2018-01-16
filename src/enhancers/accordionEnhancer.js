import {
  accordionFromLength,
  rootAccordionFromLength,
  DIMENSION_TOPIC,
} from '../config'
import { compose, withHandlers, branch } from 'recompose'
import { connectActions } from '../connectors/actionConnectors'
import { activeDatasetIdConnector } from '../connectors/activeDatasetIdConnector'
import { connect } from 'react-redux'

export const isAccordion = ({ id, lists }) => {
  const childrenLength = lists.reduce(
    (length, list = []) => length + list.length,
    0
  )

  return id === 'root'
    ? childrenLength >= rootAccordionFromLength
    : childrenLength >= accordionFromLength
}

const open = ({
  activeDatasetId,
  id,
  accordionOpened,
  dimensionKey = DIMENSION_TOPIC,
}) => () => accordionOpened({ activeDatasetId, dimensionKey, id })

const close = ({
  activeDatasetId,
  id,
  accordionClosed,
  dimensionKey = DIMENSION_TOPIC,
}) => () => accordionClosed({ activeDatasetId, dimensionKey, id })

const openAll = ({
  activeDatasetId,
  dimensionKey = DIMENSION_TOPIC,
  accordionAllOpened,
}) => () => accordionAllOpened({ activeDatasetId, dimensionKey })

const closeAll = ({
  activeDatasetId,
  dimensionKey = DIMENSION_TOPIC,
  accordionAllClosed,
}) => () => accordionAllClosed({ activeDatasetId, dimensionKey })

export const openCloseEnhancer = compose(
  connect(activeDatasetIdConnector),
  connectActions,
  withHandlers({
    open,
    close,
    toggle: props => (props.opened ? close(props) : open(props)),
    openAll,
    closeAll,
  })
)

export const accordionEnhancer = branch(
  ({ asAccordion }) => asAccordion,
  openCloseEnhancer
)
