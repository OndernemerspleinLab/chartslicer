import { mapDispatchToProps } from '../connectors/actionConnectors'
import { withHandlers, compose } from 'recompose'
import { existing } from '../helpers/helpers'
import { activeDatasetIdConnector } from '../connectors/activeDatasetIdConnector'
import { connect } from 'react-redux'

export const configChangeHandlersEnhancer = withHandlers({
  onChange: ({
    activeDatasetId,
    keyPath,
    configChanged,
    inputValue,
    multiValue,
    replaceValue,
    min,
    max,
    type,
  }) => event => {
    const value = existing(inputValue) ? inputValue : event.currentTarget.value

    // const value = minMaxValue({ fieldValue, min, max })

    configChanged({
      keyPath,
      value,
      activeDatasetId,
      multiValue,
      replaceValue,
    })
  },
})

export const configChangeEnhancer = compose(
  connect(activeDatasetIdConnector, mapDispatchToProps),
  configChangeHandlersEnhancer
)
