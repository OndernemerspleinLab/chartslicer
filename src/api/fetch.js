import { setIn } from '../helpers/getset'
// @flow

type PromiseAny = Promise<any>
type PromiseResponse = Promise<Response>
type PromiseString = Promise<string>

const checkStatus = (response: Response): Response => {
  if (!response) {
    throw new Error('Possible CORS Error')
  }
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const error: { response?: Response } & Error = new Error(response.statusText)

  error.response = response
  throw error
}

const addJsonHeaders = (options = {}) =>
  setIn(['headers', 'Accept'], 'application/json')(options)

const addTextHeaders = (options = {}) =>
  setIn(['headers', 'Accept'], 'text/plain')(options)

export const httpFetch = (
  url: string,
  options: ?RequestOptions
): PromiseResponse => {
  const responsePromise = fetch(url, options).then(checkStatus)
  responsePromise.catch(error => {
    console.log(error)
  })
  return responsePromise
}

export const fetchJson = (url: string, options: ?RequestOptions): PromiseAny =>
  httpFetch(url, addJsonHeaders(options)).then(response => response.json())

export const fetchText = (
  url: string,
  options: ?RequestOptions
): PromiseString =>
  httpFetch(url, addTextHeaders(options)).then(response => response.text())
