import { withReducer, compose, withHandlers } from 'recompose'

export const stateEnhancer = compose(
  withReducer('tableSelection', 'setTableSelection', () => {}),
  withHandlers({
    onTableFieldChange: ({ setTableSelection }) => ({ target: { value } }) => {
      setTableId(value)
    },
  })
)
