import { assign } from '../helpers'

export const assignLoading = (state = {}) =>
  assign(state, { loading: true, error: null })
export const assignLoadSuccess = (state = {}) =>
  assign(state, { loading: false, error: null })
export const assignLoadError = ({ error = true }) =>
  assign({ loading: true, error })

export const loadingHor = reducer => (state = {}, action) =>
  reducer(assignLoading(state), action)

export const loadSuccessHor = reducer => (state = {}, action) =>
  reducer(assignLoadSuccess(state), action)

export const loadErrorHor = reducer => (state = {}, action) =>
  reducer(assignLoadError(action)(state), action)
