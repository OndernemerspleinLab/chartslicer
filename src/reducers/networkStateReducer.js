import { merge } from '../getset'

export const assignLoading = merge({ loading: true, error: null })
export const assignLoadSuccess = merge({ loading: false, error: null })
export const assignLoadError = ({ error = true }) =>
  merge({ loading: true, error })

export const loadingHor = reducer => (state = {}, action) =>
  reducer(assignLoading(state), action)

export const loadSuccessHor = reducer => (state = {}, action) =>
  reducer(assignLoadSuccess(state), action)

export const loadErrorHor = reducer => (state = {}, action) =>
  reducer(assignLoadError(action)(state), action)
