import { withReducer, compose, withHandlers } from 'recompose'

const parseUrl = maybeUrl => {
  try {
    const parsedUrl = new URL(maybeUrl)
    const pathComponents = parsedUrl.hash.split('/')

    const index = pathComponents.findIndex(
      pathComponent => pathComponent === 'dataset'
    )

    return {
      id: pathComponents[index + 1],
      url: maybeUrl,
    }
  } catch (error) {
    return {
      id: maybeUrl,
      url: `https://opendata.cbs.nl/CBS/nl/dataset/${maybeUrl}/line`,
    }
  }
}

export const stateEnhancer = compose(
  withReducer('tableSelection', 'setTableSelection', () => {}),
  withHandlers({
    onTableFieldChange: ({ setTableSelection }) => ({ target: { value } }) => {
      setTableId(value)
    },
  })
)
