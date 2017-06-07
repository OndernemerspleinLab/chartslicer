import { dimensionsGetConnector } from '../connectors/dimensionConnectors'
import { connect } from 'react-redux'

export const dimensionForKeyEnhancer = connect((state, { dimensionKey }) => {
  const dimension = dimensionsGetConnector(dimensionKey)(state)

  return dimension || {}
})
