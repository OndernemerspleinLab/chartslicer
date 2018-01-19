// @flow

import { setIn } from '../helpers/getset'

type PromiseAny = Promise<any>
type PromiseResponse = Promise<Response>
type PromiseString = Promise<string>
type ResponseError = { response?: Response } & Error

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

	const error: ResponseError = new Error(response.statusText)

	error.response = response
	throw error
}

const addJsonHeaders = (options = {}) =>
	setIn(['headers', 'Accept'], 'application/json')(options)

const addTextHeaders = (options = {}) =>
	setIn(['headers', 'Accept'], 'text/plain')(options)

export const httpFetch = (
	url: string,
	options: ?RequestOptions,
): PromiseResponse => {
	try {
		checkMaxApiUrlLength(url)
	} catch (error) {
		return new Promise((resolve, reject) => reject(error))
	}

	const responsePromise = window.fetch(url, options || {}).then(checkStatus)
	responsePromise.catch(error => {
		console.log(error)
	})
	return responsePromise
}

export const fetchJson = (url: string, options: ?RequestOptions): PromiseAny =>
	httpFetch(url, addJsonHeaders(options)).then(response => response.json())

export const fetchText = (
	url: string,
	options: ?RequestOptions,
): PromiseString =>
	httpFetch(url, addTextHeaders(options)).then(response => response.text())

export const customError = ({
	predicate,
	message,
}: {
	message: string,
	predicate: ResponseError => boolean,
}) => (promise: Promise<*>) =>
	promise.catch((error: ResponseError) => {
		if (predicate(error)) {
			const newError: ResponseError = new error.constructor(message)

			newError.response = error.response
			throw newError
		} else {
			throw error
		}
	})
