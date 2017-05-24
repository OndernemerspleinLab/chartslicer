const CANCELED = Symbol('CANCELED')

export const isCanceled = response => response === CANCELED

const checkStatus = response => {
  if (!response) {
    throw new Error('Possible CORS Error')
  }
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const error = new Error(response.statusText)
  error.response = response
  throw error
}
const addJsonHeaders = (options = {}) =>
  Object.assign({}, options, {
    headers: Object.assign({}, options.headers, {
      Accept: 'application/json',
    }),
  })

export const httpFetch = (url, options) => fetch(url, options).then(checkStatus)

export const fetchJson = (url, options) =>
  httpFetch(url, addJsonHeaders(options)).then(response => response.json())
