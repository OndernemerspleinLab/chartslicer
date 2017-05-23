const CANCELED = Symbol('CANCELED')

export const isCanceled = response => response === CANCELED

const checkStatus = response => {
  if (response && response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
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

export const makeFetchLatest = () => {
  let cancelLast = () => {}

  return (url, options) =>
    new Promise((resolve, reject) => {
      cancelLast()
      cancelLast = () => reject(CANCELED)
      return fetchJson(url, options).then(resolve, reject)
    })
}
