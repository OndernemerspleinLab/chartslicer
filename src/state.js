import { withState, compose, withHandlers } from 'recompose'

export const stateEnhancer = compose(
  withState('tableId', 'setTableId', ''),
  withHandlers({
    onTableIdChange: ({ setTableId }) => ({ target: { value } }) => {
      setTableId(value)
    },
  })
)
