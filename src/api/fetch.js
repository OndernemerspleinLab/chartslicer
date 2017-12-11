// @flow

import { setIn } from '../helpers/getset'

type PromiseAny = Promise<any>
type PromiseResponse = Promise<Response>
type PromiseString = Promise<string>

const maxApiUrlLength = 15000

const checkMaxApiUrlLength = (url: string): string => {
  if (url.length > maxApiUrlLength) {
    throw new Error('Request URL Too Long')
  }
  return url
}

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
  try {
    checkMaxApiUrlLength(url)
  } catch (error) {
    return new Promise((resolve, reject) => reject(error))
  }

  const responsePromise = fetch(url, options || {}).then(checkStatus)
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

export const customError = ({
  predicate,
  message,
}: {
  predicate: Error => boolean,
  message: string,
}) => (promise: Promise<*>) =>
  promise.catch(error => {
    if (predicate(error)) {
      const newError = new error.constructor(message)

      newError.response = error.response
      throw newError
    } else {
      throw error
    }
  })
