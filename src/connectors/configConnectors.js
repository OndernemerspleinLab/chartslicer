import {
  getActiveSubstate,
  pickFromActiveSubstate,
  mapFromActiveSubstate,
  getFromActiveSubstate,
  getInFromActiveSubstate,
} from './connectorHelpers'
import { getIn } from '../helpers/getset'

// GETTERS
export const configConnector = getActiveSubstate('config')

export const configGetConnector = getFromActiveSubstate(configConnector)

export const configGetInConnector = getInFromActiveSubstate(configConnector)

export const configPickConnector = pickFromActiveSubstate(configConnector)

export const configMapConnector = mapFromActiveSubstate(configConnector)

export const multiDimensionConnector = configPickConnector(['multiDimension'])

export const topicLabelAliasConnector = ({ key, title }) => state => {
  return (
    getIn(['labelAliases', `topic/${key}`])(configConnector(state)) || title
  )
}
export const categoryLabelAliasConnector = ({
  key,
  dimensionKey,
  title,
}) => state => {
  return (
    getIn(['labelAliases', `category/${dimensionKey}/${key}`])(
      configConnector(state)
    ) || title
  )
}
export const labelAliasConnector = type => {
  switch (type) {
    case 'category':
      return categoryLabelAliasConnector

    case 'topic':
    default:
      return topicLabelAliasConnector
  }
}
