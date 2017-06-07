import { connectActions } from '../connectors/actionConnectors'
import { withHandlers, compose } from 'recompose'
import { existing } from '../helpers/helpers'
import { activeDatasetIdConnector } from '../connectors/activeDatasetIdConnector'
import { connect } from 'react-redux'

export const configChangeEnhancer = compose(
  connectActions,
  connect(activeDatasetIdConnector),
  withHandlers({
    onChange: ({
      activeDatasetId,
      keyPath,
      configChanged,
      inputValue,
      multiValue,
      replaceValue,
    }) => event => {
      const value = existing(inputValue)
        ? inputValue
        : event.currentTarget.value
      configChanged({
        keyPath,
        value,
        activeDatasetId,
        multiValue,
        replaceValue,
      })
    },
  })
)
